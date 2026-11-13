import { Card } from '../ui/Card.jsx';
import { SectionHeading } from './SectionHeading.jsx';

const CARDS = [
  {
    icon: 'bx-question-mark',
    title: 'Ask the basic question',
    body: 'If something does not add up, say so. Basic questions expose the gaps most people quietly skip over.',
  },
  {
    icon: 'bx-message-rounded-dots',
    title: 'Explain it in your own words',
    body: 'If you cannot explain an idea simply, it is not fully yours yet. Write it down and tighten it.',
  },
  {
    icon: 'bx-wrench',
    title: 'Build something small',
    body: 'Turn each topic into a tiny example or project. Something you built teaches more than something you read.',
  },
];

export function Community() {
  return (
    <section id="community" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <div className="reveal">
        <SectionHeading
          title="Learn by explaining"
          lead="Ask the basic question, put the idea in your own words, then build something with it. That loop is how understanding turns into skill."
        />
      </div>

      <Card className="reveal mt-12 overflow-hidden lg:mt-14">
        <div className="grid divide-y divide-border-secondary sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {CARDS.map((card) => (
            <div key={card.title} className="p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-button bg-brand-soft text-[22px] text-brand">
                <i aria-hidden="true" className={`bx ${card.icon} leading-none`} />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold leading-snug">{card.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-text-secondary">{card.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
