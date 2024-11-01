const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos da pasta public
app.use(express.static(path.join(__dirname, 'hero'))); // Serve arquivos da pasta hero

// Rota para a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Caminho para o index.html
});

// Rota para obter os dados do hero
app.get('/api/hero', (req, res) => {
    fs.readFile(path.join(__dirname, 'hero', 'hero.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo hero.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Rota para obter os dados do heroLevelBase
app.get('/api/heroLevelBase', (req, res) => {
    fs.readFile(path.join(__dirname, 'hero', 'heroLevelBase.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo heroLevelBase.json' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
