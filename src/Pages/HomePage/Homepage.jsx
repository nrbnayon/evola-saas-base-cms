import Hero from './Hero/Hero';
import Categories from './Categories/Categories';
import PopularServices from './PopularServices/PopularServices';
import MobileAppSection from './MobileAppSection/MobileAppSection';
import VideoSection from './VideoSection/VideoSection';
import ServicesPackages from './ServicesPackages/ServicesPackages';

const Homepage = () => {
    return (
        <div>
            <Hero />
            <Categories />
            <PopularServices />
            <VideoSection />
            <ServicesPackages />
            <MobileAppSection />
        </div>
    );
};

export default Homepage;