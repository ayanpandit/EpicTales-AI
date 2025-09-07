// App.jsx
import React, { useState, useEffect } from 'react';
import OnceUponTimeLanding from './pages/hero';
import FeaturesSection from './pages/features';
import CartoonishNavbar from './components/navbar';
import FamilyTestimonials from './pages/Testimonials';
import HowItWorks from './pages/HowItWorks';
import YourStoryBegins from './components/footer';
import Dashboard from './pages/dashboard';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If hash is #dashboard, show dashboard page
  if (currentHash === '#dashboard') {
    return (
      <div className="bg-gradient-to-b from-gray-800 to-black min-h-screen gpu-accelerated">
        <CartoonishNavbar />
        <Dashboard />
      </div>
    );
  }

  // Otherwise show the main landing page
  return (
    <div className="bg-gradient-to-b from-orange-100 to-black gpu-accelerated">
      <CartoonishNavbar />
      <OnceUponTimeLanding />
      <FeaturesSection />
      <FamilyTestimonials />
      <HowItWorks />
      <YourStoryBegins />
    </div>
  );
}

export default App;
