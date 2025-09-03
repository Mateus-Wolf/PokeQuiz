const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');

const getWrongTypes = (correctType) => {
    const allTypes = [
        'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
        'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
        'dragon', 'steel', 'dark', 'fairy'
    ];
    
    const wrongTypes = [];
    const chosenTypes = new Set([correctType]);

    while (wrongTypes.length < 3) {
        const randomIndex = Math.floor(Math.random() * allTypes.length);
        const randomType = allTypes[randomIndex];
        if (!chosenTypes.has(randomType)) {
            wrongTypes.push(randomType);
            chosenTypes.add(randomType);
        }
    }
    return wrongTypes;
};

/**
 * Gera uma nova pergunta do tipo "De que tipo é este Pokémon?".
 * @param {Array<Object>} availablePokemon - Lista de Pokémon disponíveis.
 * @returns {Object} Um objeto de pergunta.
 */
const generateTypeQuestion = (availablePokemon) => {
    if (availablePokemon.length === 0) {
      throw new Error('Não há Pokémon disponíveis para esta pergunta.');
    }
    
    const pokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
    
    const correctType = pokemon.types[0];
    const wrongTypes = getWrongTypes(correctType);
    
    const options = [];
    options.push({ name: correctType, isCorrect: true });
    
    wrongTypes.forEach(type => {
        options.push({ name: type, isCorrect: false });
    });
    
    const shuffledOptions = shuffleArray(options);
    
    return {
        type: 'what-is-this-pokemons-type',
        questionText: `De que tipo é o ${pokemon.name}?`,
        image: pokemon.sprite,
        options: shuffledOptions,
        correctAnswer: correctType,
        pokemonId: pokemon.id,
    };
};

module.exports = {
    generateTypeQuestion,
};