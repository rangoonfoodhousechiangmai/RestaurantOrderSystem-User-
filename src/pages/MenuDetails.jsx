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
    const [selectedProtein, setSelectedProtein] = useState(null);
    const [selectedAddon, setSelectedAddon] = useState([]);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [specialRequest, setSpecialRequest] = useState('');


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

    const proteinModifier = item && item.modifiers && item.modifiers.filter(mod => mod.type === 'protein' && mod.selection_type === 'single');
    const addOnModifier = item && item.modifiers && item.modifiers.filter(mod => mod.type === 'addon' && mod.selection_type === 'multiple');
    const flavorModifier = item && item.modifiers && item.modifiers.filter(mod => mod.type === 'flavor' && mod.selection_type === 'single');
    


    const increaseQty = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
        if (proteinModifier.length !== 0 && selectedProtein === null) {
            alert('Please select a protein.');
            return;
        }

        if (flavorModifier.length !== 0 && selectedFlavor === null) {
            alert('Please select a flavor.');
            return;
        }

        // const selectedModifierIds = [
        //     ...(selectedProtein ? [selectedProtein.id] : []),
        //     ...(selectedFlavor ? [selectedFlavor.id] : []),
        //     ...selectedAddon.map(addon => addon.id),
        // ];
        const itemToAdd = {
            ...item,
            price: item.price + (selectedProtein ? selectedProtein.price : 0) + selectedAddon.reduce((sum, a) => sum + a.price, 0) + (selectedFlavor ? selectedFlavor.price : 0),
            selectedProtein,
            selectedAddon,
            selectedFlavor,
            specialRequest,
        };
        addToCart(itemToAdd, quantity);
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
                    <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                        <i class="fa-solid fa-arrow-left fs-1"></i>
                    </div>
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
                            <h3 className="text-danger mb-3">
                                {item.price} THB
                            </h3>

                            {/* <p>{item.eng_description}</p> */}
                            <p className="text-muted">{item.eng_description}</p>

                            {/* protein */}
                            {proteinModifier && proteinModifier.length > 0 && (
                                <div className="mb-3">
                                    <h5>Choose Protein:</h5>
                                    {proteinModifier.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input required
                                                className="form-check-input"
                                                type="radio"
                                                name="protein"
                                                id={`protein-${index}`}
                                                value={option.eng_name}
                                                // checked={selectedProtein && selectedProtein.name === option.name}
                                                onChange={() => setSelectedProtein(option)}
                                            />
                                            <label className="form-check-label" htmlFor={`protein-${index}`}>
                                                {option.eng_name} (+{option.price} THB)
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add on */}
                            {addOnModifier && addOnModifier.length > 0 && (
                                <div className="mb-3">
                                    <h5>Add on</h5>
                                    {addOnModifier.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="addon"
                                                id={`addon-${index}`}
                                                value={option.eng_name}
                                                // checked={selectedAddon.some(a => a.name === option.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedAddon([...selectedAddon, option]);
                                                    } else {
                                                        setSelectedAddon(selectedAddon.filter(a => a.name !== option.name));
                                                    }
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`addon-${index}`}>
                                                {option.eng_name} (+{option.price} THB)
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Flavor */}
                            {flavorModifier && flavorModifier.length > 0 && (
                                <div className="mb-3">
                                    <h5>Choose Flavor:</h5>
                                    {flavorModifier.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flavor"
                                                id={`flavor-${index}`}
                                                value={option.eng_name}
                                                onChange={() => setSelectedFlavor(option)}
                                            />
                                            <label className="form-check-label" htmlFor={`flavor-${index}`}>
                                                {option.eng_name} {option.price ? `(+${option.price} THB)` : ''}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Special Request */}

                           <div className='mb-3'>
                                <textarea onChange={(e) => setSpecialRequest(e.target.value)} name="specialRequest" rows={5} id="" className='form-control' placeholder='Do you have any request?'></textarea>
                           </div>
                           
                            {/* Quantity */}
                            <div className="d-flex  flex-sm-row align-items-stretch align-items-sm-center mb-4 gap-3">

                                {/* Quantity Group */}
                                <div className="input-group w-100 w-sm-auto" style={{ maxWidth: '130px' }}>
                                    <button
                                        className="btn btn-dark"
                                        onClick={decreaseQty}
                                    >
                                        <i className="fa fa-minus text-yellow"></i>
                                    </button>

                                    <input
                                        type="text"
                                        className="form-control text-center border-0"
                                        value={quantity}
                                        disabled
                                    />

                                    <button
                                        className="btn btn-dark"
                                        onClick={increaseQty}
                                    >
                                        <i className="fa fa-plus text-yellow"></i>
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    className="btn btn-dark px-4"
                                    onClick={handleAddToCart}
                                >
                                    <i className="fa fa-shopping-cart me-2 text-yellow"></i>
                                    <span className="d-none d-sm-inline text-yellow">
                                        Add To Cart
                                    </span>
                                </button>
                            </div>


                            {/* Back */}
                            {/* <button className="btn btn-outline-danger" onClick={() => {
                                navigate('/');
                            }}>
                                Back
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* ===== Menu Detail End ===== */}
        </>
    );
}
