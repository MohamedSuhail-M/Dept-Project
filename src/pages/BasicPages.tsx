import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
import { Reveal } from '@/components/Shell';
import { CollegeMap } from '@/components/CollegeMap';

export function StudentsPage() {
  const items = [
    ['ACHIEVEMENTS', 'Celebrate the work that moves beyond the classroom.'],
    ['ACTIVITIES', 'Find community through clubs, events and shared interests.'],
    ['INTERNSHIPS', 'Connect academic foundations with real working environments.'],
    ['PLACEMENTS', 'Build confidence for the next chapter with guidance and preparation.'],
    ['PROJECTS', 'Turn ideas into working systems, experiments and stories.'],
    ['RESOURCES', 'Useful support for learning, planning and staying connected.'],
  ];
  return (
    <Page eyebrow="02 — STUDENTS" title="Student life" intro="A department culture built around making, questioning and finding your way forward.">
      <div className="grid gap-px bg-cream/10 md:grid-cols-2">
        {items.map(([title, text], i) => (
          <Reveal key={title}>
            <div className="bg-forest p-8 transition-colors hover:bg-deep-emerald md:p-10">
              <span className="font-mono text-xs text-lime/60">0{i + 1}</span>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-cream">{title}</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-cream/55">{text}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-lime/70">EXPLORE <ArrowUpRight size={14} /></span>
            </div>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}

export function EventsPage() {
  const events = [
    { date: '18 MAR 2026', title: 'AI and the changing world of work', category: 'GUEST LECTURE', venue: 'S.I.V.E.T. College · Seminar Hall', featured: true },
    { date: '04 APR 2026', title: 'Build / Break / Learn', category: 'STUDENT WORKSHOP', venue: 'AI Lab · IT Block', featured: false },
    { date: '22 APR 2026', title: 'Research, responsibility and society', category: 'SEMINAR', venue: 'S.I.V.E.T. College', featured: false },
    { date: '10 MAY 2026', title: 'Data Day — Student Showcase', category: 'SHOWCASE', venue: 'Department of CS + AI', featured: false },
  ];
  return (
    <Page eyebrow="03 — EVENTS" title="Events & ideas" intro="Lectures, workshops and department moments that bring the discipline into focus.">
      <div className="space-y-px bg-cream/10">
        {events.map((event) => (
          <Reveal key={event.title}>
            <article className={`grid gap-5 bg-forest py-8 md:grid-cols-[150px_1fr_auto] md:items-center ${event.featured ? 'px-6 md:px-8' : 'px-1'}`}>
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-lime">{event.date}</p>
                <p className="mt-2 text-[10px] font-bold tracking-[0.16em] text-cream/40">{event.category}</p>
              </div>
              <div>
                <h2 className={`font-bold tracking-tight text-cream ${event.featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{event.title}</h2>
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-cream/50"><MapPin size={13} /> {event.venue}</p>
              </div>
              <a href="/contact" className="button-outline">DETAILS <ArrowUpRight size={14} /></a>
            </article>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}

export function ContactPage() {
  return (
    <Page eyebrow="04 — FIND US" title={<>Let's <em className="text-lime">connect.</em></>} intro="S.I.V.E.T. College is located on Velachery Main Road, Gowrivakkam, Chennai – 600073.">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-10">
            <div>
              <p className="eyebrow text-lime/70">COLLEGE ADDRESS</p>
              <p className="mt-4 text-2xl font-bold leading-10 text-cream">Velachery Main Road,<br />Gowrivakkam,<br />Chennai – 600073</p>
            </div>
            <div>
              <p className="eyebrow text-lime/70">PHONE</p>
              <div className="mt-4 flex items-start gap-4 text-lg leading-8 text-cream/80">
                <Phone size={18} className="mt-1 text-lime" />
                <span>044-22780777<br />044-22780037<br />9363227088</span>
              </div>
            </div>
            <div>
              <p className="eyebrow text-lime/70">EMAIL</p>
              <div className="mt-4 flex items-center gap-4">
                <Mail size={18} className="text-lime" />
                <a href="mailto:sivethelpdesk@sivet.in" className="text-lg text-lime link-underline">sivethelpdesk@sivet.in</a>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <CollegeMap />
        </Reveal>
      </div>
    </Page>
  );
}

function Page({ title, eyebrow, intro, children }: { title: React.ReactNode; eyebrow: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="bg-forest px-5 pb-24 pt-32 text-cream lg:px-10 lg:pb-32">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="eyebrow text-lime">{eyebrow}</p>
          <h1 className="display mt-6 max-w-5xl">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-cream/60">{intro}</p>
        </Reveal>
        <div className="mt-16 lg:mt-20">{children}</div>
      </div>
    </main>
  );
}
