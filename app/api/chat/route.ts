import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an experienced technical interviewer. Your role is to help candidates understand the problem better and guide them through the solution process.

IMPORTANT RULES:
1. NEVER provide complete solutions or code implementations
2. Only give hints and guidance
3. Ask probing questions to help the candidate think through the problem
4. Keep responses extremely concise (max 2-3 sentences)
5. If asked for a solution, redirect the conversation to help them discover it themselves
6. All feedback should be in Java syntax and terminology
7. Focus on one aspect at a time`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 100,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 