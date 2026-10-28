/**
 * ============================================================================
 * StudyMate AI — Phase 3: AI API Integration & Response Validation
 * Pure Vanilla JavaScript (ES6+)
 * Strictly Zero External Frameworks, Libraries, or Dependencies
 * ============================================================================
 */

'use strict';

/* ============================================================================
   0. AI PROVIDER CONFIGURATION (GOOGLE GEMINI)
   ============================================================================ */

/**
 * Official Google Gemini 1.5 Flash Configuration.
 * Endpoint utilizes Google AI Studio API key query parameter format.
 */
const GEMINI_CONFIG = {
  provider: 'gemini',
  model: 'gemini-1.5-flash',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  requestTimeoutMs: 60000,
  maxOutputTokens: 8192,
  temperature: 0.3
};

/* ============================================================================
   1. SAMPLE STUDY-MATERIAL DATASETS (LOCAL PREDEFINED KNOWLEDGE BASE)
   ============================================================================ */

/**
 * Predefined educational datasets for Phase 2 demonstration.
 * Covers:
 * 1. Data Structures
 * 2. Operating Systems
 * 3. Database Management Systems (DBMS)
 * 4. Computer Networks
 * 5. JavaScript Fundamentals
 * 6. General Demonstration (Fallback for uncataloged topics)
 */
