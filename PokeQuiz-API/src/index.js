const express = require('express');
const session = require('express-session');
const pokemonService = require('./services/pokemonService');
const gameService = require('./services/gameService');
const { checkAnswer } = require('./services/answerChecker');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_LIVES = 3;

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use(express.json());

app.use(
    session({
        secret: 'sua-chave-secreta-super-segura-e-aleatoria',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
        },
    })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Servidor do PokéQuiz está online!');
});

app.post('/api/reset', (req, res) => {
    const { mode } = req.body;
    req.session.mode = mode || 'normal';
    req.session.score = 0;
    req.session.correctAnswer = undefined;
    req.session.usedPokemonIds = [];

    if (req.session.mode === 'normal') {
        req.session.lives = DEFAULT_LIVES;
    }

    res.json({ message: 'Jogo reiniciado', mode: req.session.mode });
});

app.get('/api/question', async (req, res) => {
    try {
        const question = await gameService.generateQuestion([]);
        req.session.correctAnswer = question.correctAnswer;
        delete question.correctAnswer;
        delete question.pokemonId;
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar a pergunta.' });
    }
});

app.post('/api/answer', (req, res) => {
    try {
        const { userGuess } = req.body;
        const correctAnswer = req.session.correctAnswer;
        const isCorrect = checkAnswer(userGuess, correctAnswer);
        req.session.correctAnswer = undefined;
        res.json({ isCorrect });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar a resposta.' });
    }
});

const startServer = async () => {
    try {
        await pokemonService.loadAllPokemon();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor do PokéQuiz rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();