// dbConfig.ts
import * as mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
}

const dbConfig: DBConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? 
    parseInt(process.env.DB_CONNECTION_LIMIT) : 10
};

export const getDbConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL database successfully!");
    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error; // Don't exit process, let the server handle it
  }
};

export const createPool = () => {
  return mysql.createPool(dbConfig);
};
