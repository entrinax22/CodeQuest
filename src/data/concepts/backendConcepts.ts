import { TeachingConcept } from '../lessonConcepts';

export const BACKEND_CONCEPTS: Record<string, TeachingConcept> = {
  'backend-http': {
    summary: 'The Hypertext Transfer Protocol (HTTP) is the foundational request-response protocol of web services. Clients send HTTP requests containing a Method, URI, Headers, and optional Body; servers process the request and return an HTTP Response with a 3-digit numeric Status Code.',
    keyRule: 'Standard HTTP Verbs: GET (retrieve), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). 2xx = Success, 4xx = Client Error, 5xx = Server Error.',
    codeSnippet: `// Node.js Express server response
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    // 201 Created explicitly confirms resource creation
    res.status(201).json({
        success: true,
        data: newUser
    });
});`,
    codeLanguage: 'json',
    terminalOutput: `HTTP/1.1 201 Created
Content-Type: application/json
Date: Sat, 03 Oct 2026 12:00:00 GMT

{
  "success": true,
  "data": { "username": "alex", "role": "engineer" }
}`,
    breakdown: [
      { term: '200 OK', definition: 'Standard response for successful HTTP requests.', badge: '2xx Success' },
      { term: '201 Created', definition: 'Resource has been successfully created on the server.', badge: '2xx Success' },
      { term: '401 Unauthorized', definition: 'Missing or invalid authentication credentials.', badge: '4xx Error' },
      { term: '404 Not Found', definition: 'Target endpoint or database resource does not exist.', badge: '4xx Error' },
      { term: '500 Server Error', definition: 'Uncaught exception or crash in backend service code.', badge: '5xx Error' }
    ],
    proTip: 'Never return 200 OK with { error: "Failed" } inside the body—always use proper semantic HTTP status codes like 400 or 422.',
    commonMistake: 'Using GET to modify database records. GET requests must be idempotent and safe—they should never alter server state.'
  },

  'backend-rest': {
    summary: 'Representational State Transfer (REST) is an architectural style for designing scalable network APIs. In REST, everything is a resource identified by URIs, and operations are expressed using HTTP verbs acting on plural nouns (e.g. /api/v1/projects/:id).',
    keyRule: 'Use plural nouns for resource endpoints: GET /api/v1/posts, POST /api/v1/posts. Avoid verbs in URIs like /api/getPosts.',
    codeSnippet: `// RESTful API Endpoint Patterns:
// GET    /api/users          -> Fetch list of users
// POST   /api/users          -> Create a new user
// GET    /api/users/:id      -> Fetch specific user
// PUT    /api/users/:id      -> Replace entire user record
// PATCH  /api/users/:id      -> Update specific user fields
// DELETE /api/users/:id      -> Remove user`,
    codeLanguage: 'json',
    terminalOutput: `GET /api/v1/users/42/orders HTTP/1.1
Host: api.codequest.dev
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
[
  { "orderId": 801, "total": 129.99, "status": "shipped" }
]`,
    breakdown: [
      { term: 'Statelessness', definition: 'Every client request must contain all necessary data; server keeps no client session state.', badge: 'REST' },
      { term: 'Resource URIs', definition: 'Hierarchical endpoints organizing entities: /companies/:id/employees.', badge: 'URI' },
      { term: 'Content-Type', definition: 'Header stating payload format, almost universally application/json.', badge: 'Header' }
    ],
    proTip: 'Version your APIs (/api/v1/...) from day one so you can evolve data structures without breaking existing mobile and web clients.',
    commonMistake: 'Embedding action verbs in endpoints: writing "/api/deleteUser?id=5" instead of sending DELETE to "/api/users/5".'
  },

  'backend-routing': {
    summary: 'Routing directs incoming HTTP requests to their designated controller functions based on HTTP method and path pattern. Middleware functions sit in the request pipeline to inspect, log, authenticate, or transform requests before reaching endpoints.',
    keyRule: 'Middleware receives (req, res, next). It MUST either call next() to pass control forward or terminate the connection with res.send().',
    codeSnippet: `// Authentication Middleware Example
function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }
    // Token valid: proceed to route handler
    next();
}

app.get('/api/dashboard', requireAuth, (req, res) => {
    res.json({ stats: { users: 1540, uptime: '99.9%' } });
});`,
    codeLanguage: 'json',
    terminalOutput: `[LOG] GET /api/dashboard - Auth Passed
Response: 200 OK (Stats payload sent)`,
    breakdown: [
      { term: 'Middleware Chain', definition: 'Sequential pipeline of interceptor functions processing requests before routes.', badge: 'Architecture' },
      { term: 'next()', definition: 'Callback function that delegates control to the next middleware in the stack.', badge: 'Control' },
      { term: 'req.params', definition: 'Object containing extracted path variables like :id.', badge: 'Express' }
    ],
    proTip: 'Always register error-handling middleware at the very bottom of your application stack: (err, req, res, next) handles unhandled exceptions.',
    commonMistake: 'Forgetting to return after sending a response in middleware (e.g. "res.status(401).json(); next();"), which causes "Cannot set headers after they are sent to the client".'
  },

  'backend-sql-queries': {
    summary: 'Structured Query Language (SQL) is the universal standard for querying and manipulating data in relational databases (PostgreSQL, MySQL, SQLite). Queries select projections with SELECT, filter with WHERE, sort with ORDER BY, and paginate with LIMIT and OFFSET.',
    keyRule: 'Basic query structure: SELECT columns FROM table WHERE condition ORDER BY column ASC/DESC LIMIT n;',
    codeSnippet: `-- Find top 5 active engineers ordered by join date
SELECT id, username, email, created_at
FROM users
WHERE is_active = TRUE AND role = 'engineer'
ORDER BY created_at DESC
LIMIT 5;`,
    codeLanguage: 'sql',
    terminalOutput: ` id | username |      email       |         created_at         
----+----------+------------------+----------------------------
 42 | elena    | elena@dev.io     | 2026-10-01 10:15:00.000+00
 39 | marcus   | marcus@dev.io    | 2026-09-28 14:22:11.000+00
(2 rows returned in 1.4ms)`,
    breakdown: [
      { term: 'SELECT ... FROM', definition: 'Specifies which columns to retrieve from the target relational table.', badge: 'Projection' },
      { term: 'WHERE Clause', definition: 'Filters rows according to boolean predicates before returning results.', badge: 'Filter' },
      { term: 'ORDER BY & LIMIT', definition: 'Orders rows by column values and constrains the maximum row count.', badge: 'Pagination' }
    ],
    proTip: 'Always create indexes on columns frequently used in WHERE filters and JOIN conditions to avoid slow full-table scans.',
    commonMistake: 'Executing SQL string concatenation: "SELECT * FROM users WHERE name = \'" + input + "\'" which introduces catastrophic SQL Injection vulnerabilities. Always use parameterized queries!'
  },

  'backend-sql-joins': {
    summary: 'Relational databases store related entities in normalized tables linked by Primary Keys (PK) and Foreign Keys (FK). SQL JOINs stitch records across multiple tables into unified result sets.',
    keyRule: 'INNER JOIN returns rows matching both tables. LEFT JOIN returns all rows from the left table, with NULLs for unmatched right-table rows.',
    codeSnippet: `-- Join orders with customers to show customer names
SELECT 
    orders.id AS order_id,
    customers.name AS customer_name,
    orders.total_amount
FROM orders
INNER JOIN customers 
    ON orders.customer_id = customers.id
WHERE orders.status = 'completed';`,
    codeLanguage: 'sql',
    terminalOutput: ` order_id | customer_name | total_amount 
----------+---------------+--------------
     1001 | Alice Walker  |        89.50
     1002 | David Chen    |       245.00
(2 rows matched ON customer_id = customers.id)`,
    breakdown: [
      { term: 'Foreign Key (FK)', definition: 'A column in one table referencing the Primary Key of another table.', badge: 'Relational' },
      { term: 'INNER JOIN', definition: 'Returns records only when the join condition matches on both tables.', badge: 'JOIN' },
      { term: 'LEFT JOIN', definition: 'Keeps all left-side rows regardless of whether matching right records exist.', badge: 'JOIN' }
    ],
    proTip: 'When joining tables with nullable foreign keys, use LEFT JOIN to ensure records with null relations are not silently excluded.',
    commonMistake: 'Forgetting the ON clause in a join: omitting "ON a.id = b.a_id" produces a massive, slow Cartesian Cross-Product!'
  },

  'backend-orm': {
    summary: 'Schema migrations version your database structure across environments. Database transactions group multiple writes into an atomic unit obeying ACID properties (Atomicity, Consistency, Isolation, Durability).',
    keyRule: 'BEGIN starts a transaction, COMMIT persists changes permanently, and ROLLBACK restores the database if any step fails.',
    codeSnippet: `BEGIN TRANSACTION;

-- Deduct balance from sender
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

-- Deposit balance to receiver
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If any error occurs, ROLLBACK; otherwise:
COMMIT;`,
    codeLanguage: 'sql',
    terminalOutput: `BEGIN
UPDATE 1
UPDATE 1
COMMIT
(Transaction committed successfully with full ACID guarantee)`,
    breakdown: [
      { term: 'Atomicity', definition: 'All statements inside the transaction succeed together, or the entire batch is rolled back.', badge: 'ACID' },
      { term: 'COMMIT', definition: 'Applies transaction operations permanently to storage.', badge: 'ACID' },
      { term: 'ROLLBACK', definition: 'Discards all operations in the current transaction block, preserving data integrity.', badge: 'ACID' }
    ],
    proTip: 'Keep transactions as short as possible to avoid long-lived database row locks that degrade concurrent API performance.',
    commonMistake: 'Performing external HTTP calls or slow disk I/O inside an active database transaction block.'
  },

  'backend-auth-jwt': {
    summary: 'JSON Web Tokens (JWT) enable stateless authentication for modern distributed APIs. A JWT consists of three base64url-encoded parts separated by dots: Header, Payload (claims like user ID and expiration), and Cryptographic Signature.',
    keyRule: 'JWT structure: header.payload.signature. The signature verifies the token was created by your server and was not tampered with.',
    codeSnippet: `// Verifying JWT in Node.js
import jwt from 'jsonwebtoken';

const token = req.headers.authorization?.split(' ')[1];
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: 42, role: "admin" }
    next();
} catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
}`,
    codeLanguage: 'json',
    terminalOutput: `Decoded JWT Payload:
{
  "sub": "user_42",
  "role": "admin",
  "iat": 1727956800,
  "exp": 1727960400
}`,
    breakdown: [
      { term: 'Bearer Token', definition: 'Standard Authorization header scheme: "Authorization: Bearer <token>".', badge: 'HTTP' },
      { term: 'Claims & Expiration', definition: 'Payload attributes like exp (expiry) preventing stolen tokens from working indefinitely.', badge: 'Security' },
      { term: 'Signature', definition: 'HMACSHA256(base64Url(header) + "." + base64Url(payload), secret).', badge: 'Crypto' }
    ],
    proTip: 'Never store sensitive secrets like passwords or API keys in the JWT payload—anyone can decode base64 without knowing the secret!',
    commonMistake: 'Issuing JWTs without an expiration time (exp). Tokens without expiry cannot be revoked if compromised.'
  },

  'backend-hashing': {
    summary: 'User passwords must never be stored in plain text. Secure systems use cryptographic, slow-hashing algorithms like bcrypt or Argon2 with unique salts to defeat brute-force and rainbow table attacks.',
    keyRule: 'A cryptographic salt adds random bytes to passwords before hashing, ensuring identical passwords yield completely distinct hashes.',
    codeSnippet: `import bcrypt from 'bcrypt';

// Password Registration
const saltRounds = 12; // 2^12 computation iterations
const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

// Password Login Verification
const isMatch = await bcrypt.compare(candidatePassword, storedHash);
if (!isMatch) {
    throw new Error('Invalid credentials');
}`,
    codeLanguage: 'json',
    terminalOutput: `Stored bcrypt hash format:
$2b$12$e8uq5/1eK3zL0vC1H0F0xeWk9kS3X2nJ.9J9Y8u0lQ/a3b1c2d3e4
[algorithm: $2b$] [rounds: 12] [salt + hash: 53 chars]`,
    breakdown: [
      { term: 'Salt Rounds', definition: 'Determines the exponential work factor, intentionally slowing down brute-force attackers.', badge: 'Bcrypt' },
      { term: 'Rainbow Tables', definition: 'Pre-computed tables of plain-text hashes, completely neutralized by salts.', badge: 'Defense' },
      { term: 'Timing Attack Safety', definition: 'bcrypt.compare executes in constant time to prevent side-channel timing analysis.', badge: 'Crypto' }
    ],
    proTip: 'Never use standard fast hashing functions like MD5 or SHA-256 for passwords—modern graphics cards can guess trillions per minute.',
    commonMistake: 'Re-hashing an already hashed password, or attempting to invent your own custom encryption algorithm.'
  },

  'backend-boss': {
    summary: 'The Backend Systems Architect Boss Challenge tests your ability to engineer production-ready web APIs: caching database hits with Redis, preventing brute force with rate limiting, and guaranteeing ACID consistency.',
    keyRule: 'Implement the Cache-Aside pattern: check cache first; on a cache miss, query the database, populate cache, and return response.',
    codeSnippet: `// High-Performance Cached Route with Rate Limiting
app.get('/api/catalog', rateLimiter({ max: 60, windowMs: 60000 }), async (req, res) => {
    const cacheKey = 'products:catalog';
    const cached = await redis.get(cacheKey);

    if (cached) {
        return res.json(JSON.parse(cached));
    }

    const data = await db.query('SELECT * FROM products WHERE in_stock = true');
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 300); // 5 min TTL
    res.json(data);
});`,
    codeLanguage: 'json',
    terminalOutput: `[CACHE HIT] Returning products:catalog in 1.1ms (DB bypassed)
HTTP 200 OK`,
    breakdown: [
      { term: 'Cache-Aside Pattern', definition: 'In-memory caching (Redis/Memcached) drastically reducing database load.', badge: 'Performance' },
      { term: 'Rate Limiting (429)', definition: 'Restricting requests per IP window to prevent DDoS and brute-force abuse.', badge: 'Security' },
      { term: 'TTL (Time To Live)', definition: 'Cache expiration period preventing stale cached data from persisting forever.', badge: 'Cache' }
    ],
    proTip: 'Always invalidate or update relevant cache keys immediately when write operations (POST, PUT, DELETE) succeed.',
    commonMistake: 'Failing to set a TTL (expiration) on cache keys, leading to memory exhaustion and stale database reads.'
  },

  // ==========================================
  // --- BACKEND ADVANCED MODULES 4 & 5 ---
  // ==========================================
  'backend-redis-cache': {
    summary: 'Redis is an in-memory key-value data structure store used as a high-speed database cache. By adopting the Cache-Aside pattern, application read latency drops from ~50ms database disk reads to sub-millisecond RAM lookups.',
    keyRule: 'Query Redis first • On cache miss, fetch from DB and populate Redis with EX (TTL) • Invalidate cache upon DB writes.',
    codeSnippet: `const key = \`user:\${userId}\`;
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

const user = await db.users.findById(userId);
await redis.set(key, JSON.stringify(user), "EX", 3600); // 1 hour TTL
return user;`,
    codeLanguage: 'json',
    terminalOutput: `[REDIS GET] user:42 -> HIT (0.8ms)`,
    breakdown: [
      { term: 'In-Memory Store', definition: 'RAM-based data storage offering microsecond read/write operations.', badge: 'Redis' },
      { term: 'Cache Invalidation', definition: 'Purging stale cache entries with redis.del() when underlying records change.', badge: 'Consistency' }
    ],
    proTip: 'Use Redis Hashes (HSET/HGETALL) instead of serializing entire JSON strings when you need to update individual user fields.',
    commonMistake: 'Not handling Cache Stampede (Thundering Herd) when a high-traffic key expires simultaneously for thousands of users.'
  },

  'backend-rate-limiting': {
    summary: 'Rate limiting protects APIs against abusive clients, DDoS attacks, and brute-force credential stuffing. The Token Bucket algorithm allows bursts while bounding sustained request volume per IP.',
    keyRule: 'Return HTTP 429 Too Many Requests • Include Retry-After headers • Store sliding-window counters in Redis.',
    codeSnippet: `const count = await redis.incr(\`rate:\${clientIp}\`);
if (count === 1) await redis.expire(\`rate:\${clientIp}\`, 60);

if (count > 100) {
  return res.status(429).set("Retry-After", "60").json({
    error: "Too many requests. Please slow down."
  });
}`,
    codeLanguage: 'json',
    breakdown: [
      { term: 'HTTP 429', definition: 'Standard status code signaling the client has exceeded their rate limit quota.', badge: 'HTTP' },
      { term: 'Token Bucket', definition: 'Rate limiting algorithm where tokens refill at a steady rate up to bucket capacity.', badge: 'Algorithm' }
    ],
    proTip: 'Use a Sliding Window Log with Redis Sorted Sets (ZADD/ZREMRANGEBYSCORE) for mathematically exact rate limiting.',
    commonMistake: 'Storing rate-limiting state in local Node.js process memory instead of Redis across multi-instance server clusters.'
  },

  'backend-adv1-boss': {
    summary: 'The Distributed Caching Boss Challenge tests Redis cluster pipelining, distributed mutex locking (Redlock), and cache stampede mitigations.',
    keyRule: 'redis.pipeline() batches network round-trips • Redlock pattern uses SET key val NX PX ms for distributed mutexes.',
    codeSnippet: `const pipeline = redis.pipeline();
pipeline.get("user:1");
pipeline.get("user:2");
const results = await pipeline.exec();`,
    codeLanguage: 'json',
    breakdown: [
      { term: 'Pipelining', definition: 'Batching multiple Redis commands into a single TCP socket packet.', badge: 'Network' },
      { term: 'Distributed Lock', definition: 'Ensuring only one worker executes critical batch logic across server clusters.', badge: 'Concurrency' }
    ],
    proTip: 'Always pass a unique random token when acquiring Redis locks and use Lua scripts to release them safely.',
    commonMistake: 'Acquiring a distributed lock without an expiration TTL, causing permanent deadlocks if the worker crashes.'
  },

  'backend-message-queues': {
    summary: 'Apache Kafka and RabbitMQ provide asynchronous, decoupled messaging architectures. Producers publish events to topics, and consumer worker groups process payloads independently with guaranteed at-least-once delivery.',
    keyRule: 'Producers publish events without blocking HTTP responses • Consumers process background jobs with worker concurrency.',
    codeSnippet: `// Kafka Producer
await producer.send({
  topic: "order-events",
  messages: [{
    key: order.id,
    value: JSON.stringify({ type: "ORDER_CREATED", orderId: order.id })
  }]
});`,
    codeLanguage: 'json',
    terminalOutput: `[KAFKA PRODUCER] Published ORDER_CREATED to partition 2 (offset: 1042)`,
    breakdown: [
      { term: 'Topic & Partition', definition: 'Ordered, append-only log of event records distributed across broker nodes.', badge: 'Kafka' },
      { term: 'Consumer Group', definition: 'Pool of worker processes sharing partitions to parallelize consumption.', badge: 'Scaling' }
    ],
    proTip: 'Partition by consistent business keys (like userId or customerId) to guarantee in-order processing per entity.',
    commonMistake: 'Treating message queues like synchronous RPC calls and blocking HTTP request threads waiting for consumer replies.'
  },

  'backend-distributed-tx': {
    summary: 'Distributed microservices avoid distributed two-phase commit (2PC) locks by adopting the Transactional Outbox pattern, idempotency keys, and event-driven sagas.',
    keyRule: 'Outbox Pattern saves DB entity + event table in ONE transaction • Idempotency keys prevent double charges on retries.',
    codeSnippet: `// Transactional Outbox
await db.tx(async (t) => {
  await t.orders.create(orderData);
  await t.outbox.create({
    topic: "order-events",
    payload: JSON.stringify(orderData)
  });
});`,
    codeLanguage: 'json',
    breakdown: [
      { term: 'Outbox Pattern', definition: 'Writes domain changes and outgoing events in the same atomic local database transaction.', badge: 'Pattern' },
      { term: 'Idempotency', definition: 'Property where an operation produces the identical result regardless of how many times it is executed.', badge: 'Resilience' }
    ],
    proTip: 'Always store idempotency keys with a 24-hour expiration in Redis/Postgres for all payment and mutation endpoints.',
    commonMistake: 'Writing to a database first, then calling Kafka. If the broker call fails, your database state and event stream diverge forever!'
  },

  'backend-master-boss': {
    summary: 'The Principal Backend Architect Master Challenge tests distributed Saga orchestrations, database sharding hash rings, and row-level locking.',
    keyRule: 'Sagas execute compensating transactions on failure • SELECT ... FOR UPDATE prevents race conditions on bank balances.',
    codeSnippet: `// Row-Level Lock for Financial Balance Transfer
await db.query("SELECT balance FROM accounts WHERE id = $1 FOR UPDATE", [accId]);`,
    codeLanguage: 'json',
    breakdown: [
      { term: 'Saga Pattern', definition: 'Sequence of local transactions coordinating compensating rollbacks across microservices.', badge: 'Saga' },
      { term: 'Database Sharding', definition: 'Horizontally partitioning database tables across multiple physical database instances.', badge: 'Sharding' }
    ],
    proTip: 'Use optimistic concurrency control (version column) before resorting to pessimistic SELECT FOR UPDATE locks.',
    commonMistake: 'Designing microservices with shared database tables, which violates service boundary autonomy and introduces tight coupling.'
  }
};
