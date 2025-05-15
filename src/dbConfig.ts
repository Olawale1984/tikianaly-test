import * as mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
};

export const getDbConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL database successfully!");
    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
