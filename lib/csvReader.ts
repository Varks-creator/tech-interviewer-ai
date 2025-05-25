import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import path from 'path';

export interface CSVRow {
  [key: string]: string;
}

export async function readCSV(filePath: string): Promise<CSVRow[]> {
  const records: CSVRow[] = [];
  
  return new Promise((resolve, reject) => {
    const parser = parse({
      columns: true, // Treats the first row as headers
      skip_empty_lines: true,
      trim: true,
    });

    createReadStream(path.resolve(filePath))
      .pipe(parser)
      .on('data', (data: CSVRow) => records.push(data))
      .on('end', () => resolve(records))
      .on('error', (error: Error) => reject(error));
  });
}

// Example usage:
// const data = await readCSV('lib/data/leetcode_questions.csv');
