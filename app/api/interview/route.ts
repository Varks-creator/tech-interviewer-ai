import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, question, solution, difficulty, feedback } = body;

    if (type === 'feedback') {
      const prompt = `As a technical interviewer, evaluate the following solution for the given coding question.
      Provide constructive feedback, specific suggestions for improvement, and a score out of 10.
      
      Question: ${question}
      Difficulty: ${difficulty}
      Solution:
      ${solution}
      
      Please provide your evaluation in the following JSON format:
      {
        "feedback": "Overall feedback on the solution",
        "suggestions": ["Specific suggestion 1", "Specific suggestion 2", ...],
        "score": number between 1-10
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an experienced technical interviewer evaluating coding solutions. Provide detailed, constructive feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content;
      return NextResponse.json(JSON.parse(response || '{}'));
    }

    if (type === 'followUp') {
      const prompt = `Based on the candidate's solution and feedback, generate a relevant follow-up question.
      
      Original Question: ${question}
      Solution: ${solution}
      Feedback: ${feedback}
      
      Generate a follow-up question that:
      1. Tests understanding of the solution
      2. Explores edge cases or alternative approaches
      3. Is specific to the candidate's implementation
      
      Return only the follow-up question.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an experienced technical interviewer asking follow-up questions."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return NextResponse.json({ question: completion.choices[0].message.content });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error in interview API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 