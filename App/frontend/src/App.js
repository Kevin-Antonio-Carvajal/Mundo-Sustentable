/**
 * Representa el encabezado de la aplicación, mostrando los logotipos
 * de Mundo Sustentable y del equipo Createc.
 */
const Header = () => (
  <div className="app-header">
    <img src="/images/mundo_sustentable.png" alt="Mundo Sustentable Logo" className="app-logo" />
    <img src="/images/equipo_createc.png" alt="Equipo Createc Logo" className="createc-logo" />
  </div>
);

/**
 * Página de bienvenida con botones para registro e inicio de sesión.
 * Incluye un slider de imágenes con transiciones suaves.
 */
const WelcomePage = () => {
  // Estado para controlar la imagen actual del slider
  const images = ['/images/logoFCpng', '/images/inicio.jpg', '/images/magno.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Cambia a la siguiente imagen en el slider.
   */
  const nextImage = () => {
    setIsVisible(false); 
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); 
      setIsVisible(true); 
    }, 300);
  };

  /**
   * Cambia a la imagen anterior en el slider.
   */
  const prevImage = () => {
    setIsVisible(false); 
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); 
      setIsVisible(true); 
    }, 300);
  };

  return (
    <div className="welcome-page">
      <h2>Bienvenido a Mundo Sustentable</h2>
      {/* Botones para navegación a las páginas de registro e inicio de sesión */}
      <div className="button-container">
        <Link className="app-button" to="/register">Registrarse</Link>
        <Link className="app-button" to="/login">Iniciar Sesión</Link>
      </div>
      {/* Slider de imágenes */}
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

/**
 * Contiene las rutas principales de la aplicación y muestra el encabezado.
 * Define las diferentes páginas accesibles en la aplicación.
 */
function App() {
  return (
    <Router>
      <Header /> {/* Encabezado común a todas las páginas */}
      <Routes>
        {/* Ruta para la página de bienvenida */}
        <Route path="/" element={<WelcomePage />} />
        {/* Ruta para la página de registro */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />
        {/* Ruta para la página principal del comprador */}
        <Route path="/home" element={<HomePage />} />
        {/* Ruta para el menú del vendedor */}
        <Route path="/menu" element={<MenuPage />} />
        {/* Ruta para el formulario de alta de productos */}
        <Route path="/product-form" element={<ProductForm />} />
        {/* Ruta para la lista de productos disponibles */}
        <Route path="/productos" element={<ProductListPage />} />
        {/* Ruta para los detalles de un producto específico */}
        <Route path="/producto/:productId" element={<ProductDetailsPage />} />
        {/* Ruta para la lista de productos del vendedor */}
        <Route path="/mis-productos" element={<MyProductsPage />} />
        {/* Ruta para editar un producto existente */}
        <Route path="/editar-producto/:productId" element={<EditProductPage />} />
        {/* Ruta para los productos comprados por el usuario */}
        <Route path="/productos-comprados" element={<PurchasedProductsPage />} />
        {/* Ruta para agregar una opinión sobre un producto */}
        <Route path="/agregar-opinion/:productoId" element={<OpinionForm />} />
        {/* Ruta para ver opiniones de un producto */}
        <Route path="/producto/:productoId/opiniones" element={<OpinionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
