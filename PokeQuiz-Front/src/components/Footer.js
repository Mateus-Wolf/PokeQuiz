import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAchievements } from '../contexts/AchievementContext';
import { FaMoon, FaSun, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Footer.css';
import { ACHIEVEMENTS } from '../data/achievementsData';

const MySwal = withReactContent(Swal);

const Footer = () => {
    const { theme, toggleTheme } = useTheme();
    const { achievements } = useAchievements();

    const showAchievementsModal = () => {
        const achievementList = ACHIEVEMENTS.map(ach => (
            <li key={ach.id} className={`achievement-item ${achievements[ach.id] ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                    <FaTrophy />
                </div>
                <div className="achievement-info">
                    <h4>{ach.name}</h4>
                    <p>{ach.description}</p>
                </div>
                {achievements[ach.id] && <span className="unlocked-status">Desbloqueada</span>}
            </li>
        ));

        MySwal.fire({
            title: 'Suas Conquistas',
            html: <ul className="achievements-list">{achievementList}</ul>,
            showCloseButton: true,
            showConfirmButton: false,
        });
    };

    return (
        <footer className="main-footer">
            <button className="theme-toggle-button" onClick={toggleTheme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
                <span>Alternar para tema {theme === 'light' ? 'escuro' : 'claro'}</span>
            </button>
            <button className="achievements-button" onClick={showAchievementsModal}>
                <FaTrophy /> Conquistas
            </button>
        </footer>
    );
};

export default Footer;