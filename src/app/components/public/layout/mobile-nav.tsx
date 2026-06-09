import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import '../../../styles/components/mobile-nav.css';

export interface MobileNavLink {
  label: string;
  path: string;
  section?: string;
}

interface MobileNavProps {
  open: boolean;
  links: MobileNavLink[];
  onNavigate: (path: string, section?: string) => void;
  onClose: () => void;
}

export function MobileNav({ open, links, onNavigate, onClose }: MobileNavProps) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const openRef = useRef(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    openRef.current = open;
    if (open) setVisible(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!visible) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const accent = accentRef.current;
    const linkEls = linkRefs.current.filter(Boolean) as HTMLButtonElement[];

    if (!overlay || !panel) return;

    if (open) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { opacity: 0, pointerEvents: 'auto' });
      gsap.set(panel, { xPercent: -100, visibility: 'visible' });
      gsap.set(accent, { scaleY: 0 });
      gsap.set(linkEls, { x: -20, opacity: 0 });

      const tl = gsap.timeline();
      tl.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        .to(panel, { xPercent: 0, duration: 0.5, ease: 'power3.out' }, 0)
        .to(accent, { scaleY: 1, duration: 0.4, ease: 'power2.out' }, 0.15)
        .to(
          linkEls,
          { x: 0, opacity: 1, duration: 0.38, stagger: 0.07, ease: 'power2.out' },
          0.2
        );

      return () => {
        tl.kill();
      };
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (!openRef.current) {
          gsap.set(panel, { visibility: 'hidden' });
          document.body.style.overflow = '';
          setVisible(false);
        }
      },
    });

    tl.to(linkEls, { x: -16, opacity: 0, duration: 0.2, stagger: 0.04, ease: 'power2.in' })
      .to(accent, { scaleY: 0, duration: 0.2, ease: 'power2.in' }, 0)
      .to(panel, { xPercent: -100, duration: 0.38, ease: 'power3.in' }, 0.05)
      .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
      .set(overlay, { pointerEvents: 'none' });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [open, visible]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return createPortal(
    <>
      <div
        ref={overlayRef}
        className="mobile-nav__overlay md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        id="mobile-nav-panel"
        className="mobile-nav__panel md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Meni za mobilne naprave"
      >
        <span ref={accentRef} className="mobile-nav__accent" aria-hidden />

        <p className="mobile-nav__label">Navigacija</p>

        <nav aria-label="Mobilna navigacija">
          <ul className="mobile-nav__links">
            {links.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <button
                    ref={(el) => {
                      linkRefs.current[idx] = el;
                    }}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    className={`mobile-nav__link${isActive ? ' is-active' : ''}`}
                    onClick={() => onNavigate(link.path, link.section)}
                  >
                    <span className="mobile-nav__link-index">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="mobile-nav__link-text">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>,
    document.body
  );
}
