import { dbconnect } from "@/lib/db";

import UserModel from "@/models/user";
import { User} from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(req: Request) {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
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
  const userId = user._id;
  const { acceptingMessages } = await req.json(); ///coming from frontend
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptingMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Falied to update user accepting messages status",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User accepting messages status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user accepting messages status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user accepting messages status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  await dbconnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
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

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
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
        isAcceptingMessages: foundUser.isAcceptingMessages,
        messages: "User found",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed  to get message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Failed  to get message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
