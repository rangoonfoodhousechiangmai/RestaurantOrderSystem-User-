import React from 'react'
import { BACKEND_URL } from '../services/config';
import useFetch from '../hooks/useFetch';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategoryList({ onCategorySelect }) {
    let { data: categories, loading, error } = useFetch(`${BACKEND_URL}/categories`);
    const { language } = useLanguage();

    return (
        <div>
            <h1 className='mt-3'>Categories</h1>
            <div className='overflow-auto d-flex gap-3 py-2'>
                {/* {loading && <p>Loading...</p>} */}
                {error && <p className='text-danger'>Error: {error}</p>}
                <button className='category-item btn btn-dark text-white text-nowrap' onClick={() => onCategorySelect(null)}>All</button>
                {categories && categories.data.map((category) => (
                    <button className='category-item btn btn-dark text-nowrap' key={category.id} onClick={() => onCategorySelect(category.id)}>
                        {language === "eng" ? category.eng_name : category.mm_name}</button>
                ))}
            </div>
        </div>
    )
}
