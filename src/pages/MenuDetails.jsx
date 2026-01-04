import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../services/config';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function MenuDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setLoading(true);
        api.get(`/menus/${id}`)
            .then(res => setItem(res.data))
            .catch(err => {
                if (err.message === "404") {
                    navigate('/404');
                } else {
                    setError(err.message);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);


    const increaseQty = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
        addToCart(item, quantity);
        alert('Added to cart!');
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
    if (!item) return <p className="text-center">Item not found</p>;

    return (
        <>
            {/* ===== Menu Detail Start ===== */}
            <div className="container-fluid pb-5">
                <div className="row px-xl-5">
                    {/* Image */}
                    <div className="col-lg-5 mb-4">
                        <img
                            className="w-100 rounded"
                            src={`${STORAGE_URL}/${item.image_path}`}
                            alt={item.eng_name}
                        />
                    </div>

                    {/* Details */}
                    <div className="col-lg-7 mb-4">
                        <div className=" p-2 h-100 rounded">
                            <h3>{item.eng_name}</h3>
                            <p className="text-muted">{item.eng_name}</p>

                            <h3 className="text-danger mb-3">
                                {item.price} THB
                            </h3>

                            {/* <p>{item.eng_description}</p> */}
                            <p className="text-muted">{item.eng_description}</p>

                            {/* Quantity */}
                            <div className="d-flex  flex-sm-row align-items-stretch align-items-sm-center mb-4 gap-3">

                                {/* Quantity Group */}
                                <div className="input-group w-100 w-sm-auto" style={{ maxWidth: '130px' }}>
                                    <button
                                        className="btn btn-danger"
                                        onClick={decreaseQty}
                                    >
                                        <i className="fa fa-minus"></i>
                                    </button>

                                    <input
                                        type="text"
                                        className="form-control text-center border-0"
                                        value={quantity}
                                        disabled
                                    />

                                    <button
                                        className="btn btn-danger"
                                        onClick={increaseQty}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    className="btn btn-danger px-4"
                                    onClick={handleAddToCart}
                                >
                                    <i className="fa fa-shopping-cart me-2"></i>
                                    <span className="d-none d-sm-inline">
                                        Add To Cart
                                    </span>
                                </button>
                            </div>


                            {/* Back */}
                            <button className="btn btn-outline-danger" onClick={() => {
                                navigate('/');
                            }}>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* ===== Menu Detail End ===== */}
        </>
    );
}
