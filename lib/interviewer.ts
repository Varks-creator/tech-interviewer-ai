export interface InterviewFeedback {
  feedback: string;
  suggestions: string[];
  score: number;
}

export interface EndOfTestFeedback {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
  recommendations: string[];
}

export class InterviewerService {
  private static instance: InterviewerService;
  private constructor() {}

  static getInstance(): InterviewerService {
    if (!InterviewerService.instance) {
      InterviewerService.instance = new InterviewerService();
    }
    return InterviewerService.instance;
  }

  async generateFeedback(
    question: string,
    solution: string,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  ): Promise<InterviewFeedback> {
    try {
      console.log('Generating feedback for:', { question, difficulty });
      
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'feedback',
          question,
          solution,
          difficulty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', { status: response.status, error: errorData });
        throw new Error(`Failed to generate feedback: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received feedback:', data);

      if (!data.feedback || !Array.isArray(data.suggestions) || typeof data.score !== 'number') {
        console.error('Invalid feedback format:', data);
        throw new Error('Invalid feedback format received');
      }

      return {
        feedback: data.feedback,
        suggestions: data.suggestions,
        score: data.score
      };
    } catch (error) {
      console.error('Error generating feedback:', error);
      return {
        feedback: "I apologize, but I encountered an error while evaluating your solution. Please try again.",
        suggestions: [],
        score: 0
      };
    }
  }

  async generateFollowUpQuestion(
    question: string,
    solution: string,
    feedback: string
  ): Promise<string> {
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'followUp',
          question,
          solution,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate follow-up question');
      }

      const data = await response.json();
      return data.question || "Could you explain your approach to handling edge cases?";
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      return "Could you explain your approach to handling edge cases?";
    }
  }

  async generateEndOfTestFeedback(
    questions: Array<{
      question: string;
      solution: string;
      feedback: string;
    }>
  ): Promise<EndOfTestFeedback> {
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'endOfTest',
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate end-of-test feedback');
      }

      const data = await response.json();
      return {
        overallScore: data.overallScore || 0,
        strengths: data.strengths || [],
        areasForImprovement: data.areasForImprovement || [],
        summary: data.summary || "No summary available",
        recommendations: data.recommendations || []
      };
    } catch (error) {
      console.error('Error generating end-of-test feedback:', error);
      return {
        overallScore: 0,
        strengths: [],
        areasForImprovement: [],
        summary: "I apologize, but I encountered an error while generating your end-of-test feedback.",
        recommendations: []
      };
    }
  }
} 