import { dbconnect } from "@/lib/db";
import UserModel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(req: Request) {
  await dbconnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
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
    //check again
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User not accepting messages",
        },
        {
          status: 400,
        }
      );
    }
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      {
        status: 500,
      }
    );
  }
}
