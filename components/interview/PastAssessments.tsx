import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAssessments, Assessment } from "@/lib/supabase";

export function PastAssessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (user) {
        try {
          const history = await getUserAssessments(user);
          setAssessments(history);
        } catch (error) {
          console.error('Error fetching interview history:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssessments();
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading past assessments...</div>;
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No past assessments found. Start your first interview!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Past Assessments</h2>
      <div className="grid gap-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{assessment.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(assessment.created_at!).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Score: {assessment.score}/10</span>
                <div className="mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {assessment.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Questions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {assessment.questions.map((q, index) => (
                  <li key={index} className="truncate">
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 