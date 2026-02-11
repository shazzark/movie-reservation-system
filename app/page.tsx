import { Navigation } from "../component/navigation";
import { Footer } from "../component/footer";
import { HeroSection } from "../component/home/hero-section";
import { FeaturedMovies } from "../component/home/featured-movie";
import { HowItWorks } from "../component/home/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <FeaturedMovies />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
