import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProductForm from './components/ProductForm';
import MenuPage from './components/MenuPage';
import ProductListPage from './components/ProductListPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import MyProductsPage from './components/MyProductsPage';
import EditProductPage from './components/EditProductPage';
import PurchasedProductsPage from './components/PurchasedProductsPage';
import OpinionForm from './components/OpinionForm';
import OpinionsPage from './components/OpinionsPage';
import './App.css';

const Header = () => (
  <div className="Header">
    <img src="/images/mundo_sustentable.png" alt="Mundo Sustentable Logo" className="App-logo" />
    <img src="/images/equipo_createc.png" alt="Equipo Createc Logo" className="Createc-logo" />
  </div>
);

const WelcomePage = () => {
  const images = ['/images/logoFCpng', '/images/inicio.jpg', '/images/magno.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsVisible(true);
    }, 300);
  };

  const prevImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className="Welcome">
      <h2>Bienvenido a Mundo Sustentable</h2>
      <div className="button-container">
        <Link className="button" to="/register">Registrarse</Link>
        <Link className="button" to="/login">Iniciar Sesión</Link>
      </div>
      <div className="image-slider">
        <button className="slide-button" onClick={prevImage}>←</button>
        <img 
          className={`featured-image ${isVisible ? 'fade-in' : 'fade-out'}`} 
          src={images[currentImageIndex]} 
          alt="Featured Product"
        />
        <button className="slide-button" onClick={nextImage}>→</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product-form" element={<ProductForm />} />
        <Route path="/productos" element={<ProductListPage />} />
        <Route path="/producto/:productId" element={<ProductDetailsPage />} />
        <Route path="/mis-productos" element={<MyProductsPage />} />
        <Route path="/editar-producto/:productId" element={<EditProductPage />} />
        <Route path="/productos-comprados" element={<PurchasedProductsPage />} />
        <Route path="/agregar-opinion/:productoId" element={<OpinionForm />} />
        <Route path="/producto/:productoId/opiniones" element={<OpinionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
