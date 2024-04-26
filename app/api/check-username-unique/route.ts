import { dbconnect } from "@/lib/db";
import { z } from "zod";
import UserModel from "@/models/user";
// for checking unique username we are importing the signup schema
import { sigUpSchema, usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuery = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  /* if (req.method !== "GET") {
    return Response.json(
      { message: "Only GET method is allowed" },
      { status: 405 }
    );
  } no need in app router*/
  await dbconnect();
  try {
    // we get the username from  url
    const { searchParams } = new URL(req.url);
    const queryParam = { username: searchParams.get("username") };
    // validate with zod
    const result = UserNameQuery.safeParse(queryParam);
    if (!result.success) {
      const userErr = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: userErr,
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking the username uniqueness", error);

    return Response.json(
      {
        success: false,
        message: "Error in checking the username uniqueness",
      },
      {
        status: 500,
      }
    );
  }
}
