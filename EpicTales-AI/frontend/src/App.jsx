// App.jsx

import OnceUponTimeLanding from './pages/hero';
import FeaturesSection from './pages/features';
import CartoonishNavbar from './components/navbar';
import FamilyTestimonials from './pages/Testimonials';
import HowItWorks from './pages/HowItWorks';
import YourStoryBegins from './components/footer';


function App() {
  return (
    <>
      <CartoonishNavbar />
      <OnceUponTimeLanding />
      <FeaturesSection />
      <FamilyTestimonials />
      <HowItWorks />
      <YourStoryBegins />
    </>
  );
}

export default App;
