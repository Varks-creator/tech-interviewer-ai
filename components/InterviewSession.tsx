'use client';

import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
}

interface InterviewSessionProps {
  questions: Question[];
  onComplete: () => void;
}

export function InterviewSession({ questions, onComplete }: InterviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCode('');
      setShowFeedback(false);
      setFeedback('');
    } else {
      onComplete();
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement AI feedback generation
    setFeedback('Great solution! You handled the edge cases well.');
    setShowFeedback(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {currentQuestion.difficulty}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
            {currentQuestion.category}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{currentQuestion.description}</p>
      </Card>

      <Card className="p-4">
        <Editor
          height="400px"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyond: false,
          }}
        />
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={!code.trim()}
        >
          Submit Solution
        </Button>
        <Button onClick={handleNext}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </Button>
      </div>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="whitespace-pre-wrap">{feedback}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 