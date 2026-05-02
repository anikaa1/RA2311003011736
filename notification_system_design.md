# Notification System Design

---

## Stage 1 — API Design

### Endpoints

1. GET /notifications  
Fetch all notifications for a user  

2. POST /notifications  
Create a new notification  

3. PUT /notifications/:id/read  
Mark a notification as read  

---

### Request Example

POST /notifications

{
  "userId": "1042",
  "type": "Placement",
  "message": "You got selected!"
}

---

### Response Example

{
  "id": "abc123",
  "userId": "1042",
  "type": "Placement",
  "message": "You got selected!",
  "isRead": false,
  "createdAt": "timestamp"
}

---

### Real-time Notifications

- Use WebSockets for instant updates  
- Push notifications when new event occurs  

---

## Stage 2 — Database Design

### Database Choice

MongoDB is used because:
- Flexible schema  
- High scalability  
- Fast read/write performance  

---

### Schema

{
  "_id": "notification_id",
  "userId": "student_id",
  "type": "Event | Result | Placement",
  "message": "string",
  "isRead": false,
  "createdAt": "timestamp"
}

---

### Indexing

db.notifications.createIndex({ userId: 1, isRead: 1 })  
db.notifications.createIndex({ createdAt: -1 })  

---

### Queries

Get unread notifications:

db.notifications.find({
  userId: "1042",
  isRead: false
}).sort({ createdAt: -1 })

---

Mark notification as read:

db.notifications.updateOne(
  { _id: "notification_id" },
  { $set: { isRead: true } }
)

---

Insert notification:

db.notifications.insertOne({
  userId: "1042",
  type: "Placement",
  message: "You got selected!",
  isRead: false,
  createdAt: new Date()
})

---

### Scaling

- Sharding based on userId  
- Pagination for large data  
- Archiving old notifications  

---

## Stage 3 — Query Optimization

### Problem
Query used:
SELECT * FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC;

### Issues
- Full table scan → slow for millions of records
- No indexing → poor performance
- SELECT * → unnecessary data fetch

### Solution

1. Create Composite Index:
CREATE INDEX idx_user_read_created
ON notifications(studentId, isRead, createdAt DESC);

2. Optimized Query:
SELECT id, message, type, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;

### Why not index every column?
- Increases storage
- Slows down inserts/updates
- Not all columns are queried frequently

---

## Stage 4 — Performance Optimization

### Problem
Notifications fetched on every page load → DB overload

### Solutions

1. Caching (Redis)
- Store recent notifications per user
- Reduce DB hits

2. Pagination
- Load limited results (e.g., 20 per request)

3. Lazy Loading
- Load notifications only when user opens panel

4. Read Replicas
- Use replicas for read-heavy operations

5. CDN / Edge caching (optional)

---

## Stage 5 — Reliable Notification System

### Problem
send_email fails midway → inconsistent state

### Issues
- Partial failure
- No retry mechanism
- DB and email not synchronized

### Solution

Use Queue-based architecture (RabbitMQ / Kafka)

### Flow

1. Save notification to DB
2. Push event to queue
3. Worker processes queue:
   - Send email
   - Send push notification
4. Retry on failure

### Benefits
- Reliable
- Scalable
- Fault-tolerant

### Improved Pseudocode

function notify_all(student_ids, message):
    for student_id in student_ids:
        save_to_db(student_id, message)
        push_to_queue(student_id, message)

worker():
    while(true):
        job = get_from_queue()
        send_email(job)
        send_push(job)

---

## Stage 6 — Priority Notification System

### Goal
Show top 10 important unread notifications

### Priority Rules
- Placement > Result > Event
- Newer notifications have higher priority

### Implementation (Node.js)

const axios = require("axios");

const TOKEN = "YOUR_TOKEN";

async function getPriorityNotifications() {
    const res = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    let notifications = res.data.notifications;

    const priorityMap = {
        Placement: 3,
        Result: 2,
        Event: 1
    };

    notifications.sort((a, b) => {
        const priorityDiff = priorityMap[b.type] - priorityMap[a.type];
        if (priorityDiff !== 0) return priorityDiff;

        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    const top10 = notifications.slice(0, 10);

    console.log(top10);
}

getPriorityNotifications();

### Optimization
- Use Min Heap (size 10) for streaming data
- Avoid sorting full dataset repeatedly