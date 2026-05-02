# Vehicle Scheduling + Notification System

A vehicle maintenance scheduler built on the Knapsack algorithm, paired with a staged notification system design covering architecture decisions from API to scale.

---

## Vehicle Scheduling

- Solves a 0/1 Knapsack problem — maximizes maintenance impact across depots within mechanic hour limits
- Bottom-up DP with 1D array, reducing space from O(n × capacity) → O(capacity)
- Reverse iteration avoids overwriting values mid-pass
- Parallel API calls to `/depots` and `/vehicles` via `Promise.all`
- Custom logging middleware tracks API calls, errors, and execution flow

## Notification System Design

- **Stage 1** — REST endpoints + WebSocket for real-time delivery
- **Stage 2** — MongoDB schema with read-optimized indexing
- **Stage 3** — Composite indexes, query limits, no full collection scans
- **Stage 4** — Redis caching, pagination, lazy loading, read replicas
- **Stage 5** — Kafka/RabbitMQ queue with retry logic and fault tolerance
- **Stage 6** — Priority ranking (Placement > Result > Event), top 10 per user

---

## Stack

Node.js, Axios, ES6+, MongoDB, Redis, Kafka (stages 4–6 are design/conceptual)

## Structure

```
logging_middleware/
vehicle_scheduling/
notification_system_design.md
```

## Run

```bash
npm install
node vehicle_scheduling/index.js
```

## Output

```
Depot 1 → Max Impact: 175
Depot 2 → Max Impact: 189
Depot 3 → Max Impact: 200
```