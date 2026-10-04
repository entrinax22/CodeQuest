import { Module } from '../curriculum';

export const PYTHON_MODULES: Module[] = [
  {
    id: 'py-1',
    title: 'Python Fundamentals',
    subtitle: 'Module 1',
    description: 'Learn Python syntax, dynamic variables, conditionals, and loops.',
    lessons: [
      {
        id: 'py-syntax',
        title: 'Python Syntax & Print',
        description: 'Understand indentation, comments, and the print() function.',
        exercises: [
          {
            id: 'py-s-1',
            type: 'choice',
            question: 'How are code blocks (like loops and functions) defined in Python?',
            hint: 'Python does not use curly braces {} for blocks.',
            options: ['Indentation (whitespace)', 'Curly braces {}', 'BEGIN and END keywords', 'Parentheses ()'],
            correct: ['Indentation (whitespace)'],
            explanation: 'Python uses consistent 4-space indentation to define code scope and blocks.'
          },
          {
            id: 'py-s-2',
            type: 'fill',
            question: 'Output a welcome message to the terminal in Python:',
            hint: 'print() is the built-in function to display text.',
            code: ['print', '(', '"Hello World"', ')'],
            blanks: [0, 2],
            options: ['print', '"Hello World"', 'echo', 'console.log', '"Hello"', 'display'],
            correct: ['print', '"Hello World"'],
            explanation: 'print("Hello World") outputs text to stdout in Python.'
          },
          {
            id: 'py-s-3',
            type: 'create',
            question: 'Write a Python statement to print the string "Python is awesome":',
            hint: 'Use the print() function with quotation marks.',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Output message to terminal\n...',
            options: [],
            correct: ['print("Python is awesome")', "print('Python is awesome')"],
            explanation: 'print("Python is awesome") prints the string to the terminal.'
          }
        ]
      },
      {
        id: 'py-variables',
        title: 'Variables & Data Types',
        description: 'Store numbers, strings, and booleans in dynamic variables.',
        exercises: [
          {
            id: 'py-v-1',
            type: 'fill',
            question: 'Assign an integer score and user name to Python variables:',
            hint: 'Python variables are assigned using single equals =.',
            code: ['score', '=', '100', '\nname', '=', '"Elena"'],
            blanks: [1, 2],
            options: ['=', '100', ':=', 'var', 'int', '=='],
            correct: ['=', '100'],
            explanation: 'Python variables are dynamically typed and assigned with single equals =.'
          },
          {
            id: 'py-v-2',
            type: 'choice',
            question: 'Which data type is the value 3.14 in Python?',
            hint: 'Numbers with fractional decimal points are floating-point numbers.',
            options: ['float', 'int', 'decimal_obj', 'str'],
            correct: ['float'],
            explanation: '3.14 has decimal digits, so Python types it as a float.'
          },
          {
            id: 'py-v-3',
            type: 'create',
            question: 'Create an integer variable named streak with value 10 in Python:',
            hint: 'streak = 10',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Assign user streak\n...',
            options: [],
            correct: ['streak = 10', 'streak=10'],
            explanation: 'streak = 10 stores the integer 10 in the variable streak.'
          }
        ]
      },
      {
        id: 'py-conditionals',
        title: 'Conditionals & Logic',
        description: 'Direct execution flow with if, elif, and else statements.',
        exercises: [
          {
            id: 'py-c-1',
            type: 'fill',
            question: 'Check if hearts are greater than 0, otherwise show game over:',
            hint: 'Conditionals in Python end with a colon (:).',
            code: ['if', 'hearts > 0:', '\n    print("Playing")', '\n', 'else', ':'],
            blanks: [0, 4],
            options: ['if', 'else', 'elif', 'then', 'case', 'when'],
            correct: ['if', 'else'],
            explanation: 'if condition: ... else: directs logic based on boolean tests.'
          },
          {
            id: 'py-c-2',
            type: 'choice',
            question: 'Which keyword represents logical AND in Python?',
            hint: 'Python uses clean english words instead of &&.',
            options: ['and', '&&', '&', 'AND_ALSO'],
            correct: ['and'],
            explanation: 'Python uses the human-readable word "and" for boolean conjunction.'
          },
          {
            id: 'py-c-3',
            type: 'create',
            question: 'Write a Python equality check comparing if status equals "active":',
            hint: 'Equality uses double equals ==.',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'if ...:\n    print("Welcome back!")',
            options: [],
            correct: ['status == "active"', "status == 'active'", 'status=="active"'],
            explanation: 'status == "active" checks if the status variable matches the string "active".'
          }
        ]
      },
      {
        id: 'py-loops',
        title: 'Loops & Iteration',
        description: 'Iterate through sequences using for loops and range().',
        exercises: [
          {
            id: 'py-l-1',
            type: 'fill',
            question: 'Loop 3 times using the for statement and range() function:',
            hint: 'for i in range(3): loops with i = 0, 1, 2.',
            code: ['for', 'i in', 'range', '(3):', '\n    print(i)'],
            blanks: [0, 2],
            options: ['for', 'range', 'while', 'loop', 'in', 'count'],
            correct: ['for', 'range'],
            explanation: 'for i in range(3): iterates from 0 through 2.'
          },
          {
            id: 'py-l-2',
            type: 'choice',
            question: 'What numbers are generated by range(3)?',
            hint: 'Python ranges are zero-indexed and stop before the end value.',
            options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '1, 2'],
            correct: ['0, 1, 2'],
            explanation: 'range(3) produces three numbers starting at 0: 0, 1, and 2.'
          },
          {
            id: 'py-l-3',
            type: 'create',
            question: 'Write a for loop header that iterates each item in a list named skills:',
            hint: 'for skill in skills:',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'skills = ["Python", "SQL", "Git"]\n...\n    print(skill)',
            options: [],
            correct: ['for skill in skills:', 'for item in skills:'],
            explanation: 'for skill in skills: iterates sequentially over each element in the list.'
          }
        ]
      }
    ]
  },
  {
    id: 'py-2',
    title: 'Data Structures & Collections',
    subtitle: 'Module 2',
    description: 'Master Python lists, dictionaries, tuples, and sets.',
    lessons: [
      {
        id: 'py-lists',
        title: 'Lists & Slicing',
        description: 'Store ordered sequences of items with list operations.',
        exercises: [
          {
            id: 'py-li-1',
            type: 'fill',
            question: 'Create a list containing three programming languages in Python:',
            hint: 'Python lists are enclosed in square brackets [].',
            code: ['languages', '=', '[', '"HTML", "CSS", "Python"', ']'],
            blanks: [2, 4],
            options: ['[', ']', '{', '}', '(', ')'],
            correct: ['[', ']'],
            explanation: 'Square brackets [ ... ] define mutable ordered lists in Python.'
          },
          {
            id: 'py-li-2',
            type: 'choice',
            question: 'Which list method appends a new element to the end of a list?',
            hint: 'items.append(element)',
            options: ['.append()', '.push()', '.add()', '.insert_last()'],
            correct: ['.append()'],
            explanation: 'list.append(x) adds item x to the end of the existing list in-place.'
          },
          {
            id: 'py-li-3',
            type: 'create',
            question: 'Call the method on tech list to append the string "CSS":',
            hint: 'tech.append("CSS")',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'tech = ["HTML"]\n# Add CSS to the list\n...',
            options: [],
            correct: ['tech.append("CSS")', "tech.append('CSS')"],
            explanation: 'tech.append("CSS") appends "CSS" to the tech list.'
          }
        ]
      },
      {
        id: 'py-dicts',
        title: 'Dictionaries & Key-Values',
        description: 'Store associative key-value data with dict mappings.',
        exercises: [
          {
            id: 'py-d-1',
            type: 'fill',
            question: 'Define key-value pairs inside a Python dictionary using colons and commas:',
            hint: '{"key": "value"}',
            code: ['user', '=', '{', '"name"', ':', '"Alex"', ',', '"level": 5', '}'],
            blanks: [4, 6],
            options: [':', ',', '=>', ';', '=', '->'],
            correct: [':', ','],
            explanation: 'Dictionaries map keys to values with colons and separate pairs with commas.'
          },
          {
            id: 'py-d-2',
            type: 'choice',
            question: 'Which method safely retrieves a dictionary value without crashing if the key is missing?',
            hint: 'dict.get(key, default)',
            options: ['.get()', '.find()', '.fetch()', '.lookup()'],
            correct: ['.get()'],
            explanation: 'dict.get("key") returns None or a default value instead of raising a KeyError.'
          },
          {
            id: 'py-d-3',
            type: 'create',
            question: 'Access the value for key "level" in the player dictionary using square brackets:',
            hint: 'player["level"]',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'player = {"name": "Koji", "level": 4}\n# Retrieve level\n...',
            options: [],
            correct: ['player["level"]', "player['level']"],
            explanation: 'player["level"] looks up the associated value 4 from the dictionary.'
          }
        ]
      },
      {
        id: 'py-tuples-sets',
        title: 'Tuples & Sets',
        description: 'Understand immutable tuples and unique unordered sets.',
        exercises: [
          {
            id: 'py-ts-1',
            type: 'fill',
            question: 'Define an immutable coordinate tuple using round parentheses:',
            hint: 'Tuples use round parentheses (x, y).',
            code: ['point', '=', '(', '10', ',', '20', ')'],
            blanks: [2, 6],
            options: ['(', ')', '[', ']', '{', '}'],
            correct: ['(', ')'],
            explanation: 'Parentheses ( ... ) define immutable tuples whose contents cannot be modified.'
          },
          {
            id: 'py-ts-2',
            type: 'choice',
            question: 'What is the primary characteristic of a Python set?',
            hint: 'Sets automatically eliminate duplicate entries.',
            options: [
              'Unordered collection of unique items with no duplicates',
              'Key-value mapping structure',
              'Fixed-size memory buffer',
              'Sorted array with index lookup'
            ],
            correct: ['Unordered collection of unique items with no duplicates'],
            explanation: 'Sets hold only unique elements, making them ideal for deduplicating data.'
          },
          {
            id: 'py-ts-3',
            type: 'create',
            question: 'Convert the list nums to a set to remove all duplicates:',
            hint: 'set(nums)',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'nums = [1, 2, 2, 3, 3]\n# Deduplicate items\nunique_nums = ...',
            options: [],
            correct: ['set(nums)', 'set(nums) '],
            explanation: 'set(nums) constructs a set containing {1, 2, 3} without duplicate values.'
          }
        ]
      }
    ]
  },
  {
    id: 'py-3',
    title: 'Functions & OOP',
    subtitle: 'Module 3',
    description: 'Build modular code with custom functions, classes, and exceptions.',
    lessons: [
      {
        id: 'py-functions',
        title: 'Custom Functions',
        description: 'Encapsulate reusable logic with def and return values.',
        exercises: [
          {
            id: 'py-f-1',
            type: 'fill',
            question: 'Define a function that returns double a number in Python:',
            hint: 'def starts a function; return sends back the result.',
            code: ['def', 'double(n):', '\n   ', 'return', 'n * 2'],
            blanks: [0, 3],
            options: ['def', 'return', 'function', 'fn', 'send', 'output'],
            correct: ['def', 'return'],
            explanation: 'def defines the function signature; return produces the calculated value.'
          },
          {
            id: 'py-f-2',
            type: 'choice',
            question: 'Which keyword is used to define a function in Python?',
            hint: 'Short for "define".',
            options: ['def', 'function', 'fn', 'func'],
            correct: ['def'],
            explanation: 'def is Python’s dedicated keyword to declare functions and methods.'
          },
          {
            id: 'py-f-3',
            type: 'create',
            question: 'Write a function header named add that accepts parameters a and b:',
            hint: 'def add(a, b):',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Function header here\n...\n    return a + b',
            options: [],
            correct: ['def add(a, b):', 'def add(a,b):'],
            explanation: 'def add(a, b): defines a function named add taking two arguments.'
          }
        ]
      },
      {
        id: 'py-classes',
        title: 'Classes & Objects',
        description: 'Model real-world entities with classes, __init__, and self.',
        exercises: [
          {
            id: 'py-cl-1',
            type: 'fill',
            question: 'Define a class and its constructor method in Python:',
            hint: 'Constructors in Python are named __init__.',
            code: ['class', 'Player:', '\n    def', '__init__', '(self, name):', '\n        self.name = name'],
            blanks: [0, 3],
            options: ['class', '__init__', 'constructor', 'object', 'init', 'self'],
            correct: ['class', '__init__'],
            explanation: 'class declares a new type; __init__ is called when instances are created.'
          },
          {
            id: 'py-cl-2',
            type: 'choice',
            question: 'What does the parameter self represent inside Python class methods?',
            hint: 'It points to the specific object instance.',
            options: [
              'The current instance of the class object',
              'The global module scope',
              'The superclass parent',
              'The Python interpreter'
            ],
            correct: ['The current instance of the class object'],
            explanation: 'self refers to the concrete object instance executing the method.'
          },
          {
            id: 'py-cl-3',
            type: 'create',
            question: 'Instantiate a class named Developer and assign it to variable dev:',
            hint: 'dev = Developer()',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'class Developer:\n    pass\n# Create instance\n...',
            options: [],
            correct: ['dev = Developer()', 'dev=Developer()'],
            explanation: 'dev = Developer() instantiates a new object from the Developer class.'
          }
        ]
      },
      {
        id: 'py-boss',
        title: 'Python Engineering Boss Challenge',
        isBoss: true,
        description: 'Prove your Python mastery with exceptions and error handling.',
        exercises: [
          {
            id: 'py-b-1',
            type: 'fill',
            question: 'Handle potential errors gracefully using try and except blocks:',
            hint: 'try tests code; except catches errors.',
            code: ['try', ':', '\n    val = int("abc")', '\n', 'except', 'ValueError:', '\n    print("Not a number")'],
            blanks: [0, 4],
            options: ['try', 'except', 'catch', 'finally', 'raise', 'error'],
            correct: ['try', 'except'],
            explanation: 'try/except prevents Python applications from crashing on runtime exceptions.'
          },
          {
            id: 'py-b-2',
            type: 'choice',
            question: 'Which block in a try statement ALWAYS runs regardless of whether an error occurred?',
            hint: 'Used for closing files and network connections.',
            options: ['finally', 'always', 'ensure', 'last'],
            correct: ['finally'],
            explanation: 'The finally block executes unconditionally for guaranteed cleanup.'
          },
          {
            id: 'py-b-3',
            type: 'create',
            question: 'Write the statement to raise a ValueError with message "Invalid XP":',
            hint: 'raise ValueError("Invalid XP")',
            placeholder: 'e.g., print(...) or expression',
            starterCode: 'if xp < 0:\n    ...',
            options: [],
            correct: ['raise ValueError("Invalid XP")', "raise ValueError('Invalid XP')"],
            explanation: 'raise ValueError("Invalid XP") throws an explicit exception to halt invalid logic.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): PYTHON METAPROGRAMMING & ASYNCIO ---
  // ==========================================
  {
    id: 'py-adv-1',
    title: 'Python Metaprogramming & AsyncIO',
    subtitle: 'Advance Module 4',
    description: 'Master decorators, generator pipelines, dunder methods, and asynchronous coroutines.',
    isAdvanced: true,
    lessons: [
      {
        id: 'py-decorators',
        title: 'Function Decorators & Wrappers',
        description: 'Extend and modify function behaviors dynamically using the @decorator syntax.',
        exercises: [
          {
            id: 'pyd-1',
            type: 'choice',
            question: 'What is a Python decorator at its core?',
            hint: 'It takes a function as input and returns a modified wrapper function.',
            options: [
              'A higher-order function that takes another function as an argument and extends its behavior',
              'A special CSS class for styling Python terminal output',
              'A compiler flag for CPython optimization',
              'A database migration script'
            ],
            correct: ['A higher-order function that takes another function as an argument and extends its behavior'],
            explanation: 'Decorators wrap existing functions to add logging, authentication, or timing without altering their code.'
          },
          {
            id: 'pyd-2',
            type: 'fill',
            question: 'Apply a decorator to authenticate a view function:',
            hint: '@require_auth placed directly above the def statement.',
            code: ['@require_auth', '\ndef', 'get_secret_vault():', '\n    return "Access Granted"'],
            blanks: [0, 1],
            options: ['@require_auth', 'def', '#require_auth', 'function', 'class', '@decorator'],
            correct: ['@require_auth', 'def'],
            explanation: '@decorator is syntactic sugar for func = decorator(func).'
          },
          {
            id: 'pyd-3',
            type: 'create',
            question: 'Write the import statement to preserve function metadata in custom decorators using functools.wraps:',
            hint: 'from functools import wraps',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Import wraps helper\n...',
            options: [],
            correct: ['from functools import wraps', 'import functools'],
            explanation: 'from functools import wraps preserves docstrings and function names inside wrappers.'
          }
        ]
      },
      {
        id: 'py-asyncio',
        title: 'Asynchronous Coroutines & AsyncIO',
        description: 'Build non-blocking concurrent pipelines using async, await, and event loops.',
        exercises: [
          {
            id: 'pya-1',
            type: 'fill',
            question: 'Define an asynchronous coroutine that fetches remote data:',
            hint: 'async def fetch_data(): ... response = await client.get()',
            code: ['async', 'def fetch_data():', '\n    response =', 'await', 'client.get("/api/v1")'],
            blanks: [0, 3],
            options: ['async', 'await', 'sync', 'yield', 'thread', 'promise'],
            correct: ['async', 'await'],
            explanation: 'async def creates a coroutine, and await pauses execution until the future resolves.'
          },
          {
            id: 'pya-2',
            type: 'choice',
            question: 'Which method runs multiple asynchronous tasks concurrently in Python asyncio?',
            hint: 'asyncio.gather(*tasks)',
            options: ['asyncio.gather()', 'asyncio.thread()', 'asyncio.fork()', 'asyncio.parallel()'],
            correct: ['asyncio.gather()'],
            explanation: 'asyncio.gather() schedules and aggregates results from multiple concurrent coroutines.'
          },
          {
            id: 'pya-3',
            type: 'create',
            question: 'Write the command to pause an async function for 1 second non-blockingly:',
            hint: 'await asyncio.sleep(1)',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Non-blocking 1-second delay\n...',
            options: [],
            correct: ['await asyncio.sleep(1)', 'await asyncio.sleep(1.0)', 'await asyncio.sleep(1);'],
            explanation: 'await asyncio.sleep(1) yields control back to the event loop without blocking CPU threads.'
          }
        ]
      },
      {
        id: 'py-adv1-boss',
        title: 'Python Advanced Architect Boss Challenge',
        isBoss: true,
        description: 'Test your knowledge on generators, yield, and asynchronous execution.',
        exercises: [
          {
            id: 'pab-1',
            type: 'choice',
            question: 'What is the memory benefit of Python generators (yield) over standard lists?',
            hint: 'Generators produce values lazily on demand.',
            options: [
              'Generators evaluate lazily and stream items one by one with O(1) memory footprint',
              'Generators compress data into gzip format',
              'Generators execute on the GPU directly',
              'Generators bypass the Global Interpreter Lock (GIL)'
            ],
            correct: ['Generators evaluate lazily and stream items one by one with O(1) memory footprint'],
            explanation: 'yield streams data lazily without allocating entire datasets in RAM.'
          },
          {
            id: 'pab-2',
            type: 'fill',
            question: 'Implement a generator function that yields squares of numbers:',
            hint: 'def gen(n): for i in range(n): yield i * i',
            code: ['def gen(n):', '\n    for i in range(n):', '\n       ', 'yield', 'i * i'],
            blanks: [3],
            options: ['yield', 'return', 'emit', 'push', 'stream'],
            correct: ['yield'],
            explanation: 'yield pauses execution and emits the next value in the iteration.'
          },
          {
            id: 'pab-3',
            type: 'create',
            question: 'Write the dunder method name used to define custom string representation for debugging in Python classes:',
            hint: '__repr__ or def __repr__(self):',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Dunder method for representation\ndef ...(self):',
            options: [],
            correct: ['__repr__', 'def __repr__(self):', '__str__', '__repr__(self)'],
            explanation: '__repr__ returns an unambiguous official string representation of a Python object.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): DATA SCIENCE & AI ENGINEERING ---
  // ==========================================
  {
    id: 'py-adv-2',
    title: 'Data Science & AI Engineering with NumPy & Pandas',
    subtitle: 'Advance Module 5',
    description: 'Transform datasets, calculate matrix vectorizations, and engineer features for Machine Learning.',
    isAdvanced: true,
    lessons: [
      {
        id: 'py-numpy-arrays',
        title: 'NumPy Vectorization & N-D Arrays',
        description: 'Accelerate numerical computing with high-performance C-backed array operations.',
        exercises: [
          {
            id: 'pyn-1',
            type: 'choice',
            question: 'Why is vectorization in NumPy significantly faster than standard Python for-loops?',
            hint: 'NumPy executes continuous C memory operations with SIMD CPU instructions.',
            options: [
              'It executes contiguous C-level SIMD operations without Python interpreter overhead',
              'It converts Python to JavaScript in the browser',
              'It skips mathematical rounding entirely',
              'It always runs on quantum computers'
            ],
            correct: ['It executes contiguous C-level SIMD operations without Python interpreter overhead'],
            explanation: 'NumPy operates directly on raw contiguous memory blocks using compiled C routines.'
          },
          {
            id: 'pyn-2',
            type: 'fill',
            question: 'Create a NumPy 2D array and compute its mean value:',
            hint: 'import numpy as np; arr = np.array([...]); arr.mean()',
            code: ['import', 'numpy', 'as np\narr = np.array([[1, 2], [3, 4]])\navg = arr.', 'mean', '()'],
            blanks: [1, 3],
            options: ['numpy', 'mean', 'average', 'pandas', 'sum', 'math'],
            correct: ['numpy', 'mean'],
            explanation: 'arr.mean() computes the arithmetic mean across array elements.'
          },
          {
            id: 'pyn-3',
            type: 'create',
            question: 'Write the NumPy function to generate an array of numbers from 0 up to 10 with step 2:',
            hint: 'np.arange(0, 10, 2)',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Generate range array [0, 2, 4, 6, 8]\n...',
            options: [],
            correct: ['np.arange(0, 10, 2)', 'np.arange(0, 10, 2);', 'np.arange(0,10,2)'],
            explanation: 'np.arange(start, stop, step) generates evenly spaced numerical sequences.'
          }
        ]
      },
      {
        id: 'py-pandas-dataframes',
        title: 'Pandas DataFrames & Data Wrangling',
        description: 'Filter, aggregate, clean, and analyze tabular records with Pandas.',
        exercises: [
          {
            id: 'pyp-1',
            type: 'fill',
            question: 'Filter a DataFrame to only include rows where score is greater than 80:',
            hint: 'high_scorers = df[df["score"] > 80]',
            code: ['high_scorers =', 'df[df["score"] > 80]'],
            blanks: [1],
            options: ['df[df["score"] > 80]', 'df.filter(score > 80)', 'df.where(score > 80)', 'SELECT * FROM df'],
            correct: ['df[df["score"] > 80]'],
            explanation: 'Boolean indexing in Pandas allows fast columnar filtering on DataFrames.'
          },
          {
            id: 'pyp-2',
            type: 'choice',
            question: 'Which Pandas method calculates summary statistics (mean, std, min, max) for numeric columns?',
            hint: 'df.describe()',
            options: ['df.describe()', 'df.summary()', 'df.info()', 'df.calculate()'],
            correct: ['df.describe()'],
            explanation: 'df.describe() generates count, mean, std, percentiles, and extremes for all numeric series.'
          },
          {
            id: 'pyp-3',
            type: 'create',
            question: 'Write the Pandas method to read a CSV file named "data.csv" into a DataFrame:',
            hint: 'pd.read_csv("data.csv")',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '// Load tabular CSV\ndf = ...',
            options: [],
            correct: ['pd.read_csv("data.csv")', "pd.read_csv('data.csv')", 'pd.read_csv("data.csv");'],
            explanation: 'pd.read_csv("data.csv") parses CSV file records into a Pandas DataFrame.'
          }
        ]
      },
      {
        id: 'py-ai-boss',
        title: 'Python AI & Data Engineering Master Challenge',
        isBoss: true,
        description: 'Prove complete mastery over Python data manipulation, vectorization, and model preparation.',
        exercises: [
          {
            id: 'paboss-1',
            type: 'choice',
            question: 'What is one-hot encoding in feature engineering for Machine Learning?',
            hint: 'It converts categorical strings into binary 0 and 1 columns.',
            options: [
              'Converting categorical variables into binary indicator columns (0s and 1s)',
              'Compressing weights into 8-bit integers',
              'Normalizing values between 0 and 1',
              'Removing null values from datasets'
            ],
            correct: ['Converting categorical variables into binary indicator columns (0s and 1s)'],
            explanation: 'pd.get_dummies() turns categorical labels into numerical binary features for ML algorithms.'
          },
          {
            id: 'paboss-2',
            type: 'fill',
            question: 'Group records by department and compute the average salary in Pandas:',
            hint: 'df.groupby("department")["salary"].mean()',
            code: ['df.', 'groupby', '("department")["salary"].', 'mean', '()'],
            blanks: [1, 3],
            options: ['groupby', 'mean', 'aggregate', 'split', 'sum', 'sort'],
            correct: ['groupby', 'mean'],
            explanation: 'groupby() splits the data into buckets to perform aggregation calculations.'
          },
          {
            id: 'paboss-3',
            type: 'create',
            question: 'Write the method to fill missing NaN values in a DataFrame with 0:',
            hint: 'df.fillna(0)',
            placeholder: 'e.g., print(...) or expression',
            starterCode: '# Handle missing values\nclean_df = ...',
            options: [],
            correct: ['df.fillna(0)', 'df.fillna(0);', 'df.fillna(value=0)'],
            explanation: 'df.fillna(0) replaces all null/NaN entries with zeroes.'
          }
        ]
      }
    ]
  }
];
