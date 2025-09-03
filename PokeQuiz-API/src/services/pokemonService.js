const axios = require('axios');

let pokemonCache = [];

// AQUI ESTÁ O ERRO! Vamos mudar o limite para 386
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=386';

/**
 * Busca e carrega os dados de espécie e geração de um Pokémon.
 * @param {string} speciesUrl - A URL da API para a espécie do Pokémon.
 * @returns {Promise<Object>} Um objeto com os dados de espécie.
 */
const getPokemonSpeciesData = async (speciesUrl) => {
  const response = await axios.get(speciesUrl);
  const data = response.data;
  return {
    generation: data.generation.name,
    evolution_chain_url: data.evolution_chain.url,
  };
};

/**
 * Busca os dados da cadeia de evolução.
 * @param {string} evolutionChainUrl - A URL da API para a cadeia de evolução.
 * @returns {Promise<Object>} Um objeto com os dados da cadeia.
 */
const getEvolutionChainData = async (evolutionChainUrl) => {
  const response = await axios.get(evolutionChainUrl);
  return response.data;
};

/**
 * Busca e carrega os dados de todos os Pokémon,
 * incluindo tipos, geração e cadeia de evolução.
 */
const loadAllPokemon = async () => {
  try {
    console.log('✨ Carregando dados dos Pokémon da PokéAPI...');

    const response = await axios.get(POKEAPI_BASE_URL);
    const results = response.data.results;

    const detailedPokemonPromises = results.map(async (pokemon) => {
      const detailsResponse = await axios.get(pokemon.url);
      const detailsData = detailsResponse.data;

      const speciesData = await getPokemonSpeciesData(detailsData.species.url);

      return {
        id: detailsData.id,
        name: detailsData.name,
        sprite: detailsData.sprites.front_default,
        types: detailsData.types.map(t => t.type.name),
        generation: speciesData.generation,
        evolution_chain_url: speciesData.evolution_chain_url,
      };
    });

    pokemonCache = await Promise.all(detailedPokemonPromises);

    console.log(`✅ Dados de ${pokemonCache.length} Pokémon carregados com sucesso!`);
    
    return pokemonCache;

  } catch (error) {
    console.error('❌ Erro ao carregar os dados dos Pokémon:', error.message);
    throw error;
  }
};

const getAllPokemon = () => {
  return pokemonCache;
};

module.exports = {
  loadAllPokemon,
  getAllPokemon,
  getPokemonSpeciesData,
  getEvolutionChainData
};