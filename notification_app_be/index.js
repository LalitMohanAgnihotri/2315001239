const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxpdC5hZ25paG90cmlfY3MyM0BnbGEuYWMuaW4iLCJleHAiOjE3ODEwNzg0ODAsImlhdCI6MTc4MTA3NzU4MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY1MTU3MDQzLTNmM2ItNGRlZi1iMTEyLWVjY2IwODgwNGQ1YyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImxhbGl0IG1vaGFuIGFnbmlob3RyaSIsInN1YiI6IjcyMzllMzc4LWM1MDMtNDc2Zi1iNjYxLWU1MTdlYzhhNWU1YiJ9LCJlbWFpbCI6ImxhbGl0LmFnbmlob3RyaV9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJsYWxpdCBtb2hhbiBhZ25paG90cmkiLCJyb2xsTm8iOiIyMzE1MDAxMjM5IiwiYWNjZXNzQ29kZSI6IlJQc2dZdCIsImNsaWVudElEIjoiNzIzOWUzNzgtYzUwMy00NzZmLWI2NjEtZTUxN2VjOGE1ZTViIiwiY2xpZW50U2VjcmV0IjoibkdlSGVic2tKRWphZlRTeCJ9.l6oFwg90hxRjTs6R7O7SsU5kyj01N52sJnScCt5zb8o";

const axios = require("axios");

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function fetchNotifications() {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    notifications.sort((a, b) => {
      const priorityDiff =
        priorityMap[b.Type] - priorityMap[a.Type];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    });

    const top10 = notifications.slice(0, 10);

    console.log("\nTOP 10 PRIORITY NOTIFICATIONS\n");
    console.table(top10);

  } catch (error) {
    console.log(
      error.response?.data || error.message
    );
  }
}

fetchNotifications();