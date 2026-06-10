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
