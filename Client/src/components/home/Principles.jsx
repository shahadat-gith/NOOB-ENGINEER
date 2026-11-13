import { Card } from '../ui/Card.jsx';
import { SectionHeading } from './SectionHeading.jsx';

const STEPS = [
  {
    icon: 'bx-bulb',
    title: 'Understand the idea',
    body: 'Get the intuition in plain language before you touch syntax, formulas or jargon.',
  },
  {
    icon: 'bx-code-alt',
    title: 'Practise it straight away',
    body: 'Apply the concept in a small example while it is still fresh, so it turns into muscle memory.',
  },
  {
    icon: 'bx-refresh',
    title: 'Review and retry',
    body: 'Come back later, spot what slipped, and rebuild the weak parts. That is what makes it stick.',
  },
];

export function Principles() {
  return (
    <section id="method" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <div className="reveal">
        <SectionHeading
          title="How it works"
          lead="Three steps, repeated for every topic — until the idea is something you can use, not just recognise."
        />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3 lg:mt-14">
        {STEPS.map((step, index) => (
          <Card
            as="article"
            interactive
            key={step.title}
            className="reveal flex flex-col p-6 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-button bg-brand-soft text-[22px] text-brand">
                <i aria-hidden="true" className={`bx ${step.icon} leading-none`} />
              </span>
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                Step {index + 1}
              </span>
            </div>
            <h3 className="mt-5 text-[18px] font-semibold leading-snug">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{step.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
