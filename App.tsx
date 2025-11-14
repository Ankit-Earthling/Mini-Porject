import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ChatbotPage from './pages/ChatbotPage';
import ResourcesPage from './pages/ResourcesPage';
import DiseasesPage from './pages/DiseasesPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import FaqPage from './pages/FaqPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { EmergencyButton } from './components/IconComponents';
import ActivitiesPage from './pages/ActivitiesPage';

function App() {
  return (
    <HashRouter>
      <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </main>
        <EmergencyButton />
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;