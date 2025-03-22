'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AIChatbot } from './AIChatbot';
import { InterviewerService, EndOfTestFeedback } from '@/lib/interviewer';
import { useAuth } from '@/contexts/AuthContext';
import { saveInterviewHistory } from '@/lib/firestore';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
}

export function InterviewSession() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solution, setSolution] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{
    question: string;
    solution: string;
    feedback: string;
  }>>([]);
  const [showEndOfTest, setShowEndOfTest] = useState(false);
  const [endOfTestFeedback, setEndOfTestFeedback] = useState<EndOfTestFeedback | null>(null);

  // Mock questions for now
  const questions: Question[] = [
    {
      id: '1',
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
      difficulty: 'EASY',
      category: 'Arrays'
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
      difficulty: 'EASY',
      category: 'Stack'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const interviewer = InterviewerService.getInstance();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log('Submitting solution for:', currentQuestion.title);
      const feedback = await interviewer.generateFeedback(
        currentQuestion.title,
        solution,
        currentQuestion.difficulty
      );
      
      console.log('Received feedback:', feedback);
      
      if (!feedback.feedback) {
        throw new Error('No feedback received');
      }
      
      setFeedback(feedback.feedback);
      setShowFollowUp(true);
      
      // Add the current question to interview history
      setInterviewQuestions(prev => [...prev, {
        question: currentQuestion.title,
        solution,
        feedback: feedback.feedback
      }]);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback('I apologize, but I encountered an error while evaluating your solution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSolution('');
      setFeedback(null);
      setShowFollowUp(false);
      setFollowUpQuestion(null);
    } else {
      // Generate end-of-test feedback
      setIsLoading(true);
      try {
        const feedback = await interviewer.generateEndOfTestFeedback(interviewQuestions);
        setEndOfTestFeedback(feedback);
        setShowEndOfTest(true);
      } catch (error) {
        console.error('Error generating end-of-test feedback:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGetFollowUp = async () => {
    setIsLoading(true);
    try {
      const question = await interviewer.generateFollowUpQuestion(
        currentQuestion.title,
        solution,
        feedback || ''
      );
      setFollowUpQuestion(question);
    } catch (error) {
      console.error('Error getting follow-up question:', error);
      setFollowUpQuestion('Error getting follow-up question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    if (user && interviewQuestions.length > 0) {
      try {
        await saveInterviewHistory(user, {
          title: 'Technical Interview',
          questions: interviewQuestions,
          difficulty: 'MIXED'
        });
      } catch (error) {
        console.error('Error saving interview history:', error);
      }
    }
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{currentQuestion.title}</h2>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {currentQuestion.difficulty}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {currentQuestion.category}
            </span>
          </div>
        </div>
        <div className="prose max-w-none mb-6">
          <pre className="whitespace-pre-wrap">{currentQuestion.description}</pre>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Your Solution</h3>
        <div className="h-[400px] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="java"
            theme="vs-dark"
            value={solution}
            onChange={(value) => setSolution(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on'
            }}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          Exit Interview
        </Button>
        {!feedback ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !solution.trim()}
          >
            {isLoading ? 'Submitting...' : 'Submit Solution'}
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
          </Button>
        )}
      </div>

      {feedback && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Feedback</h3>
          <p className="text-gray-700">{feedback}</p>
          
          {showFollowUp && !followUpQuestion && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleGetFollowUp}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Get Follow-up Question'}
              </Button>
            </div>
          )}

          {followUpQuestion && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Follow-up Question:</h4>
              <p className="text-gray-700">{followUpQuestion}</p>
            </div>
          )}
        </Card>
      )}

      <Dialog open={showEndOfTest} onOpenChange={setShowEndOfTest}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Complete!</DialogTitle>
          </DialogHeader>
          {endOfTestFeedback && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                <p className="text-2xl font-bold text-blue-600">{endOfTestFeedback.overallScore}/10</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p className="text-gray-700">{endOfTestFeedback.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {endOfTestFeedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {endOfTestFeedback.areasForImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {endOfTestFeedback.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleFinishInterview}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 