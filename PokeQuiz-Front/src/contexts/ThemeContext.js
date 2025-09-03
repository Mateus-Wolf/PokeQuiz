import React, { createContext, useState, useEffect, useContext } from 'react';

// Cria o contexto.
export const ThemeContext = createContext();

// Componente Provedor do Contexto.
export const ThemeProvider = ({ children }) => {
    // Pega o tema salvo no localStorage ou usa "light" como padrão.
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Atualiza o atributo 'data-theme' no body do HTML sempre que o tema mudar.
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Função para alternar entre os temas.
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook customizado para usar o tema de forma mais fácil nos componentes.
export const useTheme = () => useContext(ThemeContext);