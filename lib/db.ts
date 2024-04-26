import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};
export async function dbconnect(): Promise<void> {
  try {
    if (connection.isConnected) {
      console.log("DB already connected ");
    }
    const db = await mongoose.connect(process.env.MONGO_URI!);
    connection.isConnected = db.connections[0].readyState;
    console.log("Database successfully connected");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }7 
}
