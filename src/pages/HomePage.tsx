import { useEffect, useRef } from 'react';
import { ArrowUpRight, Cpu, Database, Network, FlaskConical, Code2, Cloud } from 'lucide-react';
import { nacStructure } from '@/data/nacStructure';
import { Reveal } from '@/components/Shell';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { CollegeMap } from '@/components/CollegeMap';

const stats = [
  { value: 160, suffix: '+', label: 'STUDENTS' },
  { value: 12, suffix: '', label: 'FACULTY' },
  { value: 6, suffix: '', label: 'LABS' },
  { value: 90, suffix: '%', label: 'PLACEMENTS' },
];

export function HomePage() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = window.innerHeight;
        if (y > max) return;
        const p = y / max;
        if (imgRef.current) imgRef.current.style.transform = `scale(${1 + p * 0.08})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <main>
    {/* 01 — HERO */}
<section className="relative overflow-hidden bg-forest min-h-[500px] sm:min-h-[600px] lg:min-h-[100vh] w-full" aria-labelledby="hero-title">
  <div className="absolute inset-0 z-0">
    <img 
      ref={imgRef} 
      src="/images/hero/ChatGPT_Image_Aug_14,_2026,_06_28_11_PM.png" 
      alt="S.I.V.E.T. College IT Block, Gowrivakkam, Chennai" 
      className="w-full h-full object-cover object-center transform-gpu transition-transform duration-100 ease-out" 
    />
  </div>
  <div className="absolute inset-0 z-10 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
  <div className="relative z-20 mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-40">
    <div className="hero-copy">
      {/* Add your hero title or CTA here */}
    </div>
  </div>
</section>

      {/* 02 — DEPARTMENT INTRO */}
      <section id="intro" className="bg-forest px-5 py-24 lg:px-10 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="eyebrow text-lime">02 — THE DEPARTMENT</p>
            <h2 className="section-title mt-6 text-cream">Computing<br />for the<br /><em className="text-lime">intelligent future.</em></h2>
          </Reveal>
          <Reveal className="flex flex-col justify-end">
            <p className="max-w-md text-lg leading-8 text-cream/65">The B.Sc. Computer Science with Artificial Intelligence department at S.I.V.E.T. College prepares students to think rigorously, build responsibly and shape the systems that define tomorrow.</p>
            <div className="mt-10 border-t border-cream/15 pt-6">
              <p className="eyebrow text-lime/70">PROGRAMME</p>
              <p className="mt-3 text-sm leading-6 text-cream/75">B.Sc.<br />Computer Science<br />+<br />Artificial Intelligence</p>
            </div>
            <a href="/students" className="mt-10 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-lime link-underline w-fit">DISCOVER STUDENT LIFE <ArrowUpRight size={14} /></a>
            <div className="mt-12 overflow-hidden border border-cream/12">
              <img src="https://images.pexels.com/photos/5147366/pexels-photo-5147366.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="College campus building" className="aspect-[16/10] w-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — AI / ACADEMIC FOCUS */}
      <section className="bg-deep-emerald px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">03 — ACADEMIC DIRECTION</p>
            <h2 className="section-title mt-6 max-w-4xl text-cream">A curriculum across the <em className="text-lime">foundations of intelligence.</em></h2>
          </Reveal>
          <Reveal>
            <div className="mt-12 overflow-hidden border border-cream/12">
              <img src="https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Artificial intelligence and digital technology concept" className="aspect-[21/9] w-full object-cover opacity-75" loading="lazy" />
            </div>
          </Reveal>
          <div className="mt-16 grid gap-px bg-cream/10 md:grid-cols-3">
            {[
              { icon: <Code2 size={20} />, label: 'PROGRAMMING' },
              { icon: <Database size={20} />, label: 'DATA SCIENCE' },
              { icon: <Cpu size={20} />, label: 'MACHINE LEARNING' },
              { icon: <Network size={20} />, label: 'ARTIFICIAL INTELLIGENCE' },
              { icon: <FlaskConical size={20} />, label: 'DATABASES' },
              { icon: <Cloud size={20} />, label: 'CLOUD / COMPUTING' },
            ].map(({ icon, label }) => (
              <Reveal key={label}>
                <div className="group bg-deep-emerald p-8 transition-colors hover:bg-forest lg:p-10">
                  <div className="text-lime">{icon}</div>
                  <p className="mt-10 text-lg font-bold tracking-tight text-cream">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — STATISTICS */}
      <section className="bg-forest px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">04 — THE DEPARTMENT IN NUMBERS</p>
          </Reveal>
          <div className="mt-14 grid gap-px bg-cream/12 md:grid-cols-4">
            {stats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="bg-forest px-6 py-10 lg:py-14">
                  <strong className="block font-serif text-5xl font-medium tracking-tight text-lime lg:text-6xl"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></strong>
                  <span className="mt-4 block text-[10px] font-bold tracking-[0.18em] text-cream/55">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs text-cream/40">Department prototype figures · editable in the data layer.</p>
        </div>
      </section>

      {/* 05 — LABS / INFRASTRUCTURE */}
      <section className="bg-deep-emerald px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">05 — LABS / INFRASTRUCTURE</p>
            <h2 className="section-title mt-6 max-w-3xl text-cream">Spaces built for <em className="text-lime">making and learning.</em></h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              { title: 'COMPUTER LABS', text: 'Dedicated workstations for programming, systems and coursework.', img: 'https://images.pexels.com/photos/18471488/pexels-photo-18471488.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { title: 'AI / ML LEARNING', text: 'Compute resources for model training, data exploration and research.', img: 'https://images.pexels.com/photos/17489151/pexels-photo-17489151.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { title: 'PROGRAMMING', text: 'Collaborative environments for software development and review.', img: 'https://images.pexels.com/photos/1102797/pexels-photo-1102797.png?auto=compress&cs=tinysrgb&h=650&w=940' },
              { title: 'PROJECT DEVELOPMENT', text: 'Project rooms for team building, prototyping and presentation.', img: 'https://images.pexels.com/photos/5212687/pexels-photo-5212687.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            ].map((lab, i) => (
              <Reveal key={lab.title}>
                <div className="group relative aspect-[16/10] overflow-hidden border border-cream/12 bg-forest">
                  <img src={lab.img} alt={lab.title} className="absolute inset-0 h-full w-full object-cover opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-forest/30" />
                  <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-10">
                    <span className="eyebrow text-lime/70">0{i + 1}</span>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-cream">{lab.title}</h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-cream/55">{lab.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — STUDENT LIFE */}
      <section className="bg-forest px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">06 — STUDENT LIFE</p>
            <h2 className="section-title mt-6 max-w-3xl text-cream">Beyond the <em className="text-lime">syllabus.</em></h2>
          </Reveal>
          <Reveal>
            <div className="mt-12 overflow-hidden border border-cream/12">
              <img src="https://images.pexels.com/photos/7944181/pexels-photo-7944181.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Students celebrating graduation" className="aspect-[21/9] w-full object-cover opacity-70" loading="lazy" />
            </div>
          </Reveal>
          <div className="mt-16 grid gap-px bg-cream/10 md:grid-cols-3">
            {['PROJECTS', 'EVENTS', 'COMPETITIONS', 'CLUBS', 'WORKSHOPS', 'INTERNSHIPS'].map((label, i) => (
              <Reveal key={label}>
                <a href="/students" className="group block bg-forest p-8 transition-colors hover:bg-deep-emerald lg:p-10">
                  <span className="font-mono text-xs text-lime/60">0{i + 1}</span>
                  <h3 className="mt-8 text-xl font-bold tracking-tight text-cream">{label}</h3>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-lime/70 transition group-hover:text-lime">EXPLORE <ArrowUpRight size={13} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — EVENTS */}
      <section className="bg-deep-emerald px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow text-lime">07 — EVENTS</p>
            <h2 className="section-title mt-6 max-w-3xl text-cream">Moments that <em className="text-lime">bring ideas forward.</em></h2>
          </Reveal>
          <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <article className="group overflow-hidden border border-cream/12 bg-forest transition-colors hover:border-lime/30">
                <div className="overflow-hidden">
                  <img src="https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Guest lecture conference" className="aspect-[16/9] w-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-lime">FEATURED · GUEST LECTURE</span>
                  <span className="text-xs text-cream/45">18 MAR 2026</span>
                </div>
                <h3 className="mt-10 text-3xl font-bold tracking-tight text-cream lg:text-4xl">AI and the changing world of work</h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-cream/55">A conversation on how artificial intelligence is reshaping careers, industries and the skills that matter next.</p>
                <span className="mt-10 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-lime">VIEW DETAILS <ArrowUpRight size={14} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </div>
              </article>
            </Reveal>
            <div className="flex flex-col gap-6">
              {[
                { date: '04 APR 2026', title: 'Build / Break / Learn', category: 'WORKSHOP' },
                { date: '22 APR 2026', title: 'Research, responsibility and society', category: 'SEMINAR' },
              ].map((event) => (
                <Reveal key={event.title}>
                  <a href="/events" className="group block border border-cream/12 bg-forest p-6 transition-colors hover:border-lime/30 lg:p-8">
                    <span className="text-xs font-bold tracking-[0.12em] text-lime">{event.date}</span>
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-cream">{event.title}</h3>
                    <p className="mt-2 text-[10px] font-bold tracking-[0.16em] text-cream/40">{event.category}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
          <a href="/events" className="mt-12 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-lime link-underline">ALL EVENTS <ArrowUpRight size={14} /></a>
        </div>
      </section>

      {/* 08 — NAC DIGITAL ARCHIVE */}
      <section className="bg-forest px-5 py-24 lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <p className="eyebrow text-lime">08 — QUALITY ASSURANCE</p>
              <h2 className="display mt-6 text-cream">NAC<br /><span className="text-lime">Digital</span> <em>Archive.</em></h2>
              <p className="mt-8 max-w-xl text-lg leading-8 text-cream/60">Academic documentation and quality assurance repository — organised by file, subsection and academic year.</p>
            </Reveal>
            <Reveal className="flex items-end">
              <div className="overflow-hidden border border-cream/12">
                <img src="https://images.pexels.com/photos/6549926/pexels-photo-6549926.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Document archive library" className="aspect-[4/3] w-full object-cover opacity-70" loading="lazy" />
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="mt-14 grid grid-cols-3 gap-px bg-cream/12 md:max-w-2xl">
              {[['25', 'FILES'], ['MULTI', 'YEAR ARCHIVE'], ['DOC', 'MANAGEMENT']].map(([value, label]) => (
                <div key={label} className="bg-forest px-4 py-8 text-center">
                  <strong className="block font-serif text-3xl font-medium text-lime">{value}</strong>
                  <span className="mt-2 block text-[9px] font-bold tracking-[0.16em] text-cream/50">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-3">
              {nacStructure.slice(0, 6).map((file) => (
                <a key={file.fileNumber} href={`/nac/${file.fileNumber}`} className="archive-pill">{String(file.fileNumber).padStart(2, '0')} / {file.title}</a>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <a href="/nac" className="mt-12 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-lime link-underline">EXPLORE NAC FILES <ArrowUpRight size={15} /></a>
          </Reveal>
        </div>
      </section>

      {/* 09 — CONTACT */}
      <section className="bg-deep-emerald px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-lime">09 — CONTACT</p>
            <h2 className="section-title mt-6 text-cream">Let's<br /><em className="text-lime">connect.</em></h2>
            <p className="mt-8 max-w-md text-lg leading-8 text-cream/60">S.I.V.E.T. College is located on Velachery Main Road, Gowrivakkam, Chennai – 600073.</p>
            <div className="mt-12 space-y-8">
              <div>
                <p className="eyebrow text-lime/70">COLLEGE ADDRESS</p>
                <p className="mt-3 text-lg leading-8 text-cream/80">Velachery Main Road,<br />Gowrivakkam,<br />Chennai – 600073</p>
              </div>
              <div>
                <p className="eyebrow text-lime/70">PHONE</p>
                <p className="mt-3 text-lg leading-8 text-cream/80">044-22780777<br />044-22780037<br />9363227088</p>
              </div>
              <div>
                <p className="eyebrow text-lime/70">EMAIL</p>
                <a href="mailto:sivethelpdesk@sivet.in" className="mt-3 inline-block text-lg text-lime link-underline">sivethelpdesk@sivet.in</a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <CollegeMap />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
