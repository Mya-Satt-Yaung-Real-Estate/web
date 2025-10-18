import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { StructuredData } from './components/seo/StructuredData';
import './globals.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <StructuredData type="all" />
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 pt-20">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;