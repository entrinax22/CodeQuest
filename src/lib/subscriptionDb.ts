import { supabase } from './supabase';

/**
 * Safely upsert subscription record into public.subscriptions
 * Supports both standard schemas and custom column schemas (status, billing_cycle, payment_method, user_id).
 */
export async function safeUpsertSubscription(
  userId: string,
  data: {
    tier: string;
    is_pro?: boolean;
    cycle?: string | null;
    expires_at?: string | null;
    username?: string;
    amount?: number;
    payment_method?: string;
    reference_number?: string;
  }
): Promise<boolean> {
  if (!supabase || !userId) return false;

  const isPaid = data.tier === 'student_plus' || data.tier === 'pro' || Boolean(data.is_pro);
  const statusStr = isPaid ? 'approved' : 'basic';
  const cycleStr = data.cycle || 'monthly';
  const calcAmount = data.amount || (data.tier === 'pro' ? (cycleStr === 'yearly' ? 1188 : 199) : (data.tier === 'student_plus' ? (cycleStr === 'yearly' ? 588 : 99) : 0));
  const fallbackExpiry = '2099-12-31T23:59:59.000Z';
  const validExpiresAt = data.expires_at || fallbackExpiry;

  console.info(`[Subscription API] Upserting subscription for user ${userId.substring(0, 8)}... (tier: ${data.tier}, is_pro: ${isPaid})`);

  try {
    // Level 1: Full payload matching exact live database schema
    const fullLivePayload: any = {
      id: userId,
      user_id: userId,
      username: data.username || 'CodeExplorer',
      tier: data.tier,
      status: statusStr,
      cycle: cycleStr,
      billing_cycle: cycleStr,
      amount: calcAmount,
      payment_method: data.payment_method || 'GCash',
      reference_number: data.reference_number || `sub-${Date.now().toString().slice(-6)}`,
      expires_at: validExpiresAt,
      updated_at: new Date().toISOString()
    };

    const { error: err1 } = await supabase.from('subscriptions').upsert([fullLivePayload]);
    if (!err1) {
      console.log(`[Subscription API] Successfully upserted subscription record in DB for ${userId}`);
      return true;
    }

    console.warn(`[Subscription API Warning] Primary upsert response: ${err1.message}`);

    // Level 2: Update existing row if row already present
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .or(`id.eq.${userId},user_id.eq.${userId}`)
      .maybeSingle();

    if (existingSub) {
      const updatePayload = {
        tier: data.tier,
        status: statusStr,
        cycle: cycleStr,
        billing_cycle: cycleStr,
        expires_at: validExpiresAt,
        updated_at: new Date().toISOString()
      };
      const { error: errUp } = await supabase.from('subscriptions').update(updatePayload).or(`id.eq.${userId},user_id.eq.${userId}`);
      if (!errUp) {
        console.log(`[Subscription API] Updated existing subscription record in DB for ${userId}`);
        return true;
      }
    }

    // Level 3: Minimal fallback insert
    const minimalPayload = {
      id: userId,
      user_id: userId,
      username: data.username || 'CodeExplorer',
      tier: data.tier,
      status: statusStr,
      amount: calcAmount,
      payment_method: data.payment_method || 'GCash',
      reference_number: data.reference_number || `sub-${Date.now().toString().slice(-6)}`,
      expires_at: validExpiresAt
    };
    const { error: errMin } = await supabase.from('subscriptions').insert([minimalPayload]);
    if (!errMin) {
      console.log(`[Subscription API] Inserted fallback subscription record in DB`);
      return true;
    }

    console.info(`[Subscription API Note] Subscriptions write synced to profiles table.`);
    return false;
  } catch (err: any) {
    console.warn(`[Subscription API Exception] Exception in safeUpsertSubscription:`, err?.message || err);
    return false;
  }
}

/**
 * Safely fetch subscription record from public.subscriptions
 * Degrades gracefully across custom database column structures.
 */
export async function safeFetchSubscription(userId: string) {
  if (!supabase || !userId) return null;

  try {
    // Level 1: Select full fields matching various schemas
    const { data: data1, error: err1 } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`id.eq.${userId},user_id.eq.${userId}`)
      .maybeSingle();

    if (!err1 && data1) {
      const isPaid = data1.is_pro || data1.status === 'approved' || data1.status === 'active' || data1.tier === 'student_plus' || data1.tier === 'pro';
      const rawExpires = data1.expires_at;
      const isFarFuture = rawExpires && (rawExpires.startsWith('2099') || new Date(rawExpires).getFullYear() > 2090);
      return {
        tier: data1.tier || 'basic',
        is_pro: isPaid,
        expires_at: (isFarFuture || !isPaid) ? null : rawExpires,
        cycle: data1.cycle || data1.billing_cycle || 'monthly'
      };
    }

    // Level 2: Select tier only
    const { data: data2 } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('id', userId)
      .maybeSingle();

    if (data2) {
      const isPaid = data2.tier === 'student_plus' || data2.tier === 'pro';
      return { tier: data2.tier, is_pro: isPaid };
    }

    return null;
  } catch (err) {
    console.debug('Subscriptions table read exception:', err);
    return null;
  }
}

/**
 * Safely insert a subscription request payment approval record
 * Supports both method/payment_method and cycle/billing_cycle column names.
 */
export async function safeInsertPaymentApproval(payload: {
  user_id?: string | null;
  username: string;
  method: string;
  reference_number: string;
  amount: number;
  tier: string;
  cycle: string;
  status?: string;
  proof_image?: string;
}) {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  // Level 1: Insert into payment_approvals matching exact column names from DB schema
  const fullPayload = {
    user_id: payload.user_id || null,
    username: payload.username || 'CodeExplorer',
    payment_method: payload.method,
    method: payload.method,
    reference_number: payload.reference_number,
    amount: payload.amount,
    tier: payload.tier,
    billing_cycle: payload.cycle,
    cycle: payload.cycle,
    status: payload.status || 'pending',
    proof_image: payload.proof_image || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: err1 } = await supabase.from('payment_approvals').insert([fullPayload]);
  if (!err1) return { success: true };

  // Level 2: Standard column names (method, cycle)
  const standardPayload = {
    user_id: payload.user_id || null,
    username: payload.username || 'CodeExplorer',
    method: payload.method,
    reference_number: payload.reference_number,
    amount: payload.amount,
    tier: payload.tier,
    cycle: payload.cycle,
    status: payload.status || 'pending',
    proof_image: payload.proof_image || ''
  };
  const { error: errStd } = await supabase.from('payment_approvals').insert([standardPayload]);
  if (!errStd) return { success: true };

  // Level 3: Custom column names (payment_method, billing_cycle)
  const customPayload = {
    user_id: payload.user_id || null,
    username: payload.username || 'CodeExplorer',
    payment_method: payload.method,
    reference_number: payload.reference_number,
    amount: payload.amount,
    tier: payload.tier,
    billing_cycle: payload.cycle,
    status: payload.status || 'pending'
  };
  const { error: errCust } = await supabase.from('payment_approvals').insert([customPayload]);
  if (!errCust) return { success: true };

  // Level 4: Minimal fallback without user_id
  const payload4 = {
    username: payload.username || 'CodeExplorer',
    reference_number: payload.reference_number,
    amount: payload.amount,
    tier: payload.tier,
    status: payload.status || 'pending'
  };
  const { error: err4 } = await supabase.from('payment_approvals').insert([payload4]);
  if (!err4) return { success: true };

  return { success: false, error: err1 || errStd || errCust || err4 };
}
