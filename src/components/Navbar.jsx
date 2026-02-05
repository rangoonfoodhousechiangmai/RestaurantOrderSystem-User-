import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import Brand from '../assets/brand.jpg';

export default function Navbar() {
  const { totalItems } = useCart();
  const { language, toggleLanguage } = useLanguage();

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-4 p-0" style={{ backgroundColor: '#000' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          <img src={Brand} width={'70px'} alt="" />
        </Link>

        {/* Right side */}
        <div className="ms-auto d-md-flex mt-3 mt-md-0">
          <div>
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

          <div
            style={{ float: 'right' }}
            onClick={toggleLanguage}
            className={`language-slider ms-2 my-2 my-md-0 ${language === 'mm' ? 'active' : ''}`}
          >
            <div className="slider-thumb">
              <span className="slider-text">{language === 'mm' ? 'MM' : 'ENG'}</span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
