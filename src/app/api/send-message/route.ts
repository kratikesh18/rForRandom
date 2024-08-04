"use server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found ",
        },
        { status: 404 }
      );
    }

    // checking if the user is accepting the message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting the messages ",
        },
        { status: 403 }
      );
    }

    const newMesssage = { content, createdAt: new Date() };
    user.messages.push(newMesssage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error occured while sending the messsage ");
    return Response.json(
      {
        success: false,
        message: "error occured while sending the messsage ",
      },
      { status: 401 }
    );
  }
}
