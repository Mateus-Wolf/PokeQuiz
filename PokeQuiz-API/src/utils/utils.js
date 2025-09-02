/**
 * Embaralha um array em uma ordem aleatória (algoritmo de Fisher-Yates).
 * @param {Array} array - O array a ser embaralhado.
 * @returns {Array} O array embaralhado.
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports = {
    shuffleArray,
};