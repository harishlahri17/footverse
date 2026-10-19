import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [compareItems, setCompareItems] = useState(() => {
        const localData = localStorage.getItem('compareItems');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('compareItems', JSON.stringify(compareItems));
    }, [compareItems]);

    const addToCompare = (product) => {
        if (compareItems.find((item) => item.id === product.id || item._id === product._id)) {
            toast.info("Product is already in the compare list");
            return;
        }
        
        if (compareItems.length >= 4) {
            toast.warning("You can compare up to 4 products at a time");
            return;
        }

        setCompareItems((prev) => [...prev, product]);
        toast.success("Added to Compare");
    };

    const removeFromCompare = (productId) => {
        setCompareItems((prev) => prev.filter((item) => item.id !== productId && item._id !== productId));
        toast.info("Removed from Compare");
    };

    const clearCompare = () => {
        setCompareItems([]);
        toast.success("Compare list cleared");
    };

    return (
        <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
