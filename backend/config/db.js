import pg from "pg"
import { configDotenv } from "dotenv";

load_dotenv()
const Client = pg;
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Fitspiration',
    password: process.env.db_password, 
    port: 5050,
})

db.on("connect", () => {
    console.log("connected to postgreSQL")
})

export default db;