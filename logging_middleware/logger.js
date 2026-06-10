require("dotenv").config();
const TOKEN = process.env.ACCESS_TOKEN;
const axios = require("axios");


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
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

module.exports = Log;