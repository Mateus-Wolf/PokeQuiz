const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');
const axios = require('axios');

const getEvolution = (evolutionData, pokemonName) => {
  let evolutionChain = evolutionData.chain;

  while (evolutionChain) {
    if (evolutionChain.species.name === pokemonName) {
      if (evolutionChain.evolves_to.length > 0) {
        return evolutionChain.evolves_to[0].species.name;
      }
      return null;
    }
    evolutionChain = evolutionChain.evolves_to[0];
  }
  return null;
};

/**
 * Gera uma nova pergunta do tipo "Qual a evolução deste Pokémon?".
 * @param {Array<Object>} availablePokemon - Lista de Pokémon disponíveis.
 * @returns {Promise<Object>} Um objeto de pergunta.
 */
const generateEvolutionQuestion = async (availablePokemon) => {
    if (availablePokemon.length === 0) {
      throw new Error('Não há Pokémon disponíveis para esta pergunta.');
    }

    const pokemonsToEvolve = availablePokemon.filter(p => p.evolution_chain_url && p.id < 151);
    
    if (pokemonsToEvolve.length === 0) {
      // Se não houver Pokémon com evolução no pool disponível, a gente não gera essa pergunta
      // e deixa o gameService sortear outra.
      return generateEvolutionQuestion(pokemonService.getAllPokemon());
    }

    const basePokemon = pokemonsToEvolve[Math.floor(Math.random() * pokemonsToEvolve.length)];
    
    const evolutionChainResponse = await axios.get(basePokemon.evolution_chain_url);
    const evolutionData = evolutionChainResponse.data;

    const correctEvolutionName = getEvolution(evolutionData, basePokemon.name);

    if (!correctEvolutionName) {
      return generateEvolutionQuestion(availablePokemon);
    }
    
    const correctEvolution = availablePokemon.find(p => p.name === correctEvolutionName) || pokemonService.getAllPokemon().find(p => p.name === correctEvolutionName);

    const options = [];
    const chosenNames = new Set([correctEvolutionName]);
    options.push({ name: correctEvolutionName, isCorrect: true });

    while (options.length < 4) {
        // Aqui também, as opções erradas são sorteadas do pool de disponíveis
      const randomIndex = Math.floor(Math.random() * availablePokemon.length);
      const wrongPokemon = availablePokemon[randomIndex];
      if (!chosenNames.has(wrongPokemon.name)) {
        options.push({ name: wrongPokemon.name, isCorrect: false });
        chosenNames.add(wrongPokemon.name);
      }
    }

    const shuffledOptions = shuffleArray(options);

    return {
      type: 'what-is-this-pokemons-evolution',
      questionText: `Qual é a evolução de ${basePokemon.name}?`,
      image: basePokemon.sprite,
      options: shuffledOptions,
      correctAnswer: correctEvolutionName,
      pokemonId: basePokemon.id,
    };
};

module.exports = {
  generateEvolutionQuestion,
};