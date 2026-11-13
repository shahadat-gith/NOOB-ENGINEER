import { useReveal } from '../hooks/useReveal.js';
import { Hero } from '../components/home/Hero.jsx';
import { WhyCards } from '../components/home/WhyCards.jsx';
import { Features } from '../components/home/Features.jsx';
import { Community } from '../components/home/Community.jsx';
import { Principles } from '../components/home/Principles.jsx';

export default function Home() {
  useReveal();

  return (
    <>
      <Hero />
      <WhyCards />
      <Features />
      <Community />
      <Principles />
    </>
  );
}
