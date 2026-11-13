import { Brand } from '../common/Brand.jsx';
import { Card } from '../ui/Card.jsx';
import { useTheme } from '../../context/themeContext.js';

export function Hero() {
  const { theme } = useTheme();

  return (
    <>
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="text-left">
            <h1 className="m-0 font-heading text-[30px] font-medium uppercase leading-[1.06] tracking-[-0.015em] xs:text-[38px] sm:text-[44px] xl:text-[50px]">
              <span className="block">
                BE THE{' '}
                <span className="font-bold text-brand">ENGINEER</span>
              </span>
              <span className="block">
                WHO KNOWS <span className="font-bold text-brand">“HOW”</span>
              </span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[16.5px] leading-relaxed text-text-secondary sm:text-[18px]">
              “<Brand showLink={false} showLogo={false} textClassName="text-[16.5px] sm:text-[18px]" />”
              takes you from your first concept to confident engineering — plain-language
              explanations, worked examples and short practice, so you learn how to actually do the
              work, not just repeat the theory.
            </p>
          </div>

          <Card as="figure" className="m-0 overflow-hidden p-2">
            <img
              src={theme === 'dark' ? '/hero_dark.webp' : '/hero_light.webp'}
              alt="System design diagram showing a client, load balancer, application servers, cache and database"
              className="aspect-[3/2] w-full rounded-[1.25rem] object-cover"
            />
          </Card>
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-6xl px-6 sm:mt-20">
        <hr className="border-0 border-t-2 border-border" />
      </div>
    </>
  );
}
