const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');
const axios = require('axios');

/**
 * Pega a evolução de um Pokémon dentro de uma cadeia de evolução.
 * @param {object} evolutionData - Os dados da cadeia de evolução.
 * @param {string} pokemonName - O nome do Pokémon que a gente quer encontrar a evolução.
 * @returns {string|null} O nome da evolução ou null se não houver.
 */
const getEvolution = (evolutionData, pokemonName) => {
  let evolutionChain = evolutionData.chain;

  // Busca o Pokémon na cadeia
  while (evolutionChain) {
    if (evolutionChain.species.name === pokemonName) {
      if (evolutionChain.evolves_to.length > 0) {
        return evolutionChain.evolves_to[0].species.name;
      }
      return null; // Não há evolução para este Pokémon
    }
    // Vai para o próximo Pokémon na cadeia
    evolutionChain = evolutionChain.evolves_to[0];
  }
  return null;
};

/**
 * Gera uma nova pergunta do tipo "Qual a evolução deste Pokémon?".
 * @returns {Promise<Object>} Um objeto de pergunta com a imagem, nome do Pokémon e opções.
 */
const generateEvolutionQuestion = async () => {
  const allPokemon = pokemonService.getAllPokemon();
  if (allPokemon.length === 0) {
    throw new Error('Dados de Pokémon não foram carregados.');
  }

  // A gente só pode fazer perguntas sobre Pokémon que evoluem
  // e que a gente tenha os dados no cache.
  const pokemonsToEvolve = allPokemon.filter(p => p.evolution_chain_url);
  if (pokemonsToEvolve.length === 0) {
    throw new Error('Nenhum Pokémon com evolução encontrado.');
  }

  // Escolhe um Pokémon base aleatório que tenha evolução
  const basePokemon = pokemonsToEvolve[Math.floor(Math.random() * pokemonsToEvolve.length)];

  const evolutionChainResponse = await axios.get(basePokemon.evolution_chain_url);
  const evolutionData = evolutionChainResponse.data;

  const correctEvolutionName = getEvolution(evolutionData, basePokemon.name);

  // Se o Pokémon não tiver evolução ou já for a última forma
  if (!correctEvolutionName) {
    // Tenta novamente com outro Pokémon
    return generateEvolutionQuestion();
  }
  
  // Encontra o Pokémon da evolução para pegar o ID e o sprite
  const correctEvolution = allPokemon.find(p => p.name === correctEvolutionName);

  const options = [];
  const chosenNames = new Set([correctEvolutionName]);
  options.push({ name: correctEvolutionName, isCorrect: true });

  // Pega mais 3 Pokémon aleatórios para as opções erradas
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
    type: 'what-is-this-pokemons-evolution',
    questionText: `Qual é a evolução de ${basePokemon.name}?`,
    image: basePokemon.sprite,
    options: shuffledOptions,
    correctAnswer: correctEvolutionName,
  };
};

module.exports = {
  generateEvolutionQuestion,
};