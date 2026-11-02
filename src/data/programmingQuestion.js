// Advanced Programming Question Bank
// MCA Placement Preparation | 6 Technical Tracks | 60 Subjective Coding Problems
// Format aligned with the existing Placement LMS question-bank structure.
const makeQuestions = (domainId, rawQuestions = []) => {
  return rawQuestions.map((item, index) => ({
    ...item,
    id: item.id || `${domainId}-${index + 1}`,

    question: [
      item.title,
      item.situation,
      `Programming Task: ${item.programmingTask || ''}`,
      `Sample Input: ${item.sampleInput || ''}`,
      `Expected Output: ${item.expectedOutput || ''}`,
      `Constraints: ${item.constraints || ''}`
    ]
      .filter(Boolean)
      .join('\n\n'),

    options: [],
    answer: null,
    subjective: true,
    marks: item.marks || 10
  }));
};
const programmingQuestionBank = [
  {
    id: "web-development",
    name: "Web Development",
    icon: "🌐",
    color: "blue",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("web-development", [
      {
        title: "Shopping Cart with Coupon Engine",
        situation: "An e-commerce website must maintain a cart containing product IDs, unit prices and quantities. It supports ADD, UPDATE, REMOVE and CHECKOUT operations. At checkout, apply a 10% discount when the subtotal is at least 5,000; otherwise apply no discount.",
        programmingTask: "Implement the cart operations and print each remaining item, subtotal, discount and final amount. Reject updates/removals for unknown product IDs.",
        sampleInput: "ADD P101 2500 2\nADD P102 500 1\nUPDATE P102 2\nREMOVE P101\nCHECKOUT",
        expectedOutput: "P102: quantity=2, amount=1000\nSubtotal=1000\nDiscount=0\nFinal Amount=1000",
        constraints: "1 <= operations <= 10^5; prices and quantities are positive. Use an appropriate map/dictionary for efficient product lookup."
      },
      {
        title: "REST API Request Validator",
        situation: "A backend service receives JSON requests to create a student record. Required fields are name, email and age. Email must contain a valid basic email structure and age must be between 16 and 60.",
        programmingTask: "Write a program that reads multiple JSON records, validates each record, and prints ACCEPTED or REJECTED with the missing/invalid field names. Do not crash on malformed JSON.",
        sampleInput: "{\"name\":\"Aman\",\"email\":\"aman@example.com\",\"age\":22}\n{\"name\":\"Riya\",\"email\":\"riya.example.com\",\"age\":19}",
        expectedOutput: "Record 1: ACCEPTED\nRecord 2: REJECTED\nErrors: email format invalid",
        constraints: "Process at least 1,000 records. Use JSON parsing and structured validation; state any validation assumptions."
      },
      {
        title: "URL Router and Query Parameter Parser",
        situation: "A web application receives URLs containing a path and query parameters. It must extract the route and decode query parameters, including repeated keys.",
        programmingTask: "Parse the supplied URL, separate the path, decode URL-encoded values, and print all parameters. For repeated keys, preserve all values in arrival order.",
        sampleInput: "https://shop.example.com/search?category=books&tag=ai&tag=python&page=2",
        expectedOutput: "Path: /search\ncategory: books\ntag: ai, python\npage: 2",
        constraints: "Support empty query strings, encoded spaces (%20 or +), repeated keys and missing values."
      },
      {
        title: "Session Expiry Manager",
        situation: "An application stores user session IDs with their last-activity timestamps. A session expires if it has been inactive for more than T minutes.",
        programmingTask: "Given session activity records and a current timestamp, identify active and expired sessions. A session with inactivity exactly T minutes is still active.",
        sampleInput: "T=30, CurrentTime=120\nS1 80\nS2 89\nS3 90\nS4 40",
        expectedOutput: "Active: S2 S3\nExpired: S1 S4",
        constraints: "1 <= number of sessions <= 10^5. Avoid nested comparisons; explain the boundary condition."
      },
      {
        title: "Concurrent Seat Booking",
        situation: "An event-booking platform receives seat-booking requests. A seat can be confirmed only once. Requests are processed in the order received.",
        programmingTask: "Simulate booking requests for seat IDs. Print CONFIRMED for the first successful booking and ALREADY BOOKED for later attempts for the same seat.",
        sampleInput: "5\nB A12\nB A13\nB A12\nB B01\nB A13",
        expectedOutput: "A12: CONFIRMED\nA13: CONFIRMED\nA12: ALREADY BOOKED\nB01: CONFIRMED\nA13: ALREADY BOOKED",
        constraints: "Support up to 10^5 requests. Use a set/map. Discuss how a real database transaction would prevent race conditions."
      },
      {
        title: "Log File Error Aggregator",
        situation: "A web server produces log entries with timestamp, endpoint and HTTP status code. The support team needs the count of 5xx errors per endpoint.",
        programmingTask: "Read log records, group 500–599 responses by endpoint, and print endpoints in descending error-count order. Break ties alphabetically.",
        sampleInput: "4\n10:00 /login 200\n10:01 /pay 500\n10:02 /pay 503\n10:03 /login 502",
        expectedOutput: "/pay 2\n/login 1",
        constraints: "Handle endpoints with zero server errors by omitting them. Complexity should be better than sorting all records repeatedly."
      },
      {
        title: "Paginated API Result Merger",
        situation: "Two API servers return sorted lists of product prices. A client must combine both lists into one sorted list without losing duplicate prices.",
        programmingTask: "Merge the two sorted arrays in linear time and print the merged result.",
        sampleInput: "5\n1 4 7 9 12\n4\n2 4 8 10",
        expectedOutput: "1 2 4 4 4 7 8 9 10 12",
        constraints: "Array lengths may each be up to 10^6. Target O(n+m) time."
      },
      {
        title: "Form Submission Duplicate Detector",
        situation: "A registration portal receives email addresses. Email matching must be case-insensitive and surrounding spaces must be ignored.",
        programmingTask: "Print the first repeated normalized email and the position where it repeats. If no duplicate exists, print NO DUPLICATE.",
        sampleInput: "5\nA@x.com\nb@x.com\na@X.com\nc@x.com\nb@X.com",
        expectedOutput: "First duplicate: a@x.com\nRepeated at position: 3",
        constraints: "Positions are 1-based. Normalize before checking; do not alter the original display data."
      },
      {
        title: "Comment Thread Reconstruction",
        situation: "A discussion platform stores comments as (comment_id, parent_id, text). Parent ID 0 indicates a top-level comment. Reconstruct the thread hierarchy and print a depth-first display.",
        programmingTask: "Build the comment tree and print each comment with two spaces of indentation per depth. Assume every nonzero parent exists and there are no cycles.",
        sampleInput: "5\n1 0 Welcome\n2 1 Hello\n3 1 Thanks\n4 2 Agreed\n5 0 Question",
        expectedOutput: "1 Welcome\n2 Hello\n4 Agreed\n3 Thanks\n5 Question",
        constraints: "Preserve input order among siblings. Detect and report invalid parent references if the input violates the assumption."
      },
      {
        title: "Rate Limiter for an API",
        situation: "An API allows each client at most K requests in any rolling W-second window. Requests arrive in timestamp order.",
        programmingTask: "For each request (client, timestamp), print ALLOW or BLOCK. A request exactly W seconds after an earlier request is outside the earlier request's window.",
        sampleInput: "K=2 W=10\nA 1\nA 4\nA 8\nA 11\nB 5\nB 6\nB 7",
        expectedOutput: "A 1 ALLOW\nA 4 ALLOW\nA 8 BLOCK\nA 11 ALLOW\nB 5 ALLOW\nB 6 ALLOW\nB 7 BLOCK",
        constraints: "Use a queue/deque per client. Target near O(number of requests) total processing time."
      }
    ]),
  },

  {
    id: "ai-engineer",
    name: "AI Engineer",
    icon: "🤖",
    color: "purple",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("ai-engineer", [
      {
        title: "Customer Churn Classification Pipeline",
        situation: "A telecom company provides a CSV dataset containing customer tenure, monthly charges, support calls and a churn label (0/1). Build a reproducible classification pipeline.",
        programmingTask: "Load data, handle missing numeric values, encode categorical features if present, split train/test data with a fixed random seed, train a classification model, and print accuracy, precision, recall, F1-score and confusion matrix.",
        sampleInput: "Illustrative summary input:\nRows=1000, Features=6\nTrain/Test=80/20\nModel=RandomForest",
        expectedOutput: "Output format:\nAccuracy: <computed value>\nPrecision: <computed value>\nRecall: <computed value>\nF1-score: <computed value>\nConfusion Matrix:\n[[TN FP]\n[FN TP]]",
        constraints: "Do not invent metric values; calculate them from the supplied dataset. Prevent data leakage and explain why accuracy alone may be misleading."
      },
      {
        title: "Imbalanced Fraud Detection",
        situation: "A financial dataset contains 99% legitimate transactions and 1% fraudulent transactions. A model that predicts every transaction as legitimate would have high accuracy but be useless.",
        programmingTask: "Train a fraud classifier using a stratified split. Compare a baseline model with a class-weighted model or resampling approach. Report precision, recall, F1 and PR-AUC.",
        sampleInput: "Class distribution:\nLegitimate=9900\nFraud=100\nTest split=20%",
        expectedOutput: "Expected report:\nBaseline and improved-model metric tables\nFraud recall comparison\nPR-AUC comparison\nBest model selected with justification",
        constraints: "Keep test data untouched during resampling. Use a fixed random seed and explain the precision-recall trade-off."
      },
      {
        title: "Image Classification with Data Augmentation",
        situation: "A quality-control unit needs to classify product images as DEFECTIVE or NORMAL. The dataset has folders for each class.",
        programmingTask: "Create a transfer-learning image-classification pipeline with training/validation split, image resizing, normalization and data augmentation. Print validation accuracy and per-class precision/recall.",
        sampleInput: "Input:\nDataset folders: NORMAL/, DEFECTIVE/\nImage size: 224x224\nBatch size: 32\nEpochs: 5",
        expectedOutput: "Expected output:\nDataset classes: NORMAL, DEFECTIVE\nTraining started...\nEpoch-wise loss/accuracy\nValidation metrics per class",
        constraints: "Use a pretrained model when available. Do not use validation images for training augmentation or fitting."
      },
      {
        title: "Recommendation System",
        situation: "An online learning platform wants to recommend courses to students based on course ratings. Implement user-based collaborative filtering.",
        programmingTask: "Given a user-course rating matrix, calculate similarity between users and recommend the top two unrated courses for a target user.",
        sampleInput: "Users x Courses:\nU1: 5 4 0 0\nU2: 4 5 3 0\nU3: 0 2 5 4\nTarget=U1",
        expectedOutput: "Expected output format:\nRecommended course IDs:\nCourse 3\nCourse 4\n(Recommendations must be calculated from the implemented similarity method.)",
        constraints: "Treat 0 as missing, not as a rating. State the similarity measure and handle users with no overlapping ratings."
      },
      {
        title: "Text Sentiment Analysis",
        situation: "A product company receives customer reviews and wants to classify each review as positive or negative.",
        programmingTask: "Build a text-processing and classification pipeline using TF-IDF and a suitable classifier. Print predicted sentiment for each test review.",
        sampleInput: "Reviews:\n1. The delivery was fast and product is excellent.\n2. The item broke after one day and support was poor.",
        expectedOutput: "Review 1: Positive\nReview 2: Negative",
        constraints: "Fit preprocessing and vectorization on training data only. Explain tokenization and how unseen words are handled."
      },
      {
        title: "Model Evaluation and Threshold Tuning",
        situation: "A medical screening model outputs probability scores. The team wants to choose a decision threshold that prioritizes recall while keeping precision above a specified minimum.",
        programmingTask: "Given actual labels and predicted probabilities, evaluate thresholds from 0.1 to 0.9. Select the threshold with maximum recall among those with precision >= 0.80.",
        sampleInput: "Actual: 1 0 1 0 1 0\nProb:   0.9 0.8 0.7 0.4 0.6 0.2\nMinimum precision=0.80",
        expectedOutput: "Expected output:\nSelected threshold: <computed threshold>\nPrecision: <computed value>\nRecall: <computed value>",
        constraints: "Define positive prediction as probability >= threshold. If no threshold qualifies, print NO VALID THRESHOLD."
      },
      {
        title: "K-Means Customer Segmentation",
        situation: "A retailer wants to segment customers using annual income and spending score.",
        programmingTask: "Standardize the features, apply K-Means with K=3 and a fixed random seed, then print cluster labels and cluster centroids transformed back to the original scale.",
        sampleInput: "Customer data:\n(15,39)\n(16,81)\n(17,6)\n(70,20)\n(75,85)\n(80,16)\nK=3",
        expectedOutput: "Expected output:\nCustomer-wise cluster assignments\nThree cluster centroids (income, spending score)",
        constraints: "Cluster numbering may differ. Evaluate clustering with an appropriate metric and explain why scaling is important."
      },
      {
        title: "Neural Network from Scratch",
        situation: "A developer wants to understand a simple feed-forward neural network without using a high-level deep-learning framework.",
        programmingTask: "Implement a one-hidden-layer neural network for the XOR dataset using forward propagation, backpropagation and gradient descent. Print predictions after training.",
        sampleInput: "Inputs/targets:\n0 0 -> 0\n0 1 -> 1\n1 0 -> 1\n1 1 -> 0\nLearning rate=0.5\nEpochs=10000",
        expectedOutput: "Expected output:\nPredictions close to:\n0 0 -> 0\n0 1 -> 1\n1 0 -> 1\n1 1 -> 0",
        constraints: "Use a differentiable activation function. Small floating-point deviations are acceptable; set a reproducible seed."
      },
      {
        title: "Federated Learning Simulation",
        situation: "Three hospitals cannot share patient records but can share model updates. Simulate one round of federated averaging using local model weights and different dataset sizes.",
        programmingTask: "Calculate the weighted average of local model parameters using each hospital's sample count. Print the global parameters.",
        sampleInput: "Hospital A: n=100, weights=[1.0,2.0]\nHospital B: n=200, weights=[2.0,4.0]\nHospital C: n=100, weights=[3.0,6.0]",
        expectedOutput: "Global weights=[2.0,4.0]",
        constraints: "Use sample-count weighting. Explain why raw patient records are not sent to the central server in this simulation."
      },
      {
        title: "Explainable AI Feature Importance",
        situation: "A loan approval model must provide an explanation of the features that most influence predictions.",
        programmingTask: "Train a tree-based classifier on a supplied tabular dataset, calculate feature importance, rank the top three features, and generate a local explanation for one selected prediction using an explainability method.",
        sampleInput: "Input:\nDataset: loan_applications.csv\nTarget: approved\nSelected row: 15",
        expectedOutput: "Expected output:\nTop 3 features with importance scores\nSelected prediction: APPROVED/REJECTED\nLocal explanation: feature contributions",
        constraints: "Use only training data for model fitting. Distinguish global feature importance from local explanation; do not claim causation."
      }
    ]),
  },

  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    icon: "☁️",
    color: "cyan",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("cloud-engineer", [
      {
        title: "Virtual Machine Resource Scheduler",
        situation: "A cloud provider has a fixed CPU and RAM capacity. Each incoming VM request specifies CPU cores and RAM. Allocate requests in arrival order if both resources are available.",
        programmingTask: "Simulate allocation and print ACCEPTED or REJECTED for each request, followed by remaining CPU and RAM.",
        sampleInput: "Capacity: CPU=16 RAM=64\nRequests:\nvm1 4 16\nvm2 8 32\nvm3 6 8\nvm4 2 8",
        expectedOutput: "vm1 ACCEPTED\nvm2 ACCEPTED\nvm3 REJECTED\nvm4 ACCEPTED\nRemaining CPU=2 RAM=8",
        constraints: "CPU and RAM must never become negative. Each request is atomic: allocate both resources or neither."
      },
      {
        title: "Auto-Scaling Based on CPU Utilization",
        situation: "A cloud application scales out when CPU utilization exceeds 75% and scales in when utilization falls below 30%. The instance count must remain between 2 and 10.",
        programmingTask: "Process a sequence of utilization readings and output the instance count after each reading. Scale out/in by one instance per reading.",
        sampleInput: "Starting instances=3\nCPU readings: 80 85 25 20 15 95",
        expectedOutput: "Instance counts: 4 5 4 3 2 3",
        constraints: "At exactly 75% or 30%, do not scale. Respect minimum and maximum limits."
      },
      {
        title: "Load Balancer – Round Robin",
        situation: "A cloud service has N healthy servers. Incoming requests must be distributed in round-robin order. Unhealthy servers must be skipped.",
        programmingTask: "Given server health states and request count, print the server assigned to each request.",
        sampleInput: "Servers: S1 healthy, S2 down, S3 healthy\nRequests=5",
        expectedOutput: "R1 -> S1\nR2 -> S3\nR3 -> S1\nR4 -> S3\nR5 -> S1",
        constraints: "If no server is healthy, print NO SERVER AVAILABLE for every request."
      },
      {
        title: "Cloud Storage Deduplication",
        situation: "A cloud storage system receives files identified by their content hash and size. Store only the first copy of each unique hash and report storage saved by duplicates.",
        programmingTask: "Read file records, count unique hashes and calculate total physical storage used and duplicate storage avoided.",
        sampleInput: "5\nf1 hA 100\nf2 hB 200\nf3 hA 100\nf4 hC 50\nf5 hB 200",
        expectedOutput: "Unique files=3\nPhysical storage=350\nDuplicate storage avoided=300",
        constraints: "Assume identical hashes represent identical content. If a repeated hash has a different size, report inconsistent metadata."
      },
      {
        title: "Fault-Tolerant Service Health Check",
        situation: "A service is considered DOWN after three consecutive failed health checks. It returns UP after two consecutive successful checks.",
        programmingTask: "Process a sequence of SUCCESS/FAIL events and print the service state after each event.",
        sampleInput: "Events: SUCCESS FAIL FAIL FAIL SUCCESS SUCCESS FAIL",
        expectedOutput: "UP\nUP\nUP\nDOWN\nDOWN\nUP\nUP",
        constraints: "Initial state is UP. A single success does not restore a DOWN service."
      },
      {
        title: "Distributed Job Retry Manager",
        situation: "A distributed worker may fail while processing a job. Retry a failed job up to three times; after the third failure, mark it FAILED. Successful jobs are marked COMPLETED.",
        programmingTask: "Simulate job outcomes and print final status and number of attempts.",
        sampleInput: "Jobs:\nJ1: FAIL FAIL SUCCESS\nJ2: FAIL FAIL FAIL\nJ3: SUCCESS",
        expectedOutput: "J1 COMPLETED attempts=3\nJ2 FAILED attempts=3\nJ3 COMPLETED attempts=1",
        constraints: "A job stops retrying immediately after success. Clearly define whether the retry limit means total attempts or retries."
      },
      {
        title: "Network Bandwidth Allocation",
        situation: "A cloud data center has a bandwidth capacity. Clients request bandwidth in priority order, with lower priority number being more important.",
        programmingTask: "Sort requests by priority and allocate bandwidth while capacity remains. If a request cannot be fully satisfied, reject it rather than partially allocating.",
        sampleInput: "Capacity=100\nRequests:\nA 40 2\nB 50 1\nC 30 3\nD 20 2",
        expectedOutput: "B ACCEPTED\nA ACCEPTED\nD ACCEPTED\nC REJECTED\nRemaining bandwidth=10",
        constraints: "For equal priority, preserve arrival order."
      },
      {
        title: "Container Dependency Deployment",
        situation: "A microservice application contains containers with dependencies. A service can be deployed only after all its dependencies are deployed.",
        programmingTask: "Given a directed dependency graph, generate a valid deployment order using topological sorting. Detect cycles.",
        sampleInput: "Services=6\nDependencies:\nAPI DB\nAPI AUTH\nAUTH USER\nWORKER DB\nREPORT API\nREPORT WORKER",
        expectedOutput: "One valid order:\nDB USER AUTH WORKER API REPORT",
        constraints: "If dependencies contain a cycle, print DEPLOYMENT BLOCKED: CYCLE DETECTED. Multiple valid orders are acceptable."
      },
      {
        title: "Cloud Cost Estimator",
        situation: "A cloud team wants to estimate monthly compute cost. Each VM has an hourly rate and usage hours. Apply a 12% discount if total pre-discount cost is at least 10,000.",
        programmingTask: "Calculate per-VM cost, total cost, discount and final bill. Round currency to two decimal places.",
        sampleInput: "VMs=2\nweb 2.5 1000\napi 4.0 1500",
        expectedOutput: "web cost=2500.00\napi cost=6000.00\nSubtotal=8500.00\nDiscount=0.00\nFinal=8500.00",
        constraints: "Rates are per hour. Use decimal-safe arithmetic where possible."
      },
      {
        title: "Disaster Recovery – Backup Selection",
        situation: "A system has backup files with timestamps and sizes. It needs the latest backup that does not exceed a storage limit.",
        programmingTask: "Select the eligible backup with the latest timestamp. If timestamps tie, choose the smaller file. Print NONE if no backup fits.",
        sampleInput: "Limit=500\nB1 2026-10-28 450\nB2 2026-10-30 550\nB3 2026-10-29 400\nB4 2026-10-29 350",
        expectedOutput: "Selected Backup=B4\nTimestamp=2026-10-29\nSize=350",
        constraints: "Assume timestamps use YYYY-MM-DD. State how equal timestamps are resolved."
      }
    ]),
  },

  {
    id: "software-developer",
    name: "Software Developer (SDE)",
    icon: "💻",
    color: "orange",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("software-developer", [
      {
        title: "LRU Cache Implementation",
        situation: "A software service uses a cache of capacity K. GET accesses an item and updates its recency; PUT inserts or updates an item. When full, evict the least recently used item.",
        programmingTask: "Implement an LRU cache supporting GET and PUT in O(1) average time. Print GET results and final cache order from most to least recent.",
        sampleInput: "Capacity=2\nPUT 1 10\nPUT 2 20\nGET 1\nPUT 3 30\nGET 2\nGET 3",
        expectedOutput: "GET 1=10\nGET 2=-1\nGET 3=30\nCache MRU->LRU: 3 1",
        constraints: "Use a hash map plus doubly linked list or an equivalent standard-library structure."
      },
      {
        title: "Meeting Room Allocation",
        situation: "A company receives meeting intervals. Meetings that overlap cannot use the same room. Find the minimum number of rooms required.",
        programmingTask: "Given start and end times, calculate the minimum room count and assign a room number to each meeting.",
        sampleInput: "5\n0 30\n5 10\n15 20\n35 40\n10 15",
        expectedOutput: "Minimum rooms=2\nOne valid assignment: 1 2 2 1 2",
        constraints: "Intervals are [start,end); a meeting ending at time t does not overlap one starting at t."
      },
      {
        title: "Dependency-Aware Build System",
        situation: "A software build contains modules with dependencies. A module can be compiled only after its dependencies.",
        programmingTask: "Print a valid compilation order or report a cycle. If multiple modules are available, choose the lexicographically smallest module.",
        sampleInput: "Modules=5\nA: C B\nB: D\nC: D\nD:\nE: A",
        expectedOutput: "Build order: D B C A E",
        constraints: "Use topological sorting with a priority queue. Interpret listed modules as depending on the names after the colon."
      },
      {
        title: "Versioned Key-Value Store",
        situation: "A distributed application stores multiple versions of a key. Each write has a timestamp. A read at time T must return the latest version written at or before T.",
        programmingTask: "Process WRITE and READ operations and return the correct value for each read.",
        sampleInput: "WRITE x 10 5\nWRITE x 20 9\nWRITE y 7 6\nREAD x 8\nREAD x 10\nREAD y 8",
        expectedOutput: "READ x 8 = NOT FOUND\nREAD x 10 = 20\nREAD y 8 = 7",
        constraints: "Timestamps may arrive out of order. For equal timestamps, define and implement a deterministic tie rule."
      },
      {
        title: "Rate-Limited Task Queue",
        situation: "A job processor can execute at most K jobs in every rolling W-second interval. Jobs arrive with timestamps and IDs.",
        programmingTask: "Accept or reject each job while maintaining the rolling time window. Print accepted job IDs.",
        sampleInput: "K=2 W=5\n1 J1\n2 J2\n3 J3\n6 J4\n7 J5",
        expectedOutput: "J1 ACCEPTED\nJ2 ACCEPTED\nJ3 REJECTED\nJ4 ACCEPTED\nJ5 ACCEPTED",
        constraints: "A job exactly W seconds after a previous job is outside that previous job's window. Input is timestamp-sorted."
      },
      {
        title: "Shortest Transformation Sequence",
        situation: "A word game changes one character at a time. Every intermediate word must belong to a supplied dictionary.",
        programmingTask: "Find the length of the shortest transformation from beginWord to endWord using BFS. If impossible, print 0.",
        sampleInput: "begin=hit\nend=cog\nwords=hot dot dog lot log cog",
        expectedOutput: "Shortest sequence length=5\nOne path: hit -> hot -> dot -> dog -> cog",
        constraints: "All words have equal length. Compare words case-sensitively."
      },
      {
        title: "Thread-Safe Inventory Simulation",
        situation: "An inventory service receives ordered stock updates and purchase requests. A purchase succeeds only if sufficient stock remains.",
        programmingTask: "Simulate the operations sequentially and print the stock after each purchase. Reject purchases that exceed available stock.",
        sampleInput: "Initial stock=10\nBUY 4\nADD 3\nBUY 8\nBUY 1",
        expectedOutput: "BUY 4: SUCCESS, stock=6\nADD 3: stock=9\nBUY 8: SUCCESS, stock=1\nBUY 1: SUCCESS, stock=0",
        constraints: "Do not allow negative stock. In the explanation, describe how locking or atomic database updates would be needed for concurrent requests."
      },
      {
        title: "Expression Evaluator",
        situation: "A calculator service must evaluate arithmetic expressions containing integers, parentheses and operators +, -, * and /.",
        programmingTask: "Implement an expression parser that respects operator precedence and parentheses. Division should truncate toward zero.",
        sampleInput: "Expression: 12 + 3 * (8 - 2) / 3",
        expectedOutput: "Result=18",
        constraints: "Support whitespace and multi-digit integers. Detect malformed expressions and division by zero."
      },
      {
        title: "Top-K Frequent Events",
        situation: "An application records event IDs. Find the K most frequent IDs. For equal frequencies, smaller event ID comes first.",
        programmingTask: "Count event frequencies and print the top K IDs in the required order.",
        sampleInput: "N=10 K=3\n4 1 2 2 3 3 3 2 4 4",
        expectedOutput: "Top K: 2 3 4",
        constraints: "Target better than O(n log n) if using a suitable heap/bucket strategy; explain complexity."
      },
      {
        title: "Merge K Sorted Logs",
        situation: "A monitoring platform stores K individually sorted log timestamp streams. Merge them into one globally sorted stream.",
        programmingTask: "Merge K sorted arrays using an efficient approach and print all timestamps.",
        sampleInput: "K=3\n[1,4,7]\n[2,5,8]\n[3,6,9]",
        expectedOutput: "1 2 3 4 5 6 7 8 9",
        constraints: "Total number of elements may be 10^6. Target O(N log K) using a min-heap."
      }
    ]),
  },

  {
    id: "data-analytics",
    name: "Data Analytics",
    icon: "📊",
    color: "green",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("data-analytics", [
      {
        title: "Retail Sales KPI Dashboard",
        situation: "A retailer stores transaction date, product, region, quantity and unit price. Generate total revenue, total units sold, top product and region-wise revenue.",
        programmingTask: "Read a CSV dataset using Pandas, handle missing/invalid rows, calculate KPIs and print a concise report.",
        sampleInput: "Illustrative rows:\ndate,product,region,qty,price\n2026-01-01,Phone,North,2,10000\n2026-01-02,Laptop,South,1,50000\n2026-01-03,Phone,South,1,10000",
        expectedOutput: "Total revenue=70000\nUnits sold=4\nTop product by revenue=Phone or Laptop (tie rule must be stated)\nNorth revenue=20000\nSouth revenue=60000",
        constraints: "Use quantity*price for revenue. Explain how missing quantity/price values are handled."
      },
      {
        title: "Customer Cohort Retention",
        situation: "A subscription company wants to measure customer retention by signup month. A customer is retained in a later month if they make at least one purchase in that month.",
        programmingTask: "Build a cohort retention table from customer_id, signup_date and activity_date. Show month-0, month-1 and month-2 retention percentages.",
        sampleInput: "Illustrative records:\nC1 2026-01 2026-01\nC1 2026-01 2026-02\nC2 2026-01 2026-01\nC3 2026-01 2026-03",
        expectedOutput: "January cohort size=3\nMonth 0 retention=100%\nMonth 1 retention=33.33%\nMonth 2 retention=33.33%",
        constraints: "Count unique customers per cohort/activity month. Define month offsets consistently."
      },
      {
        title: "Outlier Detection in Sensor Data",
        situation: "An industrial sensor reports temperature readings. Identify outliers using the IQR method.",
        programmingTask: "Calculate Q1, Q3 and IQR, then flag values below Q1-1.5*IQR or above Q3+1.5*IQR.",
        sampleInput: "Readings: 20 21 22 22 23 24 25 26 100",
        expectedOutput: "Outlier(s): 100\n(Quartile values depend on the stated quartile convention.)",
        constraints: "State the quartile calculation convention used by your programming library or implementation."
      },
      {
        title: "Time-Series Moving Average",
        situation: "A business tracks daily sales and wants a 3-day moving average. For each day from day 3 onward, calculate the average of that day and the previous two days.",
        programmingTask: "Read N daily sales values and print the moving average rounded to two decimal places.",
        sampleInput: "N=5\nSales=10 20 30 40 50",
        expectedOutput: "Moving averages:\nDay 3: 20.00\nDay 4: 30.00\nDay 5: 40.00",
        constraints: "Use a rolling sum for O(N) time rather than recalculating each window."
      },
      {
        title: "A/B Test Statistical Comparison",
        situation: "A product team tests two website designs. Group A and Group B contain independent conversion outcomes (1=converted, 0=not converted). Calculate conversion rates and perform a two-proportion significance test.",
        programmingTask: "Read both groups, calculate conversion rates, difference in percentage points and a two-sided p-value. State whether the result is significant at alpha=0.05.",
        sampleInput: "Group A: 1 0 0 1 0 1 0 0 1 0\nGroup B: 1 1 0 1 1 0 1 0 1 1",
        expectedOutput: "Expected report:\nA conversion rate=40.00%\nB conversion rate=70.00%\nDifference=30.00 percentage points\np-value=<computed>\nDecision at alpha=0.05=<computed>",
        constraints: "Use an appropriate two-proportion z-test or exact test. State assumptions and do not hardcode the p-value."
      },
      {
        title: "Data Cleaning and Missing Value Report",
        situation: "A data analyst receives a customer CSV with missing ages, duplicate customer IDs and inconsistent city casing.",
        programmingTask: "Clean the dataset by removing duplicate IDs (keep the latest record), standardizing city names and imputing missing ages with the median. Print before/after row counts and a cleaning summary.",
        sampleInput: "Illustrative input:\nID,Age,City,Date\n1,20,mohali,2026-01-01\n2,,CHANDIGARH,2026-01-02\n1,25,Mohali,2026-01-03",
        expectedOutput: "Rows before=3\nRows after deduplication=2\nID 1 age=25 city=Mohali\nID 2 age=<median-imputed value> city=Chandigarh",
        constraints: "Parse dates correctly. Calculate the median from the deduplicated data and document the imputation rule."
      },
      {
        title: "RFM Customer Segmentation",
        situation: "An online store wants to segment customers using Recency, Frequency and Monetary value.",
        programmingTask: "From transaction data, calculate R, F and M per customer relative to a supplied analysis date. Assign simple score bands and identify the highest-value segment.",
        sampleInput: "Analysis date=2026-02-01\nTransactions:\nC1 2026-01-20 100\nC1 2026-01-25 200\nC2 2025-12-01 500\nC3 2026-01-30 50",
        expectedOutput: "C1: Recency=7 days, Frequency=2, Monetary=300\nC2: Recency=62 days, Frequency=1, Monetary=500\nC3: Recency=2 days, Frequency=1, Monetary=50",
        constraints: "Use unique transaction IDs in real datasets to avoid double counting. Define score cutoffs before segment assignment."
      },
      {
        title: "Correlation and Multicollinearity Analysis",
        situation: "A data science team has numeric features for house price prediction. Identify highly correlated feature pairs and report variance inflation factors (VIF).",
        programmingTask: "Load a numeric dataset, calculate the correlation matrix, list pairs with absolute correlation >=0.85 and calculate VIF for each feature.",
        sampleInput: "Input file: housing_features.csv\nThreshold=0.85",
        expectedOutput: "Expected output:\nHighly correlated pairs:\n<feature A> - <feature B>: <correlation>\nVIF table for each feature",
        constraints: "Handle constant columns and missing values. Explain why correlation does not prove causation."
      },
      {
        title: "Forecast Monthly Demand",
        situation: "A retailer has monthly product demand for 24 months. Build a baseline forecasting model and predict the next three months.",
        programmingTask: "Create a time-ordered train/test split, fit a suitable baseline such as seasonal naive or moving average, calculate MAE and RMSE, then forecast three months.",
        sampleInput: "Input: demand.csv\nColumns: month, demand\nRows: 24",
        expectedOutput: "Expected output:\nTest MAE=<computed>\nTest RMSE=<computed>\nForecast month 25=<computed>\nForecast month 26=<computed>\nForecast month 27=<computed>",
        constraints: "Do not randomly shuffle time-series data. Explain the baseline and any seasonality assumptions."
      },
      {
        title: "SQL Analytics – Running Total and Rank",
        situation: "A sales database contains employee_id, sale_date and amount. Produce each employee's running sales total and rank employees by total sales within each region.",
        programmingTask: "Write an SQL query using window functions (or implement the equivalent in code) to calculate running totals and regional ranking.",
        sampleInput: "Sales:\nE1 North 100\nE1 North 150\nE2 North 200\nE3 South 300\nE4 South 100",
        expectedOutput: "Expected summary:\nNorth: E2 total=200 rank=1; E1 total=250 rank=1 (ranking is based on employee total)\nSouth: E3 total=300 rank=1; E4 total=100 rank=2",
        constraints: "Clarify the grouping level. Provide a correct query with PARTITION BY and ORDER BY; include a deterministic tie-breaker."
      }
    ]),
  },

  {
    id: "cyber-security",
    name: "Cyber Security",
    icon: "🔐",
    color: "red",
    durationMinutes: 60,
    totalQuestions: 10,
    totalMarks: 100,
    questions: makeQuestions("cyber-security", [
      {
        title: "Brute-Force Login Detection",
        situation: "A server log contains username, timestamp and login status. Flag an account if it has at least five failed login attempts within any rolling 10-minute window.",
        programmingTask: "Read the log records and print each flagged username and the timestamps of the matching window.",
        sampleInput: "Records:\nana 09:00 FAIL\nana 09:02 FAIL\nana 09:04 FAIL\nana 09:06 FAIL\nana 09:09 FAIL\nbob 09:01 FAIL\nbob 09:20 FAIL",
        expectedOutput: "Flagged account: ana\nWindow: 09:00 to 09:09\nFailed attempts: 5",
        constraints: "Input is timestamp-sorted. Use a rolling window per user. Do not flag bob."
      },
      {
        title: "File Integrity Verification",
        situation: "A security tool stores a trusted SHA-256 hash for each critical file. It must detect whether files have changed.",
        programmingTask: "Read file paths and trusted hashes, calculate current SHA-256 hashes, and report MATCH or MODIFIED. Report MISSING if a file does not exist.",
        sampleInput: "Manifest:\nconfig.txt <trusted_hash_1>\nusers.db <trusted_hash_2>",
        expectedOutput: "config.txt: MATCH or MODIFIED\nusers.db: MATCH or MODIFIED",
        constraints: "Use a cryptographic hash library. Do not implement SHA-256 manually. Explain why MD5 is not suitable for integrity against deliberate tampering."
      },
      {
        title: "Suspicious IP Detection",
        situation: "A web server records IP addresses and request counts per minute. Flag an IP if it makes more than 100 requests in any one-minute bucket.",
        programmingTask: "Aggregate requests by IP and minute, then print flagged IPs with the relevant minute and count.",
        sampleInput: "Requests:\n10.0.0.1 12:00 60\n10.0.0.1 12:00 55\n10.0.0.2 12:00 40\n10.0.0.1 12:01 20",
        expectedOutput: "10.0.0.1 at 12:00: 115 requests",
        constraints: "Treat each record's count as a batch of requests. Do not combine separate minutes."
      },
      {
        title: "Role-Based Access Control",
        situation: "An enterprise system defines roles and permissions. A user may access a resource only if at least one assigned role grants the requested permission.",
        programmingTask: "Read role-permission mappings and user-role assignments. For each access request, print ALLOW or DENY.",
        sampleInput: "Roles:\nADMIN: READ WRITE DELETE\nANALYST: READ\nGUEST: READ\nUser1 roles: ANALYST GUEST\nRequests: READ, WRITE, DELETE",
        expectedOutput: "READ: ALLOW\nWRITE: DENY\nDELETE: DENY",
        constraints: "Support multiple roles per user and deny by default. Explain least privilege."
      },
      {
        title: "Password Strength and Policy Audit",
        situation: "A company audits passwords against a policy: minimum 12 characters, uppercase, lowercase, digit and special character. The password must not contain the username.",
        programmingTask: "Validate each username/password pair and print all failed policy rules without displaying the password itself.",
        sampleInput: "username=alex\npassword=Alex2026!",
        expectedOutput: "Policy failures:\n- Minimum length 12 characters",
        constraints: "Do not log or print plaintext passwords. Treat whitespace and Unicode consistently and state your assumptions."
      },
      {
        title: "Secure File Transfer – Chunk Integrity",
        situation: "A file is transferred in chunks. Each chunk has an expected SHA-256 digest. Verify every received chunk and report the first corrupted chunk.",
        programmingTask: "Calculate the digest for each chunk and compare it with the expected digest. Print VERIFIED if all match; otherwise report the chunk index.",
        sampleInput: "Chunks:\n1 data=HELLO expected=<sha256 of HELLO>\n2 data=WORLD expected=<sha256 of NOTWORLD>",
        expectedOutput: "Chunk 1: VERIFIED\nChunk 2: CORRUPTED\nTransfer: REJECTED",
        constraints: "Use a standard SHA-256 implementation. The expected digest values should be generated using the same encoding, such as UTF-8."
      },
      {
        title: "Network Packet Allow/Deny Filter",
        situation: "A firewall receives packets with source IP, destination port and protocol. Apply rules in order; the first matching rule determines ALLOW or DENY.",
        programmingTask: "Implement a simple rule engine supporting exact IP, port and protocol, plus wildcard values. Print the action for each packet.",
        sampleInput: "Rules:\nDENY 10.0.0.5 * *\nALLOW * 443 TCP\nDENY * * *\nPackets:\n10.0.0.5 443 TCP\n10.0.0.8 443 TCP\n10.0.0.8 80 TCP",
        expectedOutput: "Packet 1: DENY\nPacket 2: ALLOW\nPacket 3: DENY",
        constraints: "Rule order is significant. Use first-match semantics and deny if no rule matches."
      },
      {
        title: "PII Detection and Masking",
        situation: "A log sanitization service must mask email addresses and 10-digit phone numbers before logs are shared.",
        programmingTask: "Write a program using regular expressions to replace email local/domain content with [EMAIL] and phone numbers with [PHONE]. Preserve all other text.",
        sampleInput: "Contact aman@example.com or call 9876543210 immediately.",
        expectedOutput: "Contact [EMAIL] or call [PHONE] immediately.",
        constraints: "Handle multiple matches in one line. Avoid masking arbitrary 10-digit sequences embedded in longer numbers."
      },
      {
        title: "Security Event Correlation",
        situation: "A security monitoring system receives events for each user. Raise an alert if a user has a failed login followed by a privileged action within five minutes.",
        programmingTask: "Process timestamped events and correlate events per user. Print an alert with both event timestamps when the rule is satisfied.",
        sampleInput: "Events:\n09:00 u1 LOGIN_FAIL\n09:03 u1 DELETE_USER\n09:01 u2 LOGIN_FAIL\n09:10 u2 DELETE_USER",
        expectedOutput: "ALERT u1: LOGIN_FAIL 09:00 -> DELETE_USER 09:03",
        constraints: "Events must be for the same user; the privileged action must occur after the failure and within five minutes."
      },
      {
        title: "Encrypted Message – Caesar Cipher Audit",
        situation: "A legacy application uses a Caesar cipher for demonstration purposes. Encrypt and decrypt alphabetic text by a supplied shift while preserving case and punctuation.",
        programmingTask: "Implement encryption and decryption. Support negative shifts and shifts larger than 26.",
        sampleInput: "Mode=ENCRYPT\nText=Attack at Dawn!\nShift=3",
        expectedOutput: "Encrypted= Dwwdfn dw Gdzq!",
        constraints: "This is an educational cipher, not secure encryption. Normalize shifts modulo 26 and leave nonletters unchanged."
      }
    ]),
  },
];
export const programmingTracks = programmingQuestionBank;
export default programmingQuestionBank;

// Add this array to the existing LMS question-bank configuration.
// Each track contains 10 subjective programming questions (10 marks each).