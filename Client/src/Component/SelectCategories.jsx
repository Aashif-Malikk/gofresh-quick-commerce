import { Category } from 'iconsax-react'
import React, { useState } from 'react'

function SelectCategories({ setFilteredProducts, allProducts }) {
    const [activeCategory, setActiveCategory] = useState('All')

    function filterProducts(categoryName) {
        setActiveCategory(categoryName)
        if (!allProducts) return;
        
        const filtered = allProducts.filter((v, k) => {
            if (v.category == categoryName) {
                return v
            }
        })
        if (categoryName == 'All') {
            setFilteredProducts(allProducts)
        } else {
            setFilteredProducts(filtered)
        }
    }

    const showCategories = [
        {
            name: 'Dairy & Eggs',
            img: './CategoriesImage/Dairy&Eggs.png'
        },
        {
            name: 'Fruits & Vegetables',
            img: './CategoriesImage/Fruit&Vegetable.png'
        },
        {
            name: 'Staples',
            img: './CategoriesImage/Staples.png'
        },
        {
            name: 'Beverages',
            img: './CategoriesImage/Beverages.png'
        },
        {
            name: 'Snack & Biscuits',
            img: './CategoriesImage/Snack&Biscuits.png'
        },
        {
            name: 'Personal Care',
            img: './CategoriesImage/Personal_care.png'
        },
    ]

    return (
        <div className='lg:block hidden'>
            <div className=''>
                <button 
                    onClick={() => { filterProducts('All') }} 
                    style={{ width: '100%' }} 
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto sm:px-5 sm:text-base flex items-center justify-center gap-2 ${
                        activeCategory === 'All' ? 'bg-emerald-700 shadow-md ring-2 ring-emerald-300' : 'bg-emerald-600'
                    }`}
                >
                    <Category color='white' variant='Linear' size={24} />
                    <p className='font-bold text-white'>All Categories</p>
                </button>
            </div>
            <div className='border-2 border-slate-200 w-65 rounded-2xl mt-2 px-1 py-1'>
                {showCategories.map((v, k) => (
                    <button 
                        onClick={() => { filterProducts(v.name) }} 
                        style={{ alignItems: 'center' }} 
                        key={k} 
                        className={`flex gap-3 ps-3 w-full rounded-2xl border px-3 py-1.5 transition-all duration-300 cursor-pointer my-1 sm:px-4 ${
                            activeCategory === v.name 
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold shadow-sm' 
                                : 'bg-white border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-800'
                        }`}
                    >
                        <img className='h-12 w-8 object-contain' src={v.img} alt="" srcSet="" />
                        <p className='font-semibold'>{v.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SelectCategories
