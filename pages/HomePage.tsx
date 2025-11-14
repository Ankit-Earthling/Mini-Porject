import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS } from '../constants';
import { HealedPot } from '../components/IconComponents';

// --- Helper Components defined outside to prevent re-creation on render ---

interface CounterProps {
  end: number;
  duration?: number;
  startAnimation: boolean;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 3000, startAnimation }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, startAnimation]);

  return <span className="text-4xl md:text-5xl font-bold text-calm-blue-300">{count.toLocaleString()}+</span>;
};


const ImpactMetric: React.FC<{ end: number, label: string }> = ({ end, label }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={ref} className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg">
            <Counter end={end} duration={3000} startAnimation={isVisible} />
            <p className="mt-2 text-slate-400">{label}</p>
        </div>
    );
};

const ImpactMetrics: React.FC = () => (
  <div className="py-20 bg-slate-900">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Our Community's Impact</h2>
      <p className="max-w-2xl mx-auto text-slate-400 mb-12">Numbers that reflect our commitment to student wellness.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <ImpactMetric end={12500} label="Students Supported" />
        <ImpactMetric end={8500} label="Active Companions" />
        <ImpactMetric end={98} label="Wellness Plans Created" />
      </div>
    </div>
  </div>
);

const SeverityLevels: React.FC = () => (
  <div className="py-20 bg-slate-800/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Find the Right Support for You</h2>
        <p className="max-w-2xl mx-auto text-slate-400 mt-4">No matter how you're feeling, there's a path forward. We're here to help you find it.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Mild Stress */}
        <div className="bg-slate-900 p-8 rounded-xl shadow-lg border border-calm-green-700/50 transform hover:-translate-y-2 transition-transform duration-300">
          <div className="bg-calm-green-500/10 text-calm-green-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
             <HealedPot className="w-8 h-8"/>
          </div>
          <h3 className="text-2xl font-semibold text-calm-green-400 mb-4">Mild Stress</h3>
          <p className="text-slate-400">Feeling overwhelmed by daily pressures? Explore our self-help guides, journaling tools, and mindfulness exercises to find your balance.</p>
        </div>
        {/* Moderate Anxiety */}
        <div className="bg-slate-900 p-8 rounded-xl shadow-lg border border-calm-blue-700/50 transform hover:-translate-y-2 transition-transform duration-300">
           <div className="bg-calm-blue-500/10 text-calm-blue-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
             <span className="text-3xl font-bold">...</span>
          </div>
          <h3 className="text-2xl font-semibold text-calm-blue-400 mb-4">Moderate Anxiety</h3>
          <p className="text-slate-400">If worry is becoming a constant, our AI Companion can be a listening ear. The Wellness Test can also offer insights and connect you to resources.</p>
        </div>
        {/* Crisis Support */}
        <div className="bg-slate-900 p-8 rounded-xl shadow-lg border border-red-500/50 transform hover:-translate-y-2 transition-transform duration-300">
           <div className="bg-red-500/10 text-red-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-2xl font-semibold text-red-400 mb-4">Crisis / Severe</h3>
          <p className="text-slate-400">Your safety is most important. If you are in crisis, please seek immediate help. Our resources page has 24/7 crisis hotlines.</p>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextTestimonial, 7000);
        return () => clearInterval(timer);
    }, [nextTestimonial]);

    return (
      <div className="py-20 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-12">Voices from Our Community</h2>
            <div className="relative max-w-3xl mx-auto h-48">
                {TESTIMONIALS.map((testimonial, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <blockquote className="text-lg md:text-xl text-slate-300 italic">"{testimonial.quote}"</blockquote>
                        <p className="mt-4 text-calm-blue-300 font-semibold">{testimonial.author}</p>
                        <p className="text-slate-500 text-sm">{testimonial.role}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
};

const Hero: React.FC = () => (
    <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="https://picsum.photos/seed/nightsky/1920/1080" alt="Calm night sky with stars" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 px-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                Find Your Calm in the Chaos of Student Life.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-8">
                A confidential space for students to navigate stress, anxiety, and mental wellness. You are not alone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/quiz" className="w-full sm:w-auto bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Take Mental Wellness Test
                </Link>
                <Link to="/chatbot" className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Chat with AI Companion
                </Link>
            </div>
        </div>
    </div>
);


// --- Main Page Component ---
const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <SeverityLevels />
      <ImpactMetrics />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;