const SAMPLE_STUDY_DATASETS = {
  'data-structures': {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science Core',
    keywords: ['data structure', 'data structures', 'dsa', 'algorithm', 'algorithms', 'array', 'arrays', 'linked list', 'stack', 'queue', 'binary tree', 'tree', 'bst', 'hash table', 'hashing', 'graph', 'heap'],
    summaries: {
      'Simple Explanation': [
        'Think of data structures as different ways of organizing items in your room. An array is like a row of numbered cubbies where every item has an exact address. If you know the number, you can grab the item in an instant.',
        'A linked list is like a scavenger hunt: each clue (or node) holds a piece of information and points you directly to the next clue. You cannot jump straight to clue number five without reading the first four clues first.',
        'Stacks and queues are specialized containers with strict access rules. A stack operates like a stack of cafeteria plates (Last-In, First-Out): the plate placed last is the first one taken. A queue works like a line at a ticket counter (First-In, First-Out): whoever arrives first is served first.',
        'Trees and hash tables provide rapid lookups for massive amounts of data. Trees organize information hierarchically (like family trees or folder directories), while hash tables use a mathematical formula (a hash function) to convert a search key into an exact index instantly.'
      ],
      'Exam-Focused': [
        'High-Yield Complexity Cheat Sheet: Arrays offer O(1) random access by index via direct memory pointer calculation, but O(n) arbitrary insertion and deletion due to element shifting.',
        'Linked Lists provide O(1) insertion and deletion given a node pointer, but O(n) sequential access time. Doubly linked lists allow bidirectional traversal at the cost of an extra pointer per node.',
        'Stack operations (push, pop, peek) and Queue operations (enqueue, dequeue, front) both strictly run in O(1) time complexity.',
        'Binary Search Trees (BST) guarantee O(log n) average search, insert, and delete time when balanced. In degenerate (skewed) cases, BST operations degrade to linear O(n) time.',
        'Hash Tables achieve average-case O(1) search, insert, and delete. Collisions are handled via Chaining (linked lists in buckets) or Open Addressing (Linear/Quadratic Probing, Double Hashing).'
      ],
      'Detailed Notes': [
        'Data structures are formal syntactic and semantic representations of data designed to optimize memory layouts and algorithmic operations. The choice of an appropriate data structure directly dictates CPU cache behavior, memory fragmentation, and asymptotic algorithmic performance.',
        'Contiguous allocations such as Arrays guarantee spatial cache locality because consecutive elements occupy adjacent physical memory addresses. In dynamic arrays, resizing amortizes to O(1) by doubling internal capacity when full, though reallocations require copying elements.',
        'Non-contiguous structures like Linked Lists allocate memory dynamically on the heap for each node. While node insertion does not require block resizing, dereferencing scattered pointers introduces cache misses and increases memory overhead.',
        'Hierarchical structures like Binary Search Trees maintain the BST invariant: every key in the left subtree is strictly less than the root node, and every key in the right subtree is strictly greater. Balanced variants (AVL trees and Red-Black trees) perform tree rotations to bound tree height to O(log n).',
        'Hash functions map arbitrary keys into bounded table indices. When load factor increases beyond a threshold (typically 0.75), rehashing into a larger table is required to mitigate collision clustering and prevent lookup degradation.'
      ]
    },
    takeaways: [
      'Arrays provide instant O(1) index access but require contiguous memory and costly element shifts for insertions.',
      'Linked Lists excel at dynamic insertions and deletions but sacrifice direct indexing and CPU cache locality.',
      'Stacks follow LIFO (Last-In, First-Out) and are fundamental to function call execution and syntax parsing.',
      'Queues follow FIFO (First-In, First-Out) and govern asynchronous buffering, breadth-first search, and task scheduling.',
      'Hash tables achieve average O(1) operations, relying on collision resolution strategies when keys map to the same bucket.'
    ],
    concepts: [
      { term: 'Time Complexity (Big-O)', definition: 'A mathematical notation describing the limiting behavior of an algorithm execution time as input size grows to infinity.' },
      { term: 'Contiguous Memory', definition: 'A single unbroken block of physical memory addresses, allowing instantaneous pointer arithmetic access.' },
      { term: 'BST Invariant', definition: 'The structural property requiring all left subtree nodes to have values strictly less than the parent, and right nodes strictly greater.' },
      { term: 'Hash Collision', definition: 'An event where two distinct keys produce the exact same table index when evaluated by a hash function.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'Which principle governs the element retrieval order of a standard Stack data structure?',
          options: ['First-In, First-Out (FIFO)', 'Last-In, First-Out (LIFO)', 'Random Access Order', 'Priority-Based Order'],
          correctIndex: 1,
          explanation: 'Stacks strictly follow Last-In, First-Out (LIFO). The element most recently added (pushed) is always the first one to be removed (popped).'
        },
        {
          id: 2,
          question: 'What is the time complexity to retrieve an element from a fixed-size array when given its index?',
          options: ['O(1) Constant Time', 'O(n) Linear Time', 'O(log n) Logarithmic Time', 'O(n²) Quadratic Time'],
          correctIndex: 0,
          explanation: 'Array elements reside in contiguous memory locations. The address is calculated instantaneously via Base Address + (Index * Element Size), running in O(1) constant time.'
        },
        {
          id: 3,
          question: 'In a standard queue data structure, what is the operation that removes the front item called?',
          options: ['Push', 'Enqueue', 'Dequeue', 'Peek'],
          correctIndex: 2,
          explanation: 'Dequeue is the operation that removes and returns the front item of a queue. Enqueue adds an item to the rear.'
        },
        {
          id: 4,
          question: 'What are the two primary components contained within every node of a singly linked list?',
          options: ['Key and Hash Value', 'Data payload and pointer to next node', 'Left child and right child pointers', 'Array index and capacity'],
          correctIndex: 1,
          explanation: 'Each node in a singly linked list contains a data payload and a single reference (pointer) directed to the subsequent node in the sequence.'
        },
        {
          id: 5,
          question: 'What is the worst-case time complexity of searching for an element in an unsorted array of size n?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctIndex: 2,
          explanation: 'In an unsorted array, linear search must examine every element sequentially until a match is found or the end is reached, requiring O(n) comparisons.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'Which traversal algorithm on a Binary Search Tree (BST) produces keys in strictly ascending sorted order?',
          options: ['Preorder Traversal (Root, Left, Right)', 'Inorder Traversal (Left, Root, Right)', 'Postorder Traversal (Left, Right, Root)', 'Level-Order Traversal (Breadth-First)'],
          correctIndex: 1,
          explanation: 'Inorder traversal visits the left subtree, then the root node, then the right subtree. Because of the BST invariant (Left < Root < Right), this yields keys in sorted ascending sequence.'
        },
        {
          id: 7,
          question: 'What is the primary operational prerequisite before Binary Search can be executed on a dataset?',
          options: ['The data must be stored in a linked list', 'The collection must be pre-sorted with random access capability', 'All values must be unique prime numbers', 'The data structure must use a hash function'],
          correctIndex: 1,
          explanation: 'Binary search requires random access into sorted elements to divide the search interval in half each step in O(log n) time.'
        },
        {
          id: 8,
          question: 'In hash tables, how does Separate Chaining resolve key collisions?',
          options: ['By probing the next sequential index in the array', 'By storing colliding entries in a linked list or bucket at that index', 'By recalculating a larger hash table immediately', 'By discarding the previous key to overwrite with the new one'],
          correctIndex: 1,
          explanation: 'Separate Chaining maintains an auxiliary data structure (typically a linked list or red-black tree) at each table bucket to hold multiple key-value pairs that hash to identical indices.'
        },
        {
          id: 9,
          question: 'What is the time complexity of prepending a new node to the head of a singly linked list with a known head pointer?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctIndex: 0,
          explanation: 'Inserting at the head merely requires setting the new node pointer to the current head and updating the head pointer. No existing elements need to be shifted, taking O(1) time.'
        },
        {
          id: 10,
          question: 'Which data structure is typically utilized internally to implement Breadth-First Search (BFS) on a graph?',
          options: ['Stack', 'Queue', 'Binary Max-Heap', 'Red-Black Tree'],
          correctIndex: 1,
          explanation: 'Breadth-First Search explores graph nodes level-by-level, which requires FIFO ordering provided by a Queue. Depth-First Search (DFS) uses a Stack.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'In the worst-case scenario where an unbalanced Binary Search Tree degenerates into a linear chain, what is the search time complexity?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctIndex: 2,
          explanation: 'When keys are inserted in sequential sorted order into a naive BST without rebalancing rotations, the tree degenerates into a linked list with height n, degrading search to O(n).'
        },
        {
          id: 12,
          question: 'What is the theoretical maximum number of nodes in a full binary tree of height h (where a root-only tree has height 0)?',
          options: ['2ʰ', '2ʰ⁺¹ - 1', '2ʰ - 1', 'h² + 1'],
          correctIndex: 1,
          explanation: 'A full binary tree has 2⁰ + 2¹ + 2² + ... + 2ʰ nodes. The sum of this geometric series is 2ʰ⁺¹ - 1.'
        },
        {
          id: 13,
          question: 'What is the amortized time complexity of appending an element to a dynamic array that doubles its capacity upon reaching capacity?',
          options: ['O(1) Amortized Time', 'O(n) Amortized Time', 'O(log n) Amortized Time', 'O(n²) Amortized Time'],
          correctIndex: 0,
          explanation: 'Although occasionally an append triggers an O(n) array copy and resize, the doubling strategy ensures that n appends cost at most 3n operations total, yielding an amortized cost of O(1) per append.'
        },
        {
          id: 14,
          question: 'What auxiliary space complexity is required by a standard out-of-place recursive Merge Sort algorithm on an array of size n?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 2,
          explanation: 'Merge Sort requires an auxiliary buffer array of size n to merge partitioned sub-arrays during the combine phase, leading to O(n) auxiliary space complexity.'
        },
        {
          id: 15,
          question: 'What structural invariant differentiates a Max-Heap from a Binary Search Tree (BST)?',
          options: ['A Max-Heap has no order between left and right children, only that a parent is greater than both children', 'A Max-Heap requires left child to be larger than right child', 'A Max-Heap cannot be represented inside an array', 'A Max-Heap requires every node to have two children'],
          correctIndex: 0,
          explanation: 'In a Max-Heap, the only requirement is the heap property: parent value >= children values. There is no horizontal left-versus-right ordering constraint, unlike a BST.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What fundamental rule distinguishes a Stack from a Queue?', back: 'A Stack follows LIFO (Last-In, First-Out), while a Queue follows FIFO (First-In, First-Out).' },
      { id: 2, front: 'Why does an Array offer O(1) random access by index?', back: 'Elements occupy contiguous memory blocks, allowing the CPU to calculate exact memory addresses in constant time: Base + (Index * Size).' },
      { id: 3, front: 'What traversal of a Binary Search Tree produces values in sorted ascending order?', back: 'Inorder Traversal: Left Subtree -> Root Node -> Right Subtree.' },
      { id: 4, front: 'What is a Hash Collision and how does Chaining resolve it?', back: 'A collision occurs when two distinct keys yield the same index. Chaining resolves it by maintaining a linked list of entries in that bucket.' },
      { id: 5, front: 'What is the primary memory drawback of Linked Lists compared to Arrays?', back: 'Linked lists incur pointer overhead (4 to 8 bytes per node) and suffer from poor CPU cache locality due to scattered heap allocation.' },
      { id: 6, front: 'What is the amortized cost of inserting into a dynamic array with doubling capacity?', back: 'O(1) amortized time per insertion, despite occasional O(n) resizing copies.' }
    ]
  },

  'operating-systems': {
    id: 'operating-systems',
    title: 'Operating Systems & Concurrency',
    category: 'Computer Systems',
    keywords: ['operating system', 'operating systems', 'os', 'process', 'processes', 'thread', 'threads', 'deadlock', 'scheduling', 'virtual memory', 'paging', 'semaphore', 'mutex', 'kernel', 'context switch'],
    summaries: {
      'Simple Explanation': [
        'An Operating System is the ultimate manager of a computer. Think of the computer hardware as a busy restaurant kitchen: the CPU is the chef, RAM is the prep table, and the hard drive is the pantry.',
        'A process is an entire cooking station with its own recipes, while threads are multiple assistant cooks sharing the same station and tools to work faster.',
        'Virtual memory gives every program the illusion of having a vast, private prep counter. When physical RAM runs out, the OS temporarily moves idle data out to the pantry (hard disk) through a technique called paging.',
        'Deadlock is a standoff where two chefs each hold one tool the other needs to finish, and neither is willing to let go. The OS uses strict scheduling and locks to prevent these standoffs.'
      ],
      'Exam-Focused': [
        'Process vs Thread: A Process possesses its own isolated virtual address space, file descriptors, and PCB. Threads within a process share the code, data, and heap segments but retain independent stacks, registers, and Program Counters.',
        'Coffman Conditions for Deadlock: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait. Breaking any one condition prevents deadlock.',
        'CPU Scheduling Algorithms: FCFS (non-preemptive, convoy effect), SJF/SRTF (provably optimal average waiting time), Round Robin (time quantum-based, preemptive, fair).',
        'Virtual Memory & Paging: Virtual addresses split into Page Number and Page Offset. The MMU and TLB translate virtual pages to physical frames. Page Fault occurs when a page is not resident in physical RAM.',
        'Synchronization Primitives: Mutex (binary locking mechanism with ownership), Counting Semaphore (integer signaling mechanism initialized to resource count).'
      ],
      'Detailed Notes': [
        'The kernel is the privileged core of an operating system executing in Ring 0 (supervisor mode). User applications execute in unprivileged Ring 3 and request kernel services exclusively via software interrupts or syscall instructions.',
        'During a Context Switch, the OS saves the executing thread CPU registers, stack pointer, and program counter into its Process/Thread Control Block (PCB/TCB), flushes or manages TLB entries, and loads the register state of the scheduled entity.',
        'Paging divides virtual memory into fixed-size units (pages, typically 4KB) mapped to physical frames. Multi-level page tables conserve memory by allocating second-level page tables only for populated virtual address regions. The Translation Lookaside Buffer (TLB) acts as a high-speed hardware cache for page table translations.',
        'Concurrency bugs manifest as race conditions when non-atomic read-modify-write sequences execute across preemptive threads. Mutual exclusion primitives enforce atomic critical section execution using hardware instructions such as Test-and-Set or Compare-And-Swap (CAS).'
      ]
    },
    takeaways: [
      'A process is an isolated execution environment; threads share memory within the same process.',
      'Deadlock requires four simultaneous conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
      'Virtual Memory allows execution of programs larger than physical RAM using paging and page replacement algorithms.',
      'The TLB (Translation Lookaside Buffer) speeds up virtual-to-physical address translation in hardware.',
      'Synchronization primitives (mutexes, semaphores) prevent race conditions in concurrent multi-threaded programs.'
    ],
    concepts: [
      { term: 'Process Control Block (PCB)', definition: 'A kernel data structure storing process state, registers, memory maps, priority, and I/O status.' },
      { term: 'Context Switch', definition: 'The computational process of storing the state of a CPU core and restoring another thread state to resume execution.' },
      { term: 'Page Fault', definition: 'A hardware interrupt raised by the MMU when a program accesses a virtual page not currently mapped in physical RAM.' },
      { term: 'Critical Section', definition: 'A code region that accesses shared resources and must not be executed concurrently by more than one thread.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'What is the primary architectural difference between a Process and a Thread?',
          options: ['Threads have their own separate private memory address space', 'Processes share the same heap and global variables', 'Threads within the same process share memory, while processes are isolated', 'Threads cannot run on multi-core processors'],
          correctIndex: 2,
          explanation: 'Threads share the code, data, and heap segments of their parent process, whereas distinct processes have completely isolated virtual address spaces.'
        },
        {
          id: 2,
          question: 'What hardware component accelerates virtual-to-physical memory address translation?',
          options: ['DMA Controller', 'Translation Lookaside Buffer (TLB)', 'ALU', 'GPU'],
          correctIndex: 1,
          explanation: 'The TLB is a high-speed associative hardware cache in the Memory Management Unit (MMU) that stores recent virtual-to-physical address mappings.'
        },
        {
          id: 3,
          question: 'Which CPU scheduling algorithm allocates a fixed slice of time (quantum) to each process in circular order?',
          options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
          correctIndex: 1,
          explanation: 'Round Robin assigns each ready process a fixed time slice (time quantum) in cyclic order, providing fair preemption.'
        },
        {
          id: 4,
          question: 'How many Coffman conditions must hold simultaneously for a system deadlock to occur?',
          options: ['Exactly 1', 'Exactly 2', 'Exactly 4', 'All 10'],
          correctIndex: 2,
          explanation: 'Deadlock requires all four Coffman conditions to hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
        },
        {
          id: 5,
          question: 'What event occurs when a CPU attempts to access a virtual memory page that is not currently loaded in physical RAM?',
          options: ['Segmentation Fault', 'Page Fault', 'Stack Overflow', 'Kernel Panic'],
          correctIndex: 1,
          explanation: 'A Page Fault is a hardware trap triggered by the MMU indicating the requested page must be loaded from secondary storage into physical RAM.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'What negative phenomenon can occur in First-Come, First-Served (FCFS) scheduling when a long CPU-bound process blocks short I/O-bound processes?',
          options: ['Starvation', 'Convoy Effect', 'Thrashing', 'Priority Inversion'],
          correctIndex: 1,
          explanation: 'The Convoy Effect occurs when short processes queue up behind a massive CPU-bound process, drastically lowering overall CPU and device utilization.'
        },
        {
          id: 7,
          question: 'What is the fundamental difference between a Mutex and a Counting Semaphore?',
          options: ['A Mutex has an ownership concept (only the locking thread can unlock it), while a semaphore is a signaling counter', 'Semaphores can only be used by one thread at a time', 'A Mutex can take any integer value', 'There is no functional difference'],
          correctIndex: 0,
          explanation: 'A Mutex is a locking mechanism with strict ownership: only the thread that acquired the mutex can release it. A Semaphore is an atomic integer counter used for signaling.'
        },
        {
          id: 8,
          question: 'What system condition is known as "Thrashing"?',
          options: ['When CPU registers overheat from infinite loops', 'When an OS spends more time swapping pages in and out of disk than executing instructions', 'When multiple processes continuously delete files concurrently', 'When a network buffer overflows'],
          correctIndex: 1,
          explanation: 'Thrashing occurs when total memory demand exceeds physical RAM, forcing the operating system into a continuous loop of page faults and disk I/O swapping.'
        },
        {
          id: 9,
          question: 'Which of the following is provably optimal in minimizing the average waiting time for a set of stationary processes?',
          options: ['First-Come, First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin with 100ms quantum', 'Priority Scheduling without preemption'],
          correctIndex: 1,
          explanation: 'Shortest Job First (SJF) is provably optimal for minimizing average waiting time because scheduling the shortest burst first clears waiting queues fastest.'
        },
        {
          id: 10,
          question: 'What problem does the Banker\'s Algorithm solve in operating systems?',
          options: ['Deadlock Avoidance by testing safe states before resource allocation', 'CPU clock synchronization', 'Virtual memory page replacement', 'Disk block defragmentation'],
          correctIndex: 0,
          explanation: 'Dijkstra\'s Banker\'s Algorithm avoids deadlock by simulating resource allocation for maximum possible claims to ensure the system remains in a safe state.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'What is Belady\'s Anomaly in the context of virtual memory page replacement?',
          options: ['More page faults occur when increasing the number of physical page frames under FIFO replacement', 'LRU page replacement causes memory corruption', 'Page frames get locked permanently during context switches', 'TLB hits drop to zero under multi-level paging'],
          correctIndex: 0,
          explanation: 'Belady\'s Anomaly is the counterintuitive phenomenon where increasing physical page frames can actually increase total page faults under FIFO replacement.'
        },
        {
          id: 12,
          question: 'How does Priority Inversion occur in concurrent real-time systems, and how is it resolved?',
          options: ['A low priority thread holds a lock needed by a high priority thread, resolved via Priority Inheritance Protocol', 'A thread priority drops automatically after 10ms', 'The OS scheduler crashes when priorities match', 'Threads starve due to equal quanta'],
          correctIndex: 0,
          explanation: 'Priority Inversion occurs when a medium priority thread preempts a low priority thread holding a lock required by a high priority thread. Priority Inheritance temporarily elevates the low thread priority.'
        },
        {
          id: 13,
          question: 'Why do operating systems use multi-level page tables instead of a single flat linear page table?',
          options: ['To avoid allocating memory for page table entries covering unmapped virtual memory spaces', 'To eliminate the need for an MMU', 'To make address translation slower but safer', 'To remove page faults entirely'],
          correctIndex: 0,
          explanation: 'In 64-bit architectures, a single linear page table would take petabytes of memory. Multi-level tables allocate intermediate tables only for active address regions.'
        },
        {
          id: 14,
          question: 'What low-level hardware atomic instruction is commonly leveraged by modern kernels to implement spinlocks and lock-free data structures?',
          options: ['Compare-And-Swap (CAS)', 'DMA Burst', 'Floating Point Division', 'Branch If Equal'],
          correctIndex: 0,
          explanation: 'Compare-And-Swap (CAS) atomically compares the contents of a memory location to a given value and, only if they match, modifies the contents to a new value.'
        },
        {
          id: 15,
          question: 'In a modern OS, what security mechanism prevents user-space applications from directly executing arbitrary kernel instructions?',
          options: ['Dual-mode CPU operation (User mode Ring 3 vs Kernel mode Ring 0)', 'Software anti-virus scans', 'Compiling code in JavaScript only', 'Restricting disk write access'],
          correctIndex: 0,
          explanation: 'Hardware-enforced dual-mode operation (e.g. Ring 0 supervisor mode vs Ring 3 user mode) traps privileged instructions, forcing user software to enter the kernel via controlled system calls.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What are the four Coffman conditions required for Deadlock?', back: '1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.' },
      { id: 2, front: 'What is the difference between a Process and a Thread?', back: 'Processes have independent virtual address spaces. Threads exist within a process and share memory (heap, data, code).' },
      { id: 3, front: 'What is a Page Fault?', back: 'A hardware interrupt generated when an executing program references a memory page that is not currently mapped in physical RAM.' },
      { id: 4, front: 'What is the purpose of the Translation Lookaside Buffer (TLB)?', back: 'A specialized hardware cache that speeds up virtual-to-physical address translations by caching page table entries.' },
      { id: 5, front: 'What is Thrashing in virtual memory?', back: 'A state where the system spends excessive time paging data to and from disk rather than executing actual program instructions.' },
      { id: 6, front: 'What is Priority Inversion and how is it solved?', back: 'When a low-priority thread holds a lock needed by a high-priority thread. Solved by Priority Inheritance (temporarily boosting the low thread).' }
    ]
  },

  'dbms': {
    id: 'dbms',
    title: 'Database Management Systems (DBMS)',
    category: 'Data Engineering',
    keywords: ['database', 'databases', 'dbms', 'sql', 'normalization', 'relational', 'acid', 'primary key', 'foreign key', 'transaction', 'indexing', 'b-tree', 'join', 'schema', 'concurrency control'],
    summaries: {
      'Simple Explanation': [
        'A Database Management System (DBMS) is an organized digital filing cabinet designed to store, manage, and retrieve information safely and quickly.',
        'Without a database, keeping records in loose spreadsheets leads to duplicate records, mismatched information, and lost updates when multiple people edit at once.',
        'Normalization is the process of organizing tables to eliminate redundant data. Think of it like organizing your closet: instead of throwing shirts and shoes in every drawer, you give each category its own neat drawer and label them with matching tags (foreign keys).',
        'Transactions guarantee that multiple related updates either all succeed together or leave the database completely untouched if something breaks midway—just like an ATM transferring money between bank accounts.'
      ],
      'Exam-Focused': [
        'ACID Properties of Transactions: Atomicity (All or Nothing via WAL), Consistency (Preserves schema constraints), Isolation (Concurrent transactions do not interfere), Durability (Committed changes survive system crashes).',
        'Relational Normalization Forms: 1NF (Atomic columns, no repeating groups), 2NF (1NF + no partial functional dependencies on composite keys), 3NF (2NF + no transitive dependencies), BCNF (Every determinant is a candidate key).',
        'Indexing & B+ Trees: B+ Trees store all actual record pointers in leaf nodes linked sequentially for range scans. Intermediate nodes store search keys. Time complexity for search, insert, and delete is O(log n).',
        'SQL Join Types: INNER JOIN (Matches in both), LEFT JOIN (All left + matching right), FULL OUTER JOIN (All rows from both tables).',
        'Concurrency Anomalies: Dirty Read (reading uncommitted data), Non-Repeatable Read (rereading row sees modified data), Phantom Read (rereading range sees newly inserted rows).'
      ],
      'Detailed Notes': [
        'A relational database management system enforces integrity constraints and relation schemas grounded in Codd relational algebra. Data storage engines manage page buffers in memory and sync dirty pages to disk utilizing Write-Ahead Logging (WAL) protocols to satisfy durability.',
        'Transactions operate under defined SQL Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Stricter isolation prevents anomalies such as dirty reads and phantom reads at the expense of throughput and lock contention.',
        'Two-Phase Locking (2PL) guarantees serializability through a growing phase (acquiring locks without releasing) and a shrinking phase (releasing locks without acquiring new ones). Strict 2PL holds exclusive locks until transaction commit to avoid cascading aborts.',
        'Query optimization translates declarative SQL queries into relational algebra trees, evaluating alternative execution plans (Index Scans vs Sequential Scans, Nested Loop vs Hash Joins) utilizing cost-based statistics.'
      ]
    },
    takeaways: [
      'ACID guarantees reliability: Atomicity, Consistency, Isolation, and Durability.',
      'Normalization (1NF -> 3NF -> BCNF) eliminates update anomalies and data redundancy.',
      'B+ Tree indexes enable rapid O(log n) lookups and efficient sequential range scans.',
      'Transactions prevent concurrent race conditions through serializability and locking protocols.',
      'Foreign keys enforce referential integrity between related relational tables.'
    ],
    concepts: [
      { term: 'ACID Properties', definition: 'A set of four guarantees (Atomicity, Consistency, Isolation, Durability) ensuring reliable database transaction processing.' },
      { term: 'Third Normal Form (3NF)', definition: 'A relational schema condition where every non-key attribute is non-transitively dependent on the primary key.' },
      { term: 'B+ Tree Index', definition: 'A self-balancing search tree data structure where all data pointers reside in doubly linked leaf nodes.' },
      { term: 'Write-Ahead Logging (WAL)', definition: 'A protocol ensuring transaction modifications are written to durable log files prior to applying them to data pages.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'What does the "A" in the ACID transaction properties stand for?',
          options: ['Availability', 'Atomicity', 'Authentication', 'Asynchrony'],
          correctIndex: 1,
          explanation: 'Atomicity ensures that all operations in a transaction execute to completion or none take effect ("all or nothing").'
        },
        {
          id: 2,
          question: 'Which SQL command is used to retrieve data from one or more database tables?',
          options: ['INSERT', 'UPDATE', 'SELECT', 'ALTER'],
          correctIndex: 2,
          explanation: 'The SELECT statement is the standard SQL DQL command used to query and extract data from database tables.'
        },
        {
          id: 3,
          question: 'What is a field in a relational table that uniquely identifies each record called?',
          options: ['Foreign Key', 'Primary Key', 'Composite Index', 'Secondary Key'],
          correctIndex: 1,
          explanation: 'A Primary Key is a column (or combination of columns) that uniquely identifies each individual row in a table and cannot contain NULL values.'
        },
        {
          id: 4,
          question: 'Which Normal Form requires eliminating repeating groups and ensuring all column values are atomic?',
          options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
          correctIndex: 0,
          explanation: 'First Normal Form (1NF) requires that each column contain only indivisible (atomic) values and that there are no repeating groups.'
        },
        {
          id: 5,
          question: 'What type of SQL join returns only the rows that have matching values in both tables?',
          options: ['LEFT JOIN', 'FULL OUTER JOIN', 'INNER JOIN', 'CROSS JOIN'],
          correctIndex: 2,
          explanation: 'An INNER JOIN selects records that have matching values in both participating tables, discarding non-matching rows.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'A table is in 2NF if it is in 1NF and what other condition is satisfied?',
          options: ['No transitive dependencies exist', 'No partial dependencies of non-key attributes on any candidate key exist', 'All determinants are candidate keys', 'No foreign keys exist'],
          correctIndex: 1,
          explanation: 'Second Normal Form (2NF) mandates that no non-prime attribute is functionally dependent on a proper subset of any candidate key (no partial dependency).'
        },
        {
          id: 7,
          question: 'Why are B+ Trees overwhelmingly preferred over standard Binary Search Trees for database table indexing on disk?',
          options: ['B+ Trees have a high branching factor that minimizes slow disk I/O reads, and leaf nodes form a linked list for range scans', 'B+ Trees consume zero disk memory', 'Binary search trees cannot store integers', 'B+ Trees execute strictly in O(1) time'],
          correctIndex: 0,
          explanation: 'B+ Trees have wide branching factors (hundreds of children per node), keeping tree height very low (3-4 levels) to minimize disk page fetches, with linked leaf nodes for rapid range scanning.'
        },
        {
          id: 8,
          question: 'What database concurrency phenomenon occurs when a transaction reads data that has been modified by another uncommitted transaction?',
          options: ['Phantom Read', 'Dirty Read', 'Non-Repeatable Read', 'Lost Update'],
          correctIndex: 1,
          explanation: 'A Dirty Read happens when Transaction A reads modifications made by Transaction B before Transaction B commits. If Transaction B rolls back, Transaction A holds invalid data.'
        },
        {
          id: 9,
          question: 'What does the Write-Ahead Logging (WAL) protocol require before a dirty data page can be written to disk?',
          options: ['The log record describing the update must be written to stable storage first', 'All user queries must be stopped', 'The database must reboot', 'The primary key index must be deleted'],
          correctIndex: 0,
          explanation: 'Write-Ahead Logging dictates that log records describing changes must be flushed to durable storage before the corresponding data pages are written to disk, ensuring crash recovery.'
        },
        {
          id: 10,
          question: 'What is the purpose of a Foreign Key constraint in a relational database?',
          options: ['To speed up full table scans', 'To enforce referential integrity between child and parent tables', 'To encrypt sensitive column values', 'To compress column data'],
          correctIndex: 1,
          explanation: 'A Foreign Key ensures referential integrity by requiring values in a child table column to match valid primary key values in the referenced parent table.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'What is the key differentiator between Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF)?',
          options: ['In BCNF, for every functional dependency X -> Y, X must be a superkey', 'BCNF permits transitive dependencies', '3NF requires fewer tables than 1NF', 'BCNF only applies to NoSQL databases'],
          correctIndex: 0,
          explanation: 'BCNF is a stricter version of 3NF. In BCNF, for every non-trivial functional dependency X -> Y, X must be a superkey. 3NF allows Y to be a prime attribute even if X is not a superkey.'
        },
        {
          id: 12,
          question: 'Under Two-Phase Locking (2PL), what behavior characterizes the "Shrinking Phase"?',
          options: ['The transaction may release existing locks but is strictly forbidden from acquiring any new locks', 'The database shrinks table file sizes on disk', 'The transaction acquires exclusive locks', 'Transactions are aborted to prevent deadlock'],
          correctIndex: 0,
          explanation: 'In 2PL, once a transaction releases its first lock, it enters the shrinking phase during which it cannot acquire any further locks, mathematically guaranteeing conflict serializability.'
        },
        {
          id: 13,
          question: 'Which SQL Transaction Isolation Level provides the highest degree of data consistency by preventing dirty reads, non-repeatable reads, and phantom reads?',
          options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
          correctIndex: 3,
          explanation: 'Serializable is the highest isolation level. It guarantees execution equivalent to serial, non-overlapping transaction execution, eliminating all read and write anomalies.'
        },
        {
          id: 14,
          question: 'What query execution operator is typically chosen by a cost-based query optimizer when joining two massive unsorted tables without indexes?',
          options: ['Index Nested Loop Join', 'Hash Join', 'Cartesian Product', 'Full Sequential Scan'],
          correctIndex: 1,
          explanation: 'When joining large unsorted tables without indexes, a Hash Join builds an in-memory hash table on the smaller table and probes it with the larger table in linear O(N+M) time.'
        },
        {
          id: 15,
          question: 'What is a "Clustered Index" in relational database storage engines like MySQL InnoDB?',
          options: ['An index that determines the physical ordering of actual table data rows on disk pages', 'An index that only indexes foreign keys', 'A secondary index stored in cloud servers', 'An index that cannot be searched with B+ trees'],
          correctIndex: 0,
          explanation: 'A Clustered Index dictates the physical on-disk arrangement of data rows. Leaf nodes of a clustered index contain the full table row data, so a table can have only one clustered index.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What does ACID stand for in database systems?', back: 'Atomicity (all-or-nothing), Consistency (preserves rules), Isolation (independent runs), Durability (persists crashes).' },
      { id: 2, front: 'What is the difference between 1NF, 2NF, and 3NF?', back: '1NF: Atomic values. 2NF: 1NF + no partial dependencies on composite keys. 3NF: 2NF + no transitive dependencies.' },
      { id: 3, front: 'Why do databases use B+ Tree indexes instead of Hash indexes for general tables?', back: 'B+ Trees support efficient sequential range queries (e.g., WHERE age BETWEEN 20 AND 30), whereas Hash indexes only support exact equality lookups.' },
      { id: 4, front: 'What is a Dirty Read anomaly?', back: 'When a transaction reads uncommitted data written by another concurrent transaction that later rolls back.' },
      { id: 5, front: 'What is Write-Ahead Logging (WAL)?', back: 'A durability protocol requiring log records describing changes to be flushed to disk before actual data pages are modified on disk.' },
      { id: 6, front: 'What is a Clustered Index?', back: 'An index that defines the physical on-disk storage order of the actual table rows; leaf pages store the complete record data.' }
    ]
  },

  'computer-networks': {
    id: 'computer-networks',
    title: 'Computer Networks & Internet Protocols',
    category: 'Infrastructure & Communications',
    keywords: ['computer network', 'computer networks', 'cn', 'network', 'networks', 'tcp', 'udp', 'ip', 'osi', 'routing', 'dns', 'http', 'https', 'socket', 'packet', 'router', 'switch', 'subnet'],
    summaries: {
      'Simple Explanation': [
        'A computer network is an interconnected highway system that allows digital devices to send messages to one another worldwide.',
        'The OSI 7-Layer model organizes network tasks into neat layers. Think of sending a physical letter: writing your thoughts is the Application layer, putting it in an envelope with an address is the Network layer, and the postal truck driving down the street is the Physical layer.',
        'TCP is like certified mail with return receipts: it guarantees every single packet arrives in exact order without loss. UDP is like a live radio broadcast: it streams fast without checking if you missed a word, making it ideal for video streaming and multiplayer gaming.',
        'DNS (Domain Name System) is the internet contact book: it translates human-friendly names like google.com into numerical IP addresses like 142.250.190.46.'
      ],
      'Exam-Focused': [
        'OSI 7-Layer Hierarchy: 7. Application (HTTP, DNS), 6. Presentation (TLS, ASCII), 5. Session (Sockets), 4. Transport (TCP, UDP), 3. Network (IP, Routers), 2. Data Link (Ethernet, MAC, Switches), 1. Physical (Cables, Bits).',
        'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK establishes a connection. Connection termination uses 4-way FIN -> ACK -> FIN -> ACK.',
        'TCP vs UDP: TCP is connection-oriented, reliable, ordered, with flow control (sliding window) and congestion control. UDP is connectionless, unreliable, low-overhead, without congestion control.',
        'IPv4 vs IPv6: IPv4 uses 32-bit addresses (approx 4.3 billion addresses). IPv6 uses 128-bit addresses represented in hexadecimal.',
        'Subnetting & CIDR: Subnet masks partition IP addresses into Network ID and Host ID. A /24 mask provides 256 addresses (254 usable hosts).'
      ],
      'Detailed Notes': [
        'Modern network communication operates primarily on the TCP/IP suite. Packets undergo encapsulation as they traverse down the stack: application payloads receive transport headers (TCP segments), network headers (IP packets), and data link headers/trailers (Ethernet frames).',
        'Transmission Control Protocol (TCP) achieves reliability over unreliable IP networks using sequence numbers, cumulative acknowledgments, and retransmission timers. Flow control uses sliding receive windows, while congestion control relies on Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery algorithms.',
        'Routing algorithms determine optimal paths across Autonomous Systems (AS). Interior Gateway Protocols like OSPF use Dijkstra link-state calculations, while the Border Gateway Protocol (BGP) manages global inter-AS path-vector routing.',
        'Hypertext Transfer Protocol Secure (HTTPS) secures HTTP over Transport Layer Security (TLS 1.3), establishing confidentiality, integrity, and server authentication through asymmetric key exchange and symmetric AES session encryption.'
      ]
    },
    takeaways: [
      'The OSI model standardizes communication into 7 distinct abstraction layers.',
      'TCP guarantees reliable, ordered packet delivery; UDP provides low-latency, connectionless delivery.',
      'TCP 3-Way Handshake (SYN, SYN-ACK, ACK) reliably establishes transport sessions.',
      'DNS translates human-readable domain names into routable numerical IP addresses.',
      'Routers operate at Layer 3 (IP routing); Switches operate at Layer 2 (MAC address forwarding).'
    ],
    concepts: [
      { term: 'TCP 3-Way Handshake', definition: 'The connection establishment procedure where client and server synchronize sequence numbers using SYN, SYN-ACK, and ACK packets.' },
      { term: 'Sliding Window Protocol', definition: 'A flow control mechanism enabling a sender to transmit multiple packets before awaiting an acknowledgment.' },
      { term: 'Domain Name System (DNS)', definition: 'A distributed hierarchical database that resolves human domain names into numerical IP addresses.' },
      { term: 'CIDR Subnetting', definition: 'Classless Inter-Domain Routing notation (e.g. /24) designating the prefix bits allocated to the network address.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'Which layer of the OSI 7-Layer model is responsible for end-to-end reliable transport of data?',
          options: ['Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Data Link Layer (Layer 2)', 'Physical Layer (Layer 1)'],
          correctIndex: 1,
          explanation: 'The Transport Layer (Layer 4), home to TCP and UDP, provides end-to-end communication, segmentation, and reliability services.'
        },
        {
          id: 2,
          question: 'What is the primary role of the Domain Name System (DNS)?',
          options: ['To encrypt email messages', 'To translate human-readable domain names into IP addresses', 'To assign MAC addresses to network cards', 'To route packets through fiber cables'],
          correctIndex: 1,
          explanation: 'DNS functions as the internet address directory, translating human-friendly names (like example.com) into numerical IP addresses.'
        },
        {
          id: 3,
          question: 'What three packets comprise the standard TCP connection establishment handshake?',
          options: ['SYN -> SYN-ACK -> ACK', 'PING -> PONG -> OK', 'HELLO -> ACK -> DATA', 'CONNECT -> ACCEPT -> READY'],
          correctIndex: 0,
          explanation: 'The TCP 3-way handshake begins with client SYN, followed by server SYN-ACK, and concluded by client ACK.'
        },
        {
          id: 4,
          question: 'How many bits are in a standard IPv4 address?',
          options: ['16 bits', '32 bits', '64 bits', '128 bits'],
          correctIndex: 1,
          explanation: 'An IPv4 address consists of 32 bits, divided into 4 octets (e.g., 192.168.1.1). IPv6 addresses use 128 bits.'
        },
        {
          id: 5,
          question: 'Which protocol is connectionless and prioritizes low latency over guaranteed delivery?',
          options: ['TCP', 'FTP', 'UDP', 'SMTP'],
          correctIndex: 2,
          explanation: 'User Datagram Protocol (UDP) is connectionless and does not guarantee packet delivery, making it ideal for real-time gaming and streaming.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'At which OSI layer do standard network Routers primarily operate?',
          options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
          correctIndex: 2,
          explanation: 'Routers operate at Layer 3 (Network Layer) because they inspect IP destination addresses and make forwarding decisions across subnetworks.'
        },
        {
          id: 7,
          question: 'How many usable host IP addresses are available in a standard /24 IPv4 subnet?',
          options: ['256', '254', '255', '128'],
          correctIndex: 1,
          explanation: 'A /24 subnet has 2⁸ = 256 total addresses. However, 2 addresses are reserved (the Network address and the Broadcast address), leaving 254 usable hosts.'
        },
        {
          id: 8,
          question: 'What mechanism in TCP prevents a fast sender from overwhelming a slow receiver buffer?',
          options: ['Congestion Control', 'Flow Control (Receive Window)', 'Checksum Verification', 'Three-Way Handshake'],
          correctIndex: 1,
          explanation: 'TCP Flow Control uses the advertised Receive Window (rwnd) field in the TCP header to tell the sender how much buffer space remains on the receiver.'
        },
        {
          id: 9,
          question: 'What is the role of the Address Resolution Protocol (ARP)?',
          options: ['Resolving an IP address to a physical MAC address on a local network', 'Resolving domain names to IP addresses', 'Assigning dynamic IP addresses to new devices', 'Encrypting HTTP requests'],
          correctIndex: 0,
          explanation: 'ARP translates an internet layer IP address into a link-layer MAC address on a local area network (LAN).'
        },
        {
          id: 10,
          question: 'What default port is utilized for encrypted HTTPS web traffic?',
          options: ['Port 80', 'Port 22', 'Port 443', 'Port 8080'],
          correctIndex: 2,
          explanation: 'HTTPS operates over TCP port 443 by default. Unencrypted HTTP operates over port 80.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'In TCP congestion control, what algorithm is triggered immediately after three duplicate ACKs are received?',
          options: ['Slow Start (reset cwnd to 1 MSS)', 'Fast Retransmit & Fast Recovery', 'Exponential Backoff', 'Selective Dropping'],
          correctIndex: 1,
          explanation: 'Receiving three duplicate ACKs signals packet loss without total timeout. TCP executes Fast Retransmit (retransmits the missing segment) and enters Fast Recovery rather than resetting to Slow Start.'
        },
        {
          id: 12,
          question: 'What global inter-domain routing protocol operates between distinct Autonomous Systems (AS) across the internet backbone?',
          options: ['OSPF', 'BGP (Border Gateway Protocol)', 'RIP', 'IS-IS'],
          correctIndex: 1,
          explanation: 'Border Gateway Protocol (BGP) is the standardized path-vector exterior gateway protocol that manages routing tables between autonomous systems across the internet.'
        },
        {
          id: 13,
          question: 'What is the function of the Time-To-Live (TTL) field in an IPv4 packet header?',
          options: ['To measure network round-trip latency', 'To prevent packets from circulating endlessly in routing loops by decrementing at each hop', 'To timestamp packet creation', 'To specify cache duration on client browsers'],
          correctIndex: 1,
          explanation: 'The TTL field is decremented by 1 at every router hop. When TTL reaches 0, the packet is discarded and an ICMP Time Exceeded message is sent back, preventing routing loops.'
        },
        {
          id: 14,
          question: 'What major performance improvement was introduced in HTTP/2 compared to HTTP/1.1?',
          options: ['Full binary framing and stream multiplexing over a single TCP connection', 'Switching from TCP to UDP', 'Eliminating SSL/TLS encryption', 'Restricting URLs to 256 characters'],
          correctIndex: 0,
          explanation: 'HTTP/2 replaced text protocols with binary framing and enabled full bidirectional multiplexing of requests and responses over a single TCP connection, eliminating head-of-line blocking.'
        },
        {
          id: 15,
          question: 'In symmetric vs asymmetric cryptography utilized in TLS handshakes, why is asymmetric encryption only used during the handshake phase?',
          options: ['Asymmetric encryption is computationally expensive, so it is only used to securely exchange a symmetric session key', 'Asymmetric encryption is insecure for data transfer', 'Symmetric keys cannot encrypt strings', 'Browser standards forbid symmetric encryption'],
          correctIndex: 0,
          explanation: 'Asymmetric cryptography (RSA/ECC) requires intensive mathematical modular operations. TLS uses it only to authenticate and exchange a symmetric key; high-speed symmetric encryption (AES) handles data.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What are the 7 layers of the OSI model from bottom to top?', back: '1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application.' },
      { id: 2, front: 'What packets make up the TCP 3-Way Handshake?', back: 'SYN (from client) -> SYN-ACK (from server) -> ACK (from client).' },
      { id: 3, front: 'What is the difference between TCP Flow Control and Congestion Control?', back: 'Flow Control protects the receiving endpoint buffer (rwnd); Congestion Control protects the intermediate network routers (cwnd).' },
      { id: 4, front: 'What does the Address Resolution Protocol (ARP) do?', back: 'Translates a known Network Layer IP address into a physical Data Link Layer MAC address on a local subnet.' },
      { id: 5, front: 'Why does IPv4 have a Time-To-Live (TTL) field?', back: 'To prevent packets from circulating indefinitely in routing loops; each router decrements TTL by 1 and drops it if it hits 0.' },
      { id: 6, front: 'What is the difference between TCP and UDP?', back: 'TCP is connection-oriented, reliable, and ordered. UDP is connectionless, lightweight, and unordered without retransmissions.' }
    ]
  },

  'javascript': {
    id: 'javascript',
    title: 'JavaScript Fundamentals & ES6+',
    category: 'Web Technology',
    keywords: ['javascript', 'js', 'ecmascript', 'es6', 'closure', 'closures', 'event loop', 'promise', 'promises', 'async', 'await', 'hoisting', 'scope', 'prototype', 'dom', 'functions', 'vanilla'],
    summaries: {
      'Simple Explanation': [
        'JavaScript is the programming language that breathes life into web pages, transforming static text into interactive applications.',
        'A closure is like a backpack that a function carries wherever it goes. Even when a function runs far away from where it was born, it still remembers and can access all the variables that were in its original room.',
        'The Event Loop is like a diligent restaurant waiter. The Call Stack is the chef who cooks one dish at a time. When an order takes time (like fetching data from a server), the waiter hands it to the kitchen timer (Web APIs) and keeps serving other tables. Once ready, the order is placed on the counter (callback queue) to be delivered as soon as the chef is free.',
        'Promises and async/await are ways to handle tasks that take time without freezing the entire browser screen. Instead of waiting around doing nothing, a Promise promises to notify you when the work is fulfilled or rejected.'
      ],
      'Exam-Focused': [
        'Execution Context & Hoisting: `var` declarations are hoisted and initialized to `undefined`. `let` and `const` are hoisted into a Temporal Dead Zone (TDZ) and cannot be accessed before lexical declaration.',
        'Closures & Lexical Scope: A closure is a function bundled together with references to its surrounding lexical environment. Functions retain access to outer variables even after the outer function has returned.',
        'Event Loop Architecture: Call Stack (single-threaded synchronous execution) -> Web APIs (Timers, Fetch, DOM Events) -> Microtask Queue (Promises, queueMicrotask) -> Macrotask Queue (setTimeout, setInterval). Microtasks always drain completely before the next macrotask.',
        'Prototypes & Inheritance: Every JavaScript object possesses an internal `[[Prototype]]` link. Property lookups traverse the prototype chain up to `Object.prototype` then `null`.',
        'Equality Operators: `==` performs type coercion prior to comparison; `===` performs strict equality without coercion (comparing both type and value).'
      ],
      'Detailed Notes': [
        'JavaScript is an interpreted, single-threaded, garbage-collected language with first-class functions. JavaScript engines (like Google V8) compile source code into bytecode and optimize hot functions via Just-In-Time (JIT) compilation.',
        'Variables declared with `let` and `const` are block-scoped, whereas `var` is function-scoped. Accessing a `let` variable prior to its initializer throws a ReferenceError due to the Temporal Dead Zone.',
        'Asynchronous concurrency relies on the Event Loop model. When an asynchronous operation completes, its handler is enqueued in either the Microtask Queue (Promises) or Macrotask Queue (Timers). Between macrotasks, the engine drains all microtasks and triggers browser rendering updates.',
        'The `this` keyword is evaluated dynamically at call time based on invocation context: default binding (global/undefined in strict mode), implicit binding (calling object), explicit binding (`call`, `apply`, `bind`), or new binding (constructor functions). Arrow functions do not bind `this`; they capture it lexically.'
      ]
    },
    takeaways: [
      'Closures allow functions to retain access to variables from their enclosing lexical scope.',
      'The Event Loop manages non-blocking concurrency via Call Stack, Microtasks, and Macrotasks.',
      'Microtasks (Promises) execute with higher priority than Macrotasks (setTimeout).',
      '`let` and `const` provide block scoping and prevent access during the Temporal Dead Zone.',
      'Arrow functions do not bind their own `this`; they inherit it lexically from surrounding scope.'
    ],
    concepts: [
      { term: 'Closure', definition: 'The combination of a function and the lexical environment within which that function was declared.' },
      { term: 'Event Loop', definition: 'The runtime coordination mechanism that dispatches callbacks from queues to the single call stack.' },
      { term: 'Temporal Dead Zone (TDZ)', definition: 'The phase between entering block scope and variable declaration where accessing let/const throws ReferenceError.' },
      { term: 'Prototype Chain', definition: 'The series of linked objects traversed when searching for properties not found directly on an object.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'What is a Closure in JavaScript?',
          options: ['A function that has access to variables from its outer lexical scope even after the outer function has returned', 'A syntax error that closes the browser tab', 'A method to convert objects to JSON strings', 'A built-in CSS animation property'],
          correctIndex: 0,
          explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing it to remember outer variables.'
        },
        {
          id: 2,
          question: 'What is the key difference between the == and === comparison operators in JavaScript?',
          options: ['== performs type coercion before comparing, while === compares both value and type without coercion', '=== only works on numbers', '== is faster than ===', 'There is no difference in modern ES6'],
          correctIndex: 0,
          explanation: '`==` allows loose equality with automatic type conversion (e.g., `5 == "5"` is true), whereas `===` requires both type and value to match identically.'
        },
        {
          id: 3,
          question: 'Which keyword defines a block-scoped constant variable that cannot be reassigned?',
          options: ['var', 'let', 'const', 'static'],
          correctIndex: 2,
          explanation: '`const` declares block-scoped variables whose identifier cannot be reassigned (though properties of objects held in const can still be mutated).'
        },
        {
          id: 4,
          question: 'What is the default return value of a JavaScript function that does not contain a return statement?',
          options: ['null', 'undefined', '0', 'false'],
          correctIndex: 1,
          explanation: 'In JavaScript, functions without an explicit return statement implicitly return `undefined`.'
        },
        {
          id: 5,
          question: 'Which array method creates a new array populated with the results of calling a provided function on every element?',
          options: ['forEach()', 'map()', 'filter()', 'reduce()'],
          correctIndex: 1,
          explanation: '`Array.prototype.map()` executes a transform function on each item and returns a brand new array of equal length.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'In the JavaScript Event Loop, which queue has strict priority over setTimeout macrotask callbacks?',
          options: ['Microtask Queue (Promise callbacks)', 'DOM Event Queue', 'Rendering Queue', 'Idle Callback Queue'],
          correctIndex: 0,
          explanation: 'The Microtask Queue (used by Promise `.then()` and `queueMicrotask`) has priority and is drained completely before the event loop picks the next macrotask.'
        },
        {
          id: 7,
          question: 'What happens when accessing a variable declared with `let` before its declaration line in the code?',
          options: ['It returns `undefined` due to variable hoisting', 'It throws a ReferenceError because the variable is in the Temporal Dead Zone (TDZ)', 'It assigns the value null', 'It returns 0'],
          correctIndex: 1,
          explanation: 'While `let` declarations are hoisted, they are not initialized. Accessing them before initialization triggers a ReferenceError due to the Temporal Dead Zone.'
        },
        {
          id: 8,
          question: 'How does an ES6 Arrow Function determine the value of the `this` keyword?',
          options: ['It binds `this` to the object that called it', 'It binds `this` lexically from the enclosing execution context', 'It resets `this` to window/global', 'Arrow functions cannot use `this`'],
          correctIndex: 1,
          explanation: 'Arrow functions do not define their own `this` binding; they inherit `this` lexically from the surrounding scope in which they were created.'
        },
        {
          id: 9,
          question: 'What will `typeof null` evaluate to in JavaScript due to a legacy language bug?',
          options: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctIndex: 2,
          explanation: 'In the original JavaScript implementation, values were represented with type tags. The type tag for objects was 0, and `null` was represented as NULL pointer (0x00), causing `typeof null === "object"`.'
        },
        {
          id: 10,
          question: 'What method can be used to prevent adding new properties to an object and prevent modifying existing property descriptors?',
          options: ['Object.freeze()', 'Object.seal()', 'Object.preventExtensions()', 'Object.lock()'],
          correctIndex: 0,
          explanation: '`Object.freeze()` makes an object completely immutable: no new properties can be added, existing properties cannot be removed or modified, and prototypes cannot be changed.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'What is the output of the following code snippet?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
          options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
          correctIndex: 1,
          explanation: '1 and 4 are synchronous. The Promise callback is placed in the Microtask queue, executing before the setTimeout callback in the Macrotask queue. Result: 1, 4, 3, 2.'
        },
        {
          id: 12,
          question: 'How does JavaScript prototypal inheritance resolve a property lookup on an object when the property does not exist on the object itself?',
          options: ['It traverses the internal `[[Prototype]]` link sequentially until found or until reaching `null`', 'It immediately throws an error', 'It searches all global variables', 'It re-runs the constructor function'],
          correctIndex: 0,
          explanation: 'If a property is not found on the instance, the engine traverses the prototype chain (`object.__proto__`) upwards until it either finds the property or hits `null`.'
        },
        {
          id: 13,
          question: 'What is the practical difference between `Function.prototype.call()` and `Function.prototype.apply()`?',
          options: ['`call()` passes arguments comma-separated, while `apply()` accepts arguments as an array', '`apply()` is asynchronous while `call()` is synchronous', '`call()` cannot bind `this`', 'There is no difference'],
          correctIndex: 0,
          explanation: 'Both methods invoke functions with an explicit `this` binding, but `call()` takes arguments individually (`fn.call(ctx, arg1, arg2)`), while `apply()` takes an array (`fn.apply(ctx, [arg1, arg2])`).'
        },
        {
          id: 14,
          question: 'What design pattern does JavaScript use to implement modular encapsulation prior to native ES modules?',
          options: ['Immediately Invoked Function Expression (IIFE) creating private scope via closures', 'Direct DOM scripting', 'Eval statements', 'Global namespace variables'],
          correctIndex: 0,
          explanation: 'Before ES6 modules, developers utilized IIFEs (e.g., `(function(){ ... })()`) to create private lexical scopes, exporting only public APIs via closures.'
        },
        {
          id: 15,
          question: 'What is the result of evaluating `[1, 2, 3] + [4, 5, 6]` in JavaScript?',
          options: ['[1, 2, 3, 4, 5, 6]', '"1,2,34,5,6"', 'NaN', 'TypeError'],
          correctIndex: 1,
          explanation: 'The `+` operator on objects triggers `ToPrimitive()`. Arrays convert to strings ("1,2,3" and "4,5,6") and string concatenation results in `"1,2,34,5,6"`.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What is a Closure in JavaScript?', back: 'A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables after the outer function returns.' },
      { id: 2, front: 'What is the Temporal Dead Zone (TDZ)?', back: 'The state between entering scope and variable declaration where let and const variables cannot be accessed without throwing a ReferenceError.' },
      { id: 3, front: 'What is the difference between Microtasks and Macrotasks?', back: 'Microtasks (Promises) have higher priority and drain completely before the Event Loop executes the next Macrotask (setTimeout/setInterval).' },
      { id: 4, front: 'How does an arrow function handle the `this` keyword?', back: 'Arrow functions do not bind their own `this`; they inherit it lexically from the enclosing scope.' },
      { id: 5, front: 'What is the difference between `==` and `===`?', back: '`==` performs implicit type coercion before comparison; `===` strictly checks both value and type without coercion.' },
      { id: 6, front: 'What is the Prototype Chain?', back: 'A sequence of linked objects traversed by JavaScript when looking up properties or methods that do not exist directly on an instance.' }
    ]
  },

  'general-demo': {
    id: 'general-demo',
    title: 'Computer Science & Software Foundations',
    category: 'General Demonstration Dataset',
    keywords: ['*'],
    summaries: {
      'Simple Explanation': [
        'Welcome to StudyMate AI! This is our general demonstration study material, selected to demonstrate interactive learning features for your custom study notes.',
        'At its core, computer science is about solving complex problems by breaking them into manageable, step-by-step instructions called algorithms.',
        'Computers operate using layers of abstraction. At the lowest layer, billions of transistors flip between electrical on and off states (1 and 0). High-level programming languages turn human logic into those binary electrical signals.',
        'Whether you study software engineering, biology, or economics, structured thinking—understanding inputs, transformations, and outputs—is the universal engine of learning.'
      ],
      'Exam-Focused': [
        'Demonstration Notice: This sample dataset illustrates Phase 2 functionality for notes that do not match predefined topics.',
        'Core Foundations: Problem decomposition, algorithmic thinking, data structures, and computational complexity govern software performance.',
        'Asymptotic Analysis: Big-O notation characterizes upper-bound execution time and space requirements as problem size N scales.',
        'System Architecture: The von Neumann model balances CPU instruction fetch-decode-execute cycles with memory latency and secondary storage bandwidth.',
        'Modularity & Separation of Concerns: Designing systems with isolated responsibilities minimizes coupling and prevents cascading failures.'
      ],
      'Detailed Notes': [
        'Notice: You are currently viewing the General Demonstration Dataset. Real-time customized AI generation tailored dynamically to any arbitrary topic will be integrated in Phase 3 via Google Gemini.',
        'Computational systems abstract physical semiconductor behavior into logical gate architectures (AND, OR, NOT), which compose arithmetic logic units (ALU), memory registers, and instruction decoders under the von Neumann model.',
        'Algorithmic analysis evaluates worst-case, average-case, and best-case performance using asymptotic bounds. Choosing appropriate data representations and algorithms determines whether a problem scales linearly O(n) or becomes intractable O(2ⁿ).',
        'Modern engineering practices emphasize modular architectures, idempotency, fault tolerance, and comprehensive automated testing to build maintainable, resilient digital systems.'
      ]
    },
    takeaways: [
      'This general demonstration dataset showcases Phase 2 interactive summaries, quizzes, and flashcards.',
      'Abstraction hides low-level mechanical complexity behind simple, powerful interfaces.',
      'Asymptotic notation (Big-O) measures how algorithmic demands scale with growing input sizes.',
      'The von Neumann architecture links CPU cores with memory via system buses.',
      'Dynamic AI synthesis for arbitrary custom notes will connect in Phase 3.'
    ],
    concepts: [
      { term: 'Abstraction', definition: 'The computational practice of hiding implementation complexity behind clean, intuitive conceptual interfaces.' },
      { term: 'Algorithm', definition: 'A finite, unambiguous sequence of instructions designed to solve a specific class of problems.' },
      { term: 'Big-O Notation', definition: 'Mathematical notation characterizing the upper bound limiting growth rate of a function as inputs expand.' },
      { term: 'von Neumann Architecture', definition: 'A computer design architecture featuring a processing unit, control unit, and unified memory for data and instructions.' }
    ],
    quizQuestions: {
      'Easy': [
        {
          id: 1,
          question: 'What is the primary definition of an Algorithm in computer science?',
          options: ['A step-by-step set of unambiguous instructions to solve a problem', 'A physical computer hardware cable', 'A programming language compiler', 'A digital image file format'],
          correctIndex: 0,
          explanation: 'An algorithm is a finite, ordered sequence of well-defined steps designed to perform a computation or solve a specific problem.'
        },
        {
          id: 2,
          question: 'What is the binary numbering system composed of?',
          options: ['Digits 0 through 9', 'Only the digits 0 and 1', 'Letters A through F', 'Decimal fractions'],
          correctIndex: 1,
          explanation: 'The binary system is a base-2 numerical system using only two states: 0 and 1, representing low and high voltages in computer transistors.'
        },
        {
          id: 3,
          question: 'What software engineering principle states that each module or class should have only one reason to change?',
          options: ['Single Responsibility Principle (SRP)', 'Multiple Inheritance', 'Global State Access', 'Premature Optimization'],
          correctIndex: 0,
          explanation: 'The Single Responsibility Principle (the S in SOLID) dictates that a software component should have exactly one responsibility and one reason to change.'
        },
        {
          id: 4,
          question: 'What metric describes how long an algorithm takes to run relative to the input size n?',
          options: ['Time Complexity', 'Screen Resolution', 'Network Bandwidth', 'File Compression Ratio'],
          correctIndex: 0,
          explanation: 'Time Complexity quantifies the amount of computer time taken by an algorithm to run as a function of the length of the input string or array.'
        },
        {
          id: 5,
          question: 'What does CPU stand for?',
          options: ['Central Processing Unit', 'Computer Power Utility', 'Core Program User', 'Central Performance Uplink'],
          correctIndex: 0,
          explanation: 'CPU stands for Central Processing Unit, the primary hardware chip that executes program instructions in a computer.'
        }
      ],
      'Medium': [
        {
          id: 6,
          question: 'What is the primary benefit of Abstraction in software architecture?',
          options: ['It hides internal complexity behind simple interfaces, reducing cognitive load', 'It increases the execution speed of machine code', 'It eliminates the need for software testing', 'It turns all variables into global constants'],
          correctIndex: 0,
          explanation: 'Abstraction allows engineers to work with high-level conceptual models without needing to manage the overwhelming minutiae of underlying mechanics.'
        },
        {
          id: 7,
          question: 'Which algorithmic complexity represents the slowest growth rate among the following as n scales to millions?',
          options: ['O(log n)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
          correctIndex: 0,
          explanation: 'Logarithmic time O(log n) grows extremely slowly: doubling input size n only adds a single constant unit of work.'
        },
        {
          id: 8,
          question: 'In software design, what is "Tight Coupling" and why is it generally discouraged?',
          options: ['When components depend heavily on each other internal details, making changes fragile', 'When data cables are connected securely', 'When code runs too quickly on modern CPUs', 'When variables are given short names'],
          correctIndex: 0,
          explanation: 'Tight coupling creates interdependencies where modifying one component inadvertently breaks others. Loose coupling is favored for maintainability.'
        },
        {
          id: 9,
          question: 'What is the purpose of Version Control Systems like Git in software development?',
          options: ['Tracking historical revisions, managing branches, and coordinating collaborative changes', 'Compiling code into machine binaries', 'Hosting live websites on the internet', 'Formatting CSS styling'],
          correctIndex: 0,
          explanation: 'Git records changes to files over time so you can recall specific versions, isolate experimental branches, and collaborate safely across engineering teams.'
        },
        {
          id: 10,
          question: 'What is an "Idempotent" operation in software engineering?',
          options: ['An operation that produces the same result no matter how many times it is applied', 'An operation that runs infinitely without stopping', 'A function that takes zero parameters', 'A database query that deletes all tables'],
          correctIndex: 0,
          explanation: 'An idempotent operation (like HTTP GET or PUT) can be executed multiple times without changing the result beyond the initial application.'
        }
      ],
      'Hard': [
        {
          id: 11,
          question: 'What is the Halting Problem, famously proven undecidable by Alan Turing in 1936?',
          options: ['No general algorithm can exist that decides whether an arbitrary program will halt or run forever', 'Computers cannot calculate prime numbers above 1 billion', 'Programs always run out of memory eventually', 'Sorting algorithms cannot run faster than O(n log n)'],
          correctIndex: 0,
          explanation: 'Turing proved through self-referential paradox that it is mathematically impossible to write a general algorithm that determines whether any arbitrary program halts.'
        },
        {
          id: 12,
          question: 'In distributed computing, what does Brewer\'s CAP Theorem state about networked systems?',
          options: ['A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance', 'All databases must use SQL', 'Networks never lose packets in local centers', 'CPUs cannot run parallel threads'],
          correctIndex: 0,
          explanation: 'The CAP theorem proves that in the presence of a network partition (P), a distributed data store must choose between Consistency (C) and Availability (A).'
        },
        {
          id: 13,
          question: 'What is the core distinction between Compiled languages (C, Rust) and Interpreted languages (Python, JavaScript)?',
          options: ['Compiled languages translate source code directly to native machine instructions prior to execution; interpreted languages execute via an interpreter VM', 'Interpreted languages do not use memory', 'Compiled languages cannot run on computers', 'There is no execution speed difference'],
          correctIndex: 0,
          explanation: 'Compiled languages convert code directly to CPU machine code ahead of time. Interpreted languages parse and execute statements on-the-fly via a runtime environment.'
        },
        {
          id: 14,
          question: 'What is Amdahl\'s Law in computer architecture and parallel computing?',
          options: ['A formula predicting the theoretical maximum speedup of a program using multiple processors, limited by its sequential portion', 'A law stating computer transistors double every two years', 'A rule defining the maximum size of RAM', 'A rule governing network cable length'],
          correctIndex: 0,
          explanation: 'Amdahl\'s Law demonstrates that the speedup of a program from parallel computing is strictly bounded by the fraction of the algorithm that must run sequentially.'
        },
        {
          id: 15,
          question: 'What is a Race Condition in concurrent software systems?',
          options: ['A flaw where output depends on the non-deterministic timing or interleaving of uncontrollable concurrent events', 'When two CPUs race to finish boot sequences', 'When network bandwidth exceeds hard drive speed', 'An algorithm designed to find fastest routes'],
          correctIndex: 0,
          explanation: 'A race condition occurs when multiple threads or processes read and write shared data without proper synchronization, making correctness dependent on unpredictable execution timing.'
        }
      ]
    },
    flashcards: [
      { id: 1, front: 'What is Abstraction in Computer Science?', back: 'Hiding internal technical complexity behind clean, intuitive conceptual interfaces to simplify problem solving.' },
      { id: 2, front: 'What is an Algorithm?', back: 'A finite, unambiguous sequence of step-by-step instructions designed to perform a computation or solve a problem.' },
      { id: 3, front: 'What is Big-O notation used for?', back: 'To classify and describe the upper-bound asymptotic growth rate of an algorithm execution time or memory as input size N scales.' },
      { id: 4, front: 'What is the von Neumann Architecture?', back: 'The foundational computer architecture model featuring a central processing unit (CPU) and unified memory holding both instructions and data.' },
      { id: 5, front: 'What is Idempotency in software engineering?', back: 'The property of an operation that produces the exact same outcome regardless of whether it is executed once or repeated multiple times.' },
      { id: 6, front: 'What is Phase 2 of StudyMate AI?', back: 'A functional frontend study workspace powered by rich local sample datasets, featuring summaries, 5-question quizzes, and interactive 3D flashcards.' }
    ]
  }
};

