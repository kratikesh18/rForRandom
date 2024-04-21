import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  // we need a session to check
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "UnAuthorized ",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    // finding the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Accepting message status not changed",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accepting message status changed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status");
    return Response.json(
      {
        success: false,
        message: "failed to update user status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  // we need a session to check
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "UnAuthorized ",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found ",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
        message: "UnAuthorized ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occured while getting the messageAccepting status");
    return Response.json(
      {
        success: false,
        message: "Error occured while getting the messageAccepting status",
      },
      { status: 500 }
    );
  }
}
