import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Brand from '../assets/brand.jpg';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-4 p-0" style={{backgroundColor: '#000'}}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          <img src={Brand} width={'70px'} alt="" />
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

          <Link
            to="/history"
            className="btn btn-outline-light ms-2"
          >
            📜 History
          </Link>

        </div>
      </div>
    </nav>
  );
}
