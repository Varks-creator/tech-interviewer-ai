import { readCSV, CSVRow } from '../csvReader';

export interface LeetCodeQuestion extends CSVRow {
  'Question ID': string;
  'Question Title': string;
  'Question Slug': string;
  'Question Text': string;
  'Topic Tagged text': string;
  'Difficulty Level': string;
  'Success Rate': string;
  'total submission': string;
  'total accepted': string;
  'Likes': string;
  'Dislikes': string;
  'Hints': string;
  'Similar Questions ID': string;
  'Similar Questions Text': string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export class LeetCodeService {
  private static instance: LeetCodeService;
  private questions: LeetCodeQuestion[] = [];

  private constructor() {}

  public static getInstance(): LeetCodeService {
    if (!LeetCodeService.instance) {
      LeetCodeService.instance = new LeetCodeService();
    }
    return LeetCodeService.instance;
  }

  public async loadQuestions(): Promise<void> {
    if (this.questions.length === 0) {
      this.questions = await readCSV('lib/data/leetcode_questions.csv') as LeetCodeQuestion[];
    }
  }

  public getQuestions(): LeetCodeQuestion[] {
    return this.questions;
  }

  private getQuestionsByDifficulty(difficulty: Difficulty): LeetCodeQuestion[] {
    return this.questions.filter(q => q['Difficulty Level'] === difficulty);
  }

  private getQuestionsByTopic(topic: string): LeetCodeQuestion[] {
    return this.questions.filter(q => 
      q['Topic Tagged text'].toLowerCase().includes(topic.toLowerCase())
    );
  }

  private getQuestionsByDifficultyAndTopic(difficulty: Difficulty, topic: string): LeetCodeQuestion[] {
    return this.questions.filter(q => 
      q['Difficulty Level'] === difficulty && 
      q['Topic Tagged text'].toLowerCase().includes(topic.toLowerCase())
    );
  }

  public getRandomQuestion(questions: LeetCodeQuestion[]): LeetCodeQuestion | null {
    if (questions.length === 0) return null;

    // Filter out questions with empty text
    const validQuestions = questions.filter(q => q['Question Text'] && q['Question Text'].trim() !== '');
    if (validQuestions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * validQuestions.length);
    return validQuestions[randomIndex];
  }

  public getRandomQuestionByDifficulty(difficulty: Difficulty): LeetCodeQuestion | null {
    const filteredQuestions = this.getQuestionsByDifficulty(difficulty);
    return this.getRandomQuestion(filteredQuestions);
  }

  public getRandomQuestionByTopic(topic: string): LeetCodeQuestion | null {
    const filteredQuestions = this.getQuestionsByTopic(topic);
    return this.getRandomQuestion(filteredQuestions);
  }

  public getRandomQuestionByDifficultyAndTopic(difficulty: Difficulty, topic: string): LeetCodeQuestion | null {
    const filteredQuestions = this.getQuestionsByDifficultyAndTopic(difficulty, topic);
    return this.getRandomQuestion(filteredQuestions);
  }
} 