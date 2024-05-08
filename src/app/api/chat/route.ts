import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: Array<ChatCompletionMessage>;
  };

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    stream: true,
    messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
