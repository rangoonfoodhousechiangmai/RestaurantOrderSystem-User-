import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../services/config';
import { api } from '../services/api';

export default function MenuList({ selectedCategory }) {
    const [menuItems, setMenuItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/menus')
            .then(data => setMenuItems(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // for filtering menu items based on selected category
    const filteredMenuItems = selectedCategory
        ? menuItems?.data?.filter(item => item.category_id === selectedCategory)
        : menuItems?.data;

    return (
        <div>
            {/* Menu Items Grid */}
            <div className="row g-3 mt-3">
                {loading && <p>Loading...</p>}
                {error && <p className='text-danger'>Error: {error}</p>}

                {filteredMenuItems && filteredMenuItems.length === 0 && (
                    <p className="text-center text-muted">No Menu found</p>
                )}

                {filteredMenuItems && filteredMenuItems.map(item => (
                    <div key={item.id} className="col-6 col-md-4 col-lg-3">
                        <Link to={`/menus/${item.id}`} className="text-decoration-none">
                            <div className="card h-100 p-md-3">
                            <img
                                src={`${STORAGE_URL}/${item.image_path}`}

                                className="card-img-top"
                                alt={item.eng_name}
                                style={{ height: "150px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column" >
                                <h5 className="card-title text-center">{item.eng_name}</h5>
                                <p className="card-text text-center" style={{color: '#E94B4B'}}>{item.price} THB</p>
                                {/* <p>{item.eng_description}</p> */}
                                {/* <button
                                    className="btn btn-danger mt-auto"
                                    onClick={() => addToCart(item)}
                                >
                                    Add to Cart
                                </button> */}
                                
                            </div>
                        </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            {/* {cart.length > 0 && (
                <div className="mt-4">
                    <h4>Cart ({cart.length})</h4>
                    <ul className="list-group">
                        {cart.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between">
                                {item.eng_name} <span>{item.price} Ks</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    )
}
