const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxpdC5hZ25paG90cmlfY3MyM0BnbGEuYWMuaW4iLCJleHAiOjE3ODEwNzMyMzUsImlhdCI6MTc4MTA3MjMzNSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjA1ZGY2NGRhLThiOTAtNDIwYy05YTFmLTYwZmEzZDgyY2VmYiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImxhbGl0IG1vaGFuIGFnbmlob3RyaSIsInN1YiI6IjcyMzllMzc4LWM1MDMtNDc2Zi1iNjYxLWU1MTdlYzhhNWU1YiJ9LCJlbWFpbCI6ImxhbGl0LmFnbmlob3RyaV9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJsYWxpdCBtb2hhbiBhZ25paG90cmkiLCJyb2xsTm8iOiIyMzE1MDAxMjM5IiwiYWNjZXNzQ29kZSI6IlJQc2dZdCIsImNsaWVudElEIjoiNzIzOWUzNzgtYzUwMy00NzZmLWI2NjEtZTUxN2VjOGE1ZTViIiwiY2xpZW50U2VjcmV0IjoibkdlSGVic2tKRWphZlRTeCJ9.xfPa2Z7ty3VEvF2eUKrAYaOLfGy499RVBDiRQYIy4-M";

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    console.log("Log Success:", response.data);
  } catch (error) {
    console.error(
      "Log Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;