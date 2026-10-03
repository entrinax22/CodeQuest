import { Module } from '../curriculum';

export const JAVA_MODULES: Module[] = [
  {
    id: 'java-1',
    title: 'Core Java Syntax',
    subtitle: 'Module 1',
    description: 'Learn static typing, main method anatomy, variables, and control flow.',
    lessons: [
      {
        id: 'java-syntax',
        title: 'Java Anatomy & Main',
        description: 'Understand class structure and public static void main.',
        exercises: [
          {
            id: 'java-s-1',
            type: 'fill',
            question: 'Complete the signature of Java’s standard program entry point method:',
            hint: 'public static void main(String[] args)',
            code: ['public', 'static', 'void', 'main', '(String[] args)'],
            blanks: [1, 2],
            options: ['static', 'void', 'public', 'main', 'final', 'class'],
            correct: ['static', 'void'],
            explanation: 'public static void main(String[] args) is the required entry point in Java.'
          },
          {
            id: 'java-s-2',
            type: 'choice',
            question: 'Which statement outputs text followed by a new line to the console in Java?',
            hint: 'System.out.println()',
            options: ['System.out.println()', 'console.log()', 'print()', 'echo()'],
            correct: ['System.out.println()'],
            explanation: 'System.out.println() writes formatted text to standard output with a line break.'
          },
          {
            id: 'java-s-3',
            type: 'create',
            question: 'Write the statement to print "Hello Java" to the console in Java:',
            hint: 'System.out.println("Hello Java"); (don’t forget the semicolon!)',
            placeholder: 'System.out.println("Hello Java");',
            starterCode: 'public static void main(String[] args) {\n    ...\n}',
            options: [],
            correct: ['System.out.println("Hello Java");', 'System.out.println("Hello Java")'],
            explanation: 'System.out.println("Hello Java"); prints text to console in Java.'
          }
        ]
      },
      {
        id: 'java-variables',
        title: 'Static Typing & Primitives',
        description: 'Declare integers, doubles, booleans, and Strings with explicit types.',
        exercises: [
          {
            id: 'java-v-1',
            type: 'fill',
            question: 'Declare an integer score and a String username in Java:',
            hint: 'Java requires explicit variable type declarations.',
            code: ['int', 'score = 100;', '\n', 'String', 'user = "Alex";'],
            blanks: [0, 3],
            options: ['int', 'String', 'var', 'let', 'number', 'text'],
            correct: ['int', 'String'],
            explanation: 'int represents 32-bit integers; String represents text sequences in Java.'
          },
          {
            id: 'java-v-2',
            type: 'choice',
            question: 'Which of the following is NOT a Java primitive type?',
            hint: 'Primitive types start with lowercase; objects start with uppercase.',
            options: ['String', 'int', 'boolean', 'double'],
            correct: ['String'],
            explanation: 'String is a reference object class in Java, not a primitive type.'
          },
          {
            id: 'java-v-3',
            type: 'create',
            question: 'Declare a double variable named rating initialized to 4.9:',
            hint: 'double rating = 4.9;',
            placeholder: 'double rating = 4.9;',
            starterCode: '// Declare rating\n...',
            options: [],
            correct: ['double rating = 4.9;', 'double rating=4.9;', 'double rating = 4.9'],
            explanation: 'double rating = 4.9; creates a 64-bit floating point variable in Java.'
          }
        ]
      },
      {
        id: 'java-conditionals',
        title: 'Control Flow & Switch',
        description: 'Branch program execution using if/else and switch statements.',
        exercises: [
          {
            id: 'java-c-1',
            type: 'fill',
            question: 'Check if score is at least 100, otherwise print retry in Java:',
            hint: 'if (condition) { ... } else { ... }',
            code: ['if', '(score >= 100) {', 'win(); }', 'else', '{ retry(); }'],
            blanks: [0, 3],
            options: ['if', 'else', 'when', 'otherwise', 'case', 'then'],
            correct: ['if', 'else'],
            explanation: 'if/else handles binary branch logic in Java.'
          },
          {
            id: 'java-c-2',
            type: 'choice',
            question: 'In a Java switch statement, which keyword prevents execution from falling through to the next case?',
            hint: 'break terminates the switch block.',
            options: ['break', 'stop', 'exit', 'return_case'],
            correct: ['break'],
            explanation: 'break exits the switch block immediately to avoid fall-through.'
          },
          {
            id: 'java-c-3',
            type: 'create',
            question: 'Compare if String variable role equals "Admin" using the equals method:',
            hint: 'role.equals("Admin")',
            placeholder: 'role.equals("Admin")',
            starterCode: 'if (...) {\n    grantAccess();\n}',
            options: [],
            correct: ['role.equals("Admin")', 'role.equals("Admin") '],
            explanation: 'In Java, always compare Strings using .equals(), never == (which checks reference identity).'
          }
        ]
      },
      {
        id: 'java-loops',
        title: 'Loops & Iteration',
        description: 'Count with for loops and iterate arrays with the enhanced for-each loop.',
        exercises: [
          {
            id: 'java-l-1',
            type: 'fill',
            question: 'Complete the standard counting for-loop from 0 to 4 in Java:',
            hint: 'for (int i = 0; i < 5; i++)',
            code: ['for', '(', 'int', 'i = 0; i < 5;', 'i++', ')'],
            blanks: [2, 4],
            options: ['int', 'i++', 'var', '++i', 'i = i', 'step'],
            correct: ['int', 'i++'],
            explanation: 'for (int i = 0; i < 5; i++) executes 5 times with i incrementing each loop.'
          },
          {
            id: 'java-l-2',
            type: 'choice',
            question: 'What is the syntax for the enhanced for-each loop in Java?',
            hint: 'It uses a colon (:) separator.',
            options: ['for (String item : items)', 'for (item in items)', 'foreach (item from items)', 'for (items as item)'],
            correct: ['for (String item : items)'],
            explanation: 'Java uses the colon syntax for (Type item : collection) for iteration.'
          },
          {
            id: 'java-l-3',
            type: 'create',
            question: 'Write an enhanced for loop header to iterate through String array names with variable name:',
            hint: 'for (String name : names)',
            placeholder: 'for (String name : names)',
            starterCode: 'String[] names = {"Alice", "Bob"};\n...\n    System.out.println(name);',
            options: [],
            correct: ['for (String name : names)', 'for(String name : names)'],
            explanation: 'for (String name : names) cleanly iterates every element in the array.'
          }
        ]
      }
    ]
  },
  {
    id: 'java-2',
    title: 'Object-Oriented Java',
    subtitle: 'Module 2',
    description: 'Master classes, encapsulation, inheritance, and interfaces.',
    lessons: [
      {
        id: 'java-classes',
        title: 'Classes & Objects',
        description: 'Define classes, private fields, and constructors.',
        exercises: [
          {
            id: 'java-cl-1',
            type: 'fill',
            question: 'Define a class and assign a field using the this keyword in Java:',
            hint: 'this.name = name differentiates field from parameter.',
            code: ['public', 'class', 'User {', '\n    private String name;', '\n    public User(String name) {', '\n       ', 'this', '.name = name;', '\n    }', '}'],
            blanks: [1, 6],
            options: ['class', 'this', 'object', 'self', 'new', 'struct'],
            correct: ['class', 'this'],
            explanation: 'class defines the blueprint; this.name references the class instance field.'
          },
          {
            id: 'java-cl-2',
            type: 'choice',
            question: 'Which access modifier restricts field visibility strictly inside the current class?',
            hint: 'The gold standard for encapsulation.',
            options: ['private', 'public', 'protected', 'default'],
            correct: ['private'],
            explanation: 'private hides fields from outside access, enforcing data encapsulation.'
          },
          {
            id: 'java-cl-3',
            type: 'create',
            question: 'Instantiate a new User object passing "Alex" to the constructor:',
            hint: 'new User("Alex")',
            placeholder: 'new User("Alex")',
            starterCode: 'User user = ...;',
            options: [],
            correct: ['new User("Alex")', 'new User("Alex");'],
            explanation: 'new User("Alex") allocates and constructs a new User instance on the heap.'
          }
        ]
      },
      {
        id: 'java-inheritance',
        title: 'Inheritance & Polymorphism',
        description: 'Extend parent classes and override methods with @Override.',
        exercises: [
          {
            id: 'java-in-1',
            type: 'fill',
            question: 'Extend a parent class and invoke the superclass constructor in Java:',
            hint: 'extends creates a subclass; super() calls the parent constructor.',
            code: ['public class Dev', 'extends', 'Employee {', '\n    public Dev() {', '\n       ', 'super', '();', '\n    }', '}'],
            blanks: [1, 5],
            options: ['extends', 'super', 'implements', 'parent', 'base', 'inherits'],
            correct: ['extends', 'super'],
            explanation: 'extends establishes subclass inheritance; super() delegates to parent constructor.'
          },
          {
            id: 'java-in-2',
            type: 'choice',
            question: 'Which annotation explicitly informs the compiler that a method overrides a superclass method?',
            hint: '@Override prevents naming typo bugs.',
            options: ['@Override', '@Overload', '@Inherited', '@ExtendMethod'],
            correct: ['@Override'],
            explanation: '@Override ensures the compiler checks that the method exists in the superclass.'
          },
          {
            id: 'java-in-3',
            type: 'create',
            question: 'Call the superclass method named render() from inside a subclass:',
            hint: 'super.render();',
            placeholder: 'super.render();',
            starterCode: '@Override\npublic void render() {\n    ...\n    // custom subclass work\n}',
            options: [],
            correct: ['super.render();', 'super.render()'],
            explanation: 'super.render(); invokes the parent implementation of the overridden method.'
          }
        ]
      },
      {
        id: 'java-interfaces',
        title: 'Interfaces & Contracts',
        description: 'Define method contracts with interface and implements.',
        exercises: [
          {
            id: 'java-if-1',
            type: 'fill',
            question: 'Implement an interface contract in a Java class declaration:',
            hint: 'implements specifies that a class fulfills an interface.',
            code: ['public class Robot', 'implements', 'Playable', '{', '}'],
            blanks: [1],
            options: ['implements', 'extends', 'interfaces', 'uses', 'applies'],
            correct: ['implements'],
            explanation: 'implements commits the class to implementing all abstract interface methods.'
          },
          {
            id: 'java-if-2',
            type: 'choice',
            question: 'Can a Java class implement multiple interfaces?',
            hint: 'Unlike classes, Java allows multiple interface implementation.',
            options: [
              'Yes, classes can implement multiple interfaces',
              'No, Java only allows exactly one interface',
              'Only if they are in the same package',
              'Only abstract classes can'
            ],
            correct: ['Yes, classes can implement multiple interfaces'],
            explanation: 'Java allows implementing multiple interfaces: class A implements B, C, D.'
          },
          {
            id: 'java-if-3',
            type: 'create',
            question: 'Declare an interface named Playable in Java:',
            hint: 'public interface Playable',
            placeholder: 'public interface Playable',
            starterCode: '...\n{\n    void play();\n}',
            options: [],
            correct: ['public interface Playable', 'interface Playable'],
            explanation: 'public interface Playable defines the interface type and contract.'
          }
        ]
      }
    ]
  },
  {
    id: 'java-3',
    title: 'Collections & Architecture',
    subtitle: 'Module 3',
    description: 'Work with ArrayList, HashMap, and Java exception handling.',
    lessons: [
      {
        id: 'java-arraylist',
        title: 'Collections & ArrayList',
        description: 'Store dynamic lists with ArrayList and Java generics.',
        exercises: [
          {
            id: 'java-al-1',
            type: 'fill',
            question: 'Create a dynamic list of Strings using ArrayList in Java:',
            hint: 'List<String> list = new ArrayList<>();',
            code: ['List', '<String> items =', 'new', 'ArrayList', '<>();'],
            blanks: [0, 3],
            options: ['List', 'ArrayList', 'Array', 'Vector', 'Collection', 'Map'],
            correct: ['List', 'ArrayList'],
            explanation: 'List<String> items = new ArrayList<>(); creates a dynamically resizable array list.'
          },
          {
            id: 'java-al-2',
            type: 'choice',
            question: 'Which method adds a new element to an ArrayList in Java?',
            hint: 'list.add(element)',
            options: ['.add()', '.append()', '.push()', '.insert()'],
            correct: ['.add()'],
            explanation: '.add() appends the element to the end of the ArrayList.'
          },
          {
            id: 'java-al-3',
            type: 'create',
            question: 'Call the add method on skills list to insert the String "Java":',
            hint: 'skills.add("Java");',
            placeholder: 'skills.add("Java");',
            starterCode: 'List<String> skills = new ArrayList<>();\n// Add Java\n...',
            options: [],
            correct: ['skills.add("Java");', 'skills.add("Java")', 'skills.add("Java") ;'],
            explanation: 'skills.add("Java"); inserts "Java" into the collection.'
          }
        ]
      },
      {
        id: 'java-hashmap',
        title: 'HashMaps & Key-Values',
        description: 'Map unique keys to values with HashMap.',
        exercises: [
          {
            id: 'java-hm-1',
            type: 'fill',
            question: 'Insert and retrieve values from a HashMap using put and get in Java:',
            hint: 'map.put(key, value) stores; map.get(key) retrieves.',
            code: ['map.', 'put', '("XP", 500);', '\nint xp = map.', 'get', '("XP");'],
            blanks: [1, 4],
            options: ['put', 'get', 'set', 'fetch', 'insert', 'retrieve'],
            correct: ['put', 'get'],
            explanation: 'put() maps a key to a value; get() retrieves the value mapped by that key.'
          },
          {
            id: 'java-hm-2',
            type: 'choice',
            question: 'Which method checks if a specific key exists inside a HashMap?',
            hint: 'map.containsKey(key)',
            options: ['containsKey()', 'hasKey()', 'exists()', 'findKey()'],
            correct: ['containsKey()'],
            explanation: 'containsKey() returns true if the map contains an entry for the specified key.'
          },
          {
            id: 'java-hm-3',
            type: 'create',
            question: 'Retrieve the value for key "streak" from the stats map using get():',
            hint: 'stats.get("streak")',
            placeholder: 'stats.get("streak")',
            starterCode: 'Map<String, Integer> stats = new HashMap<>();\n// Retrieve streak\n...',
            options: [],
            correct: ['stats.get("streak")', 'stats.get("streak");'],
            explanation: 'stats.get("streak") returns the integer value associated with "streak".'
          }
        ]
      },
      {
        id: 'java-boss',
        title: 'Java Architect Boss Challenge',
        isBoss: true,
        description: 'Handle exceptions and demonstrate enterprise Java robustness.',
        exercises: [
          {
            id: 'java-b-1',
            type: 'fill',
            question: 'Wrap risky code in try and catch blocks to prevent crashes in Java:',
            hint: 'try tests; catch handles specific Exception types.',
            code: ['try', '{', '\n    riskyOp();', '\n}', 'catch', '(Exception e) {', '\n    e.printStackTrace();', '\n}'],
            blanks: [0, 4],
            options: ['try', 'catch', 'except', 'handle', 'error', 'finally'],
            correct: ['try', 'catch'],
            explanation: 'try/catch blocks catch checked and unchecked runtime exceptions.'
          },
          {
            id: 'java-b-2',
            type: 'choice',
            question: 'Which keyword explicitly instantiates and throws an exception in Java?',
            hint: 'throw new IllegalArgumentException(...)',
            options: ['throw', 'throws', 'raise', 'fire'],
            correct: ['throw'],
            explanation: 'throw is used to trigger an exception; throws declares it in a method signature.'
          },
          {
            id: 'java-b-3',
            type: 'create',
            question: 'Throw an IllegalArgumentException with message "Invalid score":',
            hint: 'throw new IllegalArgumentException("Invalid score");',
            placeholder: 'throw new IllegalArgumentException("Invalid score");',
            starterCode: 'if (score < 0) {\n    ...\n}',
            options: [],
            correct: [
              'throw new IllegalArgumentException("Invalid score");',
              'throw new IllegalArgumentException("Invalid score")'
            ],
            explanation: 'throw new IllegalArgumentException(...) halts invalid state with an informative message.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): JAVA CONCURRENCY & MULTITHREADING ---
  // ==========================================
  {
    id: 'java-adv-1',
    title: 'Java Concurrency & Memory Model',
    subtitle: 'Advance Module 4',
    description: 'Master thread pools, synchronization, atomic variables, and the Java Memory Model.',
    isAdvanced: true,
    lessons: [
      {
        id: 'java-threads-executors',
        title: 'Thread Pools & ExecutorService',
        description: 'Manage worker thread lifecycle without the high overhead of manual thread spawning.',
        exercises: [
          {
            id: 'jte-1',
            type: 'choice',
            question: 'Why is using an ExecutorService preferred over manually spawning new Thread objects?',
            hint: 'Threads reuse existing pooled system resources to avoid thread creation overhead.',
            options: [
              'It reuses pooled worker threads and manages queue lifecycles to prevent OS memory exhaustion',
              'It automatically translates Java into bytecode',
              'It deletes the garbage collector',
              'It disables CPU core switching'
            ],
            correct: ['It reuses pooled worker threads and manages queue lifecycles to prevent OS memory exhaustion'],
            explanation: 'ExecutorService pools threads, managing task queues and reusing resources efficiently.'
          },
          {
            id: 'jte-2',
            type: 'fill',
            question: 'Create a fixed thread pool with 4 concurrent worker threads in Java:',
            hint: 'ExecutorService pool = Executors.newFixedThreadPool(4);',
            code: ['ExecutorService pool =', 'Executors', '.newFixedThreadPool(4);', '\npool.', 'submit', '(() -> doTask());'],
            blanks: [1, 3],
            options: ['Executors', 'submit', 'Threads', 'execute', 'run', 'spawn'],
            correct: ['Executors', 'submit'],
            explanation: 'Executors.newFixedThreadPool(n) instantiates a managed thread pool with n workers.'
          },
          {
            id: 'jte-3',
            type: 'create',
            question: 'Write the method call to gracefully shut down an ExecutorService named pool:',
            hint: 'pool.shutdown();',
            placeholder: 'pool.shutdown();',
            starterCode: '// Shut down thread pool gracefully\n...',
            options: [],
            correct: ['pool.shutdown();', 'pool.shutdown()'],
            explanation: 'pool.shutdown() allows running tasks to complete while rejecting new tasks.'
          }
        ]
      },
      {
        id: 'java-locks-volatile',
        title: 'Synchronization, Locks & volatile',
        description: 'Eliminate race conditions and guarantee cross-thread memory visibility.',
        exercises: [
          {
            id: 'jlv-1',
            type: 'choice',
            question: 'What guarantee does the "volatile" keyword provide in Java?',
            hint: 'It forces CPU cores to read/write directly to main memory rather than local L1/L2 caches.',
            options: [
              'Guarantees immediate visibility of changes across threads by reading directly from main memory',
              'Makes variables immutable and final',
              'Automatically locks entire database tables',
              'Serializes objects to JSON'
            ],
            correct: ['Guarantees immediate visibility of changes across threads by reading directly from main memory'],
            explanation: 'volatile prevents CPU cache incoherence by enforcing direct memory bus read/write semantics.'
          },
          {
            id: 'jlv-2',
            type: 'fill',
            question: 'Protect critical section with explicit ReentrantLock:',
            hint: 'lock.lock(); try { ... } finally { lock.unlock(); }',
            code: ['lock.lock();\ntry {\n    counter++;\n}', 'finally', '{\n    lock.', 'unlock', '();\n}'],
            blanks: [1, 3],
            options: ['finally', 'unlock', 'catch', 'release', 'close', 'free'],
            correct: ['finally', 'unlock'],
            explanation: 'ReentrantLock must always be released in a finally block to avoid deadlocks.'
          },
          {
            id: 'jlv-3',
            type: 'create',
            question: 'Write the synchronized method modifier for increment():',
            hint: 'public synchronized void increment()',
            placeholder: 'public synchronized void increment()',
            starterCode: '// Thread-safe method declaration\n... {\n    count++;\n}',
            options: [],
            correct: ['public synchronized void increment()', 'synchronized void increment()'],
            explanation: 'synchronized acquires the intrinsic object monitor lock before method execution.'
          }
        ]
      },
      {
        id: 'java-adv1-boss',
        title: 'Java Concurrency Master Boss Challenge',
        isBoss: true,
        description: 'Conquer race conditions, atomic types, and thread synchronization.',
        exercises: [
          {
            id: 'jcb-1',
            type: 'choice',
            question: 'Which class in java.util.concurrent provides lock-free thread-safe integer operations?',
            hint: 'AtomicInteger uses hardware CAS (Compare-And-Swap) instructions.',
            options: ['AtomicInteger', 'VolatileInt', 'SafeNumber', 'LockedInteger'],
            correct: ['AtomicInteger'],
            explanation: 'AtomicInteger uses low-level hardware CAS primitives without thread blocking overhead.'
          },
          {
            id: 'jcb-2',
            type: 'fill',
            question: 'Atomically increment an AtomicInteger counter and get the updated value:',
            hint: 'int nextVal = count.incrementAndGet();',
            code: ['AtomicInteger count = new AtomicInteger(0);\nint nextVal = count.', 'incrementAndGet', '();'],
            blanks: [1],
            options: ['incrementAndGet', 'getAndIncrement', 'addOne', 'increment', 'plusOne'],
            correct: ['incrementAndGet'],
            explanation: 'incrementAndGet() atomically adds 1 and returns the new value.'
          },
          {
            id: 'jcb-3',
            type: 'create',
            question: 'Instantiate a ConcurrentHashMap for thread-safe key-value mappings of String to Integer:',
            hint: 'Map<String, Integer> map = new ConcurrentHashMap<>();',
            placeholder: 'new ConcurrentHashMap<>()',
            starterCode: 'Map<String, Integer> cache = ...;',
            options: [],
            correct: ['new ConcurrentHashMap<>()', 'new ConcurrentHashMap<String, Integer>()', 'new ConcurrentHashMap<>() ;'],
            explanation: 'ConcurrentHashMap provides segment-locked high-throughput concurrent access.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): SPRING BOOT & ENTERPRISE ARCHITECTURE ---
  // ==========================================
  {
    id: 'java-adv-2',
    title: 'Spring Boot Microservices & JPA',
    subtitle: 'Advance Module 5',
    description: 'Build enterprise-grade REST APIs, dependency injection graphs, and Hibernate JPA databases.',
    isAdvanced: true,
    lessons: [
      {
        id: 'java-spring-di',
        title: 'Spring IoC & Dependency Injection',
        description: 'Decouple business layers using @Service, @Autowired, and Spring Beans.',
        exercises: [
          {
            id: 'jsd-1',
            type: 'choice',
            question: 'What is the primary role of the Spring Inversion of Control (IoC) container?',
            hint: 'It instantiates, configures, and wires application dependencies automatically.',
            options: [
              'Manages object lifecycles and automatically injects dependencies into registered components',
              'Compiles Java into native x86 machine code',
              'Manages Linux server memory paging',
              'Generates front-end React components'
            ],
            correct: ['Manages object lifecycles and automatically injects dependencies into registered components'],
            explanation: 'The IoC container manages Bean lifecycles and automatically wires dependencies.'
          },
          {
            id: 'jsd-2',
            type: 'fill',
            question: 'Annotate a Spring Service and inject a repository via constructor:',
            hint: '@Service on the class, with final repository field in constructor.',
            code: ['@Service', '\npublic class UserService {\n    private final UserRepository repo;\n    public UserService(UserRepository repo) {\n        this.repo = repo;\n    }\n}'],
            blanks: [0],
            options: ['@Service', '@Component', '@Controller', '@Entity', '@Bean'],
            correct: ['@Service'],
            explanation: '@Service marks a business-layer bean for component scanning in Spring.'
          },
          {
            id: 'jsd-3',
            type: 'create',
            question: 'Write the annotation to mark a Spring Boot main application entry point class:',
            hint: '@SpringBootApplication',
            placeholder: '@SpringBootApplication',
            starterCode: '// Main entry annotation\n...\npublic class Application {',
            options: [],
            correct: ['@SpringBootApplication', '@SpringBootApplication()'],
            explanation: '@SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.'
          }
        ]
      },
      {
        id: 'java-spring-rest-jpa',
        title: 'Spring Data JPA & REST Controllers',
        description: 'Expose RESTful endpoints and execute automated SQL queries via Hibernate repositories.',
        exercises: [
          {
            id: 'jsr-1',
            type: 'fill',
            question: 'Annotate a REST controller endpoint that handles HTTP GET requests at /api/users:',
            hint: '@RestController with @GetMapping("/api/users")',
            code: ['@RestController', '\npublic class ApiController {\n    ', '@GetMapping', '("/api/users")\n    public List<User> getUsers() { ... }\n}'],
            blanks: [0, 2],
            options: ['@RestController', '@GetMapping', '@Controller', '@PostMapping', '@Path', '@Endpoint'],
            correct: ['@RestController', '@GetMapping'],
            explanation: '@RestController returns JSON responses, and @GetMapping routes HTTP GET requests.'
          },
          {
            id: 'jsr-2',
            type: 'choice',
            question: 'Which interface in Spring Data JPA provides built-in CRUD and pagination methods?',
            hint: 'JpaRepository<T, ID>',
            options: ['JpaRepository', 'SqlService', 'HibernateManager', 'DbConnector'],
            correct: ['JpaRepository'],
            explanation: 'JpaRepository exposes save(), findById(), findAll(), and delete() out of the box.'
          },
          {
            id: 'jsr-3',
            type: 'create',
            question: 'Write the annotation to mark a persistent database entity class in JPA:',
            hint: '@Entity',
            placeholder: '@Entity',
            starterCode: '// Mark as JPA database table entity\n...\npublic class User {',
            options: [],
            correct: ['@Entity', '@Entity()', '@Table'],
            explanation: '@Entity tells Hibernate to map the Java class to a relational database table.'
          }
        ]
      },
      {
        id: 'java-enterprise-boss',
        title: 'Enterprise Java Architect Boss Challenge',
        isBoss: true,
        description: 'Prove full mastery over Spring Boot microservices, transactions, and security.',
        exercises: [
          {
            id: 'jeb-1',
            type: 'choice',
            question: 'What does the @Transactional annotation ensure in Spring Boot?',
            hint: 'It commits database operations as an atomic unit or rolls back on runtime exceptions.',
            options: [
              'Wraps method execution in an atomic database transaction that rolls back on failure',
              'Encrypts all HTTP traffic with SSL',
              'Creates a new CPU thread per request',
              'Bypasses database constraints'
            ],
            correct: ['Wraps method execution in an atomic database transaction that rolls back on failure'],
            explanation: '@Transactional provides ACID atomicity across all repository operations within the method.'
          },
          {
            id: 'jeb-2',
            type: 'fill',
            question: 'Extract an ID path parameter from a REST URL in Spring Boot:',
            hint: 'public User getUser(@PathVariable Long id)',
            code: ['@GetMapping("/users/{id}")\npublic User getUser(@', 'PathVariable', '("id") Long id) {', '\n    return service.get(id);\n}'],
            blanks: [1],
            options: ['PathVariable', 'RequestParam', 'RequestBody', 'PathParam', 'HeaderParam'],
            correct: ['PathVariable'],
            explanation: '@PathVariable binds dynamic URI template variables directly to method arguments.'
          },
          {
            id: 'jeb-3',
            type: 'create',
            question: 'Write the annotation used to inject application properties from application.properties in Spring:',
            hint: '@Value("${app.jwt.secret}")',
            placeholder: '@Value("${app.jwt.secret}")',
            starterCode: '// Inject configuration property\n...\nprivate String jwtSecret;',
            options: [],
            correct: ['@Value("${app.jwt.secret}")', '@Value("${app.jwt.secret}")', '@Value'],
            explanation: '@Value("${property.name}") injects environment configuration into bean fields.'
          }
        ]
      }
    ]
  }
];
