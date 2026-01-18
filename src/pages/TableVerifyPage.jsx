import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function TableVerifyPage() {
  const { slug, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
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
      
      // Show success
      setStatus('success');
      
      // Redirect after 1.5 seconds
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      // console.error('Invalid QR code:', error);
      setStatus('error');
      setTimeout(() => navigate('/'), 2000);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-md-6 col-lg-4 text-center">
          
          {status === 'loading' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                <h4 className="card-title">Verifying Table</h4>
                <p className="card-text text-muted">Please wait while we verify your table QR code...</p>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="card border-success border-2 shadow-sm">
              <div className="card-body py-5">
                <div className="mb-3">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="card-title text-success">Table Verified!</h4>
                <p className="card-text">You're now ordering for <strong>Table {tableNumber}</strong></p>
                <div className="text-muted small">Redirecting to menu...</div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="card border-danger border-2 shadow-sm">
              <div className="card-body py-5">
                <div className="mb-3">
                  <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="card-title text-danger">Invalid QR Code</h4>
                <p className="card-text">The QR code you scanned is invalid or expired.</p>
                <div className="text-muted small">Redirecting to menu...</div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}