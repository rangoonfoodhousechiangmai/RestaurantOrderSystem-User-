import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Qr from '../assets/table-1-OZ7MGIsrzbfDM85.svg';
import { BACKEND_URL } from '../services/config';

export default function Payment() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const totalPrice = location.state?.totalPrice;
    const orderCode = location.state?.orderCode || localStorage.getItem('orderCode');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
            setUploadedFile(file);
            setError(null);
        }
    };

    const uploadPaymentProof = async () => {
        if (!uploadedFile || !orderCode) {
            setError('Please upload a payment proof and ensure you have an order code');
            return null;
        }

        const formData = new FormData();
        formData.append('image', uploadedFile);
        formData.append('orderCode', orderCode);

        try {
            const response = await fetch(`${BACKEND_URL}/payment`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // console.log(response);
                if (response.status === 400){
                    // console.log(response.error);
                    throw new Error('Failed to upload payment proof.');
                }
            }

            return await response.json();
        } catch (err) {

            throw new Error(err.error);
        }
    };

    const handlePayment = async () => {
        setError(null);
        
        if (!uploadedFile) {
            setError('Please upload a payment proof image');
            return;
        }

        if (!orderCode) {
            setError('Order code not found. Please go back and try again.');
            return;
        }

        setIsLoading(true);

        try {
            await uploadPaymentProof();
            navigate('/history');
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
            console.error('Payment error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mb-3">
                <div className="col-md-8 col-lg-6">
                    <div className="mb-2">
                        <Link to="/history" className="text-decoration-none">
                            <i className="fas fa-arrow-left fs-4 text-dark"></i>
                        </Link>
                    </div>
                    <div className="card shadow">
                        <div className="card-header bg-dark text-white text-center">
                            <h4 className="mb-0">
                                <i className="bi bi-credit-card me-2"></i>
                                Payment
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h5>Scan QR Code to Pay</h5>
                                <img
                                    src={Qr}
                                    alt="Payment QR Code"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '300px', width: '100%' }}
                                />
                                <p className="text-muted mt-2">Scan this QR code with your payment app</p>
                            </div>

                            {totalPrice && (
                                <div className="alert alert-info text-center mb-4">
                                    <h5 className="mb-0">
                                        <i className="bi bi-cash me-2"></i>
                                        Total Amount: {totalPrice.toFixed(2)} THB
                                    </h5>
                                </div>
                            )}

                            {/* {orderCode && (
                                <div className="alert alert-secondary text-center mb-4">
                                    <h6 className="mb-0">
                                        <i className="bi bi-receipt me-2"></i>
                                        Order Code: {orderCode}
                                    </h6>
                                </div>
                            )} */}

                            {error && (
                                <div className="alert alert-danger mb-4">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="imageUpload" className="form-label">
                                    <i className="bi bi-upload me-2"></i>
                                    Upload Payment Proof
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {uploadedImage && (
                                    <div className="mt-3">
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded payment proof"
                                            className="img-fluid rounded"
                                            style={{ maxWidth: '200px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="d-grid">
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={handlePayment}
                                    disabled={isLoading || !uploadedImage}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Pay Now
                                        </>
                                    )}
                                </button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
