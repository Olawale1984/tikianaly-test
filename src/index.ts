import http from "http";
import "reflect-metadata";
import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import adminRoute from "./routes/adminRoutes";
import { createPool } from "./dbConfig";

dotenv.config();

const app = express();
const server = http.createServer(app);
const pool = createPool(); // Create connection pool at startup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface CustomRequest extends Request {
  db?: any;
}

app.use(async (req: CustomRequest, res, next) => {
  try {
    req.db = await pool.getConnection();
    next();
  } catch (error) {
    next(error);
  } finally {
    if (req.db) req.db.release(); // Release connection back to pool
  }
});
app.get("/", (_, res) => {
  res.send("Welcome to the Tikianaly API");
});

app.use("/api/v1/admin", adminRoute);  
app.use("/api/v1/", (_, res) => {
  res.send("Welcome to the Tikianaly User API");
});


app.use((error: any, req: express.Request, res: express.Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    error: {
      message: `Tikianaly API says: ${error.message}`,
    },
  });
});


const startServer = async () => {
  try {
    // Test connection at startup
    const testConn = await pool.getConnection();
    testConn.release();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server Running here 👉 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed due to database error:", error);
    process.exit(1);
  }
};

startServer();

export default app;
