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

### Real-time Notifications

* Use WebSockets for instant updates
* Push notifications when new event occurs

---

## Stage 2 — Database Design

### Database Choice

MongoDB is used because:

* Flexible schema
* High scalability
* Fast read/write performance

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

* Sharding based on userId
* Pagination for large data
* Archiving old notifications

---

## Stage 3 — Query Optimization

### Problem

Slow query due to full table scan

### Solution

CREATE INDEX idx_user_read_created
ON notifications(studentId, isRead, createdAt DESC);

Optimized query:
SELECT id, message, type, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;

---

## Stage 4 — Performance Optimization

* Use Redis caching
* Use pagination
* Lazy load notifications
* Use read replicas

---

## Stage 5 — Reliable Notification System

* Use message queue (Kafka / RabbitMQ)
* Save to DB first
* Process via worker
* Retry on failure

---

## Stage 6 — Priority Notification System

Priority:
Placement > Result > Event

Sort by:

1. Type priority
2. Timestamp

Return top 10 notifications

---
