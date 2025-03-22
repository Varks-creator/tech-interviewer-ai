# Tech Interviewer AI

A modern web application that helps developers practice technical interviews with AI-powered feedback and guidance.

## Features

- **Interactive Interview Sessions**
  - Real-time coding environment with Monaco Editor
  - Multiple difficulty levels (Easy, Medium, Hard)
  - Java code editor with syntax highlighting
  - Real-time feedback on solutions

- **AI-Powered Feedback**
  - Detailed solution evaluation
  - Specific suggestions for improvement
  - Performance scoring
  - Follow-up questions based on your solution
  - End-of-test comprehensive feedback

- **User Authentication**
  - Secure user accounts with Firebase
  - Protected interview sessions
  - Personal interview history

- **Progress Tracking**
  - Activity calendar
  - Past assessment history
  - Performance analytics
  - Detailed feedback history

- **Modern UI/UX**
  - Clean, responsive design
  - Dark mode support
  - Interactive components
  - Real-time updates

## Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Monaco Editor

- **Backend**
  - Next.js API Routes
  - OpenAI GPT-4
  - Firebase Authentication
  - Firebase Firestore

- **Database**
  - Firebase Firestore for user data and interview history
  - Prisma ORM (for future database integration)

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Firebase project credentials

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tech-interviewer-ai.git
cd tech-interviewer-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## Features in Detail

### Interview Session
- Start a new interview session
- Solve coding problems in a Java code editor
- Get real-time feedback on your solutions
- Receive follow-up questions based on your approach
- View comprehensive end-of-test feedback

### User Dashboard
- View your interview history
- Track your progress over time
- Access past assessments and feedback
- Monitor your performance metrics

### Authentication
- Secure sign-up and login
- Protected interview sessions
- Personal interview history
- User profile management

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