/* ============================================================================
   2. APPLICATION STATE CONTAINER
   ============================================================================ */

/**
 * Central client-side state container.
 */
const AppState = {
  currentSection: 'dashboard',
  currentTab: 'summary',
  theme: 'light',
  maxNoteLength: 10000,
  preferences: {
    defaultDifficulty: 'Medium',
    defaultSummaryStyle: 'Simple Explanation',
    flashcardAnimation: 'flip'
  },
  apiKey: '',
  apiKeyConfigured: false,
  isGenerating: false,

  // In-memory session statistics (Starts at 0, updated in real time)
  stats: {
    sessionsCount: 0,
    quizzesCount: 0,
    quizScores: [],
    averageScore: 0
  },

  // Current active generated study material
  activeMaterial: null,

  // Interactive Quiz state
  quiz: {
    questions: [],
    currentIndex: 0,
    selectedAnswers: [null, null, null, null, null],
    isSubmitted: false,
    score: null,
    attemptRecorded: false
  },

  // Interactive Flashcards state
  flashcards: {
    deck: [],
    currentIndex: 0,
    isFlipped: false,
    classifications: {} // Map of card id -> 'known' | 'not-known'
  }
};

/**
 * Section Metadata for sticky top navigation bar
 */
const SECTION_METADATA = {
  dashboard: {
    title: 'Dashboard',
    description: 'Create and manage your AI-powered study materials'
  },
  history: {
    title: 'Study History',
    description: 'Review previous study sessions and practice runs'
  },
  progress: {
    title: 'Learning Analytics',
    description: 'Track your quiz accuracy, study velocity, and topic mastery'
  },
  settings: {
    title: 'Application Settings',
    description: 'Manage your AI API connection, appearance theme, and study preferences'
  },
  about: {
    title: 'About StudyMate AI',
    description: 'Project overview, technology stack, and engineering roadmap'
  }
};

