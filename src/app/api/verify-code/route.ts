import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    // checking if the verify code is present and not expried
    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.veryfyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isUserVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verification success",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verification code expired",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code is not valid",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while verifying code", error);
    return Response.json(
      {
        success: false,
        message: "Error while verifying code",
      },
      { status: 500 }
    );
  }
}
