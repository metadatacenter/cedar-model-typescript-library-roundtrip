import { ExportResourceEnumerator } from './ExportResourceEnumerator';

const enumerator = new ExportResourceEnumerator();
enumerator.parse().then(() => console.log('Parsing completed.'));
