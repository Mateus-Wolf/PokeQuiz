import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import '../components/Footer.css';

const Menu = ({ onStartGame }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="menu-container">
            <h1>PokéQuiz</h1>
            <p>Escolha seu modo de jogo para começar!</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button onClick={() => onStartGame('normal')}>
                    Modo Clássico (5 Pontos)
                </button>
                <button onClick={() => onStartGame('timeAttack')}>
                    Modo Time Attack (60s)
                </button>
            </div>
        </div>
    );
};

export default Menu;