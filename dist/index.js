"use strict";
// import http from 'http';
// import express, { NextFunction, response, request } from "express";
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const dbConfig_1 = require("./dbConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ✅ Ensure the request body is parsed before any middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Middleware to attach database connection
app.use(async (req, res, next) => {
    try {
        req.db = await (0, dbConfig_1.getDbConnection)();
        next();
    }
    catch (error) {
        next(error);
    }
});
// ✅ Routes should not have extra arguments in `app.use()`
app.get("/", (_, res) => {
    res.send("Welcome to the Tikianaly API");
});
app.use("/api/v1/admin", adminRoutes_1.default); // ✅ FIX: Removed extra response handling
app.use("/api/v1/", (_, res) => {
    res.send("Welcome to the Tikianaly User API");
});
// ✅ Error handling middleware (moved to the bottom)
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: `Tikianaly API says: ${error.message}`,
        },
    });
});
const startServer = async () => {
    try {
        await (0, dbConfig_1.getDbConnection)();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server Running here 👉 http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Server startup failed due to database error:", error);
    }
};
startServer();
exports.default = app;
