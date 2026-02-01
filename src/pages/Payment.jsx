import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Qr from '../assets/table-1-OZ7MGIsrzbfDM85.svg';

export default function Payment() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const location = useLocation();
    const totalPrice = location.state?.totalPrice;

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
        }
    };

    const handlePayment = () => {
        // Placeholder for payment logic
        alert('Payment processed successfully!');
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
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Pay Now
                                </button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
