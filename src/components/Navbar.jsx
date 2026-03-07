import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { api } from "../services/api";
import Brand from '../assets/brand.jpg';


export default function Navbar() {
  const { totalItems } = useCart();
  const tableSessionToken = localStorage.getItem('tableSessionToken');
  const { language, toggleLanguage } = useLanguage();
  const [callWaiterLoading, setCallWaiterLoading] = useState(false);
  const [callWaiterSuccess, setCallWaiterSuccess] = useState(false);
  const [callWaiterError, setCallWaiterError] = useState('');

  const handleCallWaiter = async () => {
    if (callWaiterLoading || callWaiterSuccess) return;
    
    setCallWaiterLoading(true);
    setCallWaiterError('');
    try {
      let response = await api.post('/tables/call-waiter');
      setCallWaiterSuccess(true);
      setTimeout(() => setCallWaiterSuccess(false), 3000);
    } catch (error) {
      // Check for 429 Too Many Requests (throttle)
      if (error.message && error.message.includes('429')) {
        setCallWaiterError('Wait before the next call');
        setTimeout(() => setCallWaiterError(''), 3000);
      } else {
        console.error('Failed to call waiter:', error);
      }
    } finally {
      setCallWaiterLoading(false);
    }
  };

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

            {tableSessionToken && (<button
              onClick={handleCallWaiter}
              className={`btn ms-2 ${callWaiterSuccess ? 'btn-success' : callWaiterError ? 'btn-danger' : 'btn-outline-light'}`}
              disabled={callWaiterLoading}
            >
              {callWaiterLoading ? '⏳' : callWaiterSuccess ? '✓' : callWaiterError ? '⚠️' : '🛎️'} 
              {callWaiterLoading ? ' Calling...' : callWaiterSuccess ? ' Called!' : callWaiterError ? callWaiterError : ' Call Waiter'}
            </button>)}
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
