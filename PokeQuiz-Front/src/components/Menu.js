import React from 'react';

const Menu = ({ onStartGame }) => {
    return (
        <div className="menu-container">
            <h1>PokéQuiz</h1>
            <p>Adivinhe os Pokémon e seus segredos!</p>
            <button onClick={onStartGame}>Começar Jogo</button>
        </div>
    );
};

export default Menu;