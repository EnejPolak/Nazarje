import { Link } from 'react-router';
import { LegalPageLayout } from '../components/public/legal/legal-page-layout';
import { usePageMeta } from '../hooks/use-page-meta';
import { useStructuredData } from '../hooks/use-structured-data';

export function PrivacyPolicy() {
  usePageMeta({
    title: 'Politika zasebnosti · Nazarje Dogodki',
    description: 'Politika zasebnosti portala dogodkov Občine Nazarje.',
  });
  useStructuredData(null);

  return (
    <LegalPageLayout title="Politika zasebnosti">
      <h2>1. Upravljavec</h2>
      <p>
        Upravljavec osebnih podatkov je Občina Nazarje (kontaktne podatke objavi občina v končni
        verziji te politike).
      </p>

      <h2>2. Namen obdelave</h2>
      <p>Osebne podatke obdelujemo za:</p>
      <ul>
        <li>prikaz in upravljanje dogodkov na portalu,</li>
        <li>prijavo na e-novice (če je storitev aktivna),</li>
        <li>zagotavljanje delovanja spletne strani in varnosti.</li>
      </ul>

      <h2>3. Pravna podlaga</h2>
      <p>
        Podlage za obdelavo določi upravljavec v skladu z GDPR (npr. soglasje, legitimni interes,
        zakonska obveznost).
      </p>

      <h2>4. Pravice posameznikov</h2>
      <p>
        Imate pravico do dostopa, popravka, izbrisa, omejitve obdelave, ugovora in prenosljivosti
        podatkov, kadar to določa zakon. Za uveljavitev pravic kontaktirajte upravljavca.
      </p>

      <h2>5. Piškotki</h2>
      <p>
        Več o piškotkih in soglasjih je na strani{' '}
        <Link to="/piskotki">Politika piškotkov</Link>.
      </p>
    </LegalPageLayout>
  );
}
