import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModalProvider } from './contexts/ModalContext';
import { EchoProvider } from './contexts/EchoContext';
import { QueryProvider } from './providers';
import { StructuredData } from './components/seo/StructuredData';
import { Toaster } from './components/ui/toaster';
import { router } from './routes';
import { ProfileBroadcastListener } from './components/ProfileBroadcastListener';
import './styles';

function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ModalProvider>
              <EchoProvider>
                <ProfileBroadcastListener />
                <StructuredData type="all" />
                <RouterProvider router={router} />
                <Toaster />
              </EchoProvider>
            </ModalProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  );
}

export default App;