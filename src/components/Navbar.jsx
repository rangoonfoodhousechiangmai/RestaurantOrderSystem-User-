import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const updateCart = () => {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(cartData);
    };

    updateCart();
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-4" style={{backgroundColor: '#E94B4B'}}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          🍽 Restaurant
        </Link>

        {/* Right side */}
        <div className="ms-auto">
          <Link
            to="/carts"
            className="btn btn-outline-light position-relative"
          >
            🛒 Cart

            {/* Badge (dynamic) */}
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light text-danger">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
