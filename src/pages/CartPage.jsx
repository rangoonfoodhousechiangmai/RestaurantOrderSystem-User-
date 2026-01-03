import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../services/config';

export default function CartPage() {
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

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some delicious items to your cart!</p>
          <Link to="/" className="btn btn-danger">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Your Cart</h2>

      <div className="row flex-column-reverse flex-md-row">
        <div className="col-lg-8 mt-2 mt-sm-0">
          {cart.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2 col-6">
                    <img
                      src={`${STORAGE_URL}/${item.image_path}`}
                      alt={item.eng_name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-4 col-6">
                    <h5 className="card-title">{item.eng_name}</h5>
                    <p className="card-text text-muted">{item.price} THB each</p>
                  </div>
                  <div className="col-md-3 col-4 mt-3 mt-md-0">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button> 
                    </div>
                  </div>
                  <div className="col-md-2 col-4 mt-3 mt-md-0">
                    <h6 className="text-danger">{(item.price * item.quantity).toFixed(2)} THB</h6>
                  </div>
                  <div className="col-md-1 col-4 mt-3 mt-md-0 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total Price:</span>
                <span className="text-danger">{totalPrice.toFixed(2)} THB</span>
              </div>
              <hr />
              <button className="btn btn-danger w-100 mb-2">
                Proceed to Checkout
              </button>
              <button className="btn btn-outline-secondary w-100 mb-2" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/" className="btn btn-outline-primary w-100">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
