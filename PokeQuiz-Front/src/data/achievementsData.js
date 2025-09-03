export const ACHIEVEMENTS = [
    {
        id: 'first-steps',
        name: 'Primeiros Passos',
        description: 'Acerte sua primeira pergunta.',
        condition: (gameData) => gameData.score >= 1,
    },
    {
        id: 'rookie-trainer',
        name: 'Treinador Novato',
        description: 'Alcance 5 acertos no Modo Clássico.',
        condition: (gameData) => gameData.score >= 5 && gameData.mode === 'normal',
    },
    {
        id: 'generation-i-master',
        name: 'Mestre da Geração I',
        description: 'Acerte 3 perguntas sobre a Geração 1.',
        condition: (gameData) => gameData.gen1Correct >= 3,
    },
    {
        id: 'fast-and-furious',
        name: 'Veloz e Furioso',
        description: 'Acerte 10 perguntas no Modo Time Attack.',
        condition: (gameData) => gameData.score >= 10 && gameData.mode === 'timeAttack',
    },
];

export const getAchievementById = (id) => {
    return ACHIEVEMENTS.find(ach => ach.id === id);
};