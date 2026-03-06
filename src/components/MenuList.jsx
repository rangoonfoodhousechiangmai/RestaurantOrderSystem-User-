import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { STORAGE_URL } from '../services/config';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function MenuList({ selectedCategory }) {
    const [menuItems, setMenuItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

    useEffect(() => {
        // setLoading(true);
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
                                    <h5 className="card-title text-center">{language === "eng" ? item.eng_name : item.mm_name}</h5>
                                    <p className="card-text text-center" style={{ color: '#000000' }}>{item.price} THB</p>
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
        </div>
    )
}
