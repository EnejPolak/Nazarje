import { Link } from 'react-router';
import { LegalPageLayout } from '../components/public/legal/legal-page-layout';
import { usePageMeta } from '../hooks/use-page-meta';

export function CookiePolicy() {
  usePageMeta({
    title: 'Politika piškotkov · Nazarje Dogodki',
    description: 'Informacije o piškotkih na portalu dogodkov Občine Nazarje.',
  });

  return (
    <LegalPageLayout title="Politika piškotkov">
      <h2>1. Kaj so piškotki</h2>
      <p>
        Piškotki so majhne datoteke, ki jih spletna stran shrani v vašo napravo za delovanje strani
        ali analitiko.
      </p>

      <h2>2. Nujni piškotki</h2>
      <p>
        Nujni piškotki so potrebni za osnovno delovanje portala (npr. shranjevanje vaše izbire
        glede piškotkov). Za te piškotke soglasje ni potrebno.
      </p>

      <h2>3. Ne-nujni piškotki</h2>
      <p>
        Analitični ali marketinški piškotki se na tej strani trenutno ne uporabljajo. Če bodo v
        prihodnosti vključeni, boste lahko podali soglasje prek pasice za piškotke.
      </p>

      <h2>4. Upravljanje soglasij</h2>
      <p>
        Svojo izbiro lahko kadarkoli spremenite z gumbom „Nastavitve piškotkov“ v nogi strani ali
        z brisanjem piškotkov v brskalniku.
      </p>

      <h2>5. Več informacij</h2>
      <p>
        Za obdelavo osebnih podatkov glejte tudi{' '}
        <Link to="/zasebnost">Politiko zasebnosti</Link>.
      </p>
    </LegalPageLayout>
  );
}
