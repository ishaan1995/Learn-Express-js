import express from "express";
import cors from "cors";
import os from 'os'

export function getCpuUsage() {
  const cpus = os.cpus();
  let userTime = 0;
  let niceTime = 0;
  let sysTime = 0;
  let idleTime = 0;
  let irqTime = 0;

  cpus.forEach((cpu) => {
      userTime += cpu.times.user;
      niceTime += cpu.times.nice;
      sysTime += cpu.times.sys;
      idleTime += cpu.times.idle;
      irqTime += cpu.times.irq;
  });

  const total = userTime + niceTime + sysTime + idleTime + irqTime;

  return {
      user: (userTime / total) * 100,
      system: (sysTime / total) * 100,
      idle: (idleTime / total) * 100,
  };
}

export function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  return {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory
  };
}

export function getProcessMemoryUsage() {
const memoryUsage = process.memoryUsage();
return {
    rss: memoryUsage.rss, // Resident Set Size
    heapTotal: memoryUsage.heapTotal, // Total Size of the Heap
    heapUsed: memoryUsage.heapUsed, // Heap actually Used
    external: memoryUsage.external, // External memory used
};
}

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    data: [],
  });
});

app.get("/relay", (req, res) => {
  console.log("Request Params =>", req.query);
  const name = req.query.name || "Unknown";
  res.json({
    status: "success",
    params: req.query,
  });
});

// Add a new route for fetching BTC price
app.get("/btc", async (req, res) => {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets/bitcoin");
    const data = await response.json();
    if (data && data.data && data.data.priceUsd) {
      res.json({
        status: "success",
        timestamp: data.timestamp,
        ...data.data,
      });
    } else {
      res.json({
        status: "error",
        message: "Price information not available",
      });
    }
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.get('/system-info', (req, res) => {
  const cpuUsage = getCpuUsage();
  const memoryUsage = getMemoryUsage();
  const processMemoryUsage = getProcessMemoryUsage();

  res.json({
      cpuUsage,
      memoryUsage,
      processMemoryUsage,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
