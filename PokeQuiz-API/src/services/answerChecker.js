const checkAnswer = (submittedAnswer, correctAnswer) => {
  // Normaliza as strings para garantir que a comparação seja case-insensitive.
  return submittedAnswer.toLowerCase() === correctAnswer.toLowerCase();
};

module.exports = {
  checkAnswer,
};