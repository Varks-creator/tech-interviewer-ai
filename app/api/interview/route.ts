import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, question, solution, difficulty, feedback, questions } = body;

    console.log('Received request:', { type, question, difficulty });

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

      console.log('Sending request to OpenAI...');
      
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

      console.log('Received response from OpenAI');
      
      const response = completion.choices[0].message.content;
      console.log('Response content:', response);

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      
      // Validate the response format
      if (!parsedResponse.feedback || !Array.isArray(parsedResponse.suggestions) || typeof parsedResponse.score !== 'number') {
        throw new Error('Invalid response format from OpenAI');
      }

      return NextResponse.json(parsedResponse);
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

    if (type === 'endOfTest') {
      const questionsSummary = questions.map((q: any, index: number) => `
        Question ${index + 1}:
        ${q.question}
        Solution:
        ${q.solution}
        Feedback:
        ${q.feedback}
      `).join('\n');

      const prompt = `As a technical interviewer, provide comprehensive feedback for the entire interview session.
      Analyze the candidate's performance across all questions and provide a detailed evaluation.
      
      Interview Summary:
      ${questionsSummary}
      
      Please provide your evaluation in the following JSON format:
      {
        "overallScore": number between 1-10,
        "strengths": ["strength 1", "strength 2", ...],
        "areasForImprovement": ["area 1", "area 2", ...],
        "summary": "Overall summary of performance",
        "recommendations": ["recommendation 1", "recommendation 2", ...]
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an experienced technical interviewer providing comprehensive interview feedback."
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

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error in interview API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 