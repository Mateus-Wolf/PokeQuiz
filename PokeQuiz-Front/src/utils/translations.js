// Mapeia os nomes das gerações para suas versões traduzidas.
export const generationTranslations = {
    'generation-i': 'Geração 1',
    'generation-ii': 'Geração 2',
    'generation-iii': 'Geração 3',
    'generation-iv': 'Geração 4',
    'generation-v': 'Geração 5',
    'generation-vi': 'Geração 6',
    'generation-vii': 'Geração 7',
    'generation-viii': 'Geração 8',
};

// Mapeia os nomes dos tipos para suas versões traduzidas.
export const typeTranslations = {
    'normal': 'Normal',
    'fire': 'Fogo',
    'water': 'Água',
    'grass': 'Planta',
    'electric': 'Elétrico',
    'ice': 'Gelo',
    'fighting': 'Lutador',
    'poison': 'Veneno',
    'ground': 'Terrestre',
    'flying': 'Voador',
    'psychic': 'Psíquico',
    'bug': 'Inseto',
    'rock': 'Pedra',
    'ghost': 'Fantasma',
    'dragon': 'Dragão',
    'steel': 'Aço',
    'dark': 'Sombrio',
    'fairy': 'Fada'
};

// Função genérica para pegar uma tradução, se existir.
export const translate = (key, dictionary) => {
    return dictionary[key.toLowerCase()] || key;
};