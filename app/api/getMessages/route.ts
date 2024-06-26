import { dbconnect } from "@/lib/db";

import UserModel from "@/models/user";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
export async function GET(req: Request) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  // learn aggregation
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("failed to get messages", err);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      {
        status: 500,
      }
    );
  }
}
