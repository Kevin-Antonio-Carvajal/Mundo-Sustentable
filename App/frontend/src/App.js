import React, { useState, useEffect } from 'react';
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
import PurchasedProductsPage from './components/PurchasedProductsPage'; // Importa la nueva página
import OpinionForm from './components/OpinionForm';
import OpinionsPage from './components/OpinionsPage';
import './App.css';

const Header = () => (
  <div className="Header">
    <img src="/images/Logo.png" alt="Webaholics Logo" className="App-logo" />
    <h3 className="by-webaholics"> by Webaholics</h3>
  </div>
);


const WelcomePage = () => {
  const images = ['/images/logoFCpng', '/images/inicio.jpg', '/images/biblio.jpg', '/images/magno.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsVisible(true);
    }, 300); // Coincide con la duración de la animación de salida
  };

  const prevImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex - 1 + images.length) % images.length
      );
      setIsVisible(true);
    }, 300); // Coincide con la duración de la animación de salida
  };

  return (
    <div className="Welcome">
      <h2>Bienvenido a Market-Ciencias</h2>
      <div className="button-container">
        <Link className="button" to="/register">Registrarse</Link>
        <Link className="button" to="/login">Inciar Sesión</Link>
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
        <Route path="/menu" element={<MenuPage />} /> {/* Nueva ruta al menú */}
        <Route path="/product-form" element={<ProductForm />} />
        <Route path="/productos" element={<ProductListPage />} /> {/* Nueva ruta para mostrar los productos */}
        <Route path="/producto/:productId" element={<ProductDetailsPage />} />
        <Route path="/mis-productos" element={<MyProductsPage />} />
        <Route path="/editar-producto/:productId" element={<EditProductPage />} />
        <Route path="/productos-comprados" element={<PurchasedProductsPage />} /> {/* Agrega la nueva ruta */}
        <Route path="/agregar-opinion/:productoId" element={<OpinionForm />} /> {/* Nueva ruta para agregar opiniones */}
        <Route path="/producto/:productoId/opiniones" element={<OpinionsPage />} /> // Nueva ruta para ver opiniones
      </Routes>
    </Router>
  );
}

export default App;