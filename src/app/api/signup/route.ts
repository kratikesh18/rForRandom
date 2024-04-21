import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/emailVerificationCode";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    console.log(username, email, password);

    //checking if the username with this username is already exist or verified
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isUserVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isUserVerified) {
        return Response.json(
          {
            success: false,
            message: "User already verified with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.veryfyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hanshedPassword = await bcrypt.hash(password, 10);
      const expriryDate = new Date();
      expriryDate.setHours(expriryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hanshedPassword,
        verifyCode: verifyCode,
        veryfyCodeExpiry: expriryDate,
        isUserVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // sending verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log(emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "user registered successfully, kindly verify ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering the user", error);
    return { success: false, message: "Error registering user" };
  }
}
