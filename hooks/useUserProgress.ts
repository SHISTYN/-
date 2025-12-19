import { useState, useEffect, useCallback } from 'react';

export const useUserProgress = () => {
    // State
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load Favorites from LocalStorage on mount
    useEffect(() => {
        try {
            const storedFavs = localStorage.getItem('entheo_favorites');
            if (storedFavs) setFavorites(JSON.parse(storedFavs));
        } catch (e) {
            console.error("Failed to load favorites", e);
        }
    }, []);

    // Actions
    const toggleFavorite = useCallback((id: string) => {
        setFavorites(prev => {
            const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
            localStorage.setItem('entheo_favorites', JSON.stringify(newFavs));
            return newFavs;
        });
    }, []);

    const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
};