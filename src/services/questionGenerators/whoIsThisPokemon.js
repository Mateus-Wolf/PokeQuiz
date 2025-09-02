const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');

/**
 * Gera uma nova pergunta do tipo "Quem é este Pokémon?".
 * @returns {Object} Um objeto de pergunta com a imagem e as opções de resposta.
 */
const generateWhoIsThisPokemonQuestion = () => {
  const allPokemon = pokemonService.getAllPokemon();
  if (allPokemon.length === 0) {
    throw new Error('Dados de Pokémon não foram carregados.');
  }

  const correctPokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];

  const options = [];
  const chosenNames = new Set([correctPokemon.name]);

  options.push({ name: correctPokemon.name, isCorrect: true });

  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * allPokemon.length);
    const wrongPokemon = allPokemon[randomIndex];

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
  };
};

module.exports = {
  generateWhoIsThisPokemonQuestion,
};