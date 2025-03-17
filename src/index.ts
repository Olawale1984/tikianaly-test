// import http from 'http';
// import express, { NextFunction, response, request } from "express";
// import dotenv from 'dotenv';

// dotenv.config();
// const envConfig = process.env;





// const app = express();
// const server = http.createServer(app);

// app.get('/', (_, res) => { res.send('Welcome to the Tikianaly API') })
// //routes
// app.use("/api/v1/admin", (_, res) => { res.send('Welcome to the Tikianaly Admin API') });
// app.use("/api/v1/", (_, res) => { res.send('Welcome to the Tikianaly user API') });

// app.use((error: any, request: express.Request, response: express.Response, next: NextFunction) => {
//     response.status(error.status || 500);
//     response.json({
//         error: {
//             message: `Tikianaly API says ${error.message}`,
//         },
//     });
//     next();
// });


// const PORT = 5000
// app.listen(PORT, (): void => {
//     console.log((`Server Running here 👉 http://localhost:${PORT}`));
// });


// export default app;


import http from "http";
import "reflect-metadata";
import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import adminRoute from "./routes/adminRoutes";
import { getDbConnection } from "./dbConfig";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Ensure the request body is parsed before any middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extend the Request interface to include the db property
interface CustomRequest extends Request {
  db?: any;
}

// ✅ Middleware to attach database connection
app.use(async (req: CustomRequest, res, next) => {
  try {
    req.db = await getDbConnection();
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Routes should not have extra arguments in `app.use()`
app.get("/", (_, res) => {
  res.send("Welcome to the Tikianaly API");
});

app.use("/api/v1/admin", adminRoute);  // ✅ FIX: Removed extra response handling
app.use("/api/v1/", (_, res) => {
  res.send("Welcome to the Tikianaly User API");
});

// ✅ Error handling middleware (moved to the bottom)
app.use((error: any, req: express.Request, res: express.Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    error: {
      message: `Tikianaly API says: ${error.message}`,
    },
  });
});


const startServer = async () => {
  
  try {
    await getDbConnection();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server Running here 👉 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed due to database error:", error);
  }
};

startServer();

export default app;
