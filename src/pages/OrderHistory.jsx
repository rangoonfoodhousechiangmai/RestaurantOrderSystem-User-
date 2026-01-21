import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
    let orderToken = localStorage.getItem('orderToken');
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let [orders, setOrders] = useState(null);
    // console.log(orderToken);

    useEffect(() => {
        const getHistory = async () => {

            try {
                let response = await api.get('/orders/history', {
                    orderToken
                });

                if (response.roders) {
                    setOrders(response.orders);
                    console.log(orders);
                }
                setLoading(false);
            }
            catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        getHistory();
    })

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (<>

        <div>
            { !orders && 
                <div className='text-center'>
                    <h2 className=''>No Order History</h2>
                    <Link to="/" className="btn btn-danger">
                        Go Back to Home
                    </Link>
                </div>
            }
        </div>
    </>);
}