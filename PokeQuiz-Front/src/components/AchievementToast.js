import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAchievements } from '../contexts/AchievementContext';
import './AchievementToast.css';

const toastVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
};

const AchievementToast = () => {
    const { toastAch, clearToast } = useAchievements();

    useEffect(() => {
        if (toastAch) {
            const timer = setTimeout(() => {
                clearToast();
            }, 3000); // Mostra a notificação por 3 segundos
            return () => clearTimeout(timer);
        }
    }, [toastAch, clearToast]);

    return (
        <AnimatePresence>
            {toastAch && (
                <motion.div
                    className="achievement-toast"
                    key={toastAch.id}
                    variants={toastVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <FaTrophy className="toast-icon" />
                    <div className="toast-content">
                        <h3>Conquista Desbloqueada!</h3>
                        <p>{toastAch.name}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;