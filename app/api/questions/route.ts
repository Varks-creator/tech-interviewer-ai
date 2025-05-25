import { NextResponse } from 'next/server';
import { LeetCodeService, Difficulty } from '@/lib/services/leetcodeService';

const service = LeetCodeService.getInstance();

// GET /api/questions/random
export async function GET(request: Request) {
  try {
    await service.loadQuestions();
    const { searchParams } = new URL(request.url);
    
    const difficulty = searchParams.get('difficulty') as Difficulty | null;
    const topic = searchParams.get('topic');

    let question;
    if (difficulty && topic) {
      question = service.getRandomQuestionByDifficultyAndTopic(difficulty, topic);
    } else if (difficulty) {
      question = service.getRandomQuestionByDifficulty(difficulty);
    } else if (topic) {
      question = service.getRandomQuestionByTopic(topic);
    } else {
      // If no filters are provided, get a random question from all questions
      question = service.getRandomQuestion(service.getQuestions());
    }

    if (!question) {
      return NextResponse.json(
        { error: 'No questions found matching the criteria' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
} 