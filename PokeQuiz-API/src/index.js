const express = require('express');
const session = require('express-session');
const pokemonService = require('./services/pokemonService');
const gameService = require('./services/gameService');
const { checkAnswer } = require('./services/answerChecker');
const cors = require('cors'); // Importa o middleware CORS

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_LIVES = 3;

// Configuração do CORS para permitir requisições do front-end
app.use(
    cors({
        origin: 'http://localhost:3000', // A URL do seu front-end
        credentials: true, // Necessário para enviar cookies e sessões
    })
);

app.use(express.json());

// Configuração da sessão
app.use(
    session({
        secret: 'sua-chave-secreta-super-segura-e-aleatoria',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax', // Permite que cookies de sessão sejam enviados em ambientes de desenvolvimento
        },
    })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Servidor do PokéQuiz está online!');
});

// Nova rota para reiniciar o jogo
app.post('/api/reset', (req, res) => {
    req.session.lives = DEFAULT_LIVES;
    req.session.score = 0;
    req.session.correctAnswer = undefined;
    res.json({ message: 'Jogo reiniciado', lives: req.session.lives, score: req.session.score });
});

// Rota para gerar uma pergunta
app.get('/api/question', async (req, res) => {
    try {
        if (req.session.lives === undefined) {
            req.session.lives = DEFAULT_LIVES;
            req.session.score = 0;
        }

        if (req.session.lives <= 0) {
            return res.status(400).json({ error: 'Fim de jogo. Reinicie para jogar de novo.' });
        }

        const question = await gameService.generateQuestion();
        req.session.correctAnswer = question.correctAnswer;
        delete question.correctAnswer;

        console.log(`Nova pergunta gerada! Tipo: ${question.type}. Resposta correta (Modo Dev): ${req.session.correctAnswer}`);

        res.json({ ...question, lives: req.session.lives, score: req.session.score });
    } catch (error) {
        console.error('❌ Erro ao gerar a pergunta:', error);
        res.status(500).json({ error: 'Erro ao gerar a pergunta.' });
    }
});

// Rota para verificação da resposta
app.post('/api/answer', (req, res) => {
    try {
        const { userGuess } = req.body;
        const correctAnswer = req.session.correctAnswer;
        const lives = req.session.lives;

        if (!userGuess || !correctAnswer || lives === undefined || lives <= 0) {
            return res.status(400).json({ isCorrect: false, lives: lives, message: 'Resposta ou jogo inválido. Reinicie o jogo.' });
        }

        const isCorrect = checkAnswer(userGuess, correctAnswer);
        req.session.correctAnswer = undefined;

        if (isCorrect) {
            req.session.score = (req.session.score || 0) + 1;
            res.json({ isCorrect: true, lives: req.session.lives, score: req.session.score });
        } else {
            req.session.lives -= 1;
            res.json({ isCorrect: false, lives: req.session.lives, score: req.session.score });
        }
    } catch (error) {
        console.error('❌ Erro ao verificar a resposta:', error);
        res.status(500).json({ error: 'Erro ao verificar a resposta.' });
    }
});

const startServer = async () => {
    try {
        await pokemonService.loadAllPokemon();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor do PokéQuiz rodando na porta ${PORT}`);
            console.log(`📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`);
            const allPokemon = pokemonService.getAllPokemon();
            if (allPokemon.length > 0) {
                console.log(`✅ ${allPokemon.length} Pokémon carregados e prontos para o jogo!`);
            }
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();