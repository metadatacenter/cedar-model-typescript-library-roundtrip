import * as fs from 'fs';
import * as path from 'path';
import { SummaryLog } from './SummaryLog';

export class SummaryLogProcessor {
  private folderPrefix: string;

  constructor(folderPrefix: string) {
    this.folderPrefix = folderPrefix;
  }

  public saveLogObject(logObject: SummaryLog[]): void {
    const filePath = path.join(this.folderPrefix, `summary.json`);
    fs.writeFileSync(filePath, JSON.stringify(logObject, null, 2), 'utf8');
  }

  transformAndSortErrorStats(errorStats: Map<string, number>) {
    const errorStatsArray = Array.from(errorStats, ([key, count]) => {
      const [errorType, errorPath] = key.split(':'); // Split the key back into its original components
      return {
        errorType,
        errorPath,
        count,
      };
    });

    errorStatsArray.sort((a, b) => b.count - a.count);

    return errorStatsArray;
  }

  saveErrorStats(errorStats: Map<string, number>, fileName: string) {
    const transformedAndSortedErrorStats = this.transformAndSortErrorStats(errorStats);
    const filePath = path.join(this.folderPrefix, fileName);
    fs.writeFileSync(filePath, JSON.stringify(transformedAndSortedErrorStats, null, 2), 'utf8');
  }
}
