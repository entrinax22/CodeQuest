import { TeachingConcept } from '../lessonConcepts';

export const JAVA_CONCEPTS: Record<string, TeachingConcept> = {
  'java-syntax': {
    summary: 'Java is a strictly typed, object-oriented compiled language designed with the "Write Once, Run Anywhere" (WORA) philosophy. Java code compiles into bytecode (.class) which runs on the Java Virtual Machine (JVM). Every executable Java application begins execution at the public static void main(String[] args) method.',
    keyRule: 'Every file must contain a class matching the filename. The entry point method is always: public static void main(String[] args).',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java Enterprise World!");
        System.out.println("Running on the Java Virtual Machine.");
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Hello, Java Enterprise World!
Running on the Java Virtual Machine.`,
    breakdown: [
      { term: 'public static void main', definition: 'The standard entry point method executed by the JVM at program launch.', badge: 'Entry' },
      { term: 'System.out.println()', definition: 'Outputs formatted text followed by a newline to standard console output.', badge: 'I/O' },
      { term: 'JVM', definition: 'Java Virtual Machine that executes portable bytecode on any hardware platform.', badge: 'Runtime' }
    ],
    proTip: 'The public class name in a Java source file must match the filename exactly (e.g. Main.java for public class Main).',
    commonMistake: 'Forgetting the trailing semicolon (;) at the end of statements—Java requires semicolons for every statement!'
  },

  'java-variables': {
    summary: 'Java is statically typed: every variable must have a declared type at compile time. Java features primitive types (int, double, boolean, char, byte, short, long, float) that store raw binary values directly on the stack, and Reference types (like String, Arrays, Classes) that point to heap objects.',
    keyRule: 'Declare variables with: Type name = value; Primitive types start with lowercase; Object wrappers start with uppercase (Integer, Double).',
    codeSnippet: `public class VariablesDemo {
    public static void main(String[] args) {
        int studentId = 1042;
        double gpa = 3.85;
        boolean isEnrolled = true;
        String major = "Computer Science";

        System.out.println(major + " | ID: " + studentId + " | GPA: " + gpa);
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Computer Science | ID: 1042 | GPA: 3.85`,
    breakdown: [
      { term: 'Primitive Types', definition: 'Stored directly in memory: int (32-bit), double (64-bit float), boolean (true/false).', badge: 'Stack' },
      { term: 'String Reference', definition: 'An immutable object representing a sequence of UTF-16 characters.', badge: 'Heap' },
      { term: 'final Keyword', definition: 'Creates immutable constant variables that cannot be reassigned once set.', badge: 'Keyword' }
    ],
    proTip: 'Use String.equals() instead of == when comparing string content. In Java, == compares object memory references, not text equality!',
    commonMistake: 'Writing "if (str == "text")" instead of "if (str.equals("text"))". Always use .equals() for objects.'
  },

  'java-conditionals': {
    summary: 'Java branching uses standard if, else if, else conditions as well as switch statements. Conditions inside if (...) must evaluate to a boolean expression—Java does not allow numbers or truthy values to coerce into booleans.',
    keyRule: 'Conditions require parentheses: if (condition). Logical operators are && (AND), || (OR), and ! (NOT).',
    codeSnippet: `public class LogicDemo {
    public static void main(String[] args) {
        int experienceYears = 5;
        String role;

        if (experienceYears >= 5) {
            role = "Lead Architect";
        } else if (experienceYears >= 2) {
            role = "Software Engineer";
        } else {
            role = "Junior Developer";
        }

        System.out.println("Assigned Role: " + role);
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Assigned Role: Lead Architect`,
    breakdown: [
      { term: 'if / else if / else', definition: 'Evaluates boolean expressions in sequence from top to bottom.', badge: 'Control' },
      { term: 'switch-case', definition: 'Directly jumps to matching constant value cases for integers, enums, or strings.', badge: 'Branching' },
      { term: 'Ternary Operator', definition: 'condition ? trueValue : falseValue for concise conditional assignments.', badge: 'Syntax' }
    ],
    proTip: 'In modern Java (Java 14+), you can use switch expressions with arrows (case "ADMIN" -> true;) which prevent accidental fall-through bugs.',
    commonMistake: 'Forgetting break; statements inside classic switch cases, which causes execution to fall through to the next branch.'
  },

  'java-loops': {
    summary: 'Loops repeat code blocks. Java supports traditional index-based for loops, enhanced for-each loops (for (Type item : collection)), while loops, and do-while loops.',
    keyRule: 'Enhanced for-each loop syntax: for (ElementType item : arrayOrCollection) { ... }',
    codeSnippet: `public class LoopsDemo {
    public static void main(String[] args) {
        int[] scores = {95, 88, 72, 100};
        int sum = 0;

        // Enhanced for-each loop
        for (int score : scores) {
            sum += score;
        }

        System.out.println("Total Score: " + sum);
        System.out.println("Average: " + (sum / (double) scores.length));
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Total Score: 355
Average: 88.75`,
    breakdown: [
      { term: 'for (int i = 0; i < n; i++)', definition: 'Standard 3-part indexed loop with initialization, condition, and step.', badge: 'Classic' },
      { term: 'Enhanced for-each', definition: 'Clean read-only iteration over arrays and Iterable collections.', badge: 'Modern' },
      { term: 'Integer Division Pitfall', definition: 'Dividing two integers like 5 / 2 yields 2. Cast one operand to (double) for 2.5.', badge: 'Arithmetic' }
    ],
    proTip: 'When calculating averages in Java, cast the divisor or dividend to (double) so integer truncation does not discard decimal precision.',
    commonMistake: 'ArrayIndexOutOfBoundsException: remember Java arrays are 0-indexed; an array of length 5 has valid indices 0 through 4.'
  },

  'java-classes': {
    summary: 'Java is fundamentally class-based: classes encapsulate member fields (state) and methods (behavior). Constructors initialize new object instances created with the new keyword.',
    keyRule: 'Use private for instance fields and provide public getters/setters to achieve clean OOP encapsulation.',
    codeSnippet: `public class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialDeposit) {
        this.accountNumber = accountNumber;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    public double getBalance() {
        return this.balance;
    }

    public static void main(String[] args) {
        BankAccount acct = new BankAccount("AC-9921", 500.0);
        acct.deposit(250.0);
        System.out.println("Current Balance: \$" + acct.getBalance());
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Current Balance: $750.0`,
    breakdown: [
      { term: 'Constructor', definition: 'Special method having the same name as the class without a return type.', badge: 'OOP' },
      { term: 'this Keyword', definition: 'Refers to the current calling instance object of the class.', badge: 'Keyword' },
      { term: 'Encapsulation', definition: 'Hiding internal object details behind private access modifiers and public methods.', badge: 'Principle' }
    ],
    proTip: 'Always mark fields private and declare immutable fields final to prevent accidental state corruption from external callers.',
    commonMistake: 'Shadowing class fields inside constructors without using this: writing "balance = balance;" does not assign the field!'
  },

  'java-inheritance': {
    summary: 'Inheritance allows a subclass to inherit fields and methods from a superclass using the extends keyword. Polymorphism allows a subclass to override superclass methods using the @Override annotation.',
    keyRule: 'Java supports single class inheritance: a class can only extend one superclass. Use super() to call the parent constructor.',
    codeSnippet: `class Vehicle {
    protected String brand;
    public Vehicle(String brand) { this.brand = brand; }
    public void start() { System.out.println(brand + " engine started."); }
}

class ElectricCar extends Vehicle {
    private int batteryPercent;

    public ElectricCar(String brand, int batteryPercent) {
        super(brand);
        this.batteryPercent = batteryPercent;
    }

    @Override
    public void start() {
        System.out.println(brand + " silent motor active (Battery: " + batteryPercent + "%).");
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Tesla silent motor active (Battery: 92%).`,
    breakdown: [
      { term: 'extends', definition: 'Establishes an "is-a" relationship between subclass and parent class.', badge: 'Keyword' },
      { term: 'super()', definition: 'Invokes the superclass constructor, and must be the first line in subclass constructor.', badge: 'Constructor' },
      { term: '@Override', definition: 'Compiler check annotation verifying that a method correctly overrides a parent method.', badge: 'Annotation' }
    ],
    proTip: 'Always add @Override above overridden methods. If you make a typo in the method name, the compiler alerts you immediately.',
    commonMistake: 'Forgetting that super(...) must be the very first statement inside a derived class constructor.'
  },

  'java-interfaces': {
    summary: 'Interfaces define abstract contracts of methods that implementing classes must fulfill using the implements keyword. A class can implement multiple interfaces, enabling flexible, decoupled software design.',
    keyRule: 'Classes use implements Interface1, Interface2 to fulfill API contracts. All interface methods are public and abstract by default.',
    codeSnippet: `interface PaymentGateway {
    boolean processPayment(double amount);
}

class StripeGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing \$" + amount + " via Stripe Secure API.");
        return true;
    }
}

public class Checkout {
    public static void main(String[] args) {
        PaymentGateway gateway = new StripeGateway();
        gateway.processPayment(199.99);
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Processing $199.99 via Stripe Secure API.`,
    breakdown: [
      { term: 'interface', definition: 'A blueprint defining contract methods without concrete implementations.', badge: 'Contract' },
      { term: 'implements', definition: 'Keyword used by a class to promise full implementation of interface methods.', badge: 'Keyword' },
      { term: 'Polymorphic Interface', definition: 'Writing code against interface types (PaymentGateway) rather than concrete classes.', badge: 'Design' }
    ],
    proTip: 'Program to interfaces, not implementations: declare fields as List<String> list = new ArrayList<>() rather than ArrayList.',
    commonMistake: 'Trying to instantiate an interface directly with new PaymentGateway(). You can only instantiate concrete classes.'
  },

  'java-arraylist': {
    summary: 'ArrayList is Java’s premier dynamic, resizable array collection part of the java.util framework. Unlike static arrays with fixed size, an ArrayList grows automatically as elements are added.',
    keyRule: 'ArrayList only holds objects, not primitives. Use Generics: ArrayList<Integer> or List<String> list = new ArrayList<>();',
    codeSnippet: `import java.util.ArrayList;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List<String> frameworkList = new ArrayList<>();
        frameworkList.add("Spring Boot");
        frameworkList.add("Micronaut");
        frameworkList.add("Quarkus");

        System.out.println("Framework count: " + frameworkList.size());
        System.out.println("Primary: " + frameworkList.get(0));
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Framework count: 3
Primary: Spring Boot`,
    breakdown: [
      { term: 'add(element)', definition: 'Appends an element to the end of the dynamic list in O(1) amortized time.', badge: 'Method' },
      { term: 'get(index)', definition: 'Retrieves the element at the specified 0-based index.', badge: 'Method' },
      { term: 'size()', definition: 'Returns the number of active elements in the collection.', badge: 'Method' }
    ],
    proTip: 'Always import java.util.List and java.util.ArrayList and declare variables with the generic interface List<T>.',
    commonMistake: 'Attempting to declare ArrayList<int> with a primitive type. You must use wrapper types: ArrayList<Integer>.'
  },

  'java-hashmap': {
    summary: 'HashMap<K, V> is a fast key-value associative data structure implementing the Map interface. It computes hash codes for keys to achieve average O(1) constant time lookup, insertion, and deletion.',
    keyRule: 'Use put(key, value) to insert or overwrite, get(key) to retrieve, and containsKey(key) to check existence.',
    codeSnippet: `import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("MacBook Pro", 12);
        stock.put("Dell XPS", 8);

        // Safe retrieval with fallback
        int count = stock.getOrDefault("ThinkPad", 0);
        System.out.println("MacBooks available: " + stock.get("MacBook Pro"));
        System.out.println("ThinkPads available: " + count);
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `MacBooks available: 12
ThinkPads available: 0`,
    breakdown: [
      { term: 'put(k, v)', definition: 'Associates the specified value with the key in the hash table map.', badge: 'Method' },
      { term: 'get(k)', definition: 'Returns the value mapped to key, or null if the key is not found.', badge: 'Method' },
      { term: 'getOrDefault(k, def)', definition: 'Safely queries a key, returning default value if key is not mapped.', badge: 'Safe' }
    ],
    proTip: 'Use map.getOrDefault(key, fallback) to prevent NullPointerException when reading optional map keys.',
    commonMistake: 'Unboxing a null value returned by map.get("missing") into a primitive int, which throws NullPointerException!'
  },

  'java-boss': {
    summary: 'The Java Architect Boss Challenge assesses enterprise software engineering skills: designing robust class hierarchies, leveraging generics and collections, handling exceptions with try/catch, and maintaining clean contracts.',
    keyRule: 'Enterprise Java requires robust exception handling: use try { ... } catch (Exception e) { ... } to handle failure modes.',
    codeSnippet: `import java.util.*;

public class InventoryService {
    private final Map<String, Integer> inventory = new HashMap<>();

    public void restock(String item, int qty) throws IllegalArgumentException {
        if (qty <= 0) throw new IllegalArgumentException("Quantity must be positive");
        inventory.put(item, inventory.getOrDefault(item, 0) + qty);
    }

    public static void main(String[] args) {
        InventoryService service = new InventoryService();
        service.restock("Server Blade", 10);
        System.out.println("Inventory service running with 0 failures.");
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Inventory service running with 0 failures.`,
    breakdown: [
      { term: 'try-catch-finally', definition: 'Structural exception handling guaranteeing cleanup in the finally block.', badge: 'Resilience' },
      { term: 'Generics (<T>)', definition: 'Type parameters ensuring compile-time type safety across collections.', badge: 'Typing' },
      { term: 'SOLID Principles', definition: 'Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.', badge: 'Architecture' }
    ],
    proTip: 'Mark class fields final whenever possible to ensure thread-safe immutability across multi-threaded applications.',
    commonMistake: 'Catching generic Throwable or ignoring exceptions with empty catch blocks ("swallowing exceptions").'
  },

  // ==========================================
  // --- JAVA ADVANCED MODULES 4 & 5 ---
  // ==========================================
  'java-threads-executors': {
    summary: 'The java.util.concurrent framework replaces error-prone manual Thread allocation with managed ExecutorService thread pools. Worker threads are recycled to execute asynchronous tasks with optimal CPU core utilization.',
    keyRule: 'Executors.newFixedThreadPool(n) pools worker threads • pool.submit(() -> task) queues tasks • Always call pool.shutdown().',
    codeSnippet: `import java.util.concurrent.*;

public class ExecutorDemo {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(4);
        pool.submit(() -> {
            System.out.println("Running on worker: " + Thread.currentThread().getName());
        });
        pool.shutdown();
    }
}`,
    codeLanguage: 'java',
    terminalOutput: `Running on worker: pool-1-thread-1`,
    breakdown: [
      { term: 'ExecutorService', definition: 'Asynchronous task execution manager decoupling task submission from thread mechanics.', badge: 'Concurrent' },
      { term: 'Thread Pooling', definition: 'Reusing a fixed set of operating system threads to avoid allocation latency.', badge: 'Performance' }
    ],
    proTip: 'Use Executors.newVirtualThreadPerTaskExecutor() in modern Java 21+ for lightweight high-throughput virtual threads.',
    commonMistake: 'Forgetting to call shutdown() on ExecutorService, causing the JVM process to hang indefinitely without exiting.'
  },

  'java-locks-volatile': {
    summary: 'Multi-threaded applications require memory visibility and mutual exclusion. The volatile keyword forces reads and writes to hit main memory directly, while ReentrantLock provides explicit locking with try-finally safety.',
    keyRule: 'volatile guarantees visibility across CPU core caches • Always unlock ReentrantLock inside a finally block.',
    codeSnippet: `import java.util.concurrent.locks.ReentrantLock;

public class CounterService {
    private volatile boolean isRunning = true;
    private final ReentrantLock lock = new ReentrantLock();
    private int counter = 0;

    public void increment() {
        lock.lock();
        try {
            counter++;
        } finally {
            lock.unlock();
        }
    }
}`,
    codeLanguage: 'java',
    breakdown: [
      { term: 'volatile', definition: 'Prevents CPU cache incoherence by guaranteeing immediate variable visibility across threads.', badge: 'Visibility' },
      { term: 'ReentrantLock', definition: 'Explicit lock with fairness policies and tryLock() capability.', badge: 'Locking' }
    ],
    proTip: 'Prefer AtomicInteger or LongAdder over synchronized blocks for simple counter increments to avoid thread blocking.',
    commonMistake: 'Assuming volatile makes operations like counter++ atomic. volatile only guarantees visibility; counter++ is a composite 3-step read-modify-write!'
  },

  'java-adv1-boss': {
    summary: 'The Java Concurrency Master Boss Challenge tests lock-free atomic operations, ConcurrentHashMap segment locking, and thread-safe data structures.',
    keyRule: 'AtomicInteger uses hardware CAS (Compare-And-Swap) without locking • ConcurrentHashMap enables high concurrent throughput.',
    codeSnippet: `AtomicInteger safeId = new AtomicInteger(100);
int next = safeId.incrementAndGet();
ConcurrentHashMap<String, Integer> cache = new ConcurrentHashMap<>();`,
    codeLanguage: 'java',
    breakdown: [
      { term: 'AtomicInteger', definition: 'Lock-free thread-safe integers using CPU Compare-And-Swap hardware primitives.', badge: 'Atomic' },
      { term: 'ConcurrentHashMap', definition: 'Thread-safe hashtable with bucket-level lock striping for high concurrent reads/writes.', badge: 'Collection' }
    ],
    proTip: 'Use ConcurrentHashMap.computeIfAbsent() to compute expensive values atomically only when missing.',
    commonMistake: 'Using Collections.synchronizedMap() instead of ConcurrentHashMap, which bottlenecks performance by locking the entire map on every single read.'
  },

  'java-spring-di': {
    summary: 'Spring Boot uses Dependency Injection (DI) and Inversion of Control (IoC) to assemble application architectures. The Spring IoC container scans for @Component, @Service, and @Repository beans and injects them automatically.',
    keyRule: '@SpringBootApplication bootstraps the app • @Service marks business beans • Constructor injection is the gold standard.',
    codeSnippet: `import org.springframework.stereotype.Service;

@Service
public class BillingService {
    private final PaymentProcessor processor;

    public BillingService(PaymentProcessor processor) {
        this.processor = processor;
    }
}`,
    codeLanguage: 'java',
    breakdown: [
      { term: 'IoC Container', definition: 'Spring engine managing the lifecycle and wiring of all application beans.', badge: 'Spring' },
      { term: 'Constructor Injection', definition: 'Injecting dependencies through constructors to enforce immutability and ease unit testing.', badge: 'Best Practice' }
    ],
    proTip: 'Always use constructor injection with final fields instead of field-level @Autowired for cleaner, testable architecture.',
    commonMistake: 'Creating circular dependencies between Spring beans (A depends on B, B depends on A), causing startup crashes.'
  },

  'java-spring-rest-jpa': {
    summary: 'Spring Boot REST Controllers pair seamlessly with Spring Data JPA. By extending JpaRepository<Entity, ID>, Spring automatically generates CRUD database queries and transactions at runtime.',
    keyRule: '@RestController returns JSON • @GetMapping("/url") routes requests • JpaRepository provides automatic SQL generation.',
    codeSnippet: `import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.*;

@Entity
class Course {
    @Id @GeneratedValue
    private Long id;
    private String title;
}

interface CourseRepository extends JpaRepository<Course, Long> {}

@RestController
@RequestMapping("/api/courses")
class CourseController {
    private final CourseRepository repo;
    public CourseController(CourseRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Course> all() { return repo.findAll(); }
}`,
    codeLanguage: 'java',
    breakdown: [
      { term: '@RestController', definition: 'Combines @Controller and @ResponseBody to serialize Java return values into JSON.', badge: 'REST' },
      { term: 'JpaRepository', definition: 'Spring Data interface providing findAll(), findById(), and save() without writing SQL.', badge: 'ORM' }
    ],
    proTip: 'Use Spring Data derived query methods like findByUsername(String username) to auto-generate complex SQL queries from method names.',
    commonMistake: 'Forgetting the @Id annotation on JPA entities, which prevents Hibernate from establishing the primary key.'
  },

  'java-enterprise-boss': {
    summary: 'The Enterprise Java Architect Boss Challenge tests @Transactional ACID boundaries, Spring Security filter chains, and cloud configuration injection.',
    keyRule: '@Transactional commits or rolls back atomic DB transactions • @Value("${prop}") injects cloud properties.',
    codeSnippet: `@Transactional
public void transferFunds(Long fromId, Long toId, BigDecimal amount) {
    accountRepo.debit(fromId, amount);
    accountRepo.credit(toId, amount);
}`,
    codeLanguage: 'java',
    breakdown: [
      { term: '@Transactional', definition: 'Wraps method in an atomic database transaction that rolls back on RuntimeException.', badge: 'ACID' },
      { term: 'Enterprise Security', definition: 'Role-based access control (RBAC) protecting endpoints with Spring Security.', badge: 'Security' }
    ],
    proTip: '@Transactional only rolls back on unchecked RuntimeExceptions by default; specify rollbackFor = Exception.class for checked exceptions.',
    commonMistake: 'Calling a @Transactional method from within the same class (self-invocation), which bypasses the Spring proxy and transaction interceptor.'
  }
};
