# Notification System Design

---

## Stage 1 — API Design

### Endpoints

**1. GET /notifications**
Fetch all notifications for a user
Query Params:

* `userId`
* `limit` (optional)
* `page` (optional)

---

**2. POST /notifications**
Create a new notification

Request Body:

```
{
  "userId": "1042",
  "type": "Placement",
  "message": "You got selected!"
}
```

---

**3. PUT /notifications/:id/read**
Mark a notification as read

---

### Real-time Notifications

* Use WebSockets for instant updates
* Push notifications when a new event occurs
* Maintain persistent connection for live delivery

---

## Stage 2 — Database Design

### Database Choice

MongoDB is used because:

* Flexible schema for different notification types
* High scalability for large user base
* Fast read/write performance
* Easy horizontal scaling with sharding

---

### Schema (Collection: notifications)

```
{
  _id: ObjectId,
  userId: String,
  type: String,        
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

---

### Indexing

```
db.notifications.createIndex({ userId: 1, isRead: 1 })
db.notifications.createIndex({ createdAt: -1 })
```

---

### Queries

**Get unread notifications**

```
db.notifications.find({
  userId: "1042",
  isRead: false
}).sort({ createdAt: -1 }).limit(20)
```

---

**Mark notification as read**

```
db.notifications.updateOne(
  { _id: ObjectId("notification_id") },
  { $set: { isRead: true } }
)
```

---

**Insert notification**

```
db.notifications.insertOne({
  userId: "1042",
  type: "Placement",
  message: "You got selected!",
  isRead: false,
  createdAt: new Date()
})
```

---

### Scaling

* Sharding based on `userId`
* Pagination for large datasets
* Archiving old notifications
* Use TTL indexes for automatic cleanup (optional)

---

## Stage 3 — Query Optimization

### Problem

Query is slow due to:

* Full table scan
* No proper indexing
* Fetching unnecessary columns

---

### Solution

**Create composite index**

```
CREATE INDEX idx_user_read_created
ON notifications(studentId, isRead, createdAt DESC);
```

---

**Optimized Query**

```
SELECT id, message, type, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```

---

### Why not index every column?

* Increases storage overhead
* Slows down inserts and updates
* Not all columns are frequently queried

---

## Stage 4 — Performance Optimization

* Use **Redis caching** for recent notifications
* Implement **pagination** to limit data load
* Use **lazy loading** (load only when user opens panel)
* Use **read replicas** for heavy read traffic
* Optional: Edge caching/CDN for global users

---

## Stage 5 — Reliable Notification System

### Problem

Failures in sending notifications lead to inconsistent state.

---

### Solution: Queue-Based Architecture

* Use Kafka / RabbitMQ

---

### Flow

1. Save notification to DB
2. Push event to queue
3. Worker consumes queue:

   * Send email
   * Send push notification
4. Retry failed jobs

---

### Benefits

* Fault-tolerant
* Scalable
* Reliable delivery
* Decoupled architecture

---

## Stage 6 — Priority Notification System

### Goal

Display top 10 most important unread notifications.

---

### Priority Order

Placement > Result > Event

---

### Sorting Logic

1. Higher priority type first
2. Newer notifications first

---

### Approach

* Fetch notifications from API
* Assign weights to types
* Sort using priority + timestamp
* Return top 10 results

---

### Optimization

* Use **Min Heap (size = 10)** for efficient processing
* Avoid sorting entire dataset repeatedly

---

### Final Note

This approach ensures that the most relevant notifications are displayed first while maintaining efficiency and scalability even with large datasets.

---
