import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import ContactForm from '../components/ContactForm';
import ImpactCard from '../components/ImpactCard';
import TestimonialCard from '../components/TestimonialCard';
import { FaShieldAlt, FaBrain, FaRoute } from 'react-icons/fa';
import ParticleBackground from '../components/ParticleBackground';
import { useTheme } from '../context/ThemeContext';
import CarAnimation from '../components/CarAnimation';

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors duration-300 font-sans overflow-x-hidden">
      <Navbar />

      {/* 1. Hero Section - Full Screen Showroom */}
      <section className="h-screen w-full relative overflow-hidden flex flex-col justify-end pb-20">
        <div className="absolute inset-0 z-0">
          <ParticleBackground theme={theme} />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CarAnimation />
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-6xl md:text-9xl font-bold mb-4 tracking-tighter text-white opacity-90">
            SAFERIDE
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/30 pt-6">
            <p className="text-xl md:text-2xl text-gray-300 max-w-xl font-light tracking-wide">
              The future of driver wellness. <br />
              <span className="text-accent-blue">AI-Powered. Blockchain-Secured.</span>
            </p>
            <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 border border-white text-white text-lg font-medium tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase">
                Driver Portal
              </Link>
              <Link to="/insurance-portal/login" className="inline-flex items-center justify-center px-10 py-4 border border-accent-blue text-accent-blue text-lg font-medium tracking-widest hover:bg-accent-blue hover:text-black transition-all duration-300 uppercase">
                Insurance Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overview - Detailed Information */}
      <section id="overview" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">01 // Overview</span>
              <h2 className="text-4xl font-light tracking-tight text-white mb-6">
                Intelligent.<br />
                Intuitive.<br />
                Immutable.
              </h2>
              <p className="text-gray-400 font-light leading-relaxed">
                SafeRide revolutionizes driver safety through cutting-edge technology and blockchain verification.
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="text-2xl font-light text-gray-300 leading-relaxed mb-8">
                SafeRide isn't just an app; it's your intelligent co-pilot. By merging advanced AI monitoring with the immutable trust of blockchain, we've created a comprehensive safety ecosystem that protects drivers, reduces accidents, and rewards safe behavior.
              </p>

              {/* Key Points */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-black/30 p-6 border border-white/10">
                  <h3 className="text-white font-medium mb-3 text-lg">🚗 For Fleet Managers</h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Optimize operations and reduce liability with real-time driver health analytics. Monitor fatigue levels, track safety scores, and ensure compliance with automated reporting.
                  </p>
                </div>
                <div className="bg-black/30 p-6 border border-white/10">
                  <h3 className="text-white font-medium mb-3 text-lg">👤 For Individual Drivers</h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Drive with confidence knowing your safety data is securely verified on blockchain. Earn rewards for safe driving and get instant alerts when fatigue is detected.
                  </p>
                </div>
              </div>

              {/* What We Do */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-4">What SafeRide Does</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-white font-medium mb-2">Real-Time Monitoring</div>
                    <p className="text-gray-400 text-sm font-light">
                      IoT sensors and wearables track vital signs, eye movement, and brain activity to detect fatigue before it becomes dangerous.
                    </p>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-2">AI-Powered Analysis</div>
                    <p className="text-gray-400 text-sm font-light">
                      Machine learning algorithms analyze patterns and predict potential safety risks, providing instant alerts to drivers and fleet managers.
                    </p>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-2">Blockchain Verification</div>
                    <p className="text-gray-400 text-sm font-light">
                      All safety data is cryptographically secured and stored on blockchain, creating tamper-proof records for insurance and compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features - Grid Layout (Bento Box) */}
      <section id="features" className="py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-light tracking-tight">Specifications</h2>
            <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase">02 // Features</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <div className="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-r border-b border-white/10">
              <FaBrain className="text-4xl text-accent-blue mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-medium mb-4">Neural Monitoring</h3>
              <p className="text-gray-400 font-light leading-relaxed">Real-time fatigue detection using computer vision and biometric analysis.</p>
            </div>
            <div className="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-r border-b border-white/10">
              <FaShieldAlt className="text-4xl text-accent-blue mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-medium mb-4">Ledger Security</h3>
              <p className="text-gray-400 font-light leading-relaxed">Trip data hashed and stored on a decentralized network for absolute proof.</p>
            </div>
            <div className="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-b border-white/10">
              <FaRoute className="text-4xl text-accent-blue mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-medium mb-4">Predictive Routing</h3>
              <p className="text-gray-400 font-light leading-relaxed">AI-driven route suggestions based on safety scores and traffic patterns.</p>
            </div>
            {/* Additional "Spec" blocks to fill grid if needed, or keep it clean */}
          </div>
        </div>
      </section>

      {/* 4. How it Works - Process Timeline */}
      <section id="how-it-works" className="py-24 px-6 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-12 text-center">03 // Integration</span>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="relative">
              <div className="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">01</div>
              <h3 className="text-xl font-medium mb-4 relative z-10 dark:text-white">Connect</h3>
              <p className="text-gray-400 font-light">Sync with vehicle telemetry.</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">02</div>
              <h3 className="text-xl font-medium mb-4 relative z-10 dark:text-white">Analyze</h3>
              <p className="text-gray-400 font-light">AI processes driver state.</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">03</div>
              <h3 className="text-xl font-medium mb-4 relative z-10 dark:text-white">Secure</h3>
              <p className="text-gray-400 font-light">Data verified on blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact - Big Numbers */}
      <section id="impact" className="py-32 px-6 bg-accent-blue text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-black/20">
            <div className="py-8 md:py-0">
              <div className="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">40%</div>
              <div className="text-sm font-bold uppercase tracking-widest">Accident Reduction</div>
            </div>
            <div className="py-8 md:py-0">
              <div className="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">60%</div>
              <div className="text-sm font-bold uppercase tracking-widest">Wellness Increase</div>
            </div>
            <div className="py-8 md:py-0">
              <div className="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">100%</div>
              <div className="text-sm font-bold uppercase tracking-widest">Data Integrity</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Demo Video - Cinema Mode */}
      <section id="demo" className="h-screen flex items-center justify-center bg-black relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl w-full px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase">04 // Experience</span>
          </div>
          <div className="aspect-video w-full bg-gray-900 border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-accent-blue/5 group-hover:bg-accent-blue/10 transition-colors duration-500"></div>
            <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Us */}
      <section id="contact" className="py-24 px-6 bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">05 // Get In Touch</span>
            <h2 className="text-4xl font-light tracking-tight dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 font-light max-w-2xl mx-auto">Have questions about SafeRide? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 8. Footer - Minimal */}
      <footer className="py-12 px-6 bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter mb-4 md:mb-0">SAFERIDE</div>
          <div className="flex space-x-8 text-sm font-light text-gray-400">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-gray-600 uppercase tracking-widest">
            &copy; 2023 SafeRide Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
