import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Aside } from './components/Aside/Aside';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
import { useTranslation } from 'react-i18next';
import './App.module.scss';

export const App = () => {
  const { i18n } = useTranslation(); // Витягуємо i18n

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <CartProvider>
      <div className="App">
        <Navbar
          onBurgerClick={openMenu}
          currentLang={i18n.language}
          onChangeLang={changeLanguage}
        />
        <Aside isOpen={isMenuOpen} onClose={closeMenu} />
        <main className="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};