const STORAGE_KEYS = {
  THEME: 'studymate_theme',
  PREFERENCES: 'studymate_preferences',
  API_KEY: 'studymate_api_key'
};

/* ============================================================================
   3. INITIALIZATION BOOTSTRAPPER
   ============================================================================ */

function initializeApp() {
  initializeTheme();
  initializeNavigation();
  initializeMobileMenu();
  initializeTabs();
  initializeCharacterCounter();
  initializeStudyForm();
  initializeSettings();
  initializeConfirmationDialogs();
  updateDashboardStats();

  handleInitialHash();
}

function handleInitialHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash && SECTION_METADATA[hash]) {
    switchSection(hash);
  }
}

/* ============================================================================
   4. THEME SWITCHER & LOCAL STORAGE
   ============================================================================ */

function initializeTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  } catch (err) {
    console.warn('LocalStorage restricted:', err);
  }

  if (savedTheme === 'light' || savedTheme === 'dark') {
    AppState.theme = savedTheme;
  } else {
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    AppState.theme = systemPrefersDark ? 'dark' : 'light';
  }

  applyTheme(AppState.theme, false);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {}
    });
  }
}

function applyTheme(theme, persist = true) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const nextThemeLabel = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggleBtn.setAttribute('aria-label', nextThemeLabel);
    themeToggleBtn.setAttribute('title', nextThemeLabel);
  }

  const lightRadio = document.getElementById('theme-radio-light');
  const darkRadio = document.getElementById('theme-radio-dark');
  const lightCard = document.getElementById('theme-card-light');
  const darkCard = document.getElementById('theme-card-dark');
  const themeStatusIndicator = document.getElementById('theme-status-indicator');

  if (lightRadio && darkRadio) {
    lightRadio.checked = (theme === 'light');
    darkRadio.checked = (theme === 'dark');

    if (lightCard && darkCard) {
      lightCard.classList.toggle('selected', theme === 'light');
      darkCard.classList.toggle('selected', theme === 'dark');
    }
  }

  if (themeStatusIndicator) {
    themeStatusIndicator.textContent = `Current: ${theme === 'light' ? 'Light' : 'Dark'} Mode (Persisted in LocalStorage)`;
  }

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (err) {
      console.warn('Unable to persist theme:', err);
    }
  }
}

