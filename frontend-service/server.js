const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const apiProxyTarget = process.env.API_PROXY_TARGET || "http://localhost:8080";
const distPath = path.join(__dirname, "dist");

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "frontend-service" });
});

app.use("/api", async (req, res) => {
  try {
    const targetUrl = `${apiProxyTarget}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD"
        ? undefined
        : JSON.stringify(req.body)
    });

    const text = await response.text();

    res.status(response.status);
    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("content-type", contentType);
    }
    res.send(text);
  } catch (error) {
    res.status(502).json({
      message: "Frontend proxy could not reach the backend gateway",
      detail: error.message
    });
  }
});

app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`frontend-service listening on port ${port}`);
});
