import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPlaylists from "@/components/FeaturedPlaylists";
import TrendingSongs from "@/components/TrendingSongs";
import UserSpotlight from "@/components/UserSpotlight";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedPlaylists />
      <TrendingSongs />
      <UserSpotlight />
      <Footer />
    </div>
  );
};

export default Index;
