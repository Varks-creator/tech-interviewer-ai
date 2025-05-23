import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Tech Interviewer AI",
  description:
    "Learn more about Tech Interviewer AI - Your AI-powered technical interview preparation platform",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        About Tech Interviewer AI
      </h1>

      <div className="space-y-8">
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Tech Interviewer AI is designed to revolutionize how developers
            prepare for technical interviews. We combine cutting-edge AI
            technology with real-world interview scenarios to provide a
            comprehensive preparation platform that helps you build confidence
            and improve your technical interview skills.
          </p>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-medium">🤖 AI-Powered Interviews</h3>
              <p className="text-gray-600">
                Experience realistic mock interviews powered by advanced AI
                technology, simulating real interview scenarios and providing
                intelligent feedback.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">💻 Real-time Coding</h3>
              <p className="text-gray-600">
                Practice coding in a real-time environment with our integrated
                code editor, supporting multiple programming languages.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">📊 Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress with detailed feedback and scoring after
                each interview session.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">🎯 Customizable Settings</h3>
              <p className="text-gray-600">
                Tailor your interview experience with customizable difficulty
                levels and focus areas.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Frontend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Next.js 15 with React 19</li>
                <li>Tailwind CSS with shadcn/ui</li>
                <li>Monaco Editor for code execution</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Backend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Firebase Authentication</li>
                <li>Supabase (PostgreSQL)</li>
                <li>OpenAI API</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Ready to improve your technical interview skills? Sign up now and
            start your journey towards interview success with Tech Interviewer
            AI.
          </p>
          <a
            href="/auth/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up Now
          </a>
        </section>
      </div>
    </div>
  );
}
