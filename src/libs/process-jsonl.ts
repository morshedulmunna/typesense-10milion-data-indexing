import * as fs from 'fs';
import * as path from 'path';
export class DataProcess {
  async jsonlFileProcess(folder: string, fileName: string): Promise<object[]> {
    //---------
    const filePath = path.join(process.cwd(), folder, fileName);

    const booksInJsonl = fs.readFileSync(filePath, 'utf-8');
    const booksData = booksInJsonl.split('\n');
    // Data pre processing
    const data = booksData.reduce((acc, line) => {
      if (line.trim() !== '') {
        try {
          const parsedLine = JSON.parse(line);
          acc.push(parsedLine);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
      return acc;
    }, []);

    return data;
  }
}