function toggleTheme() {
  const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme, true);
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Theme`, 'info');
}

/* ============================================================================
   5. NAVIGATION & SECTION SWITCHING
   ============================================================================ */

function initializeNavigation() {
  const navButtons = document.querySelectorAll('.nav-link[data-section]');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetSection = button.getAttribute('data-section');
      if (targetSection) {
        switchSection(targetSection);
        closeMobileMenu();
      }
    });
  });

  const brandHomeLink = document.getElementById('brand-home-link');
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection('dashboard');
      closeMobileMenu();
    });
  }

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && SECTION_METADATA[hash]) {
      switchSection(hash, false);
    } else {
      switchSection('dashboard', false);
    }
  });
}

function switchSection(sectionId, updateHistory = true) {
  if (!SECTION_METADATA[sectionId]) {
    sectionId = 'dashboard';
  }

  AppState.currentSection = sectionId;

  const navButtons = document.querySelectorAll('.nav-link[data-section]');
  navButtons.forEach((btn) => {
    const isTarget = btn.getAttribute('data-section') === sectionId;
    btn.classList.toggle('active', isTarget);
    if (isTarget) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  const sections = document.querySelectorAll('.app-section');
  sections.forEach((section) => {
    const isTarget = section.id === `section-${sectionId}`;
    if (isTarget) {
      section.removeAttribute('hidden');
      section.classList.add('active');
    } else {
      section.setAttribute('hidden', '');
      section.classList.remove('active');
    }
  });

  const titleEl = document.getElementById('current-section-title');
  const descEl = document.getElementById('current-section-desc');
  if (titleEl && descEl && SECTION_METADATA[sectionId]) {
    titleEl.textContent = SECTION_METADATA[sectionId].title;
    descEl.textContent = SECTION_METADATA[sectionId].description;
  }

  if (updateHistory) {
    history.pushState(null, '', `#${sectionId}`);
  }

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================================
   6. MOBILE MENU DRAWER
   ============================================================================ */

function initializeMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const backdrop = document.getElementById('drawer-backdrop');

  if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');

  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');

  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ============================================================================
   7. WORKSPACE TABS COMPONENT
   ============================================================================ */

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');

  tabButtons.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetTab = tabButtons[(index + 1) % tabButtons.length];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetTab = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetTab = tabButtons[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        targetTab = tabButtons[tabButtons.length - 1];
      }

      if (targetTab) {
        targetTab.focus();
        activateTab(targetTab);
      }
    });
  });
}

function activateTab(activeTab) {
  const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');
  const tabPanels = document.querySelectorAll('.tab-panel[role="tabpanel"]');
  const targetPanelId = activeTab.getAttribute('aria-controls');

  tabButtons.forEach((btn) => {
    const isTarget = (btn === activeTab);
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    btn.setAttribute('tabindex', isTarget ? '0' : '-1');
  });

  tabPanels.forEach((panel) => {
    const isTarget = (panel.id === targetPanelId);
    if (isTarget) {
      panel.removeAttribute('hidden');
      panel.classList.add('active');
    } else {
      panel.setAttribute('hidden', '');
      panel.classList.remove('active');
    }
  });

  AppState.currentTab = targetPanelId ? targetPanelId.replace('panel-', '') : 'summary';
}

function switchTabByName(tabName) {
  const targetTabBtn = document.getElementById(`tab-${tabName}`);
  if (targetTabBtn) {
    activateTab(targetTabBtn);
  }
}

/* ============================================================================
   8. CHARACTER COUNTER & INPUT VALIDATION
   ============================================================================ */

function initializeCharacterCounter() {
  const notesInput = document.getElementById('notes-input');
  const charCountEl = document.getElementById('char-count');
  const counterContainer = document.getElementById('char-counter-display');
  const validationAlert = document.getElementById('input-error-alert');

  if (!notesInput || !charCountEl) return;

  const updateCounter = () => {
    let currentLength = notesInput.value.length;

    if (currentLength > AppState.maxNoteLength) {
      notesInput.value = notesInput.value.slice(0, AppState.maxNoteLength);
      currentLength = AppState.maxNoteLength;
    }

    charCountEl.textContent = currentLength.toLocaleString();

    if (counterContainer) {
      counterContainer.classList.toggle('warning', currentLength >= 9000 && currentLength < AppState.maxNoteLength);
      counterContainer.classList.toggle('limit-reached', currentLength >= AppState.maxNoteLength);
    }

    if (currentLength > 0 && validationAlert && !validationAlert.hasAttribute('hidden')) {
      validationAlert.setAttribute('hidden', '');
    }
  };

  notesInput.addEventListener('input', updateCounter);
  notesInput.addEventListener('paste', () => setTimeout(updateCounter, 10));
}

function validateStudyInput() {
  const notesInput = document.getElementById('notes-input');
  const validationAlert = document.getElementById('input-error-alert');
  const validationText = document.getElementById('input-error-text');

  if (!notesInput) return false;

  const content = notesInput.value.trim();

  if (!content) {
    if (validationAlert && validationText) {
      validationText.textContent = 'Please paste or type study notes before generating materials.';
      validationAlert.removeAttribute('hidden');
    }
    notesInput.focus();
    return false;
  }

  if (content.length < 15) {
    if (validationAlert && validationText) {
      validationText.textContent = 'Notes are too brief. Please enter at least 15 characters of study material.';
      validationAlert.removeAttribute('hidden');
    }
    notesInput.focus();
    return false;
  }

  if (validationAlert) {
    validationAlert.setAttribute('hidden', '');
  }
  return true;
}

/* ============================================================================
   9. AI INTEGRATION & STUDY MATERIAL GENERATION ENGINE
   ============================================================================ */

/**
 * Builds a structured, strict prompt instructing Google Gemini 1.5 Flash
 * to transform notes into summaries, quizzes, and flashcards formatted as JSON.
 * @param {string} topic 
 * @param {string} notes 
 * @param {string} difficulty 
 * @param {string} summaryStyle 
 * @returns {string}
 */
function buildStudyPrompt(topic, notes, difficulty, summaryStyle) {
  const effectiveTopic = (topic && topic.trim()) ? topic.trim() : 'Core Notes Overview';

  return `You are StudyMate AI, an expert educational tutor and curriculum designer.
Analyze the student notes provided below and generate comprehensive, high-quality study materials strictly following the specified parameters.

### INPUT PARAMETERS:
- Topic: ${effectiveTopic}
- Quiz Difficulty Level: ${difficulty}
- Summary Style: ${summaryStyle}

### STUDENT NOTES:
"""
${notes.trim()}
"""

### REQUIREMENTS:
1. SUMMARY:
   - "paragraphs": Array of 3 to 5 coherent, well-structured paragraphs explaining the topic based on the student's notes, written strictly in the requested style:
     * Simple Explanation: intuitive analogies, relatable metaphors, and clear plain-language descriptions.
     * Exam-Focused: high-yield facts, bullet-points embedded in sentences, formulas, and critical test takeaways.
     * Detailed Notes: in-depth academic rigor, foundational principles, mechanisms, and thorough context.
   - "takeaways": Array of 4 to 6 concise, high-impact key takeaways.
   - "concepts": Array of 3 to 6 key terms and definitions formatted as objects: [{"term": "...", "definition": "..."}].

2. MULTIPLE-CHOICE QUIZ:
   - "quiz": Array of EXACTLY 5 multiple-choice questions matching the requested "${difficulty}" difficulty level:
     * Easy: foundational recall, core terms, direct definitions.
     * Medium: application, distinctions, understanding cause-and-effect.
     * Hard: analytical reasoning, edge cases, synthesis, nuanced distinctions.
   - Each question must be an object with:
     * "id": integer (1 to 5)
     * "question": string with the question prompt
     * "options": array of EXACTLY 4 plausible strings
     * "correctIndex": integer between 0 and 3 indicating the index of the correct option
     * "explanation": clear educational explanation of why the correct option is right and the others are incorrect.

3. FLASHCARDS:
   - "flashcards": Array of AT LEAST 6 interactive flashcards for active recall and spaced repetition.
   - Each flashcard must be an object with:
     * "id": integer (1 to n)
     * "front": concise prompt, question, or term
     * "back": accurate, clear answer or explanation

### OUTPUT FORMAT:
Output MUST be valid JSON and NOTHING ELSE. Do not include markdown code fences (like \`\`\`json). Return ONLY the raw JSON object conforming to this schema:
{
  "title": "${effectiveTopic}",
  "summary": {
    "paragraphs": ["..."],
    "takeaways": ["..."],
    "concepts": [{"term": "...", "definition": "..."}]
  },
  "quiz": [
    {
      "id": 1,
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0,
      "explanation": "..."
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "...",
      "back": "..."
    }
  ]
}`;
}

/**
 * Extracts raw text from Gemini API response candidates.
 * @param {Object} data 
 * @returns {string}
 */
function extractGeminiResponse(data) {
  if (!data || !data.candidates || !data.candidates.length) {
    if (data && data.promptFeedback && data.promptFeedback.blockReason) {
      throw new Error(`Content was blocked by safety filters: ${data.promptFeedback.blockReason}`);
    }
    throw new Error('No response candidates returned by Gemini API.');
  }

  const candidate = data.candidates[0];
  if (candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Generation stopped due to Gemini safety policies.');
    }
  }

  const parts = candidate.content && candidate.content.parts;
  if (!parts || !parts.length || !parts[0].text) {
    throw new Error('Gemini API returned an empty text response.');
  }

  return parts[0].text;
}

/**
 * Parses raw AI response text, stripping markdown code fences if present.
 * @param {string} rawText 
 * @returns {Object}
 */
function parseStudyMaterialJSON(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        throw new Error('Failed to parse AI response as valid JSON: ' + err.message);
      }
    }
    throw new Error('Failed to parse AI response as valid JSON: ' + err.message);
  }
}

/**
 * Validates the schema and completeness of parsed AI study material.
 * Ensures summary paragraphs, 5 quiz questions with 4 options each, and at least 6 flashcards.
 * @param {Object} data 
 * @returns {Object} Validated and normalized data
 */
function validateStudyMaterial(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('AI response structure is not a valid JSON object.');
  }

  if (!data.title || typeof data.title !== 'string') {
    data.title = 'AI Study Notes';
  }

  if (!data.summary || typeof data.summary !== 'object') {
    throw new Error('AI response is missing the required "summary" section.');
  }

  if (!Array.isArray(data.summary.paragraphs) || data.summary.paragraphs.length === 0) {
    throw new Error('AI response is missing summary paragraphs.');
  }

  data.summary.paragraphs = data.summary.paragraphs.map(p => String(p).trim()).filter(Boolean);
  if (data.summary.paragraphs.length === 0) {
    throw new Error('Summary paragraphs are empty.');
  }

  if (!Array.isArray(data.summary.takeaways) || data.summary.takeaways.length === 0) {
    throw new Error('AI response is missing key takeaways.');
  }
  data.summary.takeaways = data.summary.takeaways.map(t => String(t).trim()).filter(Boolean);

  if (Array.isArray(data.summary.concepts)) {
    data.summary.concepts = data.summary.concepts
      .filter(c => c && typeof c === 'object' && c.term && c.definition)
      .map(c => ({ term: String(c.term).trim(), definition: String(c.definition).trim() }));
  } else {
    data.summary.concepts = [];
  }

  if (!Array.isArray(data.quiz) || data.quiz.length < 5) {
    throw new Error(`AI generated an incomplete quiz (${data.quiz ? data.quiz.length : 0}/5 questions).`);
  }

  const validatedQuiz = [];
  for (let i = 0; i < 5; i++) {
    const q = data.quiz[i];
    if (!q || typeof q !== 'object') {
      throw new Error(`Quiz question ${i + 1} is invalid.`);
    }
    if (!q.question || typeof q.question !== 'string') {
      throw new Error(`Quiz question ${i + 1} is missing a question prompt.`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Quiz question ${i + 1} must have exactly 4 options.`);
    }
    const correctIdx = Number(q.correctIndex);
    if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3 || !Number.isInteger(correctIdx)) {
      throw new Error(`Quiz question ${i + 1} has an invalid answer index (${q.correctIndex}). Must be 0, 1, 2, or 3.`);
    }

    validatedQuiz.push({
      id: i + 1,
      question: String(q.question).trim(),
      options: q.options.map(opt => String(opt).trim()),
      correctIndex: correctIdx,
      explanation: q.explanation ? String(q.explanation).trim() : 'Correct answer verified from reference notes.'
    });
  }
  data.quiz = validatedQuiz;

  if (!Array.isArray(data.flashcards) || data.flashcards.length < 6) {
    throw new Error(`AI generated fewer than 6 flashcards (${data.flashcards ? data.flashcards.length : 0} returned).`);
  }

  const validatedCards = [];
  for (let i = 0; i < data.flashcards.length; i++) {
    const c = data.flashcards[i];
    if (!c || typeof c !== 'object') continue;
    const front = c.front ? String(c.front).trim() : '';
    const back = c.back ? String(c.back).trim() : '';
    if (front && back) {
      validatedCards.push({
        id: i + 1,
        front,
        back
      });
    }
  }

  if (validatedCards.length < 6) {
    throw new Error(`Only ${validatedCards.length} valid flashcards generated; at least 6 required.`);
  }
  data.flashcards = validatedCards;

  return data;
}

/**
 * Dispatches an asynchronous request to Google Gemini API with timeout and error handling.
 * @param {string} topic 
 * @param {string} notes 
 * @param {string} difficulty 
 * @param {string} summaryStyle 
 * @param {string} apiKey 
 * @returns {Promise<Object>} Validated study material object
 */
async function requestStudyMaterial(topic, notes, difficulty, summaryStyle, apiKey) {
  const prompt = buildStudyPrompt(topic, notes, difficulty, summaryStyle);
  const endpoint = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: GEMINI_CONFIG.temperature,
      maxOutputTokens: GEMINI_CONFIG.maxOutputTokens
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_CONFIG.requestTimeoutMs);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI request timed out after 60 seconds. Please check your network connection or try shorter notes.');
    }
    throw new Error(`Network error connecting to Gemini API: ${err.message || 'Check your connection'}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errDetail = '';
    try {
      const errJson = await response.json();
      if (errJson && errJson.error && errJson.error.message) {
        errDetail = `: ${errJson.error.message}`;
      }
    } catch (_) {}

    switch (response.status) {
      case 400:
        throw new Error(`Invalid request or invalid API key (HTTP 400)${errDetail}. Please verify your key at aistudio.google.com.`);
      case 401:
      case 403:
        throw new Error(`API key authorization failed (HTTP ${response.status})${errDetail}. Ensure your Google Gemini key has active permissions.`);
      case 404:
        throw new Error(`Gemini model endpoint not found (HTTP 404)${errDetail}.`);
      case 429:
        throw new Error(`Gemini rate limit or quota exceeded (HTTP 429)${errDetail}. Please wait a moment before trying again.`);
      case 500:
      case 503:
        throw new Error(`Gemini service temporarily unavailable (HTTP ${response.status})${errDetail}. Please retry shortly.`);
      default:
        throw new Error(`Gemini API request failed with status ${response.status}${errDetail}`);
    }
  }

  const responseData = await response.json();
  const rawText = extractGeminiResponse(responseData);
  const parsed = parseStudyMaterialJSON(rawText);
  return validateStudyMaterial(parsed);
}

function initializeStudyForm() {
  const form = document.getElementById('study-input-form');
  const clearBtn = document.getElementById('btn-clear-input');
  const demoBtn = document.getElementById('btn-demo-mode');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGenerateClick();
    });
  }

  if (demoBtn) {
    demoBtn.addEventListener('click', handleDemoModeClick);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearClick);
  }
}

/**
 * Matches user topic and notes text against predefined knowledge datasets.
 * Returns the matched dataset or falls back to the general demonstration dataset.
 * @param {string} topicText 
 * @param {string} notesText 
 * @returns {Object}
 */
function getSampleStudyMaterial(topicText, notesText) {
  const topicQuery = (topicText || '').toLowerCase().trim();
  const notesQuery = (notesText || '').toLowerCase().trim();
  const combinedText = `${topicQuery} ${notesQuery}`;

  const datasetKeys = ['data-structures', 'operating-systems', 'dbms', 'computer-networks', 'javascript'];

  // 1. Direct match on Topic field
  for (const key of datasetKeys) {
    const dataset = SAMPLE_STUDY_DATASETS[key];
    const hasTopicMatch = dataset.keywords.some((kw) => topicQuery.includes(kw));
    if (hasTopicMatch) {
      return { ...dataset, isGenericDemo: false };
    }
  }

  // 2. Secondary match on Notes content
  for (const key of datasetKeys) {
    const dataset = SAMPLE_STUDY_DATASETS[key];
    const hasNotesMatch = dataset.keywords.some((kw) => combinedText.includes(kw));
    if (hasNotesMatch) {
      return { ...dataset, isGenericDemo: false };
    }
  }

  // 3. Fallback to General Demonstration dataset
  const fallback = SAMPLE_STUDY_DATASETS['general-demo'];
  return {
    ...fallback,
    isGenericDemo: true,
    userCustomTopic: topicText.trim() ? topicText.trim() : 'General Notes'
  };
}

