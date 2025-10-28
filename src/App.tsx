import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider } from './contexts/ModalContext';
import { QueryProvider } from './providers';
import { StructuredData } from './components/seo/StructuredData';
import { router } from './routes';
import './styles';

function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ModalProvider>
                <StructuredData type="all" />
                <RouterProvider router={router} />
              </ModalProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  );
}

export default App;