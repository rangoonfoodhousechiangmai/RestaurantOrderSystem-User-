import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

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
