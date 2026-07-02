import { create } from "zustand";

const useStore = create((set) => ({
    showAuthModal: false,
    isUserData: false,
    searchTerm: '',
    setSearchTerm: (term) => set({ searchTerm: term }),

    isUserDataModel: () =>
        set({ isUserData: true }),

    openAuthModal: () =>
        set({ showAuthModal: true }),

    closeAuthModal: () =>
        set({ showAuthModal: false }),

    cartItemId: [],
    quantities: {},  // { productId: count }

    setCartItemId: (ids) => set({ cartItemId: ids }),

    addToCart: (itemId) => set((state) => {
        if (state.cartItemId.includes(itemId)) return state  // already in cart
        return {
            cartItemId: [...state.cartItemId, itemId],
            quantities: { ...state.quantities, [itemId]: 1 }
        }
    }),

    increaseQty: (itemId) => set((state) => ({
        quantities: { ...state.quantities, [itemId]: (state.quantities[itemId] || 1) + 1 }
    })),

    decreaseQty: (itemId) => set((state) => {
        const currentQty = state.quantities[itemId] || 1
        if (currentQty <= 1) {
            // Remove from cart completely
            const updatedQty = { ...state.quantities }
            delete updatedQty[itemId]
            return {
                cartItemId: state.cartItemId.filter(id => id !== itemId),
                quantities: updatedQty
            }
        }
        return {
            quantities: { ...state.quantities, [itemId]: currentQty - 1 }
        }
    }),
}));

export { useStore };