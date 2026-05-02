# Notification System Design

## Stage 1 — API Design

### Endpoints

1. GET /notifications
- Fetch all notifications for a user

2. POST /notifications
- Create a notification

3. PUT /notifications/:id/read
- Mark notification as read

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

Use WebSockets to push notifications instantly to users.
## Stage 2 — Database Design

### Database Choice

We use MongoDB because:
- Flexible schema
- Handles large data
- Fast reads/writes
- Easy scaling

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

Mark as read:

db.notifications.updateOne(
  { _id: "notification_id" },
  { $set: { isRead: true } }
)

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

- Use sharding on userId
- Use pagination
- Archive old data