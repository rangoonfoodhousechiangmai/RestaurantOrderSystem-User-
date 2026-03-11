import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function TableVerifyPage() {
  const { slug, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'order_type'
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    verifyTable();
  }, []);

  async function verifyTable() {
    try {
      const result = await api.post('/tables/verify', { slug, token });
      
      // Save session
      localStorage.setItem('tableSessionToken', result.data.session_token);
      setTableNumber(result.data.table.table_number);
      // localStorage.setItem('tableId', result.data.table.id);
      
      // Show order type selection modal
      setStatus('order_type');
      
    } catch (error) {
      // console.error('Invalid QR code:', error);
      setStatus('error');
      setTimeout(() => navigate('/'), 2000);
    }
  }

  const handleOrderTypeSelect = (orderType) => {
    localStorage.setItem('orderType', orderType);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-md-6 col-lg-5">
          
          {status === 'loading' && (
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body py-5 text-center">
                <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }}></div>
                <h3 className="card-title fw-bold">Verifying Table</h3>
                <p className="card-text text-muted">Please wait while we verify your table QR code...</p>
              </div>
            </div>
          )}
          
          {status === 'order_type' && (
            <div 
              className="modal fade show d-block" 
              tabIndex="-1" 
              role="dialog"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  
                  <div className="modal-body p-0">
                    {/* Success Header */}
                    <div className="bg-success text-white text-center py-4" style={{ borderRadius: '20px 20px 0 0' }}>
                      <div className="mb-3">
                        <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
                      </div>
                      <h3 className="fw-bold mb-1">Table Verified!</h3>
                      <p className="mb-0 opacity-75">You're now ordering for <strong>Table {tableNumber}</strong></p>
                    </div>
                    
                    {/* Order Type Selection */}
                    <div className="px-4 py-4">
                      <p className="text-center text-muted mb-4 fw-semibold">
                        How would you like to enjoy your food?
                      </p>

                      <div className="row g-3">
                        {/* Dine In */}
                        <div className="col-6">
                          <button
                            className="btn w-100 border-2 rounded-4 py-4 d-flex flex-column align-items-center gap-2 hover-shadow"
                            onClick={() => handleOrderTypeSelect('dine_in')}
                            style={{ 
                              borderColor: '#0d6efd',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0d6efd';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = 'inherit';
                            }}
                          >
                            <i className="fas fa-utensils fs-1 text-primary"></i>
                            <span className="fw-bold fs-5">Dine In</span>
                            <small className="text-muted">Eat at table</small>
                          </button>
                        </div>

                        {/* Take Away */}
                        <div className="col-6">
                          <button
                            className="btn w-100 border-2 rounded-4 py-4 d-flex flex-column align-items-center gap-2 hover-shadow"
                            onClick={() => handleOrderTypeSelect('take_away')}
                            style={{ 
                              borderColor: '#198754',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#198754';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = 'inherit';
                            }}
                          >
                            <i className="fas fa-shopping-bag fs-1 text-success"></i>
                            <span className="fw-bold fs-5">Take Away</span>
                            <small className="text-muted">Pack & go</small>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                </div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body py-5 text-center">
                <div className="mb-3">
                  <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="card-title text-danger fw-bold">Invalid QR Code</h3>
                <p className="card-text text-muted">The QR code you scanned is invalid or expired.</p>
                <div className="text-muted small mt-3">Redirecting to menu...</div>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
