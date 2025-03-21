# Tech Interviewer AI

A modern web application that helps developers practice technical interviews with AI-powered feedback and guidance.

## Features

- Customizable interview sessions with 1-4 technical questions
- Realistic interview simulation using AI
- Interactive code editor for writing solutions
- Dynamic question sourcing from LeetCode dataset
- Detailed feedback and follow-up questions
- Progress tracking and performance analytics

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- OpenAI GPT-4
- Monaco Editor

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

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
- Copy `.env.example` to `.env`
- Update the following variables:
  - `DATABASE_URL`: Your PostgreSQL connection string
  - `OPENAI_API_KEY`: Your OpenAI API key

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

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
