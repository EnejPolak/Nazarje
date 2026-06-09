import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
import { SkipLink } from '../layout/skip-link';
import '../../../styles/components/legal-page.css';

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="legal-page min-h-screen bg-[#F7F4EE] flex flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" className="legal-page__main flex-1">
        <div className="legal-page__container">
          <Link to="/" className="legal-page__back">
            ← Nazaj na domov
          </Link>
          <h1 className="legal-page__title">{title}</h1>
          <div className="legal-page__prose">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
