import React, { createContext, useContext, useReducer, useEffect } from "react";
import { BaseUrl } from "../axiosInstance";
import { useAuth } from "./auth";

const CartContext = createContext();

const initialState = {
  cart: []
};

//  REDUCER
const cartReducer = (state, action) => {
    switch (action.type) {
        case "SET_CART":
            return {
                ...state,
                cart: action.payload
            };
        default:
            return state;
    }
};

//  PROVIDER
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { token } = useAuth();

    const fetchCart = async () => {
        if (!token) return;
        try {
            const { data } = await BaseUrl.get("/get-cart");
            if (data.Success) {
                dispatch({ type: "SET_CART", payload: data.cart });
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (productId, size) => {
        try {
            const { data } = await BaseUrl.post("/add-cart", { productId, size });
            if (data.Success) {
                await fetchCart();
            }
            return data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    const removeFromCart = async (productId, size) => {
        try {
            const { data } = await BaseUrl.delete("/remove-cart", {
                data: { productId, size }
            });
            if (data.Success) {
                await fetchCart();
            }
            return data;
        } catch (error) {
            console.error("Error removing from cart:", error);
            throw error;
        }
    };

    const increaseQty = async (productId, size) => {
        try {
            const { data } = await BaseUrl.put("/increase-cart", { productId, size });
            if (data.Success) {
                await fetchCart();
            }
            return data;
        } catch (error) {
            console.error("Error increasing qty:", error);
            throw error;
        }
    };

    const decreaseQty = async (productId, size) => {
        try {
            const { data } = await BaseUrl.put("/decrease-cart", { productId, size });
            if (data.Success) {
                await fetchCart();
            }
            return data;
        } catch (error) {
            console.error("Error decreasing qty:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            dispatch({ type: "SET_CART", payload: [] });
        }
    }, [token]);

    return (
        <CartContext.Provider value={{ ...state, fetchCart, addToCart, removeFromCart, increaseQty, decreaseQty }}>
            {children}
        </CartContext.Provider>
    );
};

//  HOOK
export const useCart = () => useContext(CartContext);