import { Card } from '../ui/Card.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { SectionHeading } from './SectionHeading.jsx';

function Panel({ label, children }) {
  return (
    <div className="rounded-field border border-border-secondary bg-surface-secondary p-4">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ExplanationVisual() {
  return (
    <Panel label="In plain words">
      <p className="text-[13.5px] leading-relaxed text-text">
        A cache keeps frequently used data close by, so the app does not have to ask the database
        every single time.
      </p>
    </Panel>
  );
}

function CodeVisual() {
  return (
    <CodeBlock
      label="Worked example"
      code={`const prices = [120, 80, 45];

const total = prices.reduce(
  (sum, price) => sum + price,
  0,
);`}
    />
  );
}

function PracticeVisual() {
  const prompts = [
    'Explain the idea in one sentence',
    'Trace the example yourself',
    'Compare with the solution',
  ];

  return (
    <Panel label="Try it yourself">
      <ul className="space-y-2">
        {prompts.map((prompt) => (
          <li key={prompt} className="flex items-start gap-2 text-[13px] text-text-secondary">
            <i
              aria-hidden="true"
              className="bx bx-check-circle mt-px shrink-0 text-[15px] leading-none text-success"
            />
            <span>{prompt}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function InterviewVisual() {
  return (
    <Panel label="Often asked as">
      <p className="text-[13.5px] font-medium leading-relaxed text-text">
        “How would you speed up a slow dashboard without changing the database?”
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-text-tertiary">
        Caching, indexes, pagination — and the trade-offs between them.
      </p>
    </Panel>
  );
}

const FEATURES = [
  {
    icon: 'bx-book-open',
    title: 'Plain-language explanations',
    body: 'Every idea is introduced in normal words before the technical term, so nothing feels like a leap.',
    visual: <ExplanationVisual />,
  },
  {
    icon: 'bx-code-alt',
    title: 'Worked examples',
    body: 'You see each concept applied step by step, so the theory has somewhere real to land.',
    visual: <CodeVisual />,
  },
  {
    icon: 'bx-list-check',
    title: 'Practice built in',
    body: 'Short prompts after each idea turn reading into doing, and show you what actually stuck.',
    visual: <PracticeVisual />,
  },
  {
    icon: 'bx-briefcase-alt-2',
    title: 'Interview framing',
    body: 'Learn how each topic is usually asked, and what interviewers are really listening for.',
    visual: <InterviewVisual />,
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
      <div className="reveal">
        <SectionHeading
          title="What every topic gives you"
          lead="Clarity first, then depth. Each topic is built to be understood, applied, and explained in your own words."
        />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14">
        {FEATURES.map((feature) => (
          <Card
            as="article"
            interactive
            key={feature.title}
            className="reveal flex flex-col p-6 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-brand-soft text-[22px] text-brand">
                <i aria-hidden="true" className={`bx ${feature.icon} leading-none`} />
              </span>
              <div>
                <h3 className="m-0 text-[18px] font-semibold leading-snug">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                  {feature.body}
                </p>
              </div>
            </div>
            <div className="mt-auto pt-6">{feature.visual}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
