const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');

const getWrongGenerations = (correctGeneration) => {
    const allGenerations = [
        'generation-i', 'generation-ii', 'generation-iii', 'generation-iv',
        'generation-v', 'generation-vi', 'generation-vii', 'generation-viii'
    ];
    
    const wrongGenerations = [];
    const chosenGenerations = new Set([correctGeneration]);

    while (wrongGenerations.length < 3) {
        const randomIndex = Math.floor(Math.random() * allGenerations.length);
        const randomGeneration = allGenerations[randomIndex];
        if (!chosenGenerations.has(randomGeneration)) {
            wrongGenerations.push(randomGeneration);
            chosenGenerations.add(randomGeneration);
        }
    }
    return wrongGenerations;
};

/**
 * Gera uma nova pergunta do tipo "De qual geração é este Pokémon?".
 * @param {Array<Object>} availablePokemon - Lista de Pokémon disponíveis.
 * @returns {Object} Um objeto de pergunta.
 */
const generateGenerationQuestion = (availablePokemon) => {
    if (availablePokemon.length === 0) {
      throw new Error('Não há Pokémon disponíveis para esta pergunta.');
    }
    
    const pokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
    
    const correctGeneration = pokemon.generation;
    const wrongGenerations = getWrongGenerations(correctGeneration);
    
    const options = [];
    options.push({ name: correctGeneration, isCorrect: true });
    
    wrongGenerations.forEach(generation => {
        options.push({ name: generation, isCorrect: false });
    });
    
    const shuffledOptions = shuffleArray(options);
    
    return {
        type: 'what-is-this-pokemons-generation',
        questionText: `De qual geração é o ${pokemon.name}?`,
        image: pokemon.sprite,
        options: shuffledOptions,
        correctAnswer: correctGeneration,
        pokemonId: pokemon.id,
    };
};

module.exports = {
    generateGenerationQuestion,
};