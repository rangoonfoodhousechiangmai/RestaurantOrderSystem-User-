import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [orders, setOrders] = useState(null);
    // console.log(orderToken);
    let tableSessionToken = localStorage.getItem('tableSessionToken');

    useEffect(() => {
        const getHistory = async () => {
            try {
                setLoading(true);

                const response = await api.post('/orders/history', {
                    tableSessionToken
                });

                if (response?.orders) {
                    setOrders(response.orders);
                }
            } catch (error) {
                // console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (tableSessionToken) {
            getHistory();
        }
    }, [tableSessionToken]);


    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (<>
        <div className="container">
            {orders && orders.length > 0 ? (
                <div className="row">
                    <h1 className="text-center mb-4">Order History</h1>
                    {orders.map((order, index) => (
                        <div key={order.id} className="col-md-6 mb-2">
                            <div className="card shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="card-title mb-0">
                                        <i className="bi bi-receipt me-2"></i>
                                        {order.order_code}
                                    </h6>
                                    <span className={`badge ${order.status === 'completed' ? 'bg-success' : order.status === 'pending' ? 'bg-warning text-dark' : order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                                        {order.status || 'Unknown'}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-tag me-1"></i>Table No:</strong> {order?.table.slug || 'N/A'}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-tag me-1"></i>Type:</strong> {order.order_type || 'N/A'}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-boxes me-1"></i>Quantity:</strong> {order.total_qty || 0}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-cash me-1"></i>Total:</strong> {order.total_price ? `${order.total_price.toFixed(2)} THB` : 'N/A'}
                                    </p>
                                    <small className="text-muted">
                                        <i className="bi bi-calendar me-1"></i>
                                        Date: {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                    </small>
                                    <br />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center'>
                    <h2>No Order History</h2>
                    <Link to="/" className="btn btn-danger">
                        Go Back to Home
                    </Link>
                </div>
            )}
        </div>
    </>);
}