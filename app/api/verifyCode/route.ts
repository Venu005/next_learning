import { dbconnect } from "@/lib/db";
import { z } from "zod";
import UserModel from "@/models/user";
// for checking unique username we are importing the signup schema
import { sigUpSchema, usernameValidation } from "@/schemas/signUpSchema";

export async function POST(req: Request) {
  await dbconnect();
  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username not found",
        },
        {
          status: 400,
        }
      );
    }
    const isuserVerified = user.verifyCode === code;
    const isverCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();
    if (isuserVerified && isverCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (!isverCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired, please signup to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid code,please enter the correct code to verify user",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error in verifying user", error);

    return Response.json(
      {
        success: false,
        message: "Error in verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
