import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../services/config';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import SpinnerOverlay from '../components/SpinnerOverlay';
import { useLanguage } from '../contexts/LanguageContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tableSessionToken = localStorage.getItem('tableSessionToken');
  // const [orderType, setOrderType] = useState(null);
  const { language } = useLanguage();

  const prepareOrderPayload = (cartItems, tableToken, orderType) => {
    return {
      table_session_token: tableToken,
      order_type: orderType,
      items: cartItems.map(item => ({
        menu_id: item.id,
        quantity: item.quantity,
        protein_id: item.selectedProtein?.id || null,
        flavor_id: item.selectedFlavor?.id || null,
        addon_ids: item.selectedAddon?.map(a => a.id) || [],
        special_request: item.specialRequest || ''
      }))
    };
  };

  const submitOrder = async (selectedOrderType) => {
      if (!tableSessionToken) {
        alert('Please scan the QR code');
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = prepareOrderPayload(cart, tableSessionToken, selectedOrderType);
        const response = await api.post('/orders', payload);
        alert('Order submitted successfully');
        clearCart();
        setShowModal(false);
        // Optionally redirect to order status page or home
      } catch (error) {
        // console.error(error);
        alert(error.message || 'Failed to submit order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
  };




  // console.log(tableSessionToken);

  const increaseQty = (uniqueId) => {
    const item = cart.find(item => item.uniqueId === uniqueId);
    if (item) {
      updateQuantity(uniqueId, item.quantity + 1);
    }
  };

  const decreaseQty = (uniqueId) => {
    const item = cart.find(item => item.uniqueId === uniqueId);
    if (item) {
      updateQuantity(uniqueId, item.quantity - 1);
    }
  };

  const removeItem = (uniqueId) => {
    removeFromCart(uniqueId);
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some delicious items to your cart!</p>
          <Link to="/" className="btn btn-dark">Continue Ordering</Link>
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
            <div key={item.uniqueId} className="card mb-3">
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
                    <h5 className="card-title">{language === 'eng' ? item.eng_name : item.mm_name}</h5>
                    {/* protein */}
                    {item.selectedProtein && (
                      <p className="card-text text-muted">Protein: {language === 'eng' ? item.selectedProtein.eng_name : item.selectedProtein.mm_name}</p>
                    )}
                    {/* addon */}
                    {item.selectedAddon && item.selectedAddon.length > 0 && (
                      <p className="card-text text-muted">Add-ons: {item.selectedAddon.map(a => language === 'eng' ? a.eng_name : a.mm_name).join(', ')}</p>
                    )}

                    {/* flavor */}
                    {item.selectedFlavor && (
                      <p className="card-text text-muted">Flavor: {language === 'eng' ? item.selectedFlavor.eng_name : item.selectedFlavor.mm_name}</p>
                    )}


                    <p className="card-text text-muted">{item.price} THB each</p>
                  </div>
                  <div className="col-md-3 col-4 mt-3 mt-md-0">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => decreaseQty(item.uniqueId)}
                      >
                        -
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => increaseQty(item.uniqueId)}
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
                      onClick={() => removeItem(item.uniqueId)}
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
              <button className="btn btn-warning w-100 mb-2" onClick={() => setShowModal(true)}>
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 shadow">

              <div className="modal-header border-0 text-center">
                <h5 className="modal-title w-100 fw-bold">Choose Order Type</h5>
                <button
                  type="button"
                  className="btn-close position-absolute end-0 me-3"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body px-4 pb-4">
                <p className="text-center text-muted mb-4">
                  How would you like to enjoy your food?
                </p>

                <div className="row g-3">
                  {/* Dine In */}
                  <div className="col-6">
                    <button
                      className="btn w-100 border rounded-4 py-4 d-flex flex-column align-items-center gap-2 order-type-btn"
                      onClick={() => submitOrder('dine_in')}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-utensils fs-2 text-primary"></i>
                      <span className="fw-semibold">Dine In</span>
                      <small className="text-muted">Eat at table</small>
                    </button>
                  </div>

                  {/* Take Away */}
                  <div className="col-6">
                    <button
                      className="btn w-100 border rounded-4 py-4 d-flex flex-column align-items-center gap-2 order-type-btn"
                      onClick={() => submitOrder('take_away')}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-shopping-bag fs-2 text-success"></i>
                      <span className="fw-semibold">Take Away</span>
                      <small className="text-muted">Pack & go</small>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <SpinnerOverlay isVisible={isSubmitting} />

    </div>
  );
}
