import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import AllTools from './pages/AllTools';
import CategoryPage from './pages/CategoryPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import { BlogList, BlogPost } from './pages/Blog';
import { Privacy, Terms, Cookies } from './pages/Legal';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import { Toaster } from './components/ui/toaster';
import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen bg-white text-slate-900">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            <Route path="/category/:cat" element={<CategoryPage />} />
            <Route path="/tool/:slug" element={<ToolPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <CookieBanner />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
