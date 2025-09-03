const pokemonService = require('./pokemonService');
const { checkAnswer } = require('./answerChecker');
const { generateTypeQuestion } = require('./questionGenerators/typeQuestion');
const { generateWhoIsThisPokemonQuestion } = require('./questionGenerators/whoIsThisPokemon');
const { generateEvolutionQuestion } = require('./questionGenerators/evolutionQuestion');
const { generateGenerationQuestion } = require('./questionGenerators/generationQuestion');

const questionGenerators = [
  generateTypeQuestion,
  generateWhoIsThisPokemonQuestion,
  generateEvolutionQuestion,
  generateGenerationQuestion,
];

/**
 * Gera uma nova pergunta, sorteando aleatoriamente entre os tipos de pergunta disponíveis.
 * Garante que o Pokémon da pergunta não tenha sido usado recentemente.
 * @param {Array<number>} usedPokemonIds - IDs dos Pokémon já usados.
 * @returns {Promise<Object>} Um objeto de pergunta.
 */
const generateQuestion = async (usedPokemonIds = []) => {
    const allPokemon = pokemonService.getAllPokemon();
    const availablePokemon = allPokemon.filter(p => !usedPokemonIds.includes(p.id));

    if (availablePokemon.length === 0) {
        throw new Error('Todos os Pokémon já foram usados. Reinicie o jogo.');
    }

    const randomIndex = Math.floor(Math.random() * questionGenerators.length);
    const generator = questionGenerators[randomIndex];
  
    // Passamos a lista de disponíveis para o gerador
    const question = await generator(availablePokemon);
    return question;
};

module.exports = {
  generateQuestion,
  checkAnswer
};