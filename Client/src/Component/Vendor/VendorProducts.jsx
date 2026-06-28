import React, { useEffect, useState } from 'react'
import AllProducts from '../AllProducts'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function VendorProducts() {
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

    return (
        <div>
            <AllProducts allProducts={filteredProducts.length > 2 ? filteredProducts : allProducts} />
        </div>
    )
}

export default VendorProducts
