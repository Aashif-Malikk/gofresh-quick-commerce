import { ShoppingCart } from 'iconsax-react'
import React, { useState } from 'react'
import Loader from './Loader/Loader'
import { useStore } from './utils/Zustand'

function AllProducts({ allProducts }) {
    const addToCart = useStore((state) => state.addToCart)
    const increaseQty = useStore((state) => state.increaseQty)
    const decreaseQty = useStore((state) => state.decreaseQty)
    const quantities = useStore((state) => state.quantities)
    const cartItemId = useStore((state) => state.cartItemId)


    // Simplify handlers
    const handleAddCart = (itemId) => addToCart(itemId)
    const handleIncrease = (itemId) => increaseQty(itemId)
    const handleDecrease = (itemId) => decreaseQty(itemId)

    return (
        <div className='mt-8'>
            <div className='flex flex-col gap-y-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                    <h2 className='text-2xl font-bold text-slate-900 sm:text-3xl'>All Products</h2>
                    <p className='max-w-2xl hidden lg:block text-sm text-slate-500 sm:text-base'>
                        Browse our curated grocery picks with fast delivery, fresh quality, and easy add-to-cart action.
                    </p>
                </div>
                <section className="grid w-full grid-cols-2 gap-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
                    {
                        allProducts ? (
                            allProducts.map((v) => (
                                <div key={v._id} className="overflow-hidden h-fit rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                    <img src={v.imgSrc} alt="Product" className="h-38 w-full bg-white object-cover transition duration-500 hover:scale-105" />
                                    <div className="px-4 py-1 pb-3">
                                        <div className="mb-1 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 capitalize w-30 h-10 line-clamp-2">{v.name}</p>
                                                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{v.weight}</span>
                                            </div>
                                        </div>
                                        <div className="mb-2 flex items-center gap-3">
                                            <p className="text-2xl font-bold text-slate-950">₹{v.price}</p>
                                            <del className="text-sm text-slate-400">₹{v.mrp}</del>
                                        </div>

                                        {cartItemId.includes(v._id) ? (
                                            <div className="group inline-flex w-full items-center h-12 justify-center sm:gap-2 gap-1 px-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer text-emerald-600 border-2 border-emerald-600 shadow-md shadow-emerald-600/20 transition duration-300">
                                                <button
                                                    onClick={() => handleDecrease(v._id)}
                                                    className="p-1 hover:bg-emerald-100 rounded-full font-bold text-emerald-600 text-lg w-6 h-6 flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 font-semibold text-slate-800 text-lg">
                                                    {quantities[v._id] || 1}  {/* ✅ per-product count */}
                                                </span>
                                                <button
                                                    onClick={() => handleIncrease(v._id)}
                                                    className="p-1 hover:bg-emerald-100 rounded-full font-bold text-emerald-600 text-lg w-6 h-6 flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleAddCart(v._id)}
                                                className="group inline-flex w-full items-center h-12 justify-center sm:gap-2 gap-1 px-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer bg-emerald-600 border-2 text-white border-slate-200 shadow-md shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                                            >
                                                <ShoppingCart className="transition duration-300 group-hover:scale-110" size="24" color="currentColor" variant="Linear" />
                                                <span className="text-md">Add to cart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='w-full flex justify-center items-center'>
                                <Loader size={28} color='black' />
                            </div>
                        )
                    }
                </section>
            </div>
        </div>
    )
}

export default AllProducts