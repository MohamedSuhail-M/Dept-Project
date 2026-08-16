import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [['/','HOME'],['/students','STUDENTS'],['/events','EVENTS'],['/nac','NAC FILES'],['/contact','CONTACT']];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" className="group flex items-center gap-3 text-cream" aria-label="S.I.V.E.T. College home">
      <img src="/assets/download_(3).png" alt="S.I.V.E.T. College crest" className="h-11 w-11 shrink-0 object-contain" />
      <span className="leading-none">
        <strong className={`block font-bold tracking-[0.16em] ${compact ? 'text-sm' : 'text-base'}`}>S.I.V.E.T.</strong>
        <small className="mt-1 block text-[9px] font-medium tracking-[0.2em] text-lime">COLLEGE / CS + AI</small>
      </span>
    </a>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-forest text-cream">
      <header className="fixed inset-x-0 top-0 z-40 bg-forest shadow-lg">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <Brand />
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([href, label]) => <a key={href} href={href} className="nav-link">{label}</a>)}
            <a href="/admin" className="border border-lime/50 px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-lime transition hover:bg-lime hover:text-forest">ADMIN <ArrowUpRight size={12} className="ml-1 inline" /></a>
          </nav>
          <button className="text-cream lg:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-forest p-6 text-cream lg:hidden">
          <div className="flex items-center justify-between">
            <Brand compact />
            <button aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X /></button>
          </div>
          <nav className="mt-16 flex flex-col gap-6 text-3xl font-bold tracking-tight">
            {links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a href="/admin" className="text-lime text-xl">ADMIN / ACCESS <ArrowUpRight size={18} className="inline" /></a>
          </nav>
          <p className="absolute bottom-8 text-xs uppercase tracking-[0.2em] text-lime/60">Gowrivakkam, Chennai</p>
        </div>
      )}
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest px-5 py-20 text-cream lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/assets/download_(3).png" alt="S.I.V.E.T. College crest" className="h-12 w-12 object-contain" />
              <span className="leading-none">
                <strong className="block text-lg font-bold tracking-[0.16em]">S.I.V.E.T.</strong>
                <small className="mt-1 block text-[9px] font-medium tracking-[0.2em] text-lime">COLLEGE / CS + AI</small>
              </span>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-7 text-cream/65">B.Sc. Computer Science with Artificial Intelligence<br />Gowrivakkam, Chennai – 600073</p>
          </div>
          <div>
            <p className="eyebrow text-lime">QUICK LINKS</p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-cream/70">
              {links.map(([href, label]) => <a key={href} href={href} className="link-underline w-fit hover:text-lime">{label}</a>)}
            </div>
          </div>
          <div>
            <p className="eyebrow text-lime">CONTACT</p>
            <p className="mt-6 text-sm leading-7 text-cream/70">044-22780777<br />044-22780037<br />9363227088</p>
            <a href="mailto:sivethelpdesk@sivet.in" className="mt-3 inline-block text-sm text-lime link-underline">sivethelpdesk@sivet.in</a>
          </div>
        </div>
        <div className="mt-16 border-t border-cream/12 pt-6 text-[10px] uppercase tracking-[0.18em] text-cream/40">© {new Date().getFullYear()} S.I.V.E.T. College · Departmental Portal</div>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? 'in' : ''} ${className}`}>{children}</div>;
}
