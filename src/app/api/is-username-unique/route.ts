import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// to use zod we need zod schema we defined in the schema directory  for validation  (username)
const UsenameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    // validating with zod
    const result = UsenameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "invalid query parameter",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    // here we are checking if the username matches to the validation and not exist in the DB
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isUserVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User name is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username uniquely checked",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}
