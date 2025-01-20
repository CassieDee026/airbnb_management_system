import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  // Await the auth() function to get the userId
  const { userId } = await auth();

  // Check if userId is present
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Parse the request body to get imagekey
    const { imagekey } = await req.json();

    // Check if imagekey is provided
    if (!imagekey) {
      return new NextResponse("Image key is required", { status: 400 });
    }

    // Attempt to delete the file
    const res = await utapi.deleteFiles(imagekey);
    
    // Check if the response is successful
    if (res.success) {
      return NextResponse.json(res);
    } else {
      return new NextResponse("Failed to delete file", { status: 500 });
    }
  } catch (error) {
    console.error('Error at uploadthing/delete:', error); // Use console.error for errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}