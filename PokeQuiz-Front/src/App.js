import React, { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';

// Este componente App.js vai ser o gerenciador de telas.
const App = () => {
    // Usamos o useState para controlar qual tela está visível.
    const [screen, setScreen] = useState('menu');

    const handleStartGame = () => {
        setScreen('game');
    };

    const handleBackToMenu = () => {
        setScreen('menu');
    };

    // A gente renderiza o componente da tela atual
    return (
        <div className="app-container">
            {screen === 'menu' && <Menu onStartGame={handleStartGame} />}
            {screen === 'game' && <Game onBackToMenu={handleBackToMenu} />}
        </div>
    );
};

export default App;