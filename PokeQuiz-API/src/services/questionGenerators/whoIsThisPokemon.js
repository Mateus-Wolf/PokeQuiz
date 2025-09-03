const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');

/**
 * Gera uma nova pergunta do tipo "Quem é esse Pokémon?".
 * @param {Array<Object>} availablePokemon - Lista de Pokémon disponíveis para a pergunta.
 * @returns {Object} Um objeto de pergunta com a imagem, opções de resposta e o ID do Pokémon.
 */
const generateWhoIsThisPokemonQuestion = (availablePokemon) => {
    if (availablePokemon.length === 0) {
      throw new Error('Não há Pokémon disponíveis para esta pergunta.');
    }

    const correctPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];

    const options = [];
    const chosenNames = new Set([correctPokemon.name]);

    options.push({ name: correctPokemon.name, isCorrect: true });

    while (options.length < 4) {
        // Agora, as opções erradas também são sorteadas do pool de Pokémon disponíveis
        const randomIndex = Math.floor(Math.random() * availablePokemon.length);
        const wrongPokemon = availablePokemon[randomIndex];

        if (!chosenNames.has(wrongPokemon.name)) {
            options.push({ name: wrongPokemon.name, isCorrect: false });
            chosenNames.add(wrongPokemon.name);
        }
    }

    const shuffledOptions = shuffleArray(options);

    return {
        type: 'who-is-this-pokemon',
        questionText: 'Quem é este Pokémon?',
        image: correctPokemon.sprite,
        options: shuffledOptions,
        correctAnswer: correctPokemon.name,
        pokemonId: correctPokemon.id,
    };
};

module.exports = {
    generateWhoIsThisPokemonQuestion,
};