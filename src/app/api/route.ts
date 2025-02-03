import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  try {
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();
    return NextResponse.json({
      response: geminiResponse
    });
  } catch (error: any) {
    return NextResponse.json({ error });
  }
}