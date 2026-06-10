const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxpdC5hZ25paG90cmlfY3MyM0BnbGEuYWMuaW4iLCJleHAiOjE3ODEwNzg0ODAsImlhdCI6MTc4MTA3NzU4MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY1MTU3MDQzLTNmM2ItNGRlZi1iMTEyLWVjY2IwODgwNGQ1YyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImxhbGl0IG1vaGFuIGFnbmlob3RyaSIsInN1YiI6IjcyMzllMzc4LWM1MDMtNDc2Zi1iNjYxLWU1MTdlYzhhNWU1YiJ9LCJlbWFpbCI6ImxhbGl0LmFnbmlob3RyaV9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJsYWxpdCBtb2hhbiBhZ25paG90cmkiLCJyb2xsTm8iOiIyMzE1MDAxMjM5IiwiYWNjZXNzQ29kZSI6IlJQc2dZdCIsImNsaWVudElEIjoiNzIzOWUzNzgtYzUwMy00NzZmLWI2NjEtZTUxN2VjOGE1ZTViIiwiY2xpZW50U2VjcmV0IjoibkdlSGVic2tKRWphZlRTeCJ9.l6oFwg90hxRjTs6R7O7SsU5kyj01N52sJnScCt5zb8o";

app.get("/notifications", async (req, res) => {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    res.json(response.data.notifications);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});