/**
 * Primary generation handler using live Google Gemini AI.
 * Validates inputs, verifies API key, triggers fetch, and renders results.
 */
async function handleGenerateClick() {
  if (AppState.isGenerating) return;

  const isValid = validateStudyInput();
  if (!isValid) return;

  const apiKey = getAPIKey();
  if (!apiKey) {
    showModal({
      title: 'Gemini API Key Required',
      message: 'To generate live study materials using Google Gemini, please enter your API key in Settings.\n\nYou can also click "Try Demo Mode" on the dashboard to test the app immediately with sample data.',
      confirmText: 'Go to Settings',
      cancelText: 'Stay on Dashboard',
      iconType: 'info',
      onConfirm: () => {
        switchSection('settings');
        const keyInput = document.getElementById('api-key-input');
        if (keyInput) keyInput.focus();
      }
    });
    return;
  }

  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');
  const userTopic = topicInput && topicInput.value.trim() ? topicInput.value.trim() : '';
  const userNotes = notesInput ? notesInput.value.trim() : '';

  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
  const difficulty = selectedDifficulty ? selectedDifficulty.value : AppState.preferences.defaultDifficulty;

  const selectedStyle = document.querySelector('input[name="summaryStyle"]:checked');
  const summaryStyle = selectedStyle ? selectedStyle.value : AppState.preferences.defaultSummaryStyle;

  // Set loading state
  AppState.isGenerating = true;
  const generateBtn = document.getElementById('btn-generate');
  const generateText = document.getElementById('btn-generate-text');
  const demoBtn = document.getElementById('btn-demo-mode');

  let spinnerEl = null;
  if (generateBtn) {
    generateBtn.disabled = true;
    spinnerEl = document.createElement('span');
    spinnerEl.className = 'btn-spinner';
    spinnerEl.setAttribute('aria-hidden', 'true');
    generateBtn.prepend(spinnerEl);
  }
  if (generateText) {
    generateText.textContent = 'Generating with AI...';
  }
  if (demoBtn) {
    demoBtn.disabled = true;
  }

  try {
    const validatedData = await requestStudyMaterial(userTopic, userNotes, difficulty, summaryStyle, apiKey);

    // Set Active Material
    AppState.activeMaterial = {
      id: 'ai-' + Date.now(),
      displayTitle: validatedData.title || (userTopic || 'Study Notes'),
      baseTitle: validatedData.title || (userTopic || 'Study Notes'),
      category: 'AI Generated',
      difficulty: difficulty,
      style: summaryStyle,
      isAI: true,
      isGenericDemo: false,
      summaryParagraphs: validatedData.summary.paragraphs,
      takeaways: validatedData.summary.takeaways,
      concepts: validatedData.summary.concepts || []
    };

    // Set Active Quiz
    AppState.quiz = {
      questions: validatedData.quiz.map(q => ({ ...q })),
      currentIndex: 0,
      selectedAnswers: [null, null, null, null, null],
      isSubmitted: false,
      score: null,
      attemptRecorded: false
    };

    // Set Active Flashcards
    AppState.flashcards = {
      deck: validatedData.flashcards.map(c => ({ ...c })),
      currentIndex: 0,
      isFlipped: false,
      classifications: {}
    };

    // Update Statistics
    AppState.stats.sessionsCount += 1;
    updateDashboardStats();

    // Render Views
    renderSummary();
    renderQuiz();
    renderFlashcards();

    // Switch to Summary Tab
    switchTabByName('summary');

    showToast('AI study material generated successfully!', 'success');

    // Scroll workspace into view
    const workspaceCard = document.querySelector('.workspace-card');
    if (workspaceCard) {
      workspaceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    console.error('AI Generation Error:', err);
    showModal({
      title: 'AI Generation Failed',
      message: err.message || 'An unexpected error occurred while communicating with Google Gemini.',
      confirmText: 'Review Settings',
      cancelText: 'Dismiss',
      isDanger: false,
      iconType: 'warning',
      onConfirm: () => {
        switchSection('settings');
      }
    });
    showToast(err.message || 'AI Generation failed', 'error');
  } finally {
    AppState.isGenerating = false;
    if (spinnerEl && spinnerEl.parentNode) {
      spinnerEl.parentNode.removeChild(spinnerEl);
    }
    if (generateBtn) generateBtn.disabled = false;
    if (generateText) generateText.textContent = 'Generate with AI';
    if (demoBtn) demoBtn.disabled = false;
  }
}

/**
 * Explicit demo mode handler using curated local sample datasets.
 * Does not require an API key or active network connection.
 */
function handleDemoModeClick() {
  if (AppState.isGenerating) return;

  const isValid = validateStudyInput();
  if (!isValid) return;

  AppState.isGenerating = true;

  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');
  const userTopic = topicInput && topicInput.value.trim() ? topicInput.value.trim() : '';
  const userNotes = notesInput ? notesInput.value.trim() : '';

  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
  const difficulty = selectedDifficulty ? selectedDifficulty.value : AppState.preferences.defaultDifficulty;

  const selectedStyle = document.querySelector('input[name="summaryStyle"]:checked');
  const summaryStyle = selectedStyle ? selectedStyle.value : AppState.preferences.defaultSummaryStyle;

  // Retrieve matching dataset
  const dataset = getSampleStudyMaterial(userTopic, userNotes);

  // Setup Active Material State
  AppState.activeMaterial = {
    id: dataset.id,
    displayTitle: dataset.isGenericDemo && dataset.userCustomTopic ? dataset.userCustomTopic : dataset.title,
    baseTitle: dataset.title,
    category: dataset.category,
    difficulty: difficulty,
    style: summaryStyle,
    isAI: false,
    isGenericDemo: dataset.isGenericDemo,
    summaryParagraphs: dataset.summaries[summaryStyle] || dataset.summaries['Simple Explanation'],
    takeaways: dataset.takeaways,
    concepts: dataset.concepts
  };

  // Setup Active Quiz State (Exactly 5 questions for selected difficulty)
  const quizPool = dataset.quizQuestions[difficulty] || dataset.quizQuestions['Medium'];
  AppState.quiz = {
    questions: quizPool.map((q) => ({ ...q })),
    currentIndex: 0,
    selectedAnswers: [null, null, null, null, null],
    isSubmitted: false,
    score: null,
    attemptRecorded: false
  };

  // Setup Active Flashcards State
  AppState.flashcards = {
    deck: dataset.flashcards.map((c) => ({ ...c })),
    currentIndex: 0,
    isFlipped: false,
    classifications: {}
  };

  // Update In-Memory Statistics
  AppState.stats.sessionsCount += 1;
  updateDashboardStats();

  // Render all three active views
  renderSummary();
  renderQuiz();
  renderFlashcards();

  // Switch to Summary Tab as designated landing view
  switchTabByName('summary');

  // Notify user
  showToast('Loaded sample study material (Demo Mode).', 'info');

  AppState.isGenerating = false;

  // Smoothly scroll workspace into view
  const workspaceCard = document.querySelector('.workspace-card');
  if (workspaceCard) {
    workspaceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Handles clearing inputs with confirmation.
 */
function handleClearClick() {
  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');

  const hasTopic = topicInput && topicInput.value.trim().length > 0;
  const hasNotes = notesInput && notesInput.value.trim().length > 0;

  if (!hasTopic && !hasNotes) {
    showToast('Input fields are already empty', 'info');
    return;
  }

  showModal({
    title: 'Clear Study Input?',
    message: 'Are you sure you want to clear your topic and notes? Unsaved text will be removed.',
    confirmText: 'Clear All',
    cancelText: 'Keep Notes',
    isDanger: true,
    iconType: 'warning',
    onConfirm: () => {
      clearStudyInput();
      showToast('Study input cleared', 'info');
    }
  });
}

function clearStudyInput() {
  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');
  const charCountEl = document.getElementById('char-count');
  const counterContainer = document.getElementById('char-counter-display');
  const validationAlert = document.getElementById('input-error-alert');

  if (topicInput) topicInput.value = '';
  if (notesInput) notesInput.value = '';
  if (charCountEl) charCountEl.textContent = '0';

  if (counterContainer) {
    counterContainer.classList.remove('warning', 'limit-reached');
  }

  if (validationAlert) {
    validationAlert.setAttribute('hidden', '');
  }

  if (topicInput) topicInput.focus();
}

/* ============================================================================
   10. SUMMARY RENDERING & ACTIONS (COPY & DOWNLOAD)
   ============================================================================ */

function renderSummary() {
  const emptyState = document.getElementById('summary-empty-state');
  const contentView = document.getElementById('summary-content-view');

  if (!emptyState || !contentView || !AppState.activeMaterial) return;

  emptyState.setAttribute('hidden', '');
  contentView.removeAttribute('hidden');
  contentView.innerHTML = '';

  const mat = AppState.activeMaterial;

  // 1. Toolbar (Badges & Action Buttons)
  const toolbar = document.createElement('div');
  toolbar.className = 'summary-toolbar';

  const metaBadges = document.createElement('div');
  metaBadges.className = 'summary-meta-badges';

  const sourceBadge = document.createElement('span');
  sourceBadge.className = 'badge badge-accent';
  if (mat.isAI) {
    sourceBadge.textContent = 'AI Generated (Gemini 1.5 Flash)';
  } else {
    sourceBadge.textContent = mat.isGenericDemo
      ? 'Demo Mode — General Demonstration Dataset'
      : 'Demo Mode — Sample Study Material';
  }
  metaBadges.appendChild(sourceBadge);

  const styleBadge = document.createElement('span');
  styleBadge.className = 'badge badge-subtle';
  styleBadge.textContent = `Style: ${mat.style}`;
  metaBadges.appendChild(styleBadge);

  const diffBadge = document.createElement('span');
  diffBadge.className = 'badge badge-subtle';
  diffBadge.textContent = `Difficulty: ${mat.difficulty}`;
  metaBadges.appendChild(diffBadge);

  toolbar.appendChild(metaBadges);

  // Actions: Copy & Download
  const actionsGroup = document.createElement('div');
  actionsGroup.className = 'summary-actions-group';

  // Copy Button
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn btn-secondary btn-sm';
  copyBtn.setAttribute('aria-label', 'Copy study summary to clipboard');
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span>Copy Summary</span>
  `;
  copyBtn.addEventListener('click', copySummary);
  actionsGroup.appendChild(copyBtn);

  // Download Button
  const downloadBtn = document.createElement('button');
  downloadBtn.type = 'button';
  downloadBtn.className = 'btn btn-secondary btn-sm';
  downloadBtn.setAttribute('aria-label', 'Download summary as text file');
  downloadBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Download Summary</span>
  `;
  downloadBtn.addEventListener('click', downloadSummary);
  actionsGroup.appendChild(downloadBtn);

  toolbar.appendChild(actionsGroup);
  contentView.appendChild(toolbar);

  // 2. Title & Category Heading
  const titleHeading = document.createElement('h3');
  titleHeading.className = 'summary-title-heading';
  titleHeading.textContent = mat.displayTitle;
  contentView.appendChild(titleHeading);

  // 3. Summary Paragraphs
  const bodyText = document.createElement('div');
  bodyText.className = 'summary-body-text';
  mat.summaryParagraphs.forEach((pText) => {
    const p = document.createElement('p');
    p.textContent = pText;
    bodyText.appendChild(p);
  });
  contentView.appendChild(bodyText);

  // 4. Key Takeaways Box
  const takeawaysBox = document.createElement('div');
  takeawaysBox.className = 'takeaways-box';

  const takeawaysHeader = document.createElement('div');
  takeawaysHeader.className = 'takeaways-header';
  takeawaysHeader.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
    <h4 class="takeaways-title">Key Takeaways</h4>
  `;
  takeawaysBox.appendChild(takeawaysHeader);

  const takeawaysList = document.createElement('ul');
  takeawaysList.className = 'takeaways-list';
  mat.takeaways.forEach((point) => {
    const item = document.createElement('li');
    item.className = 'takeaway-item';
    item.innerHTML = `
      <span class="takeaway-item-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span>${escapeHTML(point)}</span>
    `;
    takeawaysList.appendChild(item);
  });
  takeawaysBox.appendChild(takeawaysList);
  contentView.appendChild(takeawaysBox);

  // 5. Core Concepts & Definitions Cards
  if (mat.concepts && mat.concepts.length > 0) {
    const conceptsSec = document.createElement('div');
    conceptsSec.className = 'concepts-section';

    const conceptsTitle = document.createElement('h4');
    conceptsTitle.className = 'concepts-section-title';
    conceptsTitle.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      <span>Important Concepts & Definitions</span>
    `;
    conceptsSec.appendChild(conceptsTitle);

    const conceptsGrid = document.createElement('div');
    conceptsGrid.className = 'concepts-grid';
    mat.concepts.forEach((concept) => {
      const card = document.createElement('div');
      card.className = 'concept-item-card';

      const term = document.createElement('div');
      term.className = 'concept-term';
      term.textContent = concept.term;
      card.appendChild(term);

      const def = document.createElement('div');
      def.className = 'concept-def';
      def.textContent = concept.definition;
      card.appendChild(def);

      conceptsGrid.appendChild(card);
    });

    conceptsSec.appendChild(conceptsGrid);
    contentView.appendChild(conceptsSec);
  }
}

/**
 * Builds plain-text summary document for copying or downloading.
 */
function buildPlainTextSummary() {
  const mat = AppState.activeMaterial;
  if (!mat) return '';

  const divider = '================================================================================';
  const subDivider = '--------------------------------------------------------------------------------';

  let text = '';
  text += `${divider}\n`;
  text += `STUDYMATE AI — STUDY SUMMARY: ${mat.displayTitle.toUpperCase()}\n`;
  text += `Format Style: ${mat.style} | Difficulty Level: ${mat.difficulty}\n`;
  const sourceLabel = mat.isAI
    ? 'Google Gemini 1.5 Flash (Live AI Generation)'
    : (mat.isGenericDemo ? 'General Demonstration Dataset' : 'Curated Study Dataset');
  text += `Source: ${sourceLabel}\n`;
  text += `${divider}\n\n`;

  text += `EXECUTIVE SUMMARY:\n`;
  mat.summaryParagraphs.forEach((p) => {
    text += `${p}\n\n`;
  });

  text += `${subDivider}\n`;
  text += `KEY TAKEAWAYS:\n`;
  text += `${subDivider}\n`;
  mat.takeaways.forEach((pt, idx) => {
    text += `${idx + 1}. ${pt}\n`;
  });
  text += `\n`;

  if (mat.concepts && mat.concepts.length > 0) {
    text += `${subDivider}\n`;
    text += `CORE CONCEPTS & DEFINITIONS:\n`;
    text += `${subDivider}\n`;
    mat.concepts.forEach((c) => {
      text += `• ${c.term}: ${c.definition}\n`;
    });
    text += `\n`;
  }

  text += `${divider}\n`;
  text += `Generated with StudyMate AI — Your Personal AI Study Assistant\n`;
  text += `${divider}\n`;

  return text;
}

/**
 * Copies the active summary to the system clipboard.
 */
function copySummary() {
  const text = buildPlainTextSummary();
  if (!text) {
    showToast('No active summary to copy', 'warning');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Summary copied successfully.', 'success');
      })
      .catch((err) => {
        console.warn('Clipboard writeText failed, attempting fallback:', err);
        fallbackCopyText(text);
      });
  } else {
    fallbackCopyText(text);
  }
}

/**
 * Fallback clipboard copy using textarea.
 */
function fallbackCopyText(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (successful) {
      showToast('Summary copied successfully.', 'success');
    } else {
      showToast('Clipboard access unavailable in this browser', 'warning');
    }
  } catch (err) {
    showToast('Could not copy summary to clipboard', 'warning');
  }
}

/**
 * Downloads the active summary as a plain-text file.
 */
function downloadSummary() {
  const text = buildPlainTextSummary();
  if (!text) {
    showToast('No active summary to download', 'warning');
    return;
  }

  const mat = AppState.activeMaterial;
  const slug = (mat.displayTitle || 'studymate')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = `${slug}-summary.txt`;

  try {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Your summary download has started.', 'success');
  } catch (err) {
    console.error('Download summary error:', err);
    showToast('Failed to trigger file download', 'warning');
  }
}

/* ============================================================================
   11. INTERACTIVE QUIZ ENGINE
   ============================================================================ */

function renderQuiz() {
  const emptyState = document.getElementById('quiz-empty-state');
  const contentView = document.getElementById('quiz-content-view');

  if (!emptyState || !contentView || !AppState.activeMaterial) return;

  emptyState.setAttribute('hidden', '');
  contentView.removeAttribute('hidden');

  if (AppState.quiz.isSubmitted) {
    renderQuizResults();
  } else {
    renderQuizQuestion();
  }
}

function renderQuizQuestion() {
  const contentView = document.getElementById('quiz-content-view');
  if (!contentView) return;

  contentView.innerHTML = '';
  const qState = AppState.quiz;
  const currentQ = qState.questions[qState.currentIndex];
  if (!currentQ) return;

  // 1. Header Bar: Meta row & Progress Bar
  const headerBar = document.createElement('div');
  headerBar.className = 'quiz-header-bar';

  const metaRow = document.createElement('div');
  metaRow.className = 'quiz-meta-row';

  const leftGroup = document.createElement('div');
  leftGroup.className = 'summary-meta-badges';

  const diffBadge = document.createElement('span');
  diffBadge.className = 'badge badge-accent';
  diffBadge.textContent = `${AppState.activeMaterial.difficulty} Difficulty`;
  leftGroup.appendChild(diffBadge);

  const topicBadge = document.createElement('span');
  topicBadge.className = 'badge badge-subtle';
  topicBadge.textContent = AppState.activeMaterial.displayTitle;
  leftGroup.appendChild(topicBadge);

  metaRow.appendChild(leftGroup);

  const counterEl = document.createElement('span');
  counterEl.className = 'quiz-question-counter';
  counterEl.textContent = `Question ${qState.currentIndex + 1} of 5`;
  metaRow.appendChild(counterEl);

  headerBar.appendChild(metaRow);

  // Progress Bar
  const progressTrack = document.createElement('div');
  progressTrack.className = 'quiz-progress-track';
  const progressFill = document.createElement('div');
  progressFill.className = 'quiz-progress-fill';
  const progressPercent = ((qState.currentIndex + 1) / 5) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressTrack.appendChild(progressFill);
  headerBar.appendChild(progressTrack);

  contentView.appendChild(headerBar);

  // 2. Question Box
  const questionCard = document.createElement('div');
  questionCard.className = 'quiz-question-card';

  const questionText = document.createElement('h4');
  questionText.className = 'quiz-question-text';
  questionText.textContent = `${qState.currentIndex + 1}. ${currentQ.question}`;
  questionCard.appendChild(questionText);

  // Options List
  const optionsList = document.createElement('div');
  optionsList.className = 'quiz-options-list';
  optionsList.setAttribute('role', 'radiogroup');
  optionsList.setAttribute('aria-label', `Answer options for Question ${qState.currentIndex + 1}`);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const userSelectedIndex = qState.selectedAnswers[qState.currentIndex];

  currentQ.options.forEach((optText, optIdx) => {
    const isSelected = (userSelectedIndex === optIdx);

    const optBtn = document.createElement('button');
    optBtn.type = 'button';
    optBtn.className = `quiz-option-btn ${isSelected ? 'selected' : ''}`;
    optBtn.setAttribute('role', 'radio');
    optBtn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    optBtn.setAttribute('aria-label', `Option ${optionLetters[optIdx]}: ${optText}`);

    optBtn.innerHTML = `
      <span class="quiz-option-letter" aria-hidden="true">${optionLetters[optIdx]}</span>
      <span class="quiz-option-text">${escapeHTML(optText)}</span>
    `;

    optBtn.addEventListener('click', () => {
      selectQuizAnswer(optIdx);
    });

    optionsList.appendChild(optBtn);
  });

  questionCard.appendChild(optionsList);
  contentView.appendChild(questionCard);

  // 3. Navigation Controls Row
  const navRow = document.createElement('div');
  navRow.className = 'quiz-navigation-row';

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'btn btn-secondary';
  prevBtn.disabled = (qState.currentIndex === 0);
  prevBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    <span>Previous</span>
  `;
  prevBtn.addEventListener('click', () => navigateQuiz(-1));
  navRow.appendChild(prevBtn);

  // Jump indicators (1 2 3 4 5)
  const jumpContainer = document.createElement('div');
  jumpContainer.className = 'quiz-jump-indicators';
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    const isCurrent = (qState.currentIndex === i);
    const isAnswered = (qState.selectedAnswers[i] !== null);

    dot.className = `quiz-jump-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`;
    dot.textContent = String(i + 1);
    dot.setAttribute('aria-label', `Jump to question ${i + 1}${isAnswered ? ' (Answered)' : ''}`);
    dot.addEventListener('click', () => jumpToQuizQuestion(i));
    jumpContainer.appendChild(dot);
  }
  navRow.appendChild(jumpContainer);

  // Next or Submit Button Group
  const rightGroup = document.createElement('div');
  rightGroup.style.display = 'flex';
  rightGroup.style.gap = 'var(--space-10)';

  if (qState.currentIndex < 4) {
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn-secondary';
    nextBtn.innerHTML = `
      <span>Next</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
    nextBtn.addEventListener('click', () => navigateQuiz(1));
    rightGroup.appendChild(nextBtn);
  }

  // Submit Quiz Button (Always available to review and submit)
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn-primary';
  submitBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Submit Quiz</span>
  `;
  submitBtn.addEventListener('click', handleQuizSubmit);
  rightGroup.appendChild(submitBtn);

  navRow.appendChild(rightGroup);
  contentView.appendChild(navRow);
}

function selectQuizAnswer(optionIndex) {
  AppState.quiz.selectedAnswers[AppState.quiz.currentIndex] = optionIndex;
  renderQuizQuestion();
}

function navigateQuiz(delta) {
  const newIndex = AppState.quiz.currentIndex + delta;
  if (newIndex >= 0 && newIndex < AppState.quiz.questions.length) {
    AppState.quiz.currentIndex = newIndex;
    renderQuizQuestion();
  }
}

function jumpToQuizQuestion(index) {
  if (index >= 0 && index < AppState.quiz.questions.length) {
    AppState.quiz.currentIndex = index;
    renderQuizQuestion();
  }
}

function handleQuizSubmit() {
  const unansweredCount = AppState.quiz.selectedAnswers.filter((a) => a === null).length;

  if (unansweredCount > 0) {
    showModal({
      title: 'Unanswered Questions Warning',
      message: `You have ${unansweredCount} unanswered question(s). Any unanswered questions will be marked as incorrect.\n\nAre you sure you want to proceed with submission?`,
      confirmText: 'Submit Anyway',
      cancelText: 'Review Questions',
      isDanger: false,
      iconType: 'warning',
      onConfirm: () => {
        finalizeQuizSubmission();
      }
    });
  } else {
    finalizeQuizSubmission();
  }
}

function finalizeQuizSubmission() {
  const qState = AppState.quiz;
  let correctCount = 0;

  qState.questions.forEach((q, idx) => {
    if (qState.selectedAnswers[idx] === q.correctIndex) {
      correctCount += 1;
    }
  });

  const percentage = Math.round((correctCount / 5) * 100);
  qState.score = {
    correctCount: correctCount,
    incorrectCount: 5 - correctCount,
    percentage: percentage
  };
  qState.isSubmitted = true;

  // Prevent multiple records from duplicate submissions in the same attempt
  if (!qState.attemptRecorded) {
    AppState.stats.quizzesCount += 1;
    AppState.stats.quizScores.push(percentage);

    const sum = AppState.stats.quizScores.reduce((acc, val) => acc + val, 0);
    AppState.stats.averageScore = Math.round(sum / AppState.stats.quizScores.length);

    qState.attemptRecorded = true;
    updateDashboardStats();
  }

  renderQuizResults();
  showToast('Quiz submitted successfully.', 'success');

  const workspaceCard = document.querySelector('.workspace-card');
  if (workspaceCard) {
    workspaceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderQuizResults() {
  const contentView = document.getElementById('quiz-content-view');
  if (!contentView) return;

  contentView.innerHTML = '';
  const qState = AppState.quiz;
  const score = qState.score;
  if (!score) return;

  // 1. Results Summary Hero Card
  const resultsCard = document.createElement('div');
  resultsCard.className = 'quiz-results-card';

  // Circular Score Badge
  const scoreBadge = document.createElement('div');
  scoreBadge.className = 'quiz-results-score-badge';
  scoreBadge.innerHTML = `
    <span class="results-score-num">${score.correctCount}/5</span>
    <span class="results-score-percent">${score.percentage}%</span>
  `;
  resultsCard.appendChild(scoreBadge);

  // Performance Message
  let perfTitle = 'Good Effort!';
  let perfDesc = 'Review the detailed question explanations below to strengthen your understanding.';

  if (score.percentage === 100) {
    perfTitle = 'Outstanding Mastery!';
    perfDesc = 'Flawless performance! You answered every question correctly on this topic.';
  } else if (score.percentage >= 80) {
    perfTitle = 'Great Job!';
    perfDesc = 'Strong grasp of core concepts. You are well-prepared on this topic.';
  } else if (score.percentage >= 60) {
    perfTitle = 'Solid Progress!';
    perfDesc = 'Good conceptual baseline. Review the missed items below to close knowledge gaps.';
  } else {
    perfTitle = 'Keep Practicing!';
    perfDesc = 'Study the summary takeaways and flashcards, then retake the quiz to boost your retention.';
  }

  const titleEl = document.createElement('h3');
  titleEl.className = 'quiz-results-title';
  titleEl.textContent = perfTitle;
  resultsCard.appendChild(titleEl);

  const descEl = document.createElement('p');
  descEl.className = 'quiz-results-message';
  descEl.textContent = perfDesc;
  resultsCard.appendChild(descEl);

  // Breakdown Pills
  const breakdownPills = document.createElement('div');
  breakdownPills.className = 'quiz-results-breakdown-pills';
  breakdownPills.innerHTML = `
    <span class="badge badge-accent">Correct: ${score.correctCount}</span>
    <span class="badge badge-subtle">Incorrect / Skipped: ${score.incorrectCount}</span>
    <span class="badge badge-subtle">Difficulty: ${AppState.activeMaterial.difficulty}</span>
  `;
  resultsCard.appendChild(breakdownPills);

  // Retake Quiz Button
  const retakeBtn = document.createElement('button');
  retakeBtn.type = 'button';
  retakeBtn.className = 'btn btn-primary';
  retakeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10"></polyline>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
    <span>Retake Quiz</span>
  `;
  retakeBtn.addEventListener('click', resetQuiz);
  resultsCard.appendChild(retakeBtn);

  contentView.appendChild(resultsCard);

  // 2. Question-by-Question Review Section
  const reviewSection = document.createElement('div');
  reviewSection.className = 'quiz-review-section';

  const reviewHeading = document.createElement('h4');
  reviewHeading.className = 'review-section-title';
  reviewHeading.textContent = 'Question-by-Question Review';
  reviewSection.appendChild(reviewHeading);

  const optionLetters = ['A', 'B', 'C', 'D'];

  qState.questions.forEach((q, qIdx) => {
    const userChoice = qState.selectedAnswers[qIdx];
    const isCorrect = (userChoice === q.correctIndex);

    const card = document.createElement('div');
    card.className = `review-question-card ${isCorrect ? 'status-correct' : 'status-incorrect'}`;

    // Header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'review-card-header';

    const qText = document.createElement('h5');
    qText.className = 'review-question-text';
    qText.textContent = `${qIdx + 1}. ${q.question}`;
    cardHeader.appendChild(qText);

    const statusBadge = document.createElement('span');
    statusBadge.className = isCorrect ? 'badge badge-accent' : 'badge badge-subtle';
    statusBadge.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
    statusBadge.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
    cardHeader.appendChild(statusBadge);

    card.appendChild(cardHeader);

    // Options list
    const optionsList = document.createElement('div');
    optionsList.className = 'review-options-list';

    q.options.forEach((optText, optIdx) => {
      const isUserPick = (userChoice === optIdx);
      const isActualCorrect = (q.correctIndex === optIdx);

      let itemClass = 'review-option-item';
      let tagText = '';

      if (isUserPick && isActualCorrect) {
        itemClass += ' user-correct';
        tagText = 'Your answer (Correct)';
      } else if (isUserPick && !isActualCorrect) {
        itemClass += ' user-wrong';
        tagText = 'Your answer (Incorrect)';
      } else if (isActualCorrect) {
        itemClass += ' actual-correct';
        tagText = 'Correct Answer';
      }

      const optItem = document.createElement('div');
      optItem.className = itemClass;
      optItem.innerHTML = `
        <span><strong>${optionLetters[optIdx]}.</strong> ${escapeHTML(optText)}</span>
        ${tagText ? `<span class="badge badge-subtle" style="font-size: 0.72rem;">${tagText}</span>` : ''}
      `;
      optionsList.appendChild(optItem);
    });
    card.appendChild(optionsList);

    // Explanation Box
    const explanationBox = document.createElement('div');
    explanationBox.className = 'review-explanation-box';
    explanationBox.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <div><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</div>
    `;
    card.appendChild(explanationBox);

    reviewSection.appendChild(card);
  });

  contentView.appendChild(reviewSection);
}

function resetQuiz() {
  const qState = AppState.quiz;
  qState.currentIndex = 0;
  qState.selectedAnswers = [null, null, null, null, null];
  qState.isSubmitted = false;
  qState.score = null;
  qState.attemptRecorded = false; // Fresh attempt can record upon re-submission

  renderQuizQuestion();
  showToast('Quiz reset for a new attempt.', 'info');
}

/* ============================================================================
   12. INTERACTIVE FLASHCARDS ENGINE (3D FLIP CARD & CLASSIFICATIONS)
   ============================================================================ */

function renderFlashcards() {
  const emptyState = document.getElementById('flashcards-empty-state');
  const contentView = document.getElementById('flashcards-content-view');

  if (!emptyState || !contentView || !AppState.activeMaterial) return;

  emptyState.setAttribute('hidden', '');
  contentView.removeAttribute('hidden');
  contentView.innerHTML = '';

  const fState = AppState.flashcards;
  const totalCards = fState.deck.length;
  if (totalCards === 0) return;

  const currentCard = fState.deck[fState.currentIndex];

  // 1. Header Bar: Progress Counter & Deck Stats & Shuffle
  const headerBar = document.createElement('div');
  headerBar.className = 'flashcards-header-bar';

  // Stats Badges
  const badgesGroup = document.createElement('div');
  badgesGroup.className = 'flashcards-progress-badges';

  // Calculate known, not-known, unclassified
  let knownCount = 0;
  let notKnownCount = 0;
  Object.values(fState.classifications).forEach((status) => {
    if (status === 'known') knownCount += 1;
    if (status === 'not-known') notKnownCount += 1;
  });
  const unclassifiedCount = Math.max(0, totalCards - (knownCount + notKnownCount));

  badgesGroup.innerHTML = `
    <span class="badge badge-accent">Card ${fState.currentIndex + 1} of ${totalCards}</span>
    <span class="badge badge-subtle" style="color: var(--success);" title="Marked as Known">✓ Known: ${knownCount}</span>
    <span class="badge badge-subtle" style="color: var(--warning);" title="Marked for Review">⚠️ Review: ${notKnownCount}</span>
    <span class="badge badge-subtle">Unclassified: ${unclassifiedCount}</span>
  `;
  headerBar.appendChild(badgesGroup);

  // Shuffle Button
  const shuffleBtn = document.createElement('button');
  shuffleBtn.type = 'button';
  shuffleBtn.className = 'btn btn-secondary btn-sm';
  shuffleBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
    <span>Shuffle Deck</span>
  `;
  shuffleBtn.addEventListener('click', shuffleFlashcards);
  headerBar.appendChild(shuffleBtn);

  contentView.appendChild(headerBar);

  // 2. 3D Flip Card Component
  const stage = document.createElement('div');
  stage.className = 'flashcard-stage';

  const card3D = document.createElement('div');
  card3D.className = `flashcard-3d-card ${fState.isFlipped ? 'flipped' : ''}`;
  card3D.setAttribute('tabindex', '0');
  card3D.setAttribute('role', 'button');
  card3D.setAttribute('aria-label', `Flashcard ${fState.currentIndex + 1}. Press Space or Enter to flip.`);

  // Card Front
  const frontFace = document.createElement('div');
  frontFace.className = 'flashcard-face flashcard-front';

  const frontTop = document.createElement('div');
  frontTop.className = 'flashcard-top-row';

  const frontTag = document.createElement('span');
  frontTag.className = 'flashcard-tag';
  frontTag.textContent = 'Question / Concept';
  frontTop.appendChild(frontTag);

  const cardStatus = fState.classifications[currentCard.id];
  if (cardStatus) {
    const statusBadge = document.createElement('span');
    statusBadge.className = 'badge badge-subtle';
    if (cardStatus === 'known') {
      statusBadge.style.color = 'var(--success)';
      statusBadge.textContent = '✓ Known';
    } else {
      statusBadge.style.color = 'var(--warning)';
      statusBadge.textContent = '⚠️ Needs Review';
    }
    frontTop.appendChild(statusBadge);
  }
  frontFace.appendChild(frontTop);

  const frontText = document.createElement('div');
  frontText.className = 'flashcard-content-text';
  frontText.textContent = currentCard.front;
  frontFace.appendChild(frontText);

  const frontHint = document.createElement('div');
  frontHint.className = 'flashcard-bottom-hint';
  frontHint.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10"></polyline>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
    <span>Click or press Space to flip to answer</span>
  `;
  frontFace.appendChild(frontHint);

  card3D.appendChild(frontFace);

  // Card Back
  const backFace = document.createElement('div');
  backFace.className = 'flashcard-face flashcard-back';

  const backTop = document.createElement('div');
  backTop.className = 'flashcard-top-row';

  const backTag = document.createElement('span');
  backTag.className = 'flashcard-tag';
  backTag.textContent = 'Answer / Explanation';
  backTop.appendChild(backTag);

  backFace.appendChild(backTop);

  const backText = document.createElement('div');
  backText.className = 'flashcard-content-text';
  backText.textContent = currentCard.back;
  backFace.appendChild(backText);

  const backHint = document.createElement('div');
  backHint.className = 'flashcard-bottom-hint';
  backHint.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 1 1 2.13 9.36L1 14"></path>
    </svg>
    <span>Click or press Space to flip back</span>
  `;
  backFace.appendChild(backHint);

  card3D.appendChild(backFace);

  // Card Click & Keyboard Event
  card3D.addEventListener('click', flipFlashcard);
  card3D.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flipFlashcard();
    }
  });

  stage.appendChild(card3D);
  contentView.appendChild(stage);

  // 3. Action Controls Panel (Known/Not Known + Prev/Next)
  const controlsPanel = document.createElement('div');
  controlsPanel.className = 'flashcard-controls-panel';

  // Mark Actions Row
  const markRow = document.createElement('div');
  markRow.className = 'flashcard-mark-actions';

  const notKnownBtn = document.createElement('button');
  notKnownBtn.type = 'button';
  notKnownBtn.className = 'btn btn-secondary';
  notKnownBtn.style.color = 'var(--warning)';
  notKnownBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>Needs Review</span>
  `;
  notKnownBtn.addEventListener('click', () => classifyFlashcard('not-known'));
  markRow.appendChild(notKnownBtn);

  const knownBtn = document.createElement('button');
  knownBtn.type = 'button';
  knownBtn.className = 'btn btn-secondary';
  knownBtn.style.color = 'var(--success)';
  knownBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>Mark as Known</span>
  `;
  knownBtn.addEventListener('click', () => classifyFlashcard('known'));
  markRow.appendChild(knownBtn);

  controlsPanel.appendChild(markRow);

  // Nav Actions Row
  const navRow = document.createElement('div');
  navRow.className = 'flashcard-nav-actions';

  const prevCardBtn = document.createElement('button');
  prevCardBtn.type = 'button';
  prevCardBtn.className = 'btn btn-secondary';
  prevCardBtn.disabled = (fState.currentIndex === 0);
  prevCardBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    <span>Previous Card</span>
  `;
  prevCardBtn.addEventListener('click', () => navigateFlashcard(-1));
  navRow.appendChild(prevCardBtn);

  const nextCardBtn = document.createElement('button');
  nextCardBtn.type = 'button';
  nextCardBtn.className = 'btn btn-secondary';
  nextCardBtn.disabled = (fState.currentIndex === totalCards - 1);
  nextCardBtn.innerHTML = `
    <span>Next Card</span>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  nextCardBtn.addEventListener('click', () => navigateFlashcard(1));
  navRow.appendChild(nextCardBtn);

  controlsPanel.appendChild(navRow);
  contentView.appendChild(controlsPanel);
}

