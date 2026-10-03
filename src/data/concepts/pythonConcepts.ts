import { TeachingConcept } from '../lessonConcepts';

export const PYTHON_CONCEPTS: Record<string, TeachingConcept> = {
  'py-syntax': {
    summary: 'Python is a high-level, human-readable programming language. Unlike C++ or Java that rely on curly braces {}, Python uses whitespace indentation to define code scope and blocks. The built-in print() function outputs text and expressions to standard output.',
    keyRule: 'Python uses consistent 4-space indentation to define blocks. Statements end with a newline (no semicolons required).',
    codeSnippet: `# Python greeting program
def main():
    message = "Welcome to Python Mastery"
    print(message)
    print("Code is clean and readable!")

if __name__ == "__main__":
    main()`,
    codeLanguage: 'python',
    terminalOutput: `Welcome to Python Mastery
Code is clean and readable!`,
    breakdown: [
      { term: 'print()', definition: 'Built-in function that outputs objects and text to the terminal.', badge: 'Built-in' },
      { term: 'Indentation', definition: '4 spaces used to denote function bodies, loops, and conditions.', badge: 'Syntax' },
      { term: '# Comments', definition: 'Single-line comments starting with a hash symbol ignored by the interpreter.', badge: 'Syntax' }
    ],
    proTip: 'Always stick to 4 spaces for indentation rather than mixing tabs and spaces to prevent IndentationError.',
    commonMistake: 'Forgetting the colon (:) at the end of function or loop declarations: "def greet():" requires a colon!'
  },

  'py-variables': {
    summary: 'Python is dynamically typed: you do not declare variable types explicitly. The interpreter infers whether a variable holds an integer, float, string, or boolean based on the assigned value. Variables can also be reassigned to different types at runtime.',
    keyRule: 'Variables are created the moment you assign a value using the assignment operator (=). Variable names follow snake_case.',
    codeSnippet: `username = "DevHero"
user_level = 42
xp_points = 1250.75
is_pro_member = True

print(f"User: {username} (Level {user_level}) - Active: {is_pro_member}")`,
    codeLanguage: 'python',
    terminalOutput: `User: DevHero (Level 42) - Active: True`,
    breakdown: [
      { term: 'Dynamic Typing', definition: 'Types are bound to values at runtime, not fixed to variable names.', badge: 'Core' },
      { term: 'f-strings', definition: 'Formatted string literals f"..." for effortless variable interpolation.', badge: 'Modern' },
      { term: 'snake_case', definition: 'Standard Python naming convention: lowercase words separated by underscores.', badge: 'PEP 8' }
    ],
    proTip: 'Use f-strings f"Hello {name}" instead of + string concatenation—it is faster and prevents type mismatch errors.',
    commonMistake: 'Using uppercase or camelCase for standard variable names. Follow PEP 8 convention using snake_case like total_score.'
  },

  'py-conditionals': {
    summary: 'Branching logic in Python is governed by if, elif (short for else if), and else statements. Python evaluates conditions using boolean operators and, or, not rather than symbols like && or ||.',
    keyRule: 'Conditions use colon (:) followed by an indented block. Use and, or, not for logical comparisons.',
    codeSnippet: `score = 88

if score >= 90:
    rank = "Master"
elif score >= 75:
    rank = "Senior Developer"
else:
    rank = "Apprentice"

print(f"Assigned rank: {rank}")`,
    codeLanguage: 'python',
    terminalOutput: `Assigned rank: Senior Developer`,
    breakdown: [
      { term: 'elif', definition: 'Short for else if, used to test successive conditions when previous checks are false.', badge: 'Branching' },
      { term: 'Comparison Operators', definition: '== (equal), != (not equal), <, <=, >, >=', badge: 'Logic' },
      { term: 'Logical Operators', definition: 'and (both true), or (either true), not (inverts boolean).', badge: 'Keywords' }
    ],
    proTip: 'You can chain comparisons in Python: 10 <= score <= 100 is completely valid and expressive!',
    commonMistake: 'Accidentally using a single equal sign (=) instead of double equals (==) when checking for equality.'
  },

  'py-loops': {
    summary: 'Loops let you repeat code blocks efficiently. Python provides for loops for iterating over sequences (like range(), lists, strings) and while loops that repeat as long as a boolean condition remains true.',
    keyRule: 'for item in sequence: iterates over every element. Use range(start, stop, step) for numeric counting.',
    codeSnippet: `# Range loop
total = 0
for i in range(1, 6):
    total += i

print(f"Sum of 1 through 5: {total}")

# While loop
count = 3
while count > 0:
    print(f"Countdown: {count}")
    count -= 1
print("Launch!")`,
    codeLanguage: 'python',
    terminalOutput: `Sum of 1 through 5: 15
Countdown: 3
Countdown: 2
Countdown: 1
Launch!`,
    breakdown: [
      { term: 'range(n)', definition: 'Generates numbers from 0 up to (but excluding) n.', badge: 'Built-in' },
      { term: 'break', definition: 'Immediately terminates the nearest enclosing loop.', badge: 'Control' },
      { term: 'continue', definition: 'Skips the rest of the current iteration and jumps to the next cycle.', badge: 'Control' }
    ],
    proTip: 'range(len(items)) is an anti-pattern in Python; iterate directly over items: "for item in items:".',
    commonMistake: 'Creating an infinite while loop by forgetting to update the loop condition variable inside the loop body.'
  },

  'py-lists': {
    summary: 'Lists are mutable, ordered sequences in Python enclosed in square brackets []. They can hold elements of any data type, support dynamic appending, popping, and powerful indexing and slicing.',
    keyRule: 'Lists are 0-indexed. Negative indices like -1 access elements from the end of the list. Slicing syntax is list[start:stop:step].',
    codeSnippet: `languages = ["Python", "Rust", "Go"]
languages.append("TypeScript")
print(f"First: {languages[0]}")
print(f"Last: {languages[-1]}")

# Slicing
subset = languages[1:3]
print(f"Slice [1:3]: {subset}")`,
    codeLanguage: 'python',
    terminalOutput: `First: Python
Last: TypeScript
Slice [1:3]: ['Rust', 'Go']`,
    breakdown: [
      { term: 'append(val)', definition: 'Adds val to the end of the list in O(1) amortized time.', badge: 'Method' },
      { term: 'pop()', definition: 'Removes and returns the last element of the list.', badge: 'Method' },
      { term: 'Negative Indexing', definition: 'list[-1] returns the final element, list[-2] the second-to-last.', badge: 'Feature' }
    ],
    proTip: 'List comprehensions like [x * 2 for x in nums if x > 0] create transformed lists in a single readable line.',
    commonMistake: 'Confusing append([1, 2]) (which adds the list as a single nested element) with extend([1, 2]) (which adds each item).'
  },

  'py-dicts': {
    summary: 'Dictionaries (dicts) store key-value mappings enclosed in curly braces {}. Keys must be immutable types (like strings or integers), and lookup by key is virtually instantaneous with O(1) hash table performance.',
    keyRule: 'Access values using dict[key] or dict.get(key, default) which prevents KeyError exceptions if the key is missing.',
    codeSnippet: `config = {
    "host": "localhost",
    "port": 5432,
    "ssl": True
}

# Access with fallback
timeout = config.get("timeout", 30)
print(f"Connecting to {config['host']}:{config['port']} (timeout={timeout}s)")`,
    codeLanguage: 'python',
    terminalOutput: `Connecting to localhost:5432 (timeout=30s)`,
    breakdown: [
      { term: 'Key-Value Pair', definition: 'A mapping of an immutable key to any arbitrary Python object.', badge: 'Structure' },
      { term: '.get()', definition: 'Safely queries a key, returning None or a fallback if the key is absent.', badge: 'Method' },
      { term: '.items()', definition: 'Returns an iterable view of (key, value) tuples for easy looping.', badge: 'Method' }
    ],
    proTip: 'Looping over dicts using "for key, value in data.items():" is idiomatic and clean.',
    commonMistake: 'Directly querying data["missing_key"] without verifying with "in data" or ".get()", triggering a runtime KeyError.'
  },

  'py-tuples-sets': {
    summary: 'Tuples are immutable sequences defined with parentheses (), perfect for fixed collections and coordinate pairs. Sets are unordered collections of unique elements defined with set() or {val1, val2}, providing fast membership tests.',
    keyRule: 'Tuples cannot be altered after creation (immutable). Sets automatically de-duplicate entries and do not maintain order.',
    codeSnippet: `# Immutable tuple
point = (10, 20)
x, y = point  # Tuple unpacking
print(f"Coordinates: x={x}, y={y}")

# Unique set
unique_tags = set(["react", "vite", "react", "tailwind"])
print(f"Deduplicated tags: {sorted(list(unique_tags))}")`,
    codeLanguage: 'python',
    terminalOutput: `Coordinates: x=10, y=20
Deduplicated tags: ['react', 'tailwind', 'vite']`,
    breakdown: [
      { term: 'Immutability', definition: 'Tuples cannot be modified, making them hashable and safe dictionary keys.', badge: 'Property' },
      { term: 'Unpacking', definition: 'Assigning elements of a tuple/list to distinct variables: a, b = pair.', badge: 'Syntax' },
      { term: 'Set Operations', definition: 'Set union (|), intersection (&), and difference (-) for fast math.', badge: 'Operations' }
    ],
    proTip: 'To check if an item exists in a large collection of items, convert it to a set for instant O(1) membership lookup instead of O(N) list search.',
    commonMistake: 'Trying to create a single-element tuple with (42). In Python, a single element tuple requires a trailing comma: (42,).'
  },

  'py-functions': {
    summary: 'Functions are modular blocks of reusable code defined with the def keyword. Functions can accept positional arguments, keyword arguments with default values, and return results with return.',
    keyRule: 'def function_name(param1, param2=default): defines a function. Use return to return outputs to the caller.',
    codeSnippet: `def calculate_tax(amount: float, rate: float = 0.08) -> float:
    """Calculates tax on a given transaction amount."""
    return round(amount * rate, 2)

total_tax = calculate_tax(150.0)
print(f"Tax due: \${total_tax}")`,
    codeLanguage: 'python',
    terminalOutput: `Tax due: $12.0`,
    breakdown: [
      { term: 'def', definition: 'Keyword that declares a new function definition.', badge: 'Keyword' },
      { term: 'Default Arguments', definition: 'Parameters with preset values that callers can optionally omit.', badge: 'Feature' },
      { term: 'Type Hints', definition: 'Optional annotations (param: type -> return_type) improving code tooling.', badge: 'Typing' }
    ],
    proTip: 'Never use mutable objects (like [] or {}) as default arguments in function signatures; use default=None and initialize inside.',
    commonMistake: 'Forgetting the return keyword, which causes the function to implicitly return None.'
  },

  'py-classes': {
    summary: 'Python supports full Object-Oriented Programming (OOP). Classes act as blueprints for creating objects with encapsulated state (attributes) and behavior (methods). The __init__ method acts as the constructor.',
    keyRule: 'The first parameter of all instance methods must be self, representing the specific object instance being operated on.',
    codeSnippet: `class ServerNode:
    def __init__(self, hostname: str, ip_address: str):
        self.hostname = hostname
        self.ip_address = ip_address
        self.is_online = False

    def boot(self):
        self.is_online = True
        print(f"[{self.hostname}] Node online at {self.ip_address}")

node1 = ServerNode("alpha-01", "192.168.1.100")
node1.boot()`,
    codeLanguage: 'python',
    terminalOutput: `[alpha-01] Node online at 192.168.1.100`,
    breakdown: [
      { term: '__init__', definition: 'Constructor method automatically called when a new instance is instantiated.', badge: 'Dunder' },
      { term: 'self', definition: 'Explicit reference to the instance of the class passed to all instance methods.', badge: 'Core' },
      { term: 'Encapsulation', definition: 'Bundling data variables and the methods that operate on them within one class.', badge: 'OOP' }
    ],
    proTip: 'Implement the __str__ or __repr__ dunder method on your classes so printing your object prints human-friendly information.',
    commonMistake: 'Forgetting self as the first parameter in method definitions: "def boot(self):" is required, not "def boot():".'
  },

  'py-boss': {
    summary: 'The Python Engineering Boss Challenge tests your ability to synthesize functions, dictionaries, list comprehension, error handling with try/except, and clean OOP architecture into an end-to-end data processing service.',
    keyRule: 'Use try/except blocks to gracefully handle potential runtime exceptions like ZeroDivisionError, ValueError, or KeyError.',
    codeSnippet: `class DataPipeline:
    def __init__(self):
        self.records = []

    def ingest(self, raw_data):
        for item in raw_data:
            try:
                processed = {k: v.strip().upper() for k, v in item.items()}
                self.records.append(processed)
            except AttributeError as err:
                print(f"Skipping malformed entry: {err}")

pipeline = DataPipeline()
pipeline.ingest([{"lang": "python"}, {"lang": "rust"}])
print(f"Ingested {len(pipeline.records)} valid records.")`,
    codeLanguage: 'python',
    terminalOutput: `Ingested 2 valid records.`,
    breakdown: [
      { term: 'try / except', definition: 'Catches and handles runtime exceptions without crashing the program.', badge: 'Resilience' },
      { term: 'List / Dict Comprehension', definition: 'Concise expressions constructing new collections from iterables.', badge: 'Pythonic' },
      { term: 'Production Architecture', definition: 'Writing modular, testable, and robust Python services.', badge: 'System' }
    ],
    proTip: 'Always catch specific exceptions (e.g. except ValueError) rather than a bare except: clause which can mask unexpected bugs.',
    commonMistake: 'Using mutable globals instead of encapsulating state inside class instances or pure function return values.'
  },

  // ==========================================
  // --- PYTHON ADVANCED MODULES 4 & 5 ---
  // ==========================================
  'py-decorators': {
    summary: 'Decorators are higher-order functions that wrap another function to extend or modify its behavior without permanently altering its source code. They are widely used for timing, logging, authentication, and caching.',
    keyRule: '@decorator_name is placed immediately above a function definition • Use functools.wraps to preserve function metadata.',
    codeSnippet: `from functools import wraps
import time

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def heavy_calc():
    return sum(i * i for i in range(100000))`,
    codeLanguage: 'python',
    terminalOutput: `heavy_calc took 0.0082s`,
    breakdown: [
      { term: '@wraps', definition: 'Preserves the original function name, docstring, and annotations inside wrappers.', badge: 'Functools' },
      { term: '*args, **kwargs', definition: 'Captures arbitrary positional and keyword arguments passed into the decorated function.', badge: 'Signature' }
    ],
    proTip: 'Decorators can also accept arguments by adding an extra outer wrapper layer.',
    commonMistake: 'Forgetting to return the inner wrapper function from the decorator, which causes the function to become None.'
  },

  'py-asyncio': {
    summary: 'AsyncIO provides asynchronous single-threaded concurrency using coroutines, event loops, and non-blocking I/O. It allows applications to handle thousands of concurrent network connections without thread overhead.',
    keyRule: 'async def defines a coroutine • await pauses execution until the future resolves • Use asyncio.gather() for concurrency.',
    codeSnippet: `import asyncio

async def fetch_user(uid):
    await asyncio.sleep(0.1) # Simulate non-blocking I/O
    return {"id": uid, "name": f"Coder_{uid}"}

async def main():
    users = await asyncio.gather(fetch_user(1), fetch_user(2), fetch_user(3))
    print(f"Fetched {len(users)} users concurrently!")

asyncio.run(main())`,
    codeLanguage: 'python',
    terminalOutput: `Fetched 3 users concurrently!`,
    breakdown: [
      { term: 'async / await', definition: 'Syntax for declaring and consuming non-blocking asynchronous coroutines.', badge: 'Core' },
      { term: 'asyncio.gather', definition: 'Schedules multiple coroutines concurrently on the event loop.', badge: 'Concurrency' }
    ],
    proTip: 'Never use time.sleep() inside async coroutines because it blocks the entire event loop. Use await asyncio.sleep() instead.',
    commonMistake: 'Calling a coroutine function without await or asyncio.run(), which only creates a coroutine object without running it.'
  },

  'py-adv1-boss': {
    summary: 'The Python Metaprogramming Boss Challenge tests mastery over custom decorators, lazy generator pipelines with yield, and dunder method metamodeling.',
    keyRule: 'yield streams data one by one with O(1) memory • __repr__ formats debug strings.',
    codeSnippet: `def infinite_fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
    codeLanguage: 'python',
    breakdown: [
      { term: 'Generators', definition: 'Functions containing yield that maintain internal state across iterations.', badge: 'Streaming' },
      { term: 'Dunder Methods', definition: 'Double underscore magic methods (__repr__, __enter__, __exit__) overriding core behaviors.', badge: 'Metaprogramming' }
    ],
    proTip: 'Use generator expressions (x for x in seq) over list comprehensions [x for x in seq] when processing large datasets.',
    commonMistake: 'Using return instead of yield inside a generator, which terminates the generator prematurely.'
  },

  'py-numpy-arrays': {
    summary: 'NumPy provides N-dimensional array objects (ndarray) backed by compiled C memory blocks. Vectorized mathematical operations execute simultaneously across arrays without slow Python interpreter loops.',
    keyRule: 'NumPy vectorization runs at C speed using SIMD CPU instructions • Arrays must contain homogeneous data types.',
    codeSnippet: `import numpy as np

arr = np.array([10, 20, 30, 40, 50])
doubled = arr * 2 # Vectorized multiplication
mean_val = arr.mean()

print(f"Doubled: {doubled} | Mean: {mean_val}")`,
    codeLanguage: 'python',
    terminalOutput: `Doubled: [ 20  40  60  80 100] | Mean: 30.0`,
    breakdown: [
      { term: 'ndarray', definition: 'Homogeneous multidimensional array optimized for contiguous memory layout.', badge: 'Core' },
      { term: 'Broadcasting', definition: 'NumPy ability to perform arithmetic across arrays of differing compatible shapes.', badge: 'Math' }
    ],
    proTip: 'Avoid Python for-loops over NumPy arrays; always write vectorized expressions for maximum execution speed.',
    commonMistake: 'Mixing data types in a single NumPy array, which forces NumPy to downcast everything to generic objects or strings.'
  },

  'py-pandas-dataframes': {
    summary: 'Pandas is the premier data manipulation library for Python. It introduces DataFrames (2D tabular datasets with labeled axes) for filtering, aggregating, cleaning, and transforming real-world tabular data.',
    keyRule: 'df[condition] filters rows • df.groupby() groups and aggregates • df.fillna() handles missing NaN values.',
    codeSnippet: `import pandas as pd

df = pd.DataFrame({
    "student": ["Alice", "Bob", "Charlie"],
    "score": [95, 78, 88],
    "passed": [True, False, True]
})

high_scorers = df[df["score"] >= 85]
print(high_scorers[["student", "score"]])`,
    codeLanguage: 'python',
    terminalOutput: `   student  score
0    Alice     95
2  Charlie     88`,
    breakdown: [
      { term: 'DataFrame', definition: '2D tabular data structure with column labels and row index.', badge: 'Pandas' },
      { term: 'Boolean Indexing', definition: 'Filtering records by passing conditional expressions inside square brackets.', badge: 'Filtering' }
    ],
    proTip: 'Use df.describe() for an instant statistical overview of all numerical columns in any dataset.',
    commonMistake: 'Modifying a filtered slice of a DataFrame without .copy(), which triggers the SettingWithCopyWarning.'
  },

  'py-ai-boss': {
    summary: 'The Python AI & Data Engineering Master Challenge tests feature engineering, one-hot encoding, data cleaning, and matrix vectorization.',
    keyRule: 'One-hot encoding converts categorical labels to binary numeric columns • Clean missing values before feeding models.',
    codeSnippet: `encoded_df = pd.get_dummies(df, columns=["department"], drop_first=True)
normalized = (arr - arr.mean()) / arr.std()`,
    codeLanguage: 'python',
    breakdown: [
      { term: 'One-Hot Encoding', definition: 'Transforms categorical columns into 0 and 1 indicator columns.', badge: 'AI Prep' },
      { term: 'Normalization', definition: 'Scales numerical features to zero mean and unit variance for neural networks.', badge: 'ML' }
    ],
    proTip: 'Always check df.isna().sum() before training machine learning models to catch hidden null entries.',
    commonMistake: 'Training models on raw non-normalized features, causing gradient descent to diverge.'
  }
};
