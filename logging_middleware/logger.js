const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTY3MywiaWF0IjoxNzc3NzAwNzczLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMGUxNmZjNjEtYTc2OS00ZTlhLTgzZWEtMDE2ZTgxODM3NzcxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5pa2Ega2hhanVyaWEiLCJzdWIiOiI1NjI1N2NhMy04ZmQ3LTQwZWUtYjk0ZC02ZDZjMzRkNzUzYWMifSwiZW1haWwiOiJhazUyMTRAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhbmlrYSBraGFqdXJpYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTczNiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjU2MjU3Y2EzLThmZDctNDBlZS1iOTRkLTZkNmMzNGQ3NTNhYyIsImNsaWVudFNlY3JldCI6IkVrTXhDc1RZSm1ZVUZKZnIifQ.cchNb_lvQ42tf6biqkCduw5VrCH86WZV_G5fzcocwko"; 

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
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
  } catch (err) {
    console.log("Logging failed:", err.response?.data || err.message);
  }
}

module.exports = Log;