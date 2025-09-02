const pokemonService = require('../pokemonService');
const { shuffleArray } = require('../../utils/utils');

/**
 * Retorna uma lista de 3 tipos aleatórios que não incluem o tipo correto.
 * @param {string} correctType - O tipo correto a ser excluído.
 * @returns {Array<string>} Uma lista de 3 tipos incorretos.
 */
const getWrongTypes = (correctType) => {
    // Lista de tipos de Pokémon. A gente poderia pegar isso da PokéAPI,
    // mas pra Geração 1, essa lista é fixa e mais simples de gerenciar aqui.
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
 * @returns {Object} Um objeto de pergunta com o nome do Pokémon, imagem e opções de resposta.
 */
const generateTypeQuestion = () => {
    const allPokemon = pokemonService.getAllPokemon();
    if (allPokemon.length === 0) {
        throw new Error('Dados de Pokémon não foram carregados.');
    }
    
    // Escolhe um Pokémon aleatório
    const pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    
    // Pega o tipo primário do Pokémon
    const correctType = pokemon.types[0];
    
    // Pega 3 tipos errados
    const wrongTypes = getWrongTypes(correctType);
    
    const options = [];
    options.push({ name: correctType, isCorrect: true });
    
    wrongTypes.forEach(type => {
        options.push({ name: type, isCorrect: false });
    });
    
    // Embaralha as opções
    const shuffledOptions = shuffleArray(options);
    
    return {
        type: 'what-is-this-pokemons-type',
        questionText: `De que tipo é o ${pokemon.name}?`,
        image: pokemon.sprite,
        options: shuffledOptions,
        correctAnswer: correctType, // Por enquanto, a gente guarda a resposta aqui
    };
};

module.exports = {
    generateTypeQuestion,
};