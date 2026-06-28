import { ArrowRight, Category } from 'iconsax-react'
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function CategoriesSection({ setFilteredProducts, allProducts }) {

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
            img: 'https://res.cloudinary.com/dnv3h43cq/image/upload/v1782470278/GoFresh/Products/mdyrmhhumc3k3onqluxz.jpg'
        },
        {
            name: 'Fruits & Vegetables',
            img: 'https://res.cloudinary.com/dnv3h43cq/image/upload/v1782472422/GoFresh/Products/fu0w8pf5xutqccrnmeuu.jpg'
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
    ]

    return (
        <div className='mt-5'>
            <div className='flex flex-col gap-y-4'>
                <div className='flex justify-between pe-2'>
                    <h2 className='font-bold lg:text-2xl sm:text-3xl'>Shop by Category</h2>
                    <Link className='flex gap-2 text-green-700 font-semibold'>View all <ArrowRight color='green' variant='Linear' size={24} /></Link>
                </div>
                <div className='grid gap-2 sm:gap-4 grid-cols-4 lg:grid-cols-6'>
                    {
                        showCategories.map((v, k) => (
                            <button onClick={() => { filterProducts(v.name) }} key={k} className='group aspect-auto sm:aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none'>
                                <div className='flex h-full flex-col'>
                                    <div className='flex-1 overflow-hidden'>
                                        <img src={v.img} className='h-full w-full object-cover transition duration-300 group-hover:scale-105' alt='' />
                                    </div>
                                    <p className='py-3 text-center font-semibold text-slate-900'>{v.name}</p>
                                </div>
                            </button>
                        ))
                    }
                    <button onClick={() => { filterProducts(v.name) }} name='All' className='group aspect-auto sm:aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none'>
                        <div className='flex h-full flex-col'>
                            <div className='flex-1 flex p-4 items-center justify-center bg-slate-100'>
                                <div className='flex h-18 w-18 items-center justify-center rounded-full bg-slate-300 p-4 sm:h-24 sm:w-24'>
                                    <Category color='gray' variant='Bold' size={50} />
                                </div>
                            </div>
                            <p className='py-3 text-center font-semibold text-slate-900'>More</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoriesSection
