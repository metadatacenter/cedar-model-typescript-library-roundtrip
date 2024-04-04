import { ExportResourceEnumerator } from './roundtrip/ExportResourceEnumerator';

const startedAt = new Date();
const enumerator: ExportResourceEnumerator = new ExportResourceEnumerator();
enumerator.parse().then(() => {
  const completedAt = new Date();
  console.log('Parsing started at   ' + startedAt.toISOString());
  console.log('Parsing completed at ' + completedAt.toISOString());
  const duration = (completedAt.getTime() - startedAt.getTime()) / 1000;
  console.log(`Parsing took ${duration} seconds.`);
});
