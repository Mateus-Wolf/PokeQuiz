import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar, FaClock } from 'react-icons/fa';
import { typeTranslations, generationTranslations, translate } from '../utils/translations';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { useAchievements } from '../contexts/AchievementContext';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:3001';
const NORMAL_MODE_GOAL = 5;
const TIME_ATTACK_SECONDS = 60;
const TIME_BONUS_CORRECT = 2;
const TIME_PENALTY_WRONG = 15;
const DEFAULT_LIVES = 3;

const Game = ({ onBackToMenu, mode }) => {
    const [question, setQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(DEFAULT_LIVES);
    const [timeRemaining, setTimeRemaining] = useState(TIME_ATTACK_SECONDS);
    const [optionsDisabled, setOptionsDisabled] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [isSilhouette, setIsSilhouette] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);

    const { unlockAchievement, achievements } = useAchievements();

    const timerRef = useRef(null);

    const fetchQuestion = async () => {
        setIsContentLoading(true);
        setOptionsDisabled(false);
        setCorrectAnswer(null);
        setIsSilhouette(true);
        try {
            const response = await axios.get(`${API_URL}/api/question`);
            setQuestion(response.data);
            setIsContentLoading(false);
            if (response.data.type !== 'who-is-this-pokemon') {
                setIsSilhouette(false);
            }
        } catch (error) {
            Swal.fire('Oops...', 'Não foi possível carregar a pergunta. Tente novamente.', 'error');
            onBackToMenu();
        }
    };

    const handleAnswerSubmit = async (userGuess) => {
        setOptionsDisabled(true);
        setIsSilhouette(false);
        try {
            const response = await axios.post(`${API_URL}/api/answer`, { userGuess });
            const { isCorrect } = response.data;
            const correctOption = question.options.find(opt => opt.isCorrect).name;
            setCorrectAnswer(correctOption);

            if (isCorrect) {
                const newScore = score + 1;
                setScore(newScore);

                const gameData = { score: newScore, mode };
                ACHIEVEMENTS.forEach(ach => {
                    if (ach.condition(gameData)) {
                        unlockAchievement(ach.id);
                    }
                });

                if (mode === 'timeAttack') {
                    setTimeRemaining(prevTime => prevTime + TIME_BONUS_CORRECT);
                }
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } else if (mode === 'normal') {
                setLives(prevLives => prevLives - 1);
            } else if (mode === 'timeAttack') {
                setTimeRemaining(prevTime => prevTime - TIME_PENALTY_WRONG);
            }

            setTimeout(() => {
                if (mode === 'normal') {
                    if ((isCorrect ? score + 1 : score) >= NORMAL_MODE_GOAL) {
                        Swal.fire('Vitória!', 'Parabéns, você completou o objetivo!', 'success');
                        onBackToMenu();
                    } else if (!isCorrect && lives - 1 <= 0) {
                         Swal.fire('Fim de Jogo!', `Sua pontuação final foi de ${score} ponto(s).`, 'info');
                         onBackToMenu();
                    } else {
                        fetchQuestion();
                    }
                } else {
                    fetchQuestion();
                }
            }, 1500);
        } catch (error) {
            Swal.fire('Oops...', 'Não foi possível verificar a resposta.', 'error');
            setOptionsDisabled(false);
        }
    };

    useEffect(() => {
        if (mode === 'timeAttack') {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        Swal.fire('Tempo Esgotado!', `Sua pontuação final foi de ${score} ponto(s).`, 'info');
                        onBackToMenu();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [mode, onBackToMenu, score]);
    
    useEffect(() => {
        const resetGame = async () => {
             setScore(0);
             setLives(DEFAULT_LIVES);
             setTimeRemaining(TIME_ATTACK_SECONDS);

            try {
                await axios.post(`${API_URL}/api/reset`, { mode });
                fetchQuestion();
                setIsLoading(false);
            } catch (error) {
                Swal.fire('Erro!', 'Não foi possível iniciar o jogo.', 'error');
                onBackToMenu();
            }
        };
        resetGame();
    }, [mode, onBackToMenu]);

    if (isLoading) {
        return <div className="loading-container">Iniciando o jogo...</div>;
    }

    const timePercentage = (timeRemaining / TIME_ATTACK_SECONDS) * 100;
    
    const getTimeBarColor = () => {
        if (timePercentage <= 25) {
            return 'red';
        } else if (timePercentage <= 50) {
            return 'yellow';
        } else {
            return 'green';
        }
    };
    
    const timeBarColor = getTimeBarColor();
    const isSilhouetteCondition = question?.type === 'who-is-this-pokemon';

    const gameInfo = mode === 'normal' ? (
        <span><FaHeart className="icon-heart" /> Vidas: {lives}</span>
    ) : (
        <span><FaClock className="icon-clock" /> Tempo: {timeRemaining}s</span>
    );
    
    return (
        <div className="game-container">
            <div className="game-info">
                {gameInfo}
                <span><FaStar className="icon-star" /> Pontos: {score}</span>
            </div>
            
            {mode === 'timeAttack' && (
                <div className="time-bar-container">
                    <motion.div
                        className={`time-bar ${timeBarColor}`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${timePercentage}%` }}
                    ></motion.div>
                </div>
            )}
            
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
                            <img
                                src={question.image}
                                alt="Pokémon"
                                className={`question-image ${isSilhouetteCondition ? 'silhouette' : ''}`}
                            />
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
                            let className = 'option-button';
                            if (correctAnswer && option.name === correctAnswer) {
                                className += ' correct';
                            } else if (correctAnswer) {
                                className += ' incorrect';
                            }
                            
                            let translatedOption = option.name;
                            if (question.type === 'what-is-this-pokemons-type') {
                                translatedOption = translate(option.name, typeTranslations);
                            } else if (question.type === 'what-is-this-pokemons-generation') {
                                translatedOption = translate(option.name, generationTranslations);
                            }
                            
                            return (
                                <motion.button
                                    key={index}
                                    className={className}
                                    onClick={() => handleAnswerSubmit(option.name)}
                                    disabled={optionsDisabled}
                                    variants={{
                                        hidden: { x: -20, opacity: 0 },
                                        visible: { x: 0, opacity: 1 },
                                    }}
                                >
                                    {translatedOption}
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