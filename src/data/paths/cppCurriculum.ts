import { Module } from '../curriculum';

export const CPP_MODULES: Module[] = [
  {
    id: 'cpp-1',
    title: 'C++ Systems & Core Syntax',
    subtitle: 'Module 1',
    description: 'Learn C++ structure, #include directives, stream I/O, static types, and control flow.',
    lessons: [
      {
        id: 'cpp-syntax',
        title: 'C++ Structure & std::cout',
        description: 'Understand header includes, the main() function, and console streaming with <<.',
        exercises: [
          {
            id: 'cpp-s-1',
            type: 'fill',
            question: 'Complete the standard header inclusion for streaming console input/output in C++:',
            hint: '#include <iostream> provides std::cout and std::cin.',
            code: ['#include', '<', 'iostream', '>', '\nint', 'main()', '{', 'return', '0;', '}'],
            blanks: [2, 5],
            options: ['iostream', 'main()', 'stdio.h', 'run()', 'console', 'string'],
            correct: ['iostream', 'main()'],
            explanation: '#include <iostream> includes the stream declarations, and int main() is the program entry point.'
          },
          {
            id: 'cpp-s-2',
            type: 'choice',
            question: 'Which stream operator is used to output data into std::cout in C++?',
            hint: 'Think of the arrows pointing into cout: std::cout << "data";',
            options: [
              'Insertion operator <<',
              'Extraction operator >>',
              'Arrow member pointer ->',
              'Pipe redirect operator |'
            ],
            correct: ['Insertion operator <<'],
            explanation: 'The insertion operator (<<) pushes formatted text and values directly into output streams like std::cout.'
          },
          {
            id: 'cpp-s-3',
            type: 'create',
            question: 'Write a C++ statement to output "Hello C++" followed by std::endl:',
            hint: 'std::cout << "Hello C++" << std::endl;',
            placeholder: 'std::cout << "Hello C++" << std::endl;',
            starterCode: '#include <iostream>\nint main() {\n    // Output here\n    return 0;\n}',
            options: [],
            correct: [
              'std::cout << "Hello C++" << std::endl;',
              'std::cout << "Hello C++" << \'\\n\';',
              'std::cout << "Hello C++" << "\\n";'
            ],
            explanation: 'std::cout << "Hello C++" << std::endl; sends the text to the terminal and flushes the buffer.'
          }
        ]
      },
      {
        id: 'cpp-variables',
        title: 'Primitives & Value Types',
        description: 'Declare integers, double-precision floats, chars, booleans, and auto type deduction.',
        exercises: [
          {
            id: 'cpp-v-1',
            type: 'fill',
            question: 'Declare an integer for memory bytes and a double for clock speed in C++:',
            hint: 'Use explicit primitive types: int and double.',
            code: ['int', 'bufferSize = 1024;', '\n', 'double', 'clockRate = 3.6;'],
            blanks: [0, 3],
            options: ['int', 'double', 'float', 'number', 'var', 'size_t'],
            correct: ['int', 'double'],
            explanation: 'int represents signed integers (typically 4 bytes) and double provides 64-bit IEEE floating point.'
          },
          {
            id: 'cpp-v-2',
            type: 'choice',
            question: 'What does the auto keyword do when declaring a variable in modern C++ (C++11 and later)?',
            hint: 'auto tells the compiler to inspect the initialization expression.',
            options: [
              'Deduces the variable type automatically at compile time from its initializer',
              'Allocates the variable in dynamic heap memory instead of the stack',
              'Creates a dynamically-typed variable like Python or JavaScript at runtime',
              'Prevents the variable from being modified later in the function'
            ],
            correct: ['Deduces the variable type automatically at compile time from its initializer'],
            explanation: 'In C++, auto is strictly compile-time type deduction—it retains static typing without runtime overhead.'
          },
          {
            id: 'cpp-v-3',
            type: 'create',
            question: 'Declare a constant integer named MAX_CAPACITY initialized to 100 in C++:',
            hint: 'const int MAX_CAPACITY = 100;',
            placeholder: 'const int MAX_CAPACITY = 100;',
            starterCode: '// Declare a constant integer\n...',
            options: [],
            correct: [
              'const int MAX_CAPACITY = 100;',
              'constexpr int MAX_CAPACITY = 100;',
              'const int MAX_CAPACITY=100;'
            ],
            explanation: 'const int MAX_CAPACITY = 100; declares an immutable compile-time or runtime constant.'
          }
        ]
      },
      {
        id: 'cpp-conditionals',
        title: 'Branches & Bitwise Logic',
        description: 'Manage branching logic with if/else statements and conditional operators.',
        exercises: [
          {
            id: 'cpp-c-1',
            type: 'choice',
            question: 'What is the value of result in: int result = (5 > 2) ? 10 : 20;?',
            hint: 'The ternary operator returns the true branch when the condition holds.',
            options: ['10', '20', 'true', '1'],
            correct: ['10'],
            explanation: 'Since 5 > 2 evaluates to true, the ternary returns 10.'
          },
          {
            id: 'cpp-c-2',
            type: 'fill',
            question: 'Write a conditional checking if voltage is above threshold and power is active:',
            hint: 'Use && for logical AND in C++.',
            code: ['if', '(voltage > 5.0', '&&', 'powerOn', ')', '{\n  armSystem();\n}'],
            blanks: [0, 2],
            options: ['if', '&&', 'and', '||', 'where', 'when'],
            correct: ['if', '&&'],
            explanation: 'if (condition && condition) checks that both boolean expressions evaluate to true.'
          },
          {
            id: 'cpp-c-3',
            type: 'create',
            question: 'Complete an if statement checking if errorCode is equal to 0:',
            hint: 'if (errorCode == 0)',
            placeholder: 'if (errorCode == 0)',
            starterCode: '// Check if error code is zero\n...',
            options: [],
            correct: [
              'if (errorCode == 0)',
              'if (errorCode == 0) {',
              'if (errorCode==0)'
            ],
            explanation: 'if (errorCode == 0) uses equality operator == to test the condition.'
          }
        ]
      },
      {
        id: 'cpp-loops',
        title: 'Loops & Range Iteration',
        description: 'Iterate over ranges using classic for loops, while loops, and range-based for.',
        exercises: [
          {
            id: 'cpp-l-1',
            type: 'fill',
            question: 'Complete a range-based for loop iterating over integer items in container data:',
            hint: 'for (int x : data) loops through each element in C++11.',
            code: ['for', '(', 'int', 'x', ':', 'data', ')', '{\n  sum += x;\n}'],
            blanks: [0, 4],
            options: ['for', ':', 'in', 'of', 'foreach', 'while'],
            correct: ['for', ':'],
            explanation: 'C++11 range-based for loops use the syntax for (type var : collection).'
          },
          {
            id: 'cpp-l-2',
            type: 'choice',
            question: 'Which loop is guaranteed to execute its code block at least once before testing the condition?',
            hint: 'The condition check comes at the bottom after the loop body.',
            options: [
              'do-while loop',
              'while loop',
              'standard for loop',
              'range-based for loop'
            ],
            correct: ['do-while loop'],
            explanation: 'do { ... } while (condition); executes the block first, then evaluates the test condition.'
          },
          {
            id: 'cpp-l-3',
            type: 'create',
            question: 'Write a standard for loop header to iterate from i = 0 up to (not including) 10:',
            hint: 'for (int i = 0; i < 10; ++i)',
            placeholder: 'for (int i = 0; i < 10; ++i)',
            starterCode: '// Write for loop header\n...',
            options: [],
            correct: [
              'for (int i = 0; i < 10; ++i)',
              'for (int i = 0; i < 10; i++)',
              'for (int i = 0; i < 10; ++i) {',
              'for (int i = 0; i < 10; i++) {'
            ],
            explanation: 'for (int i = 0; i < 10; ++i) initializes i to 0, checks bound < 10, and increments each cycle.'
          }
        ]
      }
    ]
  },
  {
    id: 'cpp-2',
    title: 'Memory Management & Pointers',
    subtitle: 'Module 2',
    description: 'Master raw memory addresses, dereferencing, reference variables, and heap allocation.',
    lessons: [
      {
        id: 'cpp-pointers',
        title: 'Pointers & Address-Of (&, *)',
        description: 'Store memory addresses in pointer variables and read values with dereferencing (*).',
        exercises: [
          {
            id: 'cpp-p-1',
            type: 'fill',
            question: 'Declare an integer pointer ptr and store the memory address of val:',
            hint: 'Use * for pointer declaration and & to get an address.',
            code: ['int', '*', 'ptr', '=', '&', 'val;'],
            blanks: [1, 4],
            options: ['*', '&', '->', '@', '^', '#'],
            correct: ['*', '&'],
            explanation: 'int* declares a pointer type; &val fetches the hardware memory address of val.'
          },
          {
            id: 'cpp-p-2',
            type: 'choice',
            question: 'Given int* ptr = &score; what does *ptr evaluate to?',
            hint: 'Dereferencing a pointer accesses the actual value at the memory address.',
            options: [
              'The integer value stored inside score',
              'The physical hexadecimal memory address of score',
              'The memory address of the pointer variable ptr',
              'A null pointer exception'
            ],
            correct: ['The integer value stored inside score'],
            explanation: 'The dereference operator (*) looks up the memory cell pointed to and returns the stored value.'
          },
          {
            id: 'cpp-p-3',
            type: 'create',
            question: 'Assign the value 42 to the integer pointed to by ptr:',
            hint: '*ptr = 42;',
            placeholder: '*ptr = 42;',
            starterCode: 'int score = 0;\nint* ptr = &score;\n// Set score to 42 through ptr\n...',
            options: [],
            correct: ['*ptr = 42;', '*ptr = 42', '*ptr=42;'],
            explanation: '*ptr = 42 writes directly to the memory address stored in ptr.'
          }
        ]
      },
      {
        id: 'cpp-references',
        title: 'References & Aliases',
        description: 'Pass parameters by reference without copying memory and without pointer nullability.',
        exercises: [
          {
            id: 'cpp-r-1',
            type: 'choice',
            question: 'What is a major fundamental difference between a C++ reference (int&) and a pointer (int*)?',
            hint: 'References must be initialized immediately and cannot be reseated or null.',
            options: [
              'A reference cannot be null and cannot be reseated to refer to another object',
              'A reference consumes 8 extra bytes on the heap',
              'A pointer cannot be passed to a function',
              'A reference can only point to primitive integers'
            ],
            correct: ['A reference cannot be null and cannot be reseated to refer to another object'],
            explanation: 'References act as immutable aliases to existing variables—they cannot be null and cannot be retargeted.'
          },
          {
            id: 'cpp-r-2',
            type: 'fill',
            question: 'Declare a function parameter by const reference to avoid expensive copies:',
            hint: 'const std::string& name',
            code: ['void', 'printName', '(', 'const', 'std::string', '&', 'name', ')', ';'],
            blanks: [3, 5],
            options: ['const', '&', '*', 'ref', 'in', 'copy'],
            correct: ['const', '&'],
            explanation: 'Passing const std::string& passes a read-only alias without copying large string buffers.'
          },
          {
            id: 'cpp-r-3',
            type: 'create',
            question: 'Declare a reference named refScore that aliases existing variable score:',
            hint: 'int& refScore = score;',
            placeholder: 'int& refScore = score;',
            starterCode: 'int score = 95;\n// Declare reference alias\n...',
            options: [],
            correct: [
              'int& refScore = score;',
              'int &refScore = score;',
              'int & refScore = score;',
              'int& refScore = score'
            ],
            explanation: 'int& refScore = score binds refScore as an exact alias to score.'
          }
        ]
      },
      {
        id: 'cpp-dynamic-memory',
        title: 'Heap Allocation (new & delete)',
        description: 'Dynamically allocate heap memory with new and prevent memory leaks with delete.',
        exercises: [
          {
            id: 'cpp-dm-1',
            type: 'fill',
            question: 'Allocate a single integer on the heap and release it after use:',
            hint: 'new allocates on the heap; delete deallocates.',
            code: ['int*', 'p', '=', 'new', 'int(100);', '\n', 'delete', 'p;'],
            blanks: [3, 6],
            options: ['new', 'delete', 'malloc', 'free', 'alloc', 'drop'],
            correct: ['new', 'delete'],
            explanation: 'new allocates memory on the free store (heap) and delete frees it back to the operating system.'
          },
          {
            id: 'cpp-dm-2',
            type: 'choice',
            question: 'What occurs if dynamically allocated heap memory is never freed with delete?',
            hint: 'The memory stays occupied until the process exits.',
            options: [
              'A memory leak occurs, gradually exhausting system RAM',
              'The C++ runtime automatically garbage collects it',
              'A compiler syntax error is generated at build time',
              'The operating system immediately reboots'
            ],
            correct: ['A memory leak occurs, gradually exhausting system RAM'],
            explanation: 'C++ does not have a built-in garbage collector; unreleased heap allocations leak RAM.'
          },
          {
            id: 'cpp-dm-3',
            type: 'create',
            question: 'Deallocate a dynamically allocated array pointed to by arr:',
            hint: 'delete[] arr;',
            placeholder: 'delete[] arr;',
            starterCode: 'int* arr = new int[50];\n// Free the array memory\n...',
            options: [],
            correct: ['delete[] arr;', 'delete [] arr;', 'delete[] arr'],
            explanation: 'delete[] is required to deallocate heap arrays and invoke destructors for each element.'
          }
        ]
      }
    ]
  },
  {
    id: 'cpp-3',
    title: 'OOP & Standard Template Library (STL)',
    subtitle: 'Module 3',
    description: 'Construct classes, encapsulate fields, and leverage std::vector for dynamic arrays.',
    lessons: [
      {
        id: 'cpp-classes',
        title: 'Classes & Member Functions',
        description: 'Define classes with private members, public methods, and constructor initializers.',
        exercises: [
          {
            id: 'cpp-cl-1',
            type: 'fill',
            question: 'Define class Player with public access modifier for its constructor:',
            hint: 'C++ access specifiers end with a colon (:).',
            code: ['class', 'Player', '{', '\n', 'public', ':', '\n  Player();\n};'],
            blanks: [0, 4],
            options: ['class', 'public', 'struct', 'private', 'open', 'module'],
            correct: ['class', 'public'],
            explanation: 'class defines a class with members private by default; public: exposes member functions.'
          },
          {
            id: 'cpp-cl-2',
            type: 'choice',
            question: 'Which special class member function runs automatically when an object goes out of scope?',
            hint: 'Its name begins with a tilde (~).',
            options: [
              'Destructor (~ClassName)',
              'Default constructor (ClassName())',
              'Static factory method',
              'Operator overload'
            ],
            correct: ['Destructor (~ClassName)'],
            explanation: 'The destructor ~ClassName() runs automatically to release resources (RAII pattern).'
          },
          {
            id: 'cpp-cl-3',
            type: 'create',
            question: 'Instantiate an object of class Engine named v8 on the stack:',
            hint: 'Engine v8;',
            placeholder: 'Engine v8;',
            starterCode: 'class Engine { public: Engine() {} };\nint main() {\n    // Create v8 engine\n    ...\n}',
            options: [],
            correct: ['Engine v8;', 'Engine v8{};', 'Engine v8();'],
            explanation: 'Engine v8; creates a stack-allocated instance of Engine calling its default constructor.'
          }
        ]
      },
      {
        id: 'cpp-stl-vector',
        title: 'STL Containers: std::vector',
        description: 'Use the standard dynamic array container std::vector with push_back() and size().',
        exercises: [
          {
            id: 'cpp-vec-1',
            type: 'fill',
            question: 'Declare a vector of integers and append 42 to the end of the container:',
            hint: 'std::vector<int> and push_back()',
            code: ['std::vector<int>', 'nums;', '\nnums.', 'push_back', '(', '42', ');'],
            blanks: [0, 3],
            options: ['std::vector<int>', 'push_back', 'append', 'std::list<int>', 'add', 'insert'],
            correct: ['std::vector<int>', 'push_back'],
            explanation: 'std::vector<int> is a contiguous dynamic array; push_back() appends items to the back.'
          },
          {
            id: 'cpp-vec-2',
            type: 'choice',
            question: 'Which method returns the current count of elements stored in an STL vector?',
            hint: 'nums.size()',
            options: ['size()', 'length()', 'count()', 'capacity()'],
            correct: ['size()'],
            explanation: 'vector::size() returns the number of active elements, while capacity() returns allocated storage.'
          },
          {
            id: 'cpp-vec-3',
            type: 'create',
            question: 'Clear all elements from vector items:',
            hint: 'items.clear();',
            placeholder: 'items.clear();',
            starterCode: 'std::vector<int> items = {1, 2, 3};\n// Empty the vector\n...',
            options: [],
            correct: ['items.clear();', 'items.clear()'],
            explanation: 'items.clear(); erases all elements from the vector, reducing size to 0.'
          }
        ]
      },
      {
        id: 'cpp-boss',
        title: 'C++ Systems Architecture Boss',
        isBoss: true,
        description: 'Synthesize pointers, references, RAII memory management, and STL containers.',
        exercises: [
          {
            id: 'cpp-b-1',
            type: 'fill',
            question: 'Pass a vector by const reference to calculate its total count without copying:',
            hint: 'const std::vector<int>& data',
            code: ['int', 'countItems', '(', 'const', 'std::vector<int>', '&', 'data', ')', '{\n  return data.size();\n}'],
            blanks: [3, 5],
            options: ['const', '&', '*', 'ref', 'inline', 'static'],
            correct: ['const', '&'],
            explanation: 'Passing containers by const reference is the golden standard in C++ to prevent heap reallocation copies.'
          },
          {
            id: 'cpp-b-2',
            type: 'choice',
            question: 'What C++ concept ensures resources like heap memory and file handles are automatically freed via destructors?',
            hint: 'RAII',
            options: [
              'Resource Acquisition Is Initialization (RAII)',
              'Just-In-Time Compilation (JIT)',
              'Generational Garbage Collection',
              'Volatile memory paging'
            ],
            correct: ['Resource Acquisition Is Initialization (RAII)'],
            explanation: 'RAII binds resource lifecycle to object lifetime on the stack, ensuring zero leaks even during exceptions.'
          },
          {
            id: 'cpp-b-3',
            type: 'create',
            question: 'Write a C++ statement to sort vector scores using std::sort:',
            hint: 'std::sort(scores.begin(), scores.end());',
            placeholder: 'std::sort(scores.begin(), scores.end());',
            starterCode: '#include <vector>\n#include <algorithm>\n// Sort scores in ascending order\n...',
            options: [],
            correct: [
              'std::sort(scores.begin(), scores.end());',
              'std::sort(scores.begin(), scores.end())',
              'sort(scores.begin(), scores.end());'
            ],
            explanation: 'std::sort takes iterator pairs begin() and end() to sort elements in O(N log N) time.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): MODERN C++20, SMART POINTERS & MOVE SEMANTICS ---
  // ==========================================
  {
    id: 'cpp-adv-1',
    title: 'Modern C++: Smart Pointers & Move Semantics',
    subtitle: 'Advance Module 4',
    description: 'Eliminate memory leaks forever with std::unique_ptr, std::shared_ptr, and move semantics (rvalue references &&).',
    isAdvanced: true,
    lessons: [
      {
        id: 'cpp-smart-pointers',
        title: 'Smart Pointers: unique_ptr & shared_ptr',
        description: 'Enforce single and shared ownership semantics with automatic RAII memory cleanup.',
        exercises: [
          {
            id: 'csp-1',
            type: 'choice',
            question: 'Why should you prefer std::make_unique<T>() over raw "new" operators in modern C++?',
            hint: 'It guarantees exception safety and prevents dangling pointers.',
            options: [
              'It guarantees single ownership, eliminates raw delete calls, and is 100% exception-safe',
              'It turns C++ into an interpreted scripting language',
              'It disables pointer arithmetic in the kernel',
              'It runs garbage collection on a secondary thread'
            ],
            correct: ['It guarantees single ownership, eliminates raw delete calls, and is 100% exception-safe'],
            explanation: 'std::make_unique enforces exclusive ownership with automatic destruction upon leaving scope.'
          },
          {
            id: 'csp-2',
            type: 'fill',
            question: 'Instantiate a unique_ptr managing an integer on the heap:',
            hint: 'auto ptr = std::make_unique<int>(100);',
            code: ['auto ptr =', 'std::make_unique<int>', '(100);'],
            blanks: [1],
            options: ['std::make_unique<int>', 'std::make_shared<int>', 'new int', 'malloc(sizeof(int))'],
            correct: ['std::make_unique<int>'],
            explanation: 'std::make_unique<T>(val) allocates and returns an exclusive-ownership smart pointer.'
          },
          {
            id: 'csp-3',
            type: 'create',
            question: 'Transfer exclusive ownership of unique_ptr source to target using std::move:',
            hint: 'target = std::move(source);',
            placeholder: 'target = std::move(source);',
            starterCode: 'std::unique_ptr<Widget> target;\n// Move ownership from source to target\n...',
            options: [],
            correct: ['target = std::move(source);', 'target = std::move(source)'],
            explanation: 'unique_ptr cannot be copied; it must be moved via std::move.'
          }
        ]
      },
      {
        id: 'cpp-move-semantics',
        title: 'Move Semantics & Rvalue References (&&)',
        description: 'Eliminate deep copy overheads by transferring resources directly with std::move.',
        exercises: [
          {
            id: 'cms-1',
            type: 'choice',
            question: 'What does an rvalue reference (Type&&) represent in C++11 and beyond?',
            hint: 'A temporary object that can be scavenged/moved from without copying.',
            options: [
              'A reference to a temporary object whose resources can be safely stolen/moved',
              'A read-only pointer to ROM',
              'A double pointer for 2D matrix math',
              'An asynchronous socket thread'
            ],
            correct: ['A reference to a temporary object whose resources can be safely stolen/moved'],
            explanation: 'Rvalue references (&&) enable move constructors to steal internal buffer pointers in O(1) time.'
          },
          {
            id: 'cms-2',
            type: 'fill',
            question: 'Declare a move constructor for class Buffer:',
            hint: 'Buffer(Buffer&& other) noexcept : data(other.data) { other.data = nullptr; }',
            code: ['Buffer(', 'Buffer&&', 'other)', 'noexcept', '{', '\n    data = other.data;\n    other.data = nullptr;\n}'],
            blanks: [1, 3],
            options: ['Buffer&&', 'noexcept', 'const Buffer&', 'throw', 'explicit', 'virtual'],
            correct: ['Buffer&&', 'noexcept'],
            explanation: 'Move constructors take rvalue references and must be marked noexcept for STL container optimizations.'
          },
          {
            id: 'cms-3',
            type: 'create',
            question: 'Cast an lvalue object x to an rvalue reference:',
            hint: 'std::move(x)',
            placeholder: 'std::move(x)',
            starterCode: '// Cast x to rvalue\nauto&& rval = ...;',
            options: [],
            correct: ['std::move(x)', 'std::move(x);'],
            explanation: 'std::move is an unconditional static_cast to an rvalue reference type.'
          }
        ]
      },
      {
        id: 'cpp-adv1-boss',
        title: 'Modern Memory Architecture Boss Challenge',
        isBoss: true,
        description: 'Prove mastery over ownership semantics, weak pointers, and cyclic reference prevention.',
        exercises: [
          {
            id: 'cmb-1',
            type: 'choice',
            question: 'How do std::weak_ptr instances prevent memory leaks in cyclic reference structures (like graph nodes)?',
            hint: 'They hold non-owning references that do not increment the shared_ptr reference count.',
            options: [
              'They observe shared objects without incrementing the reference count, breaking cycles',
              'They delete nodes automatically every 10ms',
              'They bypass heap memory allocation',
              'They lock mutexes on write'
            ],
            correct: ['They observe shared objects without incrementing the reference count, breaking cycles'],
            explanation: 'std::weak_ptr provides non-owning references, preventing circular strong reference memory leaks.'
          },
          {
            id: 'cmb-2',
            type: 'fill',
            question: 'Convert a std::weak_ptr w into a std::shared_ptr to safely access its value:',
            hint: 'if (auto sp = w.lock()) { sp->doAction(); }',
            code: ['if (auto sp = w.', 'lock', '()) {', '\n    sp->doAction();\n}'],
            blanks: [1],
            options: ['lock', 'get', 'acquire', 'promote', 'upgrade'],
            correct: ['lock'],
            explanation: 'weak_ptr::lock() creates a shared_ptr if the managed object is still alive.'
          },
          {
            id: 'cmb-3',
            type: 'create',
            question: 'Write the directive to perfect-forward argument arg in a template function:',
            hint: 'std::forward<T>(arg)',
            placeholder: 'std::forward<T>(arg)',
            starterCode: 'template<typename T>\nvoid wrapper(T&& arg) {\n    target(...);\n}',
            options: [],
            correct: ['std::forward<T>(arg)', 'std::forward<T>(arg);'],
            explanation: 'std::forward<T>(arg) preserves the original value category (lvalue vs rvalue) during forwarding.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): HIGH PERFORMANCE & TEMPLATE METAPROGRAMMING ---
  // ==========================================
  {
    id: 'cpp-adv-2',
    title: 'High-Performance Cache Systems & Metaprogramming',
    subtitle: 'Advance Module 5',
    description: 'Master hardware cache locality, C++20 concepts, SIMD optimizations, and compile-time constexpr.',
    isAdvanced: true,
    lessons: [
      {
        id: 'cpp-templates-concepts',
        title: 'C++20 Concepts & Constexpr Computation',
        description: 'Enforce compile-time type constraints and evaluate algorithms at compile time.',
        exercises: [
          {
            id: 'ctc-1',
            type: 'choice',
            question: 'What is the primary benefit of C++20 Concepts over traditional SFINAE template constraints?',
            hint: 'Concepts provide clear compiler diagnostic errors and clean readable constraints.',
            options: [
              'Clear and readable compile-time constraints with human-understandable error messages',
              'They allow C++ to run in web browsers without WebAssembly',
              'They remove the need for header files',
              'They automatically parallelize loops'
            ],
            correct: ['Clear and readable compile-time constraints with human-understandable error messages'],
            explanation: 'C++20 concepts replace obscure SFINAE hacks with explicit constraint declarations.'
          },
          {
            id: 'ctc-2',
            type: 'fill',
            question: 'Constrain a template function to only accept numeric types using requires:',
            hint: 'template<typename T> requires std::integral<T> void compute(T val)',
            code: ['template<typename T>', '\nrequires', 'std::integral<T>', '\nvoid compute(T val) { ... }'],
            blanks: [1],
            options: ['requires', 'where', 'concept', 'assert', 'constrain'],
            correct: ['requires'],
            explanation: 'requires clause enforces type concepts at compile time.'
          },
          {
            id: 'ctc-3',
            type: 'create',
            question: 'Declare a function factorial that can be evaluated entirely at compile time in C++:',
            hint: 'constexpr int factorial(int n)',
            placeholder: 'constexpr int factorial(int n)',
            starterCode: '// Compile-time function declaration\n... {\n    return n <= 1 ? 1 : n * factorial(n - 1);\n}',
            options: [],
            correct: ['constexpr int factorial(int n)', 'consteval int factorial(int n)'],
            explanation: 'constexpr enables execution at compile time if inputs are known constants.'
          }
        ]
      },
      {
        id: 'cpp-cache-systems',
        title: 'CPU Cache Locality & Memory Alignment',
        description: 'Maximize IPC throughput by designing Struct-of-Arrays (SoA) data layouts.',
        exercises: [
          {
            id: 'ccs-1',
            type: 'choice',
            question: 'Why is traversing a contiguous std::vector orders of magnitude faster than a std::list for millions of records?',
            hint: 'Vector elements reside consecutively in memory, minimizing CPU L1/L2 cache misses.',
            options: [
              'Contiguous memory layouts optimize CPU spatial cache locality and hardware prefetching',
              'std::list encrypts each node in RAM',
              'std::vector is executed on graphics cards',
              'std::list requires virtual memory swapping'
            ],
            correct: ['Contiguous memory layouts optimize CPU spatial cache locality and hardware prefetching'],
            explanation: 'Contiguous vectors maximize L1/L2/L3 cache line utilization (typically 64 bytes per line).'
          },
          {
            id: 'ccs-2',
            type: 'fill',
            question: 'Align a high-performance struct to a 64-byte CPU cache line boundary:',
            hint: 'struct alignas(64) CacheAlignedNode',
            code: ['struct', 'alignas(64)', 'CacheAlignedNode {\n    int data[16];\n};'],
            blanks: [1],
            options: ['alignas(64)', 'aligned(64)', 'packed(64)', 'cacheline(64)'],
            correct: ['alignas(64)'],
            explanation: 'alignas(64) prevents false sharing by aligning structures to exact 64-byte cache boundaries.'
          },
          {
            id: 'ccs-3',
            type: 'create',
            question: 'Write the C++ keyword to hint to the compiler that an inline function should be placed directly at the call site:',
            hint: 'inline or [[gnu::always_inline]]',
            placeholder: 'inline',
            starterCode: '// Function inlining keyword\n... int fastAdd(int a, int b) { return a + b; }',
            options: [],
            correct: ['inline', 'forceinline', '__forceinline'],
            explanation: 'inline suggests the compiler eliminate call stack frame overhead.'
          }
        ]
      },
      {
        id: 'cpp-systems-boss',
        title: 'Principal Systems Architect Master Challenge',
        isBoss: true,
        description: 'Prove complete mastery over low-level memory, SIMD vectorization, and modern C++ architectures.',
        exercises: [
          {
            id: 'csb-1',
            type: 'choice',
            question: 'What is False Sharing in multi-threaded C++ applications?',
            hint: 'When two threads on different cores modify independent variables on the exact same 64-byte cache line.',
            options: [
              'Performance degradation caused by multiple threads modifying independent variables on the same cache line',
              'Sharing passwords in source code',
              'Using uninitialized pointers across threads',
              'Allocating memory on the wrong NUMA node'
            ],
            correct: ['Performance degradation caused by multiple threads modifying independent variables on the same cache line'],
            explanation: 'False sharing forces continuous cache invalidation across CPU cores over the memory bus.'
          },
          {
            id: 'csb-2',
            type: 'fill',
            question: 'Atomically load a value with acquire memory ordering semantics:',
            hint: 'val.load(std::memory_order_acquire);',
            code: ['std::atomic<int> flag;\nint res = flag.', 'load', '(', 'std::memory_order_acquire', ');'],
            blanks: [1, 3],
            options: ['load', 'std::memory_order_acquire', 'get', 'std::memory_order_relaxed', 'read', 'sync'],
            correct: ['load', 'std::memory_order_acquire'],
            explanation: 'memory_order_acquire prevents memory reads/writes from being reordered before the load.'
          },
          {
            id: 'csb-3',
            type: 'create',
            question: 'Write the C++20 attribute that hints to the compiler that a branch condition is highly likely to be true:',
            hint: '[[likely]]',
            placeholder: '[[likely]]',
            starterCode: 'if (fastPathValid) ... {\n    // Hot execution path\n}',
            options: [],
            correct: ['[[likely]]', '[[likely]];'],
            explanation: '[[likely]] aids CPU branch prediction by optimizing instruction pipeline layout.'
          }
        ]
      }
    ]
  }
];
