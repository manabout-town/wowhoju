import { useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SceneBg } from './fx/SceneBg';
import { Intro } from './sections/Intro';
import { Hero } from './home/Hero';
import { Story } from './home/Story';
import { Day } from './home/Day';
import { RoadMap } from './home/RoadMap';
import { Picks } from './home/Picks';
import { Pink } from './home/Pink';
import { Custom } from './home/Custom';
import { Gallery } from './home/Gallery';
import { Reviews } from './home/Reviews';
import { Season } from './home/Season';
import { Contact } from './home/Contact';
import { Tours } from './pages/Tours';
import { TourPage } from './pages/TourPage';
const CustomPage = lazy(() => import('./pages/Pages').then((m) => ({ default: m.CustomPage })));
const InfoPage = lazy(() => import('./pages/Pages').then((m) => ({ default: m.InfoPage })));
const HelpPage = lazy(() => import('./pages/Pages').then((m) => ({ default: m.HelpPage })));
const AboutPage = lazy(() => import('./pages/Pages').then((m) => ({ default: m.AboutPage })));
import { useLenis } from './lib/useLenis';
import { useReveal } from './lib/useReveal';
import { useRoute } from './lib/route';
import { ScrollTrigger } from './lib/gsap';
import { say } from './data/copy';
import './home/home.css';

const TITLES: Record<string, string> = { tours: '투어', tour: '투어', custom: '맞춤투어', info: '여행정보', help: '고객센터', about: 'About Us' };

export default function App() {
  const route = useRoute();
  const home = route.page === 'home';
  useLenis();
  useReveal();
  useEffect(() => {
    document.title = home ? '와우호주 — 퍼스 현지 한인 여행사, 서호주 투어' : `${TITLES[route.page] ?? '와우호주'} — 와우호주`;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [route, home]);
  const key = route.page + route.parts.join('/');
  return (
    <>
      <SceneBg page={key} />
      {home && <Intro video="/video/lancelin.mp4" poster="/video/lancelin.jpg" lines={[[say('painting').split(',')[0] + ','], ['잊지 못할 서호주 여행']]} word="와우호주" logo="/logo/logo-ko.png" storageKey="wowhoju-intro" />}
      <Header home={home} />
      <main id="main" tabIndex={-1} key={key}>
        {home && (
          <>
            <Hero />
            <Story />
            <Day />
            <RoadMap />
            <Picks />
            <Pink />
            <Custom />
            <Gallery />
            <Reviews />
            <Season />
            <Contact />
          </>
        )}
        {route.page === 'tours' && <Tours route={route} />}
        {route.page === 'tour' && <TourPage id={route.parts[0]} />}
        <Suspense fallback={<section className="sec pg" data-bg="pinnacles" />}>
          {route.page === 'custom' && <CustomPage />}
          {route.page === 'info' && <InfoPage route={route} />}
          {route.page === 'help' && <HelpPage />}
          {route.page === 'about' && <AboutPage />}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
