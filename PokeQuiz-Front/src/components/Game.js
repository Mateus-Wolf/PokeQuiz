import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar } from 'react-icons/fa';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:3001';

const Game = ({ onBackToMenu }) => {
    const [question, setQuestion] = useState(null);
    const [isGameLoading, setIsGameLoading] = useState(true);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [lives, setLives] = useState(0);
    const [score, setScore] = useState(0);
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null); // Estado para a resposta correta
    const [lastScore, setLastScore] = useState(0); // Novo estado para animação

    // Referência para o contêiner do placar para posicionar o ponto subindo
    const scoreRef = useRef(null);

    const fetchQuestion = async () => {
        setIsContentLoading(true);
        setOptionsDisabled(false);
        setCorrectAnswer(null); // Reseta a resposta correta para a nova pergunta
        try {
            const response = await axios.get(`${API_URL}/api/question`);
            const { lives, score, ...questionData } = response.data;
            setQuestion(questionData);
            setLives(lives);
            setScore(score);
            setLastScore(score); // Atualiza o último placar
            setIsContentLoading(false);
        } catch (error) {
            console.error('Erro ao buscar a pergunta:', error);
            if (error.response && error.response.status === 400 && error.response.data.error === 'Fim de jogo. Reinicie para jogar de novo.') {
                Swal.fire('Fim de Jogo!', `Sua pontuação final foi de ${score} ponto(s).`, 'info');
            } else {
                Swal.fire('Oops...', 'Não foi possível carregar o jogo. Tente novamente mais tarde.', 'error');
            }
            onBackToMenu();
        }
    };

    const handleAnswerSubmit = async (userGuess, optionName) => {
        setOptionsDisabled(true);

        try {
            const response = await axios.post(`${API_URL}/api/answer`, { userGuess: optionName });
            const { isCorrect, lives: newLives, score: newScore } = response.data;
            
            // Define a resposta certa para o feedback visual
            const correctOption = question.options.find(opt => opt.isCorrect).name;
            setCorrectAnswer(correctOption);

            setLives(newLives);
            setScore(newScore);

            // Carrega a próxima pergunta após um delay
            setTimeout(() => {
                fetchQuestion();
            }, 1500);
        } catch (error) {
            console.error('Erro ao enviar a resposta:', error);
            Swal.fire('Oops...', 'Não foi possível verificar a resposta.', 'error');
            setOptionsDisabled(false);
        }
    };

    useEffect(() => {
        const resetGame = async () => {
            try {
                await axios.post(`${API_URL}/api/reset`);
                fetchQuestion();
                setIsGameLoading(false);
            } catch (error) {
                Swal.fire('Erro!', 'Não foi possível iniciar o jogo.', 'error');
                onBackToMenu();
            }
        };
        resetGame();
    }, []);

    // O componente de animação para o ponto subindo
    const ScoreIncrease = ({ startFrom }) => {
      // O useRef é usado para pegar a posição do placar
      const scorePosition = scoreRef.current?.getBoundingClientRect();

      return (
        <AnimatePresence>
          {score > lastScore && (
            <motion.div
              style={{
                position: 'absolute',
                top: scorePosition?.top,
                left: scorePosition?.left,
                color: '#4CAF50',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                pointerEvents: 'none', // Impede que o elemento seja clicável
                zIndex: 1000,
              }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              +1
            </motion.div>
          )}
        </AnimatePresence>
      );
    };

    if (isGameLoading) {
        return <div className="loading-container">Iniciando o jogo...</div>;
    }

    return (
        <div className="game-container">
            <div className="game-info">
                <span><FaHeart className="icon-heart" /> Vidas: {lives}</span>
                <span ref={scoreRef}><FaStar className="icon-star" /> Pontos: {score}</span>
            </div>
            
            <ScoreIncrease /> {/* O componente de animação */}
            
            {isContentLoading ? (
                <div className="content-loading">
                    <p>Buscando nova pergunta...</p>
                </div>
            ) : (
                <>
                    <h2 className="question-text">{question.questionText}</h2>
                    
                    {question.image && (
                        <motion.div
                            className="question-image-container"
                            key={question.image}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            <img src={question.image} alt="Pokémon" className="question-image" />
                        </motion.div>
                    )}
                    
                    <motion.div
                        className="options-container"
                        key={question.questionText}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                        }}
                    >
                        {question.options.map((option, index) => {
                            // Define a classe CSS baseada no feedback visual
                            let className = 'option-button';
                            if (correctAnswer && option.name === correctAnswer) {
                                className += ' correct';
                            } else if (correctAnswer) {
                                className += ' incorrect';
                            }
                            
                            return (
                                <motion.button
                                    key={index}
                                    className={className}
                                    onClick={() => handleAnswerSubmit(option.name, option.name)}
                                    disabled={optionsDisabled}
                                    variants={{
                                        hidden: { x: -20, opacity: 0 },
                                        visible: { x: 0, opacity: 1 },
                                    }}
                                >
                                    {option.name}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </>
            )}

            <button onClick={onBackToMenu}>Voltar para o Menu</button>
        </div>
    );
};

export default Game;