# Stage 1 - Notification System API Design

## Overview

The system provides real-time notifications to students regarding Placements, Results and Events.

All APIs are protected and require Bearer Token authentication.

---

## Authentication

Header:

Authorization: Bearer <token>

---

## Notification Object

```json
{
  "id": "uuid",
  "studentId": 2315001239,
  "type": "Placement",
  "message": "Microsoft Hiring Drive",
  "isRead": false,
  "createdAt": "2026-06-10T12:00:00Z"
}
```

---

## APIs

### 1. Get Notifications

GET /notifications

Query Parameters:

* page
* limit
* notification_type

Example:

GET /notifications?page=1&limit=20&notification_type=Placement

Response:

```json
{
  "notifications": []
}
```

---

### 2. Get Notification By ID

GET /notifications/{id}

Response:

```json
{
  "notification": {}
}
```

---

### 3. Create Notification

POST /notifications

Request:

```json
{
  "studentId": 2315001239,
  "type": "Placement",
  "message": "Google Hiring Drive"
}
```

Response:

```json
{
  "success": true
}
```

---

### 4. Mark Notification As Read

PUT /notifications/{id}/read

Response:

```json
{
  "success": true
}
```

---

### 5. Delete Notification

DELETE /notifications/{id}

Response:

```json
{
  "success": true
}
```

---

## Real Time Notification Design

Technology: WebSocket

Flow:

1. Student connects to WebSocket server.
2. Notification is generated.
3. Server pushes notification instantly.
4. Frontend updates automatically without refresh.

---

## Error Handling

400 Bad Request

401 Unauthorized

404 Not Found

500 Internal Server Error

---

# Stage 2 - Database Design

## Students Table

| Column | Type    |
| ------ | ------- |
| id     | bigint  |
| name   | varchar |
| email  | varchar |

## Notifications Table

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| student_id | bigint    |
| type       | varchar   |
| message    | text      |
| is_read    | boolean   |
| created_at | timestamp |

## Relationship

One Student → Many Notifications

## Indexes

```sql
CREATE INDEX idx_student
ON notifications(student_id);

CREATE INDEX idx_student_read
ON notifications(student_id, is_read);

CREATE INDEX idx_created
ON notifications(created_at);
```

## Scaling Considerations

1. Pagination for large result sets.
2. Redis cache for frequently accessed notifications.
3. Read replicas for heavy read traffic.
4. Database partitioning based on creation date.
5. Composite indexes for common queries.
 

 # Stage 3

## Query Analysis

Given Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is the query accurate?

Yes. It correctly retrieves unread notifications for a specific student ordered by creation time.

### Why is the query slow?

As the notifications table grows to millions of rows, the database may perform a large scan before filtering records.

The query filters using:

* studentID
* isRead

and sorts using:

* createdAt

Without a suitable composite index, the database must perform additional sorting and scanning operations.

### Recommended Index

```sql
CREATE INDEX idx_notification_lookup
ON notifications(studentID, isRead, createdAt);
```

This allows the database to efficiently:

1. Locate notifications for a student.
2. Filter unread notifications.
3. Return records already ordered by createdAt.

### Should we add indexes on every column?

No.

Reasons:

1. Additional storage consumption.
2. Slower INSERT operations.
3. Slower UPDATE operations.
4. Increased index maintenance overhead.

Indexes should only be added for frequently queried columns.

### Placement Notifications in Last 7 Days

```sql
SELECT *
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

### Expected Computational Cost

Without index:

* O(N)

With composite index:

* Approximately O(log N)
# Stage 4

## Problem

Notifications are being fetched on every page load for every student.

As the number of students grows, database load increases significantly, resulting in slower response times and poor user experience.

---

## Proposed Solutions

### 1. Pagination

Instead of fetching all notifications:

```http
GET /notifications?page=1&limit=20
```

Benefits:

* Smaller result set
* Faster response time
* Reduced database load

Tradeoff:

* Requires multiple API requests

---

### 2. Redis Cache

Frequently accessed notifications can be stored in Redis.

Benefits:

* Extremely fast reads
* Reduced database traffic

Tradeoff:

* Cache invalidation complexity
* Possibility of stale data

---

### 3. Read Replicas

Use primary database for writes and replicas for reads.

Benefits:

* Improved scalability
* Reduced load on primary database

Tradeoff:

* Replication lag

---

### 4. Composite Indexes

Indexes on frequently queried fields:

```sql
CREATE INDEX idx_notification_lookup
ON notifications(studentID, isRead, createdAt);
```

Benefits:

* Faster query execution

Tradeoff:

* Increased storage
* Slower writes

---

## Recommended Approach

Use a combination of:

1. Pagination
2. Redis Cache
3. Read Replicas
4. Proper Indexing

This provides the best balance between performance and scalability.
 

 # Stage 5

## Problems with Current Implementation

Current pseudocode:

```python
for student_id in student_ids:
    send_email(student_id, message)
    save_to_db(student_id, message)
    push_to_app(student_id, message)
```

### Issues

1. Slow execution for 50,000 students.
2. Email failure stops processing.
3. Partial success is difficult to handle.
4. No retry mechanism.
5. Tight coupling between operations.

---

## Proposed Architecture

### Step 1

HR clicks "Notify All".

### Step 2

Notification Service creates notification jobs.

### Step 3

Jobs are placed into a Message Queue.

Examples:

* RabbitMQ
* Kafka

### Step 4

Dedicated workers process jobs asynchronously.

Workers:

* Email Worker
* Database Worker
* Push Notification Worker

---

## Retry Mechanism

Failed jobs are retried automatically.

Example:

* Retry 1
* Retry 2
* Retry 3

If all retries fail:

Move message to Dead Letter Queue (DLQ).

---

## Benefits

1. High scalability
2. Fault tolerance
3. Faster response time
4. Independent processing
5. Reliable notification delivery

---

## Revised Pseudocode

```python
def notify_all(student_ids, message):

    for student_id in student_ids:
        queue.publish({
            "studentId": student_id,
            "message": message
        })

# Email Worker
consume():
    send_email()

# Database Worker
consume():
    save_to_db()

# Push Worker
consume():
    push_to_app()
```

# Stage 6

## Priority Logic

Notification Priority:

| Type      | Weight |
| --------- | ------ |
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Notifications are sorted by:

1. Priority Weight (Descending)
2. Timestamp (Descending)

---

## Approach

1. Fetch notifications from API.
2. Assign weight based on notification type.
3. Sort by:

   * Weight DESC
   * Timestamp DESC
4. Return first 10 notifications.

---

## Handling New Notifications

Instead of repeatedly sorting the entire collection, a Min Heap of size 10 can be maintained.

Benefits:

* O(log k) insertion
* Efficient for continuous streams
* Memory efficient

Where:

k = 10

---

## Time Complexity

Sorting Approach:

O(n log n)

Heap Approach:

O(n log 10)

≈ O(n)

---

## Scalability

Heap based solution scales better when notification volume grows significantly.

