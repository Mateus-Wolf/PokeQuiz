import React, { createContext, useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { ACHIEVEMENTS, getAchievementById } from '../data/achievementsData';

export const AchievementContext = createContext();

const ACHIEVEMENT_STORAGE_KEY = 'pokequiz-achievements';

export const AchievementProvider = ({ children }) => {
    const [achievements, setAchievements] = useState(() => {
        try {
            const storedAchievements = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
            return storedAchievements ? JSON.parse(storedAchievements) : {};
        } catch (error) {
            console.error('Failed to load achievements from localStorage:', error);
            return {};
        }
    });

    const [toastAch, setToastAch] = useState(null);

    useEffect(() => {
        localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements));
    }, [achievements]);

    const unlockAchievement = (id) => {
        if (!achievements[id]) {
            const unlockedAch = getAchievementById(id);
            if (!unlockedAch) return;

            const newAchievements = { ...achievements, [id]: true };
            setAchievements(newAchievements);
            setToastAch(unlockedAch); // Ativa a notificação no topo da tela
        }
    };
    
    const clearToast = () => {
        setToastAch(null);
    };

    return (
        <AchievementContext.Provider value={{ achievements, unlockAchievement, toastAch, clearToast }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => useContext(AchievementContext);