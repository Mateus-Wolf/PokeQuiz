const pokemonService = require('./pokemonService');
const { checkAnswer } = require('./answerChecker'); // Importa a função de checagem
const { generateTypeQuestion } = require('./questionGenerators/typeQuestion');
const { generateWhoIsThisPokemonQuestion } = require('./questionGenerators/whoIsThisPokemon');
const { generateEvolutionQuestion } = require('./questionGenerators/evolutionQuestion');

// Array com todos os geradores de pergunta disponíveis.
// A gente pode adicionar mais geradores aqui no futuro!
const questionGenerators = [
  generateTypeQuestion,
  generateWhoIsThisPokemonQuestion,
  generateEvolutionQuestion
];

/**
 * Gera uma nova pergunta, sorteando aleatoriamente entre os tipos de pergunta disponíveis.
 * @returns {Promise<Object>} Um objeto de pergunta com a imagem, texto e opções de resposta.
 */
const generateQuestion = async () => {
  // Sorteia um gerador de pergunta aleatório
  const randomIndex = Math.floor(Math.random() * questionGenerators.length);
  const generator = questionGenerators[randomIndex];
  
  // Chama a função geradora e retorna a pergunta
  const question = await generator();
  return question;
};

module.exports = {
  generateQuestion,
  checkAnswer
};