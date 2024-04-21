import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to DB");
    return;
  }
  try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI || "");

    connection.isConnected = dbConnection.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
