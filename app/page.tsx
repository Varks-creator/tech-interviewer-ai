"use client";

// main page

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PastAssessments } from "@/components/interview/PastAssessments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [topic, setTopic] = useState<string>("");
  const [showParams, setShowParams] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/landing");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const startNewAssessment = () => {
    if (!showParams) {
      setShowParams(true);
    } else {
      router.push(`/interview?difficulty=${difficulty}&topic=${topic}`);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Technical Interview Practice
          </h1>
          <p className="text-gray-600">
            Practice coding interviews with AI-powered feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Start New Interview</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">
                Begin a new technical interview session. You'll receive
                real-time feedback and guidance.
              </p>
              {showParams ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Difficulty
                    </label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <label className="text-sm font-medium">
                      Select Topic (optional)
                    </label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Array">Array</SelectItem>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Linked List">Linked List</SelectItem>
                        <SelectItem value="Tree">Tree</SelectItem>
                        <SelectItem value="Graph">Graph</SelectItem>
                        <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                        <SelectItem value="Search">Binary Search</SelectItem>
                        <SelectItem value="Bit Manipulation">Bit Manipulation</SelectItem>
                        <SelectItem value="Math">Math</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={startNewAssessment} className="w-full">
                    Begin
                  </Button>
                </div>
              ) : (
                <Button onClick={startNewAssessment} className="w-full">
                  Start Interview
                </Button>
              )}
            </div>
          </div>

          <div>
            <PastAssessments />
          </div>
        </div>
      </div>
    </main>
  );
}
