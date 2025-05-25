"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIChatbot } from "./AIChatbot";
import { InterviewerService, EndOfTestFeedback } from "@/lib/interviewer";
import { useAuth } from "@/contexts/AuthContext";
import { saveAssessment } from "@/lib/supabase";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  starterCode?: string;
  score?: number;
  feedback?: string;
}

interface ApiQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  starterCode?: string;
}

interface LeetCodeQuestion {
  "Question ID": string;
  "Question Title": string;
  "Question Slug": string;
  "Question Text": string;
  "Topic Tagged text": string;
  "Difficulty Level": string;
  "Success Rate": string;
  "total submission": string;
  "total accepted": string;
  Likes: string;
  Dislikes: string;
  Hints: string;
  "Similar Questions ID": string;
  "Similar Questions Text": string;
}

export function InterviewSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solution, setSolution] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<
    Array<{
      question: string;
      solution: string;
      feedback: string;
    }>
  >([]);
  const [showEndOfTest, setShowEndOfTest] = useState(false);
  const [endOfTestFeedback, setEndOfTestFeedback] =
    useState<EndOfTestFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [topic, setTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    const difficultyParam = searchParams.get("difficulty");
    const topicParam = searchParams.get("topic");

    if (
      difficultyParam &&
      ["Easy", "Medium", "Hard"].includes(difficultyParam)
    ) {
      setDifficulty(difficultyParam as "Easy" | "Medium" | "Hard");
    }
    if (topicParam) {
      setTopic(topicParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const params = new URLSearchParams({
          difficulty,
          ...(topic && { topic }),
        });

        console.log("Fetching questions with params:", params.toString());
        const response = await fetch(`/api/questions?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data: LeetCodeQuestion = await response.json();
        console.log("Fetched question data:", data);

        if (!data || !data["Question Title"]) {
          console.error("Invalid question data received:", data);
          throw new Error("Invalid question data received");
        }

        // Transform LeetCodeQuestion to our Question interface
        const formattedQuestion: Question = {
          id: data["Question ID"],
          title: data["Question Title"],
          description: data["Question Text"],
          difficulty: data["Difficulty Level"] as "Easy" | "Medium" | "Hard",
          category: data["Topic Tagged text"].split(",")[0].trim(), // Take first topic
          starterCode: `public class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        // Write your solution here
        
    }
}`,
        };

        console.log("Formatted question:", formattedQuestion);
        setQuestions([formattedQuestion]);
      } catch (error: any) {
        console.error("Error fetching questions:", error);
        // Fallback to mock questions if fetch fails
        setQuestions([
          {
            id: "1",
            title: "Two Sum",
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
            difficulty: "Easy",
            category: "Arrays",
            starterCode: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
          },
        ]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [difficulty, topic]);

  useEffect(() => {
    console.log("Current question index:", currentQuestionIndex);
    console.log("Questions array:", questions);
    console.log("Current question:", questions[currentQuestionIndex]);
  }, [currentQuestionIndex, questions]);

  if (isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">No Questions Available</h2>
        <p className="text-gray-600 mb-4">
          No questions found for the selected difficulty and topic.
        </p>
        <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    console.error("No current question found:", {
      currentQuestionIndex,
      questions,
    });
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Question</h2>
        <p className="text-gray-600 mb-4">
          There was an error loading the question. Please try again.
        </p>
        <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const interviewer = InterviewerService.getInstance();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Submitting solution for:", currentQuestion.title);
      const feedback = await interviewer.generateFeedback(
        currentQuestion.title,
        solution,
        currentQuestion.difficulty.toUpperCase() as "EASY" | "MEDIUM" | "HARD"
      );

      console.log("Received feedback:", feedback);

      if (!feedback.feedback) {
        throw new Error("No feedback received");
      }

      setFeedback(feedback.feedback);
      setShowFollowUp(true);

      // Add the current question to interview history
      setInterviewQuestions((prev) => [
        ...prev,
        {
          question: currentQuestion.title,
          solution,
          feedback: feedback.feedback,
        },
      ]);
    } catch (error: any) {
      console.error("Error getting feedback:", error);
      setFeedback(
        "I apologize, but I encountered an error while evaluating your solution. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSolution("");
      setFeedback(null);
      setShowFollowUp(false);
      setFollowUpQuestion(null);
    } else {
      // Generate end-of-test feedback
      setIsLoading(true);
      try {
        const feedback = await interviewer.generateEndOfTestFeedback(
          interviewQuestions
        );
        setEndOfTestFeedback(feedback);
        setShowEndOfTest(true);
      } catch (error) {
        console.error("Error generating end-of-test feedback:", error);
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
        feedback || ""
      );
      setFollowUpQuestion(question);
    } catch (error) {
      console.error("Error getting follow-up question:", error);
      setFollowUpQuestion(
        "Error getting follow-up question. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    if (user && interviewQuestions.length > 0 && endOfTestFeedback) {
      try {
        console.log("Preparing to save assessment:", {
          user: user.uid,
          questions: interviewQuestions,
          score: endOfTestFeedback.overallScore,
          questions_length: interviewQuestions.length,
        });

        const assessment = {
          title: "Technical Interview",
          questions: interviewQuestions,
          difficulty: "MIXED",
          score: endOfTestFeedback.overallScore,
        };

        console.log("Assessment data to save:", assessment);

        await saveAssessment(user, assessment);
        router.push("/");
      } catch (error: unknown) {
        console.error("Error saving interview history:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          errorInfo: error,
        });
      }
    } else {
      console.error("Missing required data:", {
        hasUser: !!user,
        questionsLength: interviewQuestions.length,
        hasFeedback: !!endOfTestFeedback,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main Layout (Three Panels) */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4 mt-4">
        {/* Left: Question Panel */}
        <div className="w-1/4 bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4">
            <h2 className="text-base font-semibold mb-2">
              {currentQuestion.title}
            </h2>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {currentQuestion.difficulty}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                {currentQuestion.category}
              </span>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)] px-4 pb-4">
            <pre className="whitespace-pre-wrap text-xs text-gray-700">
              {currentQuestion.description}
            </pre>
          </div>
        </div>

        {/* Center: Code Editor + Feedback */}
        <div className="w-2/4 flex flex-col gap-4 overflow-hidden rounded-xl shadow">
          <Card className="flex-1 overflow-hidden flex flex-col p-4">
            <div className="text-base font-semibold mb-2">
              <h3 className="text-base font-medium mb-2">Your Solution</h3>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden rounded-xl">
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                value={solution || currentQuestion.starterCode}
                onChange={(value) => setSolution(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 10, bottom: 10 },
                }}
              />
            </div>
          </Card>

          {feedback && (
            <Card className="overflow-hidden flex flex-col">
              <div className="p-4">
                <h3 className="text-base font-medium mb-2">Feedback</h3>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {feedback}
                </pre>
              </div>
            </Card>
          )}
        </div>

        {/* Right: AI Assistant */}
        <div className="w-1/4 bg-white rounded-lg shadow overflow-hidden">
          <div className="h-full">
            <AIChatbot
              question={currentQuestion.title}
              key={currentQuestionIndex}
            />
          </div>
        </div>
      </div>

      {/* Bottom: Action Buttons */}
      <div className="flex justify-between items-center px-4 h-12 border-t bg-white shrink-0 rounded-xl shadow">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="text-xs"
        >
          Exit Interview
        </Button>
        {!feedback ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !solution.trim()}
            className="text-xs"
          >
            {isLoading ? "Submitting..." : "Submit Solution"}
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="text-xs">
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish Interview"}
          </Button>
        )}
      </div>

      {/* End of Test Dialog */}
      <Dialog open={showEndOfTest} onOpenChange={setShowEndOfTest}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Complete!</DialogTitle>
          </DialogHeader>
          {endOfTestFeedback && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {endOfTestFeedback.overallScore}/10
                </p>
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
                <h3 className="text-lg font-medium mb-2">
                  Areas for Improvement
                </h3>
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
