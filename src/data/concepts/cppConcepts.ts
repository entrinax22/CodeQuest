import { TeachingConcept } from '../lessonConcepts';

export const CPP_CONCEPTS: Record<string, TeachingConcept> = {
  'cpp-syntax': {
    summary: 'C++ is a compiled, high-performance systems programming language that gives developers direct control over hardware and memory. Every C++ program compiles directly into machine machine code. Output and input are managed via the standard iostream library using stream operators << and >>.',
    keyRule: '#include <iostream> brings in input/output streams. The entry point is int main() which returns 0 upon successful completion.',
    codeSnippet: `#include <iostream>

int main() {
    std::cout << "Welcome to C++ Systems Engineering" << std::endl;
    std::cout << "Direct hardware speed and control." << std::endl;
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Welcome to C++ Systems Engineering
Direct hardware speed and control.`,
    breakdown: [
      { term: '#include <iostream>', definition: 'Preprocessor directive importing standard stream input/output headers.', badge: 'Preprocessor' },
      { term: 'std::cout', definition: 'Character output stream object directing bytes to the terminal.', badge: 'Stream' },
      { term: '<< Operator', definition: 'Stream insertion operator pushing data into standard output.', badge: 'Operator' }
    ],
    proTip: 'Prefer std::cout << \'\\n\' over std::endl in tight performance loops because std::endl forces an expensive hardware buffer flush.',
    commonMistake: 'Forgetting the semicolon at the end of statements or writing "std::cin << data" instead of extraction "std::cin >> data".'
  },

  'cpp-variables': {
    summary: 'C++ variables represent typed locations in hardware memory. Primitive types include fixed-width integers (int, short, long, long long), floating-point numbers (float, double), characters (char), and booleans (bool). Modern C++ (C++11+) provides the auto keyword for compile-time type deduction.',
    keyRule: 'Variables must be typed or use auto for compile-time deduction. const values cannot be modified once set.',
    codeSnippet: `#include <iostream>

int main() {
    int maxThreads = 8;
    double clockFrequencyGHz = 4.2;
    const size_t bufferSize = 4096;
    auto isOverclocked = true; // Compiler deduces bool

    std::cout << "Threads: " << maxThreads << " | Clock: " << clockFrequencyGHz << " GHz\\n";
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Threads: 8 | Clock: 4.2 GHz`,
    breakdown: [
      { term: 'Primitive Types', definition: 'int (typically 32-bit signed), double (64-bit IEEE float), bool (1 byte).', badge: 'Types' },
      { term: 'auto Keyword', definition: 'Directs the C++ compiler to deduce the variable type from its initialization expression.', badge: 'Modern C++' },
      { term: 'const Specifier', definition: 'Marks data as read-only, preventing modification after initialization.', badge: 'Safety' }
    ],
    proTip: 'Use constexpr for values known at compile-time—it allows the compiler to optimize calculations directly into binary constants.',
    commonMistake: 'Leaving primitive variables uninitialized (e.g. "int count;"), which contains whatever garbage bytes were previously in that RAM location.'
  },

  'cpp-conditionals': {
    summary: 'Branching in C++ is controlled by if, else if, else, and switch statements. C++ evaluates conditions as booleans, where 0 is false and any non-zero integer is treated as true.',
    keyRule: 'if (condition) checks logical expressions. Bitwise operators (&, |, ^, ~) manipulate raw bits; logical operators (&&, ||, !) evaluate booleans.',
    codeSnippet: `#include <iostream>

int main() {
    int packetSize = 1400;

    if (packetSize > 1500) {
        std::cout << "Warning: Packet exceeds standard MTU\\n";
    } else if (packetSize >= 1000) {
        std::cout << "Optimal throughput packet size\\n";
    } else {
        std::cout << "Small packet payload\\n";
    }

    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Optimal throughput packet size`,
    breakdown: [
      { term: 'if / else if', definition: 'Tests conditional expressions sequentially at runtime.', badge: 'Control' },
      { term: 'Logical AND (&&)', definition: 'Short-circuit evaluation: evaluates right side only if left side is true.', badge: 'Logic' },
      { term: 'Ternary Operator', definition: 'condition ? trueResult : falseResult for single-expression assignments.', badge: 'Syntax' }
    ],
    proTip: 'Modern C++ allows an init-statement inside if: if (auto ptr = getBuffer(); ptr != nullptr) scopes variables strictly to the block.',
    commonMistake: 'Writing single = inside conditionals: "if (status = 1)" assigns 1 and evaluates as true! Always use ==.'
  },

  'cpp-loops': {
    summary: 'C++ provides for loops, while loops, do-while loops, and modern range-based for loops (for (const auto& item : items)) which safely iterate over STL containers without manual index bounds checking.',
    keyRule: 'Range-based for loop syntax: for (auto& item : container) iterates directly over elements by reference.',
    codeSnippet: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> benchmarks = {120, 115, 130, 125};

    // Range-based for loop
    int total = 0;
    for (int ms : benchmarks) {
        total += ms;
    }

    std::cout << "Average benchmark: " << (total / (double)benchmarks.size()) << " ms\\n";
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Average benchmark: 122.5 ms`,
    breakdown: [
      { term: 'Range-based for', definition: 'C++11 syntax iterating cleanly over arrays and containers without index counters.', badge: 'Modern' },
      { term: 'Traditional for', definition: 'for (int i = 0; i < N; ++i) provides full control over index increments.', badge: 'Classic' },
      { term: 'Pre-increment (++i)', definition: 'Increments the value in-place without generating a temporary copy, preferred in C++.', badge: 'Performance' }
    ],
    proTip: 'In range-based for loops, use "const auto& item : items" to iterate by const reference without copying large objects.',
    commonMistake: 'Off-by-one errors in classic for loops: iterating "<= size" instead of "< size" reads out of bounds, triggering undefined behavior.'
  },

  'cpp-pointers': {
    summary: 'A pointer is a variable that stores the physical memory address of another variable. The address-of operator (&) extracts the memory address of an existing variable, and the dereference operator (*) accesses or modifies the value at that address.',
    keyRule: 'int* ptr = &val stores the address of val. Dereferencing with *ptr reads or writes the actual value in memory.',
    codeSnippet: `#include <iostream>

int main() {
    int score = 100;
    int* ptr = &score; // ptr holds memory address of score

    std::cout << "Value via variable: " << score << "\\n";
    std::cout << "Value via pointer: " << *ptr << "\\n";

    *ptr = 250; // Modify score through pointer
    std::cout << "Updated score: " << score << "\\n";
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Value via variable: 100
Value via pointer: 100
Updated score: 250`,
    breakdown: [
      { term: 'Address-Of (&)', definition: 'Unary operator retrieving the numeric memory address of a variable in RAM.', badge: 'Operator' },
      { term: 'Dereference (*)', definition: 'Operator accessing the value stored at the target memory location.', badge: 'Operator' },
      { term: 'nullptr', definition: 'C++11 type-safe null pointer constant representing an unassigned address.', badge: 'Modern' }
    ],
    proTip: 'Always initialize pointers immediately or set them to nullptr. Dereferencing an uninitialized wild pointer crashes with a segmentation fault.',
    commonMistake: 'Confusing pointer declaration syntax (int* p) with the dereference operation (*p = 10).'
  },

  'cpp-references': {
    summary: 'A reference is an immutable alias (alternative name) for an existing variable. Unlike pointers, references cannot be null, cannot be uninitialized, and cannot be reseated to point to something else once bound.',
    keyRule: 'int& ref = original creates an alias. Passing parameters by const reference (const Type&) avoids copying large objects with zero overhead.',
    codeSnippet: `#include <iostream>
#include <string>

// Pass by const reference: Zero memory copy!
void printMessage(const std::string& msg) {
    std::cout << "[LOG]: " << msg << "\\n";
}

int main() {
    int counter = 10;
    int& alias = counter;

    alias += 5; // Modifies counter directly
    std::cout << "Counter value: " << counter << "\\n";
    printMessage("High performance reference parameter");
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Counter value: 15
[LOG]: High performance reference parameter`,
    breakdown: [
      { term: 'Type& Alias', definition: 'Creates a direct alias to an existing object; all changes affect the target directly.', badge: 'Core' },
      { term: 'const Type&', definition: 'Read-only reference passing objects to functions with zero copy penalty.', badge: 'Idiom' },
      { term: 'No Nullability', definition: 'References must be initialized to a valid object upon declaration.', badge: 'Safety' }
    ],
    proTip: 'Prefer passing parameters by const reference (const std::string&) for all non-primitive types instead of passing by value.',
    commonMistake: 'Returning a reference to a local stack variable from a function. The variable is destroyed when the function returns, leaving a dangling reference!'
  },

  'cpp-dynamic-memory': {
    summary: 'Dynamic memory is allocated at runtime on the Free Store (heap) using the new operator, and must be explicitly deallocated using delete or delete[] to prevent memory leaks.',
    keyRule: 'Every new must pair with a matching delete; every new[] array allocation must pair with delete[].',
    codeSnippet: `#include <iostream>

int main() {
    // Dynamic single integer on heap
    int* dynamicVal = new int(42);
    std::cout << "Heap value: " << *dynamicVal << "\\n";
    delete dynamicVal; // Free single item

    // Dynamic array
    int* buffer = new int[5]{10, 20, 30, 40, 50};
    std::cout << "Buffer[2]: " << buffer[2] << "\\n";
    delete[] buffer; // Free array
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Heap value: 42
Buffer[2]: 30`,
    breakdown: [
      { term: 'new Operator', definition: 'Allocates memory on the heap and calls the type constructor.', badge: 'Heap' },
      { term: 'delete / delete[]', definition: 'Frees heap memory back to the OS and invokes object destructors.', badge: 'Deallocation' },
      { term: 'Memory Leak', definition: 'Allocated memory that is never freed, exhausting system RAM over time.', badge: 'Pitfall' }
    ],
    proTip: 'In modern C++, prefer smart pointers like std::unique_ptr and std::make_unique which delete memory automatically (RAII).',
    commonMistake: 'Using delete instead of delete[] on dynamic arrays: "delete arr;" only destroys the first element and corrupts memory!'
  },

  'cpp-classes': {
    summary: 'Classes in C++ encapsulate fields and member methods. Members are private by default (unlike struct where members are public by default). Constructors initialize objects and destructors (~ClassName) automatically clean up resources when objects leave scope.',
    keyRule: 'class Members are private by default. Use public: for public methods. Destructors (~ClassName) handle RAII cleanup.',
    codeSnippet: `#include <iostream>
#include <string>

class Server {
private:
    std::string ip;
    int port;

public:
    Server(std::string ip, int port) : ip(ip), port(port) {
        std::cout << "Server initialized on " << ip << ":" << port << "\\n";
    }

    ~Server() {
        std::cout << "Server shutting down safely (RAII).\\n";
    }
};

int main() {
    Server s("127.0.0.1", 8080);
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Server initialized on 127.0.0.1:8080
Server shutting down safely (RAII).`,
    breakdown: [
      { term: 'Constructor Initializer', definition: ': ip(ip), port(port) initializes member fields before constructor body runs.', badge: 'Performance' },
      { term: 'Destructor (~Name)', definition: 'Method called automatically when an object leaves its scope.', badge: 'RAII' },
      { term: 'Access Specifiers', definition: 'public:, private:, and protected: controlling member visibility.', badge: 'Encapsulation' }
    ],
    proTip: 'Use constructor member initializer lists (: field(arg)) rather than assigning inside the constructor body to avoid double initialization.',
    commonMistake: 'Forgetting the closing semicolon after a class definition: "class MyClass { ... };" requires a semicolon!'
  },

  'cpp-stl-vector': {
    summary: 'std::vector from the Standard Template Library (STL) is a contiguous dynamic array container. It automatically reallocates memory as new elements are added via push_back() or emplace_back(). It provides fast O(1) random index access.',
    keyRule: '#include <vector> provides std::vector<T>. Use push_back(val) to append, .size() for element count, and [index] for access.',
    codeSnippet: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> packetIds;
    packetIds.push_back(101);
    packetIds.push_back(105);
    packetIds.push_back(102);

    std::sort(packetIds.begin(), packetIds.end());

    std::cout << "Sorted packet count: " << packetIds.size() << "\\n";
    for (int id : packetIds) {
        std::cout << "Packet #" << id << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Sorted packet count: 3
Packet #101 Packet #102 Packet #105 `,
    breakdown: [
      { term: 'std::vector<T>', definition: 'Contiguous heap-backed array with automatic geometric resizing.', badge: 'STL' },
      { term: 'push_back(val)', definition: 'Appends an element to the back of the vector in amortized O(1) time.', badge: 'Method' },
      { term: 'Iterators (begin, end)', definition: 'Pointer-like abstraction objects used by STL algorithms like std::sort.', badge: 'Iterators' }
    ],
    proTip: 'If you know the expected number of elements in advance, call vec.reserve(N) to prevent multiple heap reallocations.',
    commonMistake: 'Using operator[] with an out-of-range index (vec[100]). Use vec.at(100) if you want bound checking with std::out_of_range exceptions.'
  },

  'cpp-boss': {
    summary: 'The C++ Systems Architecture Boss Challenge tests your mastery of RAII (Resource Acquisition Is Initialization), STL algorithms, smart resource management, and high-throughput memory layout.',
    keyRule: 'RAII binds resource lifetime to object lifetime on the stack—guaranteeing zero memory or handle leaks.',
    codeSnippet: `#include <iostream>
#include <vector>
#include <memory>

class MemoryBuffer {
public:
    MemoryBuffer() { std::cout << "Allocated physical buffer\\n"; }
    ~MemoryBuffer() { std::cout << "Buffer safely released\\n"; }
};

int main() {
    {
        auto buffer = std::make_unique<MemoryBuffer>();
        // Automatically deleted when scope exits!
    }
    std::cout << "Clean systems exit with 0 leaks.\\n";
    return 0;
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Allocated physical buffer
Buffer safely released
Clean systems exit with 0 leaks.`,
    breakdown: [
      { term: 'RAII', definition: 'The core C++ idiom ensuring resources are released during stack unwinding.', badge: 'Idiom' },
      { term: 'std::unique_ptr', definition: 'Smart pointer that owns and manages a heap object via RAII.', badge: 'Smart Pointer' },
      { term: 'Zero Overhead', definition: 'C++ abstractions compile down to machine instructions with zero runtime cost.', badge: 'Philosophy' }
    ],
    proTip: 'Follow the "Rule of Zero": design classes using standard containers and smart pointers so you don\'t have to write custom destructors.',
    commonMistake: 'Mixing raw delete with smart pointers or manually managing resources when standard containers already handle RAII.'
  },

  // ==========================================
  // --- C++ ADVANCED MODULES 4 & 5 ---
  // ==========================================
  'cpp-smart-pointers': {
    summary: 'Modern C++ eliminates raw new/delete in favor of smart pointers from <memory>. std::unique_ptr enforces exclusive single ownership with zero overhead, while std::shared_ptr implements atomic reference counting.',
    keyRule: 'Use std::make_unique<T>() for single ownership • Use std::make_shared<T>() for shared ownership • Never delete a smart pointer.',
    codeSnippet: `#include <memory>
#include <iostream>

struct Packet { int id = 42; };

int main() {
    auto uptr = std::make_unique<Packet>();
    std::cout << "Packet ID: " << uptr->id << "\\n";
    // uptr automatically deleted here upon leaving scope!
}`,
    codeLanguage: 'cpp',
    terminalOutput: `Packet ID: 42`,
    breakdown: [
      { term: 'std::unique_ptr', definition: 'Exclusive non-copyable smart pointer with zero runtime overhead over raw pointer.', badge: 'Smart' },
      { term: 'std::shared_ptr', definition: 'Shared ownership pointer with atomic thread-safe reference count control block.', badge: 'RefCount' }
    ],
    proTip: 'Pass raw pointers or references (const Widget&) to non-owning observer functions rather than passing smart pointers by value.',
    commonMistake: 'Trying to copy a std::unique_ptr with copy assignment. unique_ptr is non-copyable; you must transfer it with std::move().'
  },

  'cpp-move-semantics': {
    summary: 'Move semantics (introduced in C++11) enable resources (such as heap buffers and file descriptors) to be transferred from temporary rvalues (&&) in O(1) time rather than performing expensive deep copies.',
    keyRule: 'T&& denotes an rvalue reference • std::move(x) casts an lvalue to rvalue • Move constructors should be marked noexcept.',
    codeSnippet: `#include <vector>
#include <utility>

std::vector<int> source = {1, 2, 3, 4, 5};
// O(1) pointer swap instead of deep copying 5 elements:
std::vector<int> destination = std::move(source);`,
    codeLanguage: 'cpp',
    breakdown: [
      { term: 'Rvalue Reference (&&)', definition: 'Reference to an expiring temporary object that can be safely scavenged/moved.', badge: 'Language' },
      { term: 'std::move', definition: 'Unconditional static_cast converting an lvalue to an rvalue reference.', badge: 'Cast' },
      { term: 'noexcept', definition: 'Guarantees the move operation will not throw, allowing STL containers to use it during reallocations.', badge: 'Safety' }
    ],
    proTip: 'Always mark custom move constructors and move assignment operators noexcept so std::vector uses moves during reallocation.',
    commonMistake: 'Attempting to access an object after it has been moved from. It is in a valid but unspecified state.'
  },

  'cpp-adv1-boss': {
    summary: 'The Modern Memory Architecture Boss Challenge tests cyclic reference prevention with std::weak_ptr, perfect forwarding with std::forward, and move constructors.',
    keyRule: 'std::weak_ptr prevents reference cycles in graphs/trees • std::forward<T> preserves value categories.',
    codeSnippet: `std::shared_ptr<Node> parent = std::make_shared<Node>();
std::weak_ptr<Node> weakParent = parent; // Non-owning reference
if (auto sp = weakParent.lock()) { sp->ping(); }`,
    codeLanguage: 'cpp',
    breakdown: [
      { term: 'std::weak_ptr', definition: 'Non-owning observer smart pointer that breaks circular reference memory leaks.', badge: 'Observer' },
      { term: 'std::forward', definition: 'Perfect forwarding helper used in template functions to forward lvalues and rvalues accurately.', badge: 'Templates' }
    ],
    proTip: 'Use weak_ptr.lock() to safely obtain a temporary shared_ptr before accessing the referenced object.',
    commonMistake: 'Dereferencing weak_ptr directly with * or ->. You must call .lock() first to obtain an active shared_ptr.'
  },

  'cpp-templates-concepts': {
    summary: 'C++20 Concepts constrain template parameters at compile time with expressive boolean predicates, eliminating decipherable compiler errors from SFINAE. Combined with constexpr, code executes during compilation.',
    keyRule: 'template<typename T> requires concept_name enforces constraints • constexpr evaluates expressions at compile time.',
    codeSnippet: `#include <concepts>

template<typename T>
requires std::integral<T>
constexpr T square(T val) {
    return val * val;
}

constexpr int compileTimeResult = square(5); // Computed at compile time!`,
    codeLanguage: 'cpp',
    breakdown: [
      { term: 'C++20 Concepts', definition: 'Named compile-time requirements specifying valid template types with clean compiler diagnostics.', badge: 'C++20' },
      { term: 'constexpr', definition: 'Specifier allowing functions and variables to be computed during compilation.', badge: 'Compile-Time' }
    ],
    proTip: 'Use static_assert(condition, "message") alongside concepts to catch architectural invariants during build time.',
    commonMistake: 'Calling runtime I/O (like std::cout or reading disk files) inside constexpr/consteval functions.'
  },

  'cpp-cache-systems': {
    summary: 'High-performance C++ software is architected around hardware CPU cache hierarchies (L1, L2, L3). Contiguous memory layouts (Struct-of-Arrays) minimize cache misses and eliminate false sharing across multi-core CPUs.',
    keyRule: 'Contiguous vectors maximize L1 cache line prefetching • alignas(64) aligns structs to 64-byte cache lines.',
    codeSnippet: `struct alignas(64) WorkerSlot {
    int counter;
    // 60 bytes of padding to prevent False Sharing on 64-byte CPU cache line
};`,
    codeLanguage: 'cpp',
    breakdown: [
      { term: 'Spatial Locality', definition: 'Accessing adjacent memory addresses stored on the same 64-byte CPU cache line.', badge: 'Hardware' },
      { term: 'False Sharing', definition: 'CPU cache ping-pong degradation when separate threads write to adjacent variables on the same cache line.', badge: 'Multithreading' }
    ],
    proTip: 'Prefer Struct-of-Arrays (SoA) over Array-of-Structs (AoS) when processing large SIMD datasets.',
    commonMistake: 'Using linked lists for high-frequency loops, which causes constant CPU cache misses on pointer hops.'
  },

  'cpp-systems-boss': {
    summary: 'The Principal Systems Architect Master Challenge tests lock-free memory orderings (acquire/release), SIMD intrinsics, and micro-architectural optimizations.',
    keyRule: 'memory_order_acquire and memory_order_release synchronize memory across threads • [[likely]] optimizes branch prediction.',
    codeSnippet: `std::atomic<bool> ready{false};
ready.store(true, std::memory_order_release);
while (!ready.load(std::memory_order_acquire)) {}`,
    codeLanguage: 'cpp',
    breakdown: [
      { term: 'Acquire-Release', definition: 'Memory ordering model guaranteeing changes made before release are visible after acquire.', badge: 'Atomics' },
      { term: 'Branch Prediction', definition: 'CPU pipeline optimization guided by [[likely]] and [[unlikely]] attributes.', badge: 'Optimization' }
    ],
    proTip: 'Never use relaxed memory ordering (memory_order_relaxed) unless you are 100% certain variable order does not affect other shared states.',
    commonMistake: 'Assuming std::memory_order_seq_cst is required everywhere, which introduces unnecessary memory fence penalties on ARM processors.'
  }
};
