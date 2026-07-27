import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';

import '../styles/home.css';
import Features from '../components/home/Features';

export default function HomeV2() {
  return (
    <div className="home-page">
      <Navbar />

      <Hero />

      <Features />
    </div>
  );
}
