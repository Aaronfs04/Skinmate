import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Grab the form data from the incoming request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file was provided." }, 
        { status: 400 }
      );
    }

    // 2. Convert the image into a Buffer (required for most AI APIs)
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. TO DO: Send 'buffer' to Azure AI Vision
    // You will add your fetch() call to Azure right here later!

    // 4. Return a success response back to the frontend
    return NextResponse.json({
      success: true,
      message: "Image successfully received by the backend!",
      filename: imageFile.name,
      size: imageFile.size
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
