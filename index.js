const express = require("express");
const https = require("https");
const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

const app = express();

const agent = new https.Agent({
  pfx: fs.readFileSync(`./certificates/${process.env.KEY}`),
  passphrase: process.env.PASSPHRASE,
  ca: fs.readFileSync(`./certificates/${process.env.CERTIFICATE}`),
});

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.httpsAgent = agent;

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.get("/start-auth", async (req, res) => {
  const ssn = req.query.ssn;

  try {
    const response = await axios.post("/auth", {
      personalNumber: ssn,
      // TODO: Remove fixed IP
      endUserIp: "127.0.0.1",
    });

    res.json({
      status: "SUCCESS",
      message: "Open your BankID app",
      data: {
        orderRef: response.data.orderRef,
        autoStartToken: ssn ? null : response.data.autoStartToken,
      },
    });
  } catch {
    return res.json({
      status: "FAILED",
      message: "An error occured...",
      data: null,
    });
  }
});

app.get("/collect-auth", async (req, res) => {
  const ref = req.query.ref;

  const response = await axios.post("/collect", { orderRef: ref });

  if (response.data.status === "failed") {
    return res.json({
      status: "FAILED",
      message: "An error occured...",
      data: null,
    });
  }

  if (response.data.status === "complete") {
    return res.json({
      status: "SUCCESS",
      message: "Authentication success!",
      data: {
        user: response.data.completionData.user,
      },
    });
  }

  return res.json({
    status: "PENDING",
    message: "Authentication pending...",
    data: null,
  });
});

app.listen("3000", () => console.log("App listening on port 3000"));
