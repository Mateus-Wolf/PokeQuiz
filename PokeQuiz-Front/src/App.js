import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AchievementProvider } from './contexts/AchievementContext';
import Menu from './components/Menu';
import Game from './components/Game';
import Footer from './components/Footer';
import AchievementToast from './components/AchievementToast'; // Importa a notificação

const screenVariants = {
    hidden: { opacity: 0, x: 200 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200, transition: { duration: 0.3 } },
};

const App = () => {
    const [screen, setScreen] = useState('menu');
    const [gameMode, setGameMode] = useState(null);

    const handleStartGame = (mode) => {
        setGameMode(mode);
        setScreen('game');
    };

    const handleBackToMenu = () => {
        setScreen('menu');
    };

    return (
        <ThemeProvider>
            <AchievementProvider>
                <div className="app-container">
                    <AnimatePresence mode="wait">
                        {screen === 'menu' && (
                            <motion.div
                                key="menu-screen"
                                variants={screenVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Menu onStartGame={handleStartGame} />
                            </motion.div>
                        )}
                        {screen === 'game' && (
                            <motion.div
                                key="game-screen"
                                variants={screenVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Game onBackToMenu={handleBackToMenu} mode={gameMode} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <Footer />
                <AchievementToast />
            </AchievementProvider>
        </ThemeProvider>
    );
};

export default App;