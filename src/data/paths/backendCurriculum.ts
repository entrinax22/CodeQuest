import { Module } from '../curriculum';

export const BACKEND_MODULES: Module[] = [
  {
    id: 'backend-1',
    title: 'HTTP Protocols & RESTful APIs',
    subtitle: 'Module 1',
    description: 'Master HTTP methods, status codes, REST resources, headers, and request-response cycles.',
    lessons: [
      {
        id: 'backend-http',
        title: 'HTTP Methods & Status Codes',
        description: 'Understand GET, POST, PUT, DELETE, and standard 2xx, 4xx, and 5xx status codes.',
        exercises: [
          {
            id: 'be-h-1',
            type: 'choice',
            question: 'Which HTTP method should be used when creating a brand new resource on the server?',
            hint: 'GET retrieves, PUT replaces, DELETE removes.',
            options: ['POST', 'GET', 'HEAD', 'OPTIONS'],
            correct: ['POST'],
            explanation: 'POST is the standard HTTP verb designed to submit data and create new records on a server.'
          },
          {
            id: 'be-h-2',
            type: 'fill',
            question: 'Return a 201 Created status and JSON payload when a user account is registered:',
            hint: '201 Created signifies successful resource creation.',
            code: ['res.status(', '201', ').json({', 'id: 42,', 'created: true', '});'],
            blanks: [1, 3],
            options: ['201', 'id: 42,', '200', '404', '500', 'status: "ok"'],
            correct: ['201', 'id: 42,'],
            explanation: 'HTTP 201 explicitly communicates to clients that a new resource has been created.'
          },
          {
            id: 'be-h-3',
            type: 'create',
            question: 'Which HTTP status code indicates "Unauthorized" (missing or invalid credentials)?',
            hint: '401',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Enter the 3-digit numeric HTTP status code for Unauthorized\n...',
            options: [],
            correct: ['401', 'HTTP 401', '401 Unauthorized'],
            explanation: 'HTTP 401 Unauthorized indicates that the client request lacks valid authentication credentials.'
          }
        ]
      },
      {
        id: 'backend-rest',
        title: 'REST Architecture & Payloads',
        description: 'Design stateless resource URIs and handle JSON request bodies and headers.',
        exercises: [
          {
            id: 'be-r-1',
            type: 'choice',
            question: 'Following clean RESTful conventions, what is the best URI to fetch user 42’s orders?',
            hint: 'Use plural resource nouns and nested sub-resources.',
            options: [
              '/api/v1/users/42/orders',
              '/getUserOrders?userId=42',
              '/api/orders/get_by_user_id_42',
              '/runQuery/users/orders/42'
            ],
            correct: ['/api/v1/users/42/orders'],
            explanation: 'REST uses nested plural nouns (/users/:id/orders) to represent clear relational hierarchies without action verbs in the URI.'
          },
          {
            id: 'be-r-2',
            type: 'fill',
            question: 'Set the HTTP response header specifying JSON format:',
            hint: 'Content-Type: application/json',
            code: ['res.setHeader(', '"Content-Type"', ',', '"application/json"', ');'],
            blanks: [1, 3],
            options: ['"Content-Type"', '"application/json"', '"Accept"', '"text/html"', '"Authorization"', '"Host"'],
            correct: ['"Content-Type"', '"application/json"'],
            explanation: 'Content-Type: application/json informs the recipient that the HTTP payload body is JSON formatted.'
          },
          {
            id: 'be-r-3',
            type: 'create',
            question: 'Which HTTP method should be used to completely replace an existing resource at /api/users/15?',
            hint: 'PUT',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Enter the uppercase HTTP verb\n...',
            options: [],
            correct: ['PUT', 'put'],
            explanation: 'PUT replaces the entire targeted resource with the uploaded representation.'
          }
        ]
      },
      {
        id: 'backend-routing',
        title: 'Routing & Middleware',
        description: 'Implement middleware chains for logging, parsing, and request validation.',
        exercises: [
          {
            id: 'be-rt-1',
            type: 'fill',
            question: 'Pass control to the next middleware function in an Express / HTTP pipeline:',
            hint: 'next() passes control down the pipeline.',
            code: ['function', 'logger(req, res,', 'next', ') {', '\n  console.log(req.url);', '\n ', 'next()', ';', '\n}'],
            blanks: [2, 6],
            options: ['next', 'next()', 'continue', 'yield', 'forward', 'done()'],
            correct: ['next', 'next()'],
            explanation: 'Middleware receives next as a parameter and calls next() to yield control to the subsequent handler.'
          },
          {
            id: 'be-rt-2',
            type: 'choice',
            question: 'What occurs if a middleware function neither sends a response nor calls next()?',
            hint: 'The connection remains open waiting indefinitely.',
            options: [
              'The HTTP request hangs indefinitely until the client times out',
              'The server automatically restarts',
              'A 404 Not Found is immediately returned to the browser',
              'The request bypasses all remaining routes'
            ],
            correct: ['The HTTP request hangs indefinitely until the client times out'],
            explanation: 'If a middleware neither responds nor forwards execution with next(), the HTTP socket remains hung until a timeout occurs.'
          },
          {
            id: 'be-rt-3',
            type: 'create',
            question: 'Extract the route parameter id from req.params in Node/Express:',
            hint: 'const { id } = req.params; or const id = req.params.id;',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: 'app.get("/api/users/:id", (req, res) => {\n    // Extract id\n    ...\n});',
            options: [],
            correct: [
              'const id = req.params.id;',
              'const { id } = req.params;',
              'let id = req.params.id;',
              'const id = req.params.id'
            ],
            explanation: 'req.params contains key-value pairs of route parameters specified in path patterns.'
          }
        ]
      }
    ]
  },
  {
    id: 'backend-2',
    title: 'Relational Databases & SQL',
    subtitle: 'Module 2',
    description: 'Query relational tables, filter with WHERE, perform JOIN operations, and ensure data integrity.',
    lessons: [
      {
        id: 'backend-sql-queries',
        title: 'SQL SELECT & Filtering',
        description: 'Query database tables with SELECT, WHERE, ORDER BY, and LIMIT.',
        exercises: [
          {
            id: 'be-sql-1',
            type: 'fill',
            question: 'Query email and username of all active users ordered by signup date:',
            hint: 'SELECT ... FROM ... WHERE ... ORDER BY ...',
            code: ['SELECT', 'username, email', 'FROM', 'users', 'WHERE', 'is_active = true', 'ORDER BY', 'created_at DESC;'],
            blanks: [0, 4],
            options: ['SELECT', 'WHERE', 'GET', 'FILTER', 'HAVING', 'FIND'],
            correct: ['SELECT', 'WHERE'],
            explanation: 'SELECT specifies projection columns and WHERE filters rows before returning results.'
          },
          {
            id: 'be-sql-2',
            type: 'choice',
            question: 'Which SQL clause limits the maximum number of rows returned by a query?',
            hint: 'LIMIT 10',
            options: ['LIMIT', 'TOP', 'STOP', 'MAX_ROWS'],
            correct: ['LIMIT'],
            explanation: 'LIMIT restricts the row count returned in standard SQL (PostgreSQL, MySQL, SQLite).'
          },
          {
            id: 'be-sql-3',
            type: 'create',
            question: 'Write a SQL clause to filter products with price greater than 50:',
            hint: 'WHERE price > 50',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: 'SELECT * FROM products\n// Filter here\n...',
            options: [],
            correct: ['WHERE price > 50', 'WHERE price > 50;', 'where price > 50'],
            explanation: 'WHERE price > 50 filters the rows based on the numeric condition.'
          }
        ]
      },
      {
        id: 'backend-sql-joins',
        title: 'SQL JOINs & Relations',
        description: 'Combine related data across multiple tables using INNER JOIN and LEFT JOIN.',
        exercises: [
          {
            id: 'be-j-1',
            type: 'fill',
            question: 'Join the orders table with the customers table matching customer ID foreign keys:',
            hint: 'JOIN ... ON orders.customer_id = customers.id',
            code: ['SELECT', 'orders.id, customers.name\nFROM orders\n', 'INNER JOIN', 'customers\n', 'ON', 'orders.customer_id = customers.id;'],
            blanks: [2, 4],
            options: ['INNER JOIN', 'ON', 'MERGE', 'WITH', 'WHERE', 'LEFT JOIN'],
            correct: ['INNER JOIN', 'ON'],
            explanation: 'INNER JOIN combines rows from two tables whenever the ON predicate evaluates to true.'
          },
          {
            id: 'be-j-2',
            type: 'choice',
            question: 'What is the key difference between INNER JOIN and LEFT JOIN in SQL?',
            hint: 'LEFT JOIN keeps all rows from the left table even if there is no match on the right.',
            options: [
              'LEFT JOIN retains all rows from the left table, inserting NULL for unmatched right columns',
              'LEFT JOIN deletes rows from the right table if no match is found',
              'INNER JOIN only works on primary key numeric columns',
              'INNER JOIN sorts the output in ascending order automatically'
            ],
            correct: ['LEFT JOIN retains all rows from the left table, inserting NULL for unmatched right columns'],
            explanation: 'LEFT JOIN guarantees that every record from the left table is returned, with NULLs for missing relations.'
          },
          {
            id: 'be-j-3',
            type: 'create',
            question: 'Write a SQL statement to insert a new category named "Electronics" into categories table:',
            hint: 'INSERT INTO categories (name) VALUES ("Electronics");',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Write INSERT statement\n...',
            options: [],
            correct: [
              "INSERT INTO categories (name) VALUES ('Electronics');",
              'INSERT INTO categories (name) VALUES ("Electronics");',
              "INSERT INTO categories (name) VALUES ('Electronics')"
            ],
            explanation: 'INSERT INTO table (columns) VALUES (values) creates new records in relational databases.'
          }
        ]
      },
      {
        id: 'backend-orm',
        title: 'Migrations & Transactions (ACID)',
        description: 'Understand schema migrations and ACID database transactions for consistency.',
        exercises: [
          {
            id: 'be-orm-1',
            type: 'choice',
            question: 'What does the "A" in ACID database transactions guarantee?',
            hint: 'All operations succeed together or none do (all-or-nothing).',
            options: [
              'Atomicity (all operations succeed or the entire transaction rolls back)',
              'Asynchronous execution for fast responses',
              'Automated index caching on disk',
              'Authorization checking before query dispatch'
            ],
            correct: ['Atomicity (all operations succeed or the entire transaction rolls back)'],
            explanation: 'Atomicity guarantees all-or-nothing: if any operation fails, the transaction is completely rolled back.'
          },
          {
            id: 'be-orm-2',
            type: 'fill',
            question: 'Wrap sensitive money transfer operations in a transaction block:',
            hint: 'BEGIN TRANSACTION ... COMMIT',
            code: ['BEGIN', 'TRANSACTION;', '\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;', '\n', 'COMMIT', ';'],
            blanks: [0, 3],
            options: ['BEGIN', 'COMMIT', 'START', 'SAVE', 'ROLLBACK', 'EXECUTE'],
            correct: ['BEGIN', 'COMMIT'],
            explanation: 'BEGIN TRANSACTION starts a unit of work; COMMIT applies the changes permanently to the database.'
          },
          {
            id: 'be-orm-3',
            type: 'create',
            question: 'Which SQL command rolls back all uncommitted changes in the current transaction?',
            hint: 'ROLLBACK;',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Revert transaction changes\n...',
            options: [],
            correct: ['ROLLBACK;', 'ROLLBACK', 'rollback;', 'rollback'],
            explanation: 'ROLLBACK cancels all database modifications made since the start of the current transaction.'
          }
        ]
      }
    ]
  },
  {
    id: 'backend-3',
    title: 'Authentication & Production Systems',
    subtitle: 'Module 3',
    description: 'Implement JWT tokens, cryptographic password hashing, caching, and rate limiting.',
    lessons: [
      {
        id: 'backend-auth-jwt',
        title: 'JWT Tokens & Stateless Auth',
        description: 'Structure JSON Web Tokens: header, payload claims, and cryptographic signatures.',
        exercises: [
          {
            id: 'be-jwt-1',
            type: 'choice',
            question: 'How many base64url-encoded parts separated by dots make up a JSON Web Token (JWT)?',
            hint: 'header.payload.signature',
            options: ['3', '2', '4', '1'],
            correct: ['3'],
            explanation: 'A JWT consists of 3 dot-separated parts: Header (algorithm), Payload (claims), and Signature (secret verification).'
          },
          {
            id: 'be-jwt-2',
            type: 'fill',
            question: 'Attach a bearer token into the Authorization HTTP header:',
            hint: 'Authorization: Bearer <token>',
            code: ['headers: {', '\n  ', '"Authorization"', ':', '"Bearer "', '+ token\n}'],
            blanks: [2, 4],
            options: ['"Authorization"', '"Bearer "', '"Token"', '"Auth"', '"Key"', '"Cookie"'],
            correct: ['"Authorization"', '"Bearer "'],
            explanation: 'The standard HTTP header format for stateless token authentication is Authorization: Bearer <token>.'
          },
          {
            id: 'be-jwt-3',
            type: 'create',
            question: 'Why should sensitive secrets like user passwords never be stored inside a JWT payload?',
            hint: 'The payload is only base64 encoded and can be decoded by anyone.',
            options: [],
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Explain why passwords cannot go in JWT payloads\n...',
            correct: [
              'Because the payload is not encrypted and can be decoded by anyone',
              'Because the payload is only base64 encoded',
              'Because anyone can decode the payload',
              'Because JWT payloads are readable by clients'
            ],
            explanation: 'JWT payloads are base64url encoded, NOT encrypted. Anyone who intercepts the token can read the payload.'
          }
        ]
      },
      {
        id: 'backend-hashing',
        title: 'Password Hashing & Salts (bcrypt)',
        description: 'Secure user credentials with slow cryptographic hashing algorithms and unique salts.',
        exercises: [
          {
            id: 'be-hash-1',
            type: 'choice',
            question: 'Why is standard SHA-256 or MD5 considered unsafe for hashing user passwords in production?',
            hint: 'They are designed to be fast, making brute-force and rainbow table attacks trivial.',
            options: [
              'They are too fast, enabling attackers to test billions of guesses per second with GPUs',
              'They can only hash strings shorter than 8 characters',
              'They require an active internet connection to compute',
              'Modern web browsers refuse to send SHA hashes'
            ],
            correct: ['They are too fast, enabling attackers to test billions of guesses per second with GPUs'],
            explanation: 'Password hashing requires intentionally slow, memory-hard algorithms like bcrypt or Argon2 to defeat GPU brute force.'
          },
          {
            id: 'be-hash-2',
            type: 'fill',
            question: 'Hash a raw user password using bcrypt with 12 salt rounds:',
            hint: 'bcrypt.hash(password, 12)',
            code: ['const', 'hashed', '=', 'await', 'bcrypt.hash', '(password,', '12', ');'],
            blanks: [4, 6],
            options: ['bcrypt.hash', '12', 'bcrypt.encode', 'md5', 'crypto.sha', '1'],
            correct: ['bcrypt.hash', '12'],
            explanation: 'bcrypt.hash(password, saltRounds) generates a cryptographically secure hash with an embedded random salt.'
          },
          {
            id: 'be-hash-3',
            type: 'create',
            question: 'What is the purpose of adding a cryptographic "salt" to a password before hashing?',
            hint: 'To prevent rainbow table attacks and ensure identical passwords have distinct hashes.',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// What does salt prevent?\n...',
            options: [],
            correct: [
              'To ensure identical passwords result in different unique hashes',
              'To prevent rainbow table attacks',
              'Prevents rainbow table attacks',
              'Ensure identical passwords have different hashes'
            ],
            explanation: 'A salt is random data added to the password input so identical passwords generate completely different hashes.'
          }
        ]
      },
      {
        id: 'backend-boss',
        title: 'Backend Systems Architect Boss',
        isBoss: true,
        description: 'Synthesize REST APIs, SQL transactions, JWT verification, and caching layers.',
        exercises: [
          {
            id: 'be-b-1',
            type: 'fill',
            question: 'Check Redis cache first and return cached data, otherwise query the relational database:',
            hint: 'const cached = await redis.get(key);',
            code: ['const', 'cached', '=', 'await', 'redis.get(cacheKey);', '\nif (cached) return JSON.parse(cached);\nconst data = await', 'db.query', '(sql);'],
            blanks: [4, 7],
            options: ['redis.get(cacheKey);', 'db.query', 'redis.set', 'cache.find', 'fetch', 'localStorage.get'],
            correct: ['redis.get(cacheKey);', 'db.query'],
            explanation: 'The Cache-Aside pattern queries an in-memory cache like Redis first, only hitting the relational database on cache misses.'
          },
          {
            id: 'be-b-2',
            type: 'choice',
            question: 'Which HTTP header prevents brute-force credential stuffing by limiting requests per IP address?',
            hint: 'Rate limiting returns HTTP 429 Too Many Requests.',
            options: [
              'HTTP 429 Too Many Requests (Rate Limiting)',
              'HTTP 403 Forbidden',
              'HTTP 502 Bad Gateway',
              'HTTP 301 Moved Permanently'
            ],
            correct: ['HTTP 429 Too Many Requests (Rate Limiting)'],
            explanation: 'Rate limiting protects APIs from abuse and DDoS by returning HTTP 429 when a client exceeds allowed thresholds.'
          },
          {
            id: 'be-b-3',
            type: 'create',
            question: 'Write the SQL statement to permanently remove all expired user sessions from user_sessions table:',
            hint: 'DELETE FROM user_sessions WHERE expires_at < NOW();',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Clean up expired sessions\n...',
            options: [],
            correct: [
              'DELETE FROM user_sessions WHERE expires_at < NOW();',
              'DELETE FROM user_sessions WHERE expires_at < NOW()',
              'delete from user_sessions where expires_at < now();'
            ],
            explanation: 'DELETE FROM table WHERE condition removes rows matching the expiration predicate.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): DISTRIBUTED CACHING & RATE LIMITING ---
  // ==========================================
  {
    id: 'backend-adv-1',
    title: 'Distributed Caching, Redis & Rate Limiting',
    subtitle: 'Advance Module 4',
    description: 'Master in-memory caching strategies, cache stampede prevention, and high-load token bucket rate limiting.',
    isAdvanced: true,
    lessons: [
      {
        id: 'backend-redis-cache',
        title: 'In-Memory Caching & Redis Cache-Aside',
        description: 'Reduce relational database latency from 80ms to 2ms using Redis key-value memory caches.',
        exercises: [
          {
            id: 'brc-1',
            type: 'choice',
            question: 'What is the Cache Stampede (Thundering Herd) problem in backend engineering?',
            hint: 'When a popular cache key expires and thousands of concurrent requests all hammer the database simultaneously.',
            options: [
              'When a popular cache key expires and thousands of concurrent requests all hammer the database simultaneously',
              'When Redis runs out of memory on Linux',
              'When SQL injection crashes PostgreSQL',
              'When frontend users spam clicks on the UI'
            ],
            correct: ['When a popular cache key expires and thousands of concurrent requests all hammer the database simultaneously'],
            explanation: 'Cache stampede occurs when an expired hot key causes simultaneous DB queries; solved via mutex locks or probabilistic early recomputation.'
          },
          {
            id: 'brc-2',
            type: 'fill',
            question: 'Store a serialized JSON value in Redis with a 3600-second (1-hour) expiration (TTL):',
            hint: 'await redis.set(key, JSON.stringify(val), "EX", 3600);',
            code: ['await', 'redis.set', '(key, payload,', '"EX"', ', 3600);'],
            blanks: [1, 3],
            options: ['redis.set', '"EX"', 'redis.put', '"TTL"', 'redis.save', '"SEC"'],
            correct: ['redis.set', '"EX"'],
            explanation: 'redis.set(key, val, "EX", seconds) sets an automated time-to-live expiration.'
          },
          {
            id: 'brc-3',
            type: 'create',
            question: 'Write the Redis command to delete/invalidate a cache key named "user:100":',
            hint: 'await redis.del("user:100");',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Invalidate user cache\n...',
            options: [],
            correct: ['await redis.del("user:100");', 'await redis.del("user:100")', 'redis.del("user:100");', 'redis.del("user:100")'],
            explanation: 'redis.del(key) removes the key from cache, guaranteeing subsequent reads fetch fresh DB data.'
          }
        ]
      },
      {
        id: 'backend-rate-limiting',
        title: 'API Rate Limiting & Token Bucket Algorithms',
        description: 'Protect microservice endpoints from DDoS and API abuse using Redis token buckets.',
        exercises: [
          {
            id: 'brl-1',
            type: 'choice',
            question: 'Which algorithm allows bursty traffic while enforcing an average rate limit over time?',
            hint: 'Token Bucket allows bursts up to bucket capacity.',
            options: ['Token Bucket algorithm', 'Round Robin DNS', 'Bubble Sort', 'Greedy Knapsack'],
            correct: ['Token Bucket algorithm'],
            explanation: 'Token bucket fills tokens at a constant rate and allows bursts as long as tokens are available in the bucket.'
          },
          {
            id: 'brl-2',
            type: 'fill',
            question: 'Return HTTP 429 Too Many Requests response with Retry-After header in Express:',
            hint: 'res.status(429).set("Retry-After", "60").json({ error: "Rate limit exceeded" });',
            code: ['res.', 'status(429)', '.set("Retry-After", "60").', 'json', '({ error: "Rate limit exceeded" });'],
            blanks: [1, 3],
            options: ['status(429)', 'json', 'status(500)', 'send', 'status(403)', 'redirect'],
            correct: ['status(429)', 'json'],
            explanation: 'HTTP 429 informs clients that they exceeded allowed throughput quotas.'
          },
          {
            id: 'brl-3',
            type: 'create',
            question: 'Write the Redis atomic command to increment an IP counter key named "rate:127.0.0.1":',
            hint: 'await redis.incr("rate:127.0.0.1");',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Atomically increment request count\n...',
            options: [],
            correct: ['await redis.incr("rate:127.0.0.1");', 'await redis.incr("rate:127.0.0.1")', 'redis.incr("rate:127.0.0.1");'],
            explanation: 'redis.incr(key) atomically increments a numeric key without race conditions.'
          }
        ]
      },
      {
        id: 'backend-adv1-boss',
        title: 'Distributed Caching Boss Challenge',
        isBoss: true,
        description: 'Prove high-scale caching architecture, Redis cluster pipelining, and eviction policies.',
        exercises: [
          {
            id: 'bcb-1',
            type: 'choice',
            question: 'Which Redis memory eviction policy removes the least recently used keys among those with an expiration set?',
            hint: 'volatile-lru',
            options: ['volatile-lru', 'allkeys-random', 'noeviction', 'volatile-ttl'],
            correct: ['volatile-lru'],
            explanation: 'volatile-lru evicts the least recently used keys that have an explicit TTL expiration configured.'
          },
          {
            id: 'bcb-2',
            type: 'fill',
            question: 'Execute multiple Redis commands in a single network round-trip using a pipeline:',
            hint: 'const pipeline = redis.pipeline(); pipeline.get(k1); pipeline.get(k2); await pipeline.exec();',
            code: ['const pipe = redis.', 'pipeline', '();\npipe.get("k1");\npipe.get("k2");\nawait pipe.', 'exec', '();'],
            blanks: [1, 3],
            options: ['pipeline', 'exec', 'batch', 'commit', 'transaction', 'run'],
            correct: ['pipeline', 'exec'],
            explanation: 'Redis pipelining batches commands to dramatically reduce socket network round-trip times.'
          },
          {
            id: 'bcb-3',
            type: 'create',
            question: 'Write the command to acquire a distributed lock in Redis with a 5000ms TTL:',
            hint: 'await redis.set("lock:order", workerId, "NX", "PX", 5000);',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Set distributed mutex lock if not exists\n...',
            options: [],
            correct: [
              'await redis.set("lock:order", workerId, "NX", "PX", 5000);',
              'await redis.set("lock:order", workerId, "NX", "PX", 5000)',
              'redis.set("lock:order", workerId, "NX", "PX", 5000);'
            ],
            explanation: 'SET key val NX PX 5000 is the canonical atomic distributed lock pattern in Redis.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): EVENT-DRIVEN MICROSERVICES & KAFKA ---
  // ==========================================
  {
    id: 'backend-adv-2',
    title: 'Event-Driven Microservices & Message Queues',
    subtitle: 'Advance Module 5',
    description: 'Decouple systems at scale with Apache Kafka, RabbitMQ, idempotency, and the Outbox Pattern.',
    isAdvanced: true,
    lessons: [
      {
        id: 'backend-message-queues',
        title: 'Kafka, RabbitMQ & Pub/Sub Queues',
        description: 'Publish asynchronous domain events to decouple background workers from HTTP threads.',
        exercises: [
          {
            id: 'bmq-1',
            type: 'choice',
            question: 'What is the primary advantage of asynchronous message queues (like Kafka or RabbitMQ) over synchronous REST calls between microservices?',
            hint: 'Services do not block waiting for downstream services, and traffic spikes are buffered safely.',
            options: [
              'Decouples service dependencies, buffers traffic spikes, and provides at-least-once guaranteed delivery',
              'Eliminates the need for backend code entirely',
              'Replaces relational SQL databases',
              'Compresses video streams'
            ],
            correct: ['Decouples service dependencies, buffers traffic spikes, and provides at-least-once guaranteed delivery'],
            explanation: 'Message queues buffer domain events asynchronously so services scale independently.'
          },
          {
            id: 'bmq-2',
            type: 'fill',
            question: 'Publish a user_created domain event to a Kafka topic:',
            hint: 'await producer.send({ topic: "user-events", messages: [{ value: payload }] });',
            code: ['await producer.', 'send', '({ topic: "user-events",', 'messages', ': [{ value: JSON.stringify(user) }] });'],
            blanks: [1, 3],
            options: ['send', 'messages', 'publish', 'payloads', 'emit', 'events'],
            correct: ['send', 'messages'],
            explanation: 'producer.send() publishes partitioned event records to a Kafka cluster.'
          },
          {
            id: 'bmq-3',
            type: 'create',
            question: 'Write the consumer method to subscribe to topic "order-events" in KafkaJS:',
            hint: 'await consumer.subscribe({ topic: "order-events" });',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Subscribe consumer to topic\n...',
            options: [],
            correct: [
              'await consumer.subscribe({ topic: "order-events" });',
              'await consumer.subscribe({ topic: "order-events" })',
              'consumer.subscribe({ topic: "order-events" });'
            ],
            explanation: 'consumer.subscribe() registers a consumer group to receive partitioned events.'
          }
        ]
      },
      {
        id: 'backend-distributed-tx',
        title: 'Transactional Outbox & Idempotency Keys',
        description: 'Guarantee dual-write consistency between databases and message brokers.',
        exercises: [
          {
            id: 'bdt-1',
            type: 'choice',
            question: 'What architectural problem does the Transactional Outbox Pattern solve?',
            hint: 'Dual-write problem: ensuring a database record is saved AND an event is published atomically without distributed 2PC.',
            options: [
              'Guarantees atomic consistency between local database writes and message broker event publishing',
              'Speeds up CSS styling',
              'Encrypts user passwords on frontend devices',
              'Generates email templates automatically'
            ],
            correct: ['Guarantees atomic consistency between local database writes and message broker event publishing'],
            explanation: 'The Outbox pattern writes domain events to an outbox table inside the same DB transaction, eliminating dual-write failures.'
          },
          {
            id: 'bdt-2',
            type: 'fill',
            question: 'Check idempotency key in database before charging a payment to prevent double-charging:',
            hint: 'SELECT id FROM idempotency_keys WHERE key = $1;',
            code: ['const existing = await db.query("SELECT * FROM idempotency_keys WHERE', 'key = $1', '", [idempotencyKey]);'],
            blanks: [1],
            options: ['key = $1', 'id = $1', 'status = $1', 'user = $1'],
            correct: ['key = $1'],
            explanation: 'Idempotency keys ensure identical payment requests executed multiple times only charge the customer once.'
          },
          {
            id: 'bdt-3',
            type: 'create',
            question: 'Write the HTTP header name used by payment gateways (like Stripe) for idempotent requests:',
            hint: 'Idempotency-Key',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: '// Client header for safe retries\nheaders: { "...": uniqueReqId }',
            options: [],
            correct: ['Idempotency-Key', 'idempotency-key', 'X-Idempotency-Key'],
            explanation: 'Idempotency-Key is the industry standard header for safe automated retry requests.'
          }
        ]
      },
      {
        id: 'backend-master-boss',
        title: 'Principal Backend Architect Master Challenge',
        isBoss: true,
        description: 'Prove full mastery over distributed transactions, saga patterns, and high-availability database sharding.',
        exercises: [
          {
            id: 'bmb-1',
            type: 'choice',
            question: 'What is the Saga Pattern in distributed microservices?',
            hint: 'A sequence of local transactions where each step publishes events, with compensating transactions on failure.',
            options: [
              'A series of local transactions across services coordinated via events and compensating rollback actions',
              'A single monolithic SQL database table',
              'A type of frontend CSS layout',
              'A network load balancer'
            ],
            correct: ['A series of local transactions across services coordinated via events and compensating rollback actions'],
            explanation: 'Sagas replace distributed 2PC locking with eventual consistency and compensating rollback actions.'
          },
          {
            id: 'bmb-2',
            type: 'fill',
            question: 'Implement consistent hashing for database sharding based on user ID:',
            hint: 'const shardId = hash(userId) % TOTAL_SHARDS;',
            code: ['const shardIndex =', 'hash(userId) % TOTAL_SHARDS', ';'],
            blanks: [1],
            options: ['hash(userId) % TOTAL_SHARDS', 'userId / 10', 'TOTAL_SHARDS - 1', 'Math.random() * 4'],
            correct: ['hash(userId) % TOTAL_SHARDS'],
            explanation: 'Modulo hashing evenly distributes database writes across partitioned shard nodes.'
          },
          {
            id: 'bmb-3',
            type: 'create',
            question: 'Write the SQL clause to lock a specific row for update during a financial balance transfer:',
            hint: 'FOR UPDATE',
            placeholder: 'e.g., HTTP method, SQL query, or syntax',
            starterCode: 'SELECT * FROM accounts WHERE id = 42 ...;',
            options: [],
            correct: ['FOR UPDATE', 'FOR UPDATE;', 'for update'],
            explanation: 'SELECT ... FOR UPDATE locks the selected row against concurrent modifications until transaction commit.'
          }
        ]
      }
    ]
  }
];
