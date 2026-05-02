const axios = require("axios");
const Log = require("../logging_middleware/logger");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTY3MywiaWF0IjoxNzc3NzAwNzczLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMGUxNmZjNjEtYTc2OS00ZTlhLTgzZWEtMDE2ZTgxODM3NzcxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5pa2Ega2hhanVyaWEiLCJzdWIiOiI1NjI1N2NhMy04ZmQ3LTQwZWUtYjk0ZC02ZDZjMzRkNzUzYWMifSwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhbmlrYSBraGFqdXJpYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTczNiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjU2MjU3Y2EzLThmZDctNDBlZS1iOTRkLTZkNmMzNGQ3NTNhYyIsImNsaWVudFNlY3JldCI6IkVrTXhDc1RZSm1ZVUZKZnIifQ.cchNb_lvQ42tf6biqkCduw5VrCH86WZV_G5fzcocwko";

const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
};

function knapsack(tasks, capacity) {
    const dp = Array(capacity + 1).fill(0);

    for (let task of tasks) {
        const wt = task.Duration;
        const val = task.Impact;

        for (let w = capacity; w >= wt; w--) {
            dp[w] = Math.max(dp[w], val + dp[w - wt]);
        }
    }

    return dp[capacity];
}

async function run() {
    try {
        await Log("backend", "info", "handler", "Fetching data");

        const [depotsRes, vehiclesRes] = await Promise.all([
            axios.get("http://20.207.122.201/evaluation-service/depots", { headers }),
            axios.get("http://20.207.122.201/evaluation-service/vehicles", { headers })
        ]);

        const depots = depotsRes.data.depots;
        const tasks = vehiclesRes.data.vehicles;

        for (let depot of depots) {
            const maxImpact = knapsack(tasks, depot.MechanicHours);
            console.log(`Depot ${depot.ID} → Max Impact: ${maxImpact}`);
        }

    } catch (err) {
        await Log("backend", "error", "handler", err.message);
        console.log("Error:", err.response?.data || err.message);
    }
}

run();