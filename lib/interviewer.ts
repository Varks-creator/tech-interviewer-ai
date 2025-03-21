export interface InterviewFeedback {
  feedback: string;
  suggestions: string[];
  score: number;
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
        throw new Error('Failed to generate feedback');
      }

      return await response.json();
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
} 