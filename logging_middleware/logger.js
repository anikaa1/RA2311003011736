const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTI1MSwiaWF0IjoxNzc3Njk4MzUxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWI2OWVjOWItOWFlNy00ZWU0LTg2NWEtZjA5NmJhNTcxZmJmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5pa2Ega2hhanVyaWEiLCJzdWIiOiI1NjI1N2NhMy04ZmQ3LTQwZWUtYjk0ZC02ZDZjMzRkNzUzYWMifSwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhbmlrYSBraGFqdXJpYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTczNiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjU2MjU3Y2EzLThmZDctNDBlZS1iOTRkLTZkNmMzNGQ3NTNhYyIsImNsaWVudFNlY3JldCI6IkVrTXhDc1RZSm1ZVUZKZnIifQ.Bcw8Vx9p5iC1qgvZNsZgy9wPcoICnulzvWePKiA1UXQ";

async function Log(stack, level, pkg, message) {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Success:", response.data);
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
    }
}

// test call
Log("backend", "error", "handler", "test log working");
