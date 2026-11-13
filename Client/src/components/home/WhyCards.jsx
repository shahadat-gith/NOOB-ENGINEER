import { Card } from '../ui/Card.jsx';
import { SectionHeading } from './SectionHeading.jsx';

const CARDS = [
  {
    icon: 'bx-rocket',
    title: 'No background needed',
    body: 'We start from zero. If you are curious and willing to read, that is enough.',
  },
  {
    icon: 'bx-bulb',
    title: 'Understand, not memorise',
    body: 'Every idea is explained from the ground up, so it stays with you instead of fading after an exam.',
  },
  {
    icon: 'bx-code-alt',
    title: 'Examples you can follow',
    body: 'Nothing is left in theory. Each concept is shown in action with small, readable examples.',
  },
  {
    icon: 'bx-target-lock',
    title: 'Confidence that shows',
    body: 'Explain your reasoning clearly in interviews, projects and everyday engineering work.',
  },
];

export function WhyCards() {
  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <div className="reveal">
        <SectionHeading
          title="Made for beginners, not experts"
          lead="No assumed knowledge and no skipped steps. Every topic starts where you are and moves at a pace you can actually keep."
        />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Card
            as="article"
            interactive
            key={card.title}
            className="reveal flex flex-col p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-button bg-brand-soft text-[22px] text-brand">
              <i aria-hidden="true" className={`bx ${card.icon} leading-none`} />
            </span>
            <h3 className="mt-5 text-[16px] font-semibold leading-snug">{card.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-text-secondary">{card.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
