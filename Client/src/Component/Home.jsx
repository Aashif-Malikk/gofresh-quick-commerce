import React, { useEffect, useState } from 'react'
import SelectCategories from './SelectCategories'
import Hero from './Hero'
import CategoriesSection from './CategoriesSection'
import AllProducts from './AllProducts'
import { useStore } from './utils/Zustand'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Home() {
    const [allProducts, setAllProducts] = useState(null)
    const [filteredProducts, setFilteredProducts] = useState([])

    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/products`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            return data.products
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function shuffleArray(array) {
        if (!Array.isArray(array)) {
            throw new TypeError("Input must be an array");
        }

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const getProducts = async () => {
            const products = await fetchAllProducts();
            if (products) {
                const shuffled = shuffleArray(products);
                setAllProducts(shuffled);
            }
        };
        getProducts();
    }, [])

    const searchTerm = useStore(s => s.searchTerm)

    useEffect(() => {
        if (searchTerm.trim()) {
            const searchItem = allProducts?.filter((v) =>
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.category?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredProducts(searchItem)
        } else {
            setFilteredProducts(allProducts)
        }
    }, [searchTerm])

    // console.log(allProducts)
    return (
        <div className='flex px-3 pt-2 sm:px-6 sm:pt-3 sm:gap-5 relative'>
            <div style={{ flexGrow: '0' }} className='flex'>
                <SelectCategories setFilteredProducts={setFilteredProducts} allProducts={allProducts} />
            </div>
            <div style={{ flexGrow: '9' }} className=''>
                <Hero />
                <CategoriesSection setFilteredProducts={setFilteredProducts} allProducts={allProducts} />
                <AllProducts allProducts={filteredProducts?.length > 2 ? filteredProducts : allProducts} />
            </div>
        </div>
    )
}

export default Home
