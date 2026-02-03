import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(null);
    let [orders, setOrders] = useState(null);
    // console.log(orderToken);
    let tableSessionToken = localStorage.getItem('tableSessionToken');
    // console.log(tableSessionToken);

    useEffect(() => {
        const getHistory = async () => {
            try {
                setLoading(true);

                const response = await api.post('/orders/history', {
                    tableSessionToken
                });
                console.log(response);
                if (response?.orders) {
                    setOrders(response.orders);
                }
            } catch (error) {
                setLoading(false);
                console.error(error);
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
                <div className="row mb-3">
                    <h1 className="text-center mb-2">Order History</h1>
                    <div className='mb-3'>
                        <Link to="/" className='btn btn-warning'>Order again</Link>
                    </div>
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
                                        <strong><i className="bi bi-tag me-1"></i>Table No:</strong> {order?.table ? order.table.slug : order.table_name}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-tag me-1"></i>Type:</strong> {order.order_type || 'N/A'}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong><i className="bi bi-boxes me-1"></i>Quantity:</strong> {order.total_qty || 0}
                                    </p>
                                    <small className="text-muted">
                                        <i className="bi bi-calendar me-1"></i>
                                        Date: {order.created_at
                                            ? new Date(order.created_at).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'N/A'}
                                    </small>
                                    <br />
                                    {order.order_items && order.order_items.length > 0 && (
                                        <div className="mt-3">
                                            <h6 className="mb-2">Order Items:</h6>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.order_items.map((item, idx) => (
                                                        <tr key={item.id}>
                                                            <td><strong>{item.menu?.eng_name || item.menu?.mm_name || 'Unknown Item'}</strong><br></br>
                                                                {item.order_item_modifiers &&
                                                                    item.order_item_modifiers.length > 0 &&
                                                                    item.order_item_modifiers.map((mod, index) => (
                                                                        <span key={index}>
                                                                            {mod.eng_name}
                                                                            <br />
                                                                        </span>
                                                                    ))}
                                                            </td>
                                                            <td>{item.quantity || 0}</td>

                                                            <td>{item.total_price ? `${item.total_price.toFixed(2)} THB` : 'N/A'}</td>
                                                        </tr>



                                                    ))}
                                                    <tr>
                                                        <td colSpan={2} className='text-center'>Total</td>
                                                        <td>{order.total_price ? `${order.total_price.toFixed(2)}THB` : 'N/A'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='text-end'>
                                                <Link to="/payment" state={{ totalPrice: order.total_price, orderCode: order.order_code }} className='btn btn-dark'>
                                                    Payment
                                                </Link>
                                                {/* <button >Payment</button> */}
                                            </div>
                                        </div>
                                    )}
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