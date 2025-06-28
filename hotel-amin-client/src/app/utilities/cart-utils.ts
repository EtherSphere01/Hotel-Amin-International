// Cart utility functions
export interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
}

const CART_KEY = "hotelCart";

export const getCartItems = (): CartItem[] => {
    try {
        if (typeof window !== "undefined") {
            const cartItems = localStorage.getItem(CART_KEY);
            return cartItems ? JSON.parse(cartItems) : [];
        }
        return [];
    } catch (error) {
        console.error("Error getting cart items:", error);
        return [];
    }
};

export const saveCartItems = (items: CartItem[]): void => {
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event("cartUpdated"));
        }
    } catch (error) {
        console.error("Error saving cart items:", error);
    }
};

export const addToCart = (item: CartItem): boolean => {
    try {
        const cartItems = getCartItems();
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
            // Update existing item
            cartItems[existingItemIndex] = item;
        } else {
            // Add new item
            cartItems.push(item);
        }

        saveCartItems(cartItems);
        return true;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return false;
    }
};

export const removeFromCart = (itemId: number): boolean => {
    try {
        const cartItems = getCartItems();
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        saveCartItems(updatedCart);
        return true;
    } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
    }
};

export const updateCartItemQuantity = (
    itemId: number,
    quantity: number
): boolean => {
    try {
        if (quantity < 1) return false;

        const cartItems = getCartItems();
        const updatedCart = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
        );

        saveCartItems(updatedCart);
        return true;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return false;
    }
};

export const clearCart = (): boolean => {
    try {
        saveCartItems([]);
        return true;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
};

export const getCartItemCount = (): number => {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (): number => {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => {
        const nights =
            item.checkInDate && item.checkOutDate
                ? Math.ceil(
                      (new Date(item.checkOutDate).getTime() -
                          new Date(item.checkInDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                  )
                : 1;
        return total + item.price * item.quantity * nights;
    }, 0);
};
