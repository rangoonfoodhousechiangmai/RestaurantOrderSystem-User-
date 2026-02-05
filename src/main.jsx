import { createRoot } from 'react-dom/client'
import router from './router/index.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';


createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </LanguageProvider>
)