function flipFlashcard() {
  AppState.flashcards.isFlipped = !AppState.flashcards.isFlipped;
  const card3D = document.querySelector('.flashcard-3d-card');
  if (card3D) {
    card3D.classList.toggle('flipped', AppState.flashcards.isFlipped);
  }
}

function navigateFlashcard(delta) {
  const fState = AppState.flashcards;
  const newIndex = fState.currentIndex + delta;
  if (newIndex >= 0 && newIndex < fState.deck.length) {
    fState.currentIndex = newIndex;
    fState.isFlipped = false; // Always return to front when navigating
    renderFlashcards();
  }
}

function shuffleFlashcards() {
  const fState = AppState.flashcards;
  const deck = fState.deck;

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  fState.currentIndex = 0;
  fState.isFlipped = false;
  renderFlashcards();
  showToast('Flashcard deck shuffled.', 'info');
}

function classifyFlashcard(status) {
  const fState = AppState.flashcards;
  const currentCard = fState.deck[fState.currentIndex];
  if (!currentCard) return;

  fState.classifications[currentCard.id] = status;
  renderFlashcards();

  if (status === 'known') {
    showToast('Flashcard marked as known.', 'success');
  } else {
    showToast('Flashcard marked for review.', 'info');
  }
}

/* ============================================================================
   13. DASHBOARD QUICK STATISTICS
   ============================================================================ */

function updateDashboardStats() {
  const sessionsEl = document.getElementById('stat-sessions-count');
  const quizzesEl = document.getElementById('stat-quizzes-count');
  const scoreAvgEl = document.getElementById('stat-score-avg');

  if (sessionsEl) {
    sessionsEl.textContent = String(AppState.stats.sessionsCount);
  }

  if (quizzesEl) {
    quizzesEl.textContent = String(AppState.stats.quizzesCount);
  }

  if (scoreAvgEl) {
    scoreAvgEl.textContent = `${AppState.stats.averageScore}%`;
  }
}

/* ============================================================================
   14. SETTINGS MANAGEMENT & PREFERENCES
   ============================================================================ */

function initializeSettings() {
  // 1. API Key Visibility Toggle
  const toggleKeyBtn = document.getElementById('btn-toggle-key-visibility');
  const apiKeyInput = document.getElementById('api-key-input');

  if (toggleKeyBtn && apiKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      const isPassword = (apiKeyInput.type === 'password');
      apiKeyInput.type = isPassword ? 'text' : 'password';

      const eyeShow = toggleKeyBtn.querySelector('.icon-eye-show');
      const eyeHide = toggleKeyBtn.querySelector('.icon-eye-hide');

      if (eyeShow && eyeHide) {
        if (isPassword) {
          eyeShow.setAttribute('hidden', '');
          eyeHide.removeAttribute('hidden');
          toggleKeyBtn.setAttribute('aria-label', 'Hide API key');
        } else {
          eyeShow.removeAttribute('hidden');
          eyeHide.setAttribute('hidden', '');
          toggleKeyBtn.setAttribute('aria-label', 'Show API key');
        }
      }
    });
  }

  // 2. API Key Save, Remove, and Test Connection
  const saveKeyBtn = document.getElementById('btn-save-key');
  const removeKeyBtn = document.getElementById('btn-remove-key');
  const testKeyBtn = document.getElementById('btn-test-connection');

  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', saveAPIKeyFromInput);
  }

  if (removeKeyBtn) {
    removeKeyBtn.addEventListener('click', removeAPIKeyWithConfirm);
  }

  if (testKeyBtn) {
    testKeyBtn.addEventListener('click', testAPIConnection);
  }

  // Restore saved API key state and update badge on load
  loadSavedAPIKey();

  // 3. Appearance Radios
  const themeCardLight = document.getElementById('theme-card-light');
  const themeCardDark = document.getElementById('theme-card-dark');
  const lightRadio = document.getElementById('theme-radio-light');
  const darkRadio = document.getElementById('theme-radio-dark');

  if (themeCardLight && lightRadio) {
    themeCardLight.addEventListener('click', () => applyTheme('light', true));
  }

  if (themeCardDark && darkRadio) {
    themeCardDark.addEventListener('click', () => applyTheme('dark', true));
  }

  // 4. Study Preferences Form
  loadSavedPreferences();

  const prefsForm = document.getElementById('preferences-form');
  if (prefsForm) {
    prefsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStudyPreferences();
    });
  }

  // 5. Data Management Action Buttons
  const clearHistoryBtn = document.getElementById('btn-data-clear-history');
  const resetProgressBtn = document.getElementById('btn-data-reset-progress');
  const resetPrefsBtn = document.getElementById('btn-data-reset-prefs');

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      showToast('Study history tracking starts in Phase 4', 'info');
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      showToast('Quiz progress tracking starts in Phase 4', 'info');
    });
  }

  if (resetPrefsBtn) {
    resetPrefsBtn.addEventListener('click', () => {
      showModal({
        title: 'Reset Preferences to Defaults?',
        message: 'This will reset your default quiz difficulty, summary style, flashcard animation, and theme back to default settings.',
        confirmText: 'Reset Defaults',
        cancelText: 'Cancel',
        isDanger: true,
        iconType: 'warning',
        onConfirm: () => {
          resetPreferencesToDefaults();
          showToast('Preferences reset to default values', 'info');
        }
      });
    });
  }
}

/**
 * Retrieves the currently saved Gemini API key from memory or LocalStorage.
 * @returns {string}
 */
function getAPIKey() {
  if (AppState.apiKey && AppState.apiKey.trim()) {
    return AppState.apiKey.trim();
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (saved && saved.trim()) {
      AppState.apiKey = saved.trim();
      AppState.apiKeyConfigured = true;
      return saved.trim();
    }
  } catch (err) {
    console.warn('LocalStorage error reading API key:', err);
  }
  return '';
}

/**
 * Persists the user-provided Gemini API key to LocalStorage.
 */
function saveAPIKeyFromInput() {
  const apiKeyInput = document.getElementById('api-key-input');
  const keyVal = apiKeyInput ? apiKeyInput.value.trim() : '';

  if (!keyVal) {
    showToast('Please enter an API key before saving', 'warning');
    return;
  }

  if (keyVal.length < 10) {
    showToast('API key appears too short to be valid', 'warning');
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, keyVal);
  } catch (err) {
    console.warn('LocalStorage error saving API key:', err);
  }

  AppState.apiKey = keyVal;
  AppState.apiKeyConfigured = true;
  updateAIConfigStatus();

  // Clear previous test feedback
  const feedbackEl = document.getElementById('connection-test-feedback');
  if (feedbackEl) {
    feedbackEl.setAttribute('hidden', '');
    feedbackEl.innerHTML = '';
  }

  showToast('Gemini API key saved in browser storage', 'success');
}

/**
 * Confirms and removes the stored API key from LocalStorage and AppState.
 */
function removeAPIKeyWithConfirm() {
  const currentKey = getAPIKey();
  const apiKeyInput = document.getElementById('api-key-input');

  if (!currentKey && (!apiKeyInput || !apiKeyInput.value.trim())) {
    showToast('No saved API key to remove', 'info');
    return;
  }

  showModal({
    title: 'Remove API Key?',
    message: 'Are you sure you want to remove your Gemini API key from browser storage? You will need to re-enter it to generate live AI materials.',
    confirmText: 'Remove Key',
    cancelText: 'Keep Key',
    isDanger: true,
    iconType: 'warning',
    onConfirm: () => {
      try {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
      } catch (err) {
        console.warn('LocalStorage error removing API key:', err);
      }
      AppState.apiKey = '';
      AppState.apiKeyConfigured = false;
      if (apiKeyInput) apiKeyInput.value = '';
      updateAIConfigStatus();

      const feedbackEl = document.getElementById('connection-test-feedback');
      if (feedbackEl) {
        feedbackEl.setAttribute('hidden', '');
        feedbackEl.innerHTML = '';
      }

      showToast('API key removed from storage', 'info');
    }
  });
}

/**
 * Loads the saved Gemini API key upon initial application startup.
 */
function loadSavedAPIKey() {
  const key = getAPIKey();
  const apiKeyInput = document.getElementById('api-key-input');
  if (key) {
    if (apiKeyInput) apiKeyInput.value = key;
    AppState.apiKeyConfigured = true;
  } else {
    AppState.apiKeyConfigured = false;
  }
  updateAIConfigStatus();
}

/**
 * Updates the configuration status badge in the Settings panel.
 */
function updateAIConfigStatus() {
  const badge = document.getElementById('ai-config-status-badge');
  if (!badge) return;

  const key = getAPIKey();
  if (key) {
    badge.textContent = 'Configured (Gemini 1.5 Flash)';
    badge.className = 'badge badge-success';
  } else {
    badge.textContent = 'Not Configured';
    badge.className = 'badge badge-warning';
  }
}

/**
 * Sends a lightweight test ping to the Google Gemini API to verify credentials.
 */
async function testAPIConnection() {
  const apiKeyInput = document.getElementById('api-key-input');
  const testBtn = document.getElementById('btn-test-connection');
  const testText = document.getElementById('btn-test-text');
  const feedbackEl = document.getElementById('connection-test-feedback');

  const keyToTest = (apiKeyInput && apiKeyInput.value.trim()) || getAPIKey();

  if (!keyToTest) {
    showToast('Please enter an API key to test', 'warning');
    if (feedbackEl) {
      feedbackEl.className = 'connection-feedback-alert error';
      feedbackEl.innerHTML = `
        <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>No API key provided. Enter your Gemini API key from Google AI Studio above.</span>
      `;
      feedbackEl.removeAttribute('hidden');
    }
    return;
  }

  // Update UI for testing state
  if (testBtn) testBtn.disabled = true;
  if (testText) {
    testText.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Testing...';
  }
  if (feedbackEl) {
    feedbackEl.className = 'connection-feedback-alert';
    feedbackEl.innerHTML = `
      <span class="btn-spinner" aria-hidden="true"></span>
      <span>Connecting to Google Gemini API (gemini-1.5-flash)...</span>
    `;
    feedbackEl.removeAttribute('hidden');
  }

  const endpoint = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${encodeURIComponent(keyToTest)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with the single word: OK' }] }],
        generationConfig: { maxOutputTokens: 5 }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      if (feedbackEl) {
        feedbackEl.className = 'connection-feedback-alert success';
        feedbackEl.innerHTML = `
          <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Connection successful! Google Gemini 1.5 Flash is ready to generate study materials.</span>
        `;
      }
      showToast('API Connection verified successfully', 'success');
    } else {
      let errDetail = '';
      try {
        const errJson = await response.json();
        if (errJson && errJson.error && errJson.error.message) {
          errDetail = errJson.error.message;
        }
      } catch (_) {}

      let userMsg = `Connection failed (HTTP ${response.status}).`;
      if (response.status === 400) {
        userMsg = 'API key invalid or unrecognized (HTTP 400). Please check your key at aistudio.google.com.';
      } else if (response.status === 403) {
        userMsg = 'Access forbidden (HTTP 403). Your key does not have permission to access Gemini 1.5 Flash.';
      } else if (response.status === 429) {
        userMsg = 'Rate limit or quota exceeded (HTTP 429). Please check your Google AI Studio quota.';
      }

      if (feedbackEl) {
        feedbackEl.className = 'connection-feedback-alert error';
        feedbackEl.innerHTML = `
          <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>${escapeHTML(userMsg)}${errDetail ? ` <small style="display:block;margin-top:4px;opacity:0.85;">Details: ${escapeHTML(errDetail)}</small>` : ''}</span>
        `;
      }
      showToast('Connection test failed', 'error');
    }
  } catch (err) {
    clearTimeout(timeoutId);
    let errMsg = err.name === 'AbortError'
      ? 'Connection timed out (15s). Please check your internet connection.'
      : `Network error: ${err.message || 'Failed to reach Google Gemini API'}`;

    if (feedbackEl) {
      feedbackEl.className = 'connection-feedback-alert error';
      feedbackEl.innerHTML = `
        <svg class="feedback-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${escapeHTML(errMsg)}</span>
      `;
    }
    showToast('Connection test failed', 'error');
  } finally {
    if (testBtn) testBtn.disabled = false;
    if (testText) testText.textContent = 'Test Connection';
  }
}

function loadSavedPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        AppState.preferences = { ...AppState.preferences, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Unable to read preferences:', err);
  }

  const diffSelect = document.getElementById('pref-default-difficulty');
  const styleSelect = document.getElementById('pref-default-summary-style');
  const animSelect = document.getElementById('pref-flashcard-animation');

  if (diffSelect) diffSelect.value = AppState.preferences.defaultDifficulty;
  if (styleSelect) styleSelect.value = AppState.preferences.defaultSummaryStyle;
  if (animSelect) animSelect.value = AppState.preferences.flashcardAnimation;

  syncDashboardOptionDefaults();
}

function syncDashboardOptionDefaults() {
  const diffRadio = document.querySelector(`input[name="difficulty"][value="${AppState.preferences.defaultDifficulty}"]`);
  if (diffRadio) diffRadio.checked = true;

  const styleRadio = document.querySelector(`input[name="summaryStyle"][value="${AppState.preferences.defaultSummaryStyle}"]`);
  if (styleRadio) styleRadio.checked = true;
}

function saveStudyPreferences() {
  const diffSelect = document.getElementById('pref-default-difficulty');
  const styleSelect = document.getElementById('pref-default-summary-style');
  const animSelect = document.getElementById('pref-flashcard-animation');

  if (diffSelect) AppState.preferences.defaultDifficulty = diffSelect.value;
  if (styleSelect) AppState.preferences.defaultSummaryStyle = styleSelect.value;
  if (animSelect) AppState.preferences.flashcardAnimation = animSelect.value;

  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(AppState.preferences));
    syncDashboardOptionDefaults();
    showToast('Preferences saved successfully', 'success');
  } catch (err) {
    console.warn('Unable to persist preferences:', err);
    showToast('Could not save to LocalStorage', 'warning');
  }
}

function resetPreferencesToDefaults() {
  AppState.preferences = {
    defaultDifficulty: 'Medium',
    defaultSummaryStyle: 'Simple Explanation',
    flashcardAnimation: 'flip'
  };

  try {
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  } catch (err) {
    console.warn('Unable to clear LocalStorage:', err);
  }

  applyTheme('light', false);
  loadSavedPreferences();
}

/* ============================================================================
   15. ACCESSIBLE MODAL DIALOG COMPONENT
   ============================================================================ */

let activeModalConfirmCallback = null;

function initializeConfirmationDialogs() {
  const modal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (typeof activeModalConfirmCallback === 'function') {
        const callback = activeModalConfirmCallback;
        activeModalConfirmCallback = null;
        callback();
      }
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });

    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
  }
}

function showModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  isDanger = false,
  iconType = 'info',
  onConfirm = null
}) {
  const modal = document.getElementById('app-modal');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const iconContainer = document.getElementById('modal-icon-container');

  if (!modal || !titleEl || !msgEl || !confirmBtn || !cancelBtn) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  confirmBtn.textContent = confirmText;
  confirmBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

  if (showCancel) {
    cancelBtn.textContent = cancelText;
    cancelBtn.removeAttribute('hidden');
  } else {
    cancelBtn.setAttribute('hidden', '');
  }

  if (iconContainer) {
    if (iconType === 'warning') {
      iconContainer.style.color = 'var(--warning)';
    } else if (isDanger) {
      iconContainer.style.color = 'var(--danger)';
    } else {
      iconContainer.style.color = 'var(--primary)';
    }
  }

  activeModalConfirmCallback = onConfirm;

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeModal() {
  const modal = document.getElementById('app-modal');
  if (modal) {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }
  activeModalConfirmCallback = null;
}

/* ============================================================================
   16. TOAST NOTIFICATION ENGINE
   ============================================================================ */

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`;
  } else if (type === 'warning') {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`;
  } else if (type === 'error' || type === 'danger') {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`;
  } else {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-text">${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  const removeTimeout = setTimeout(() => {
    dismissToast(toast);
  }, duration);

  toast.addEventListener('click', () => {
    clearTimeout(removeTimeout);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-hiding');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 200);
}

/**
 * Escapes plain text to avoid unsafe HTML injection.
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================================
   17. DOM READY EVENT DISPATCHER
   ============================================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
