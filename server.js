const { configDotenv } = require("dotenv");
const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public"))); // Serve arquivos da pasta public
app.use(express.static(path.join(__dirname, "hero"))); // Serve arquivos da pasta hero

// Rota para a raiz
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Caminho para o index.html
});

app.get("/api/heroes", async (req, res) => {
    try {
        const heroesFileData = JSON.parse(await fs.readFile(path.join(__dirname, "hero", "hero.json"), "utf8"));
        console.log(heroesFileData);
        const daasd = [];

        const heroesData = heroesFileData.map((hero) => {
            return {
                heroName: hero.heroname,
                heroId: hero.heroId,
            };
        });

        res.send(heroesData);
    } catch (err) {
        console.log("Error:", err);

        res.send({ error: "Erro ao buscar a lista de heróis." });
    }
});

// Rota para obter os dados do hero
app.get("/api/hero/:heroId", async (req, res) => {
  const { heroId } = req.params;
  const heroesJSONData = JSON.parse(await fs.readFile(path.join(__dirname, "hero", "hero.json"), "utf8"));
  const heroesLevelBaseJSONData = JSON.parse(
    await fs.readFile(path.join(__dirname, "hero", "heroLevelBase.json"), "utf8"),
  );

  console.log("🚀 ~ app.get ~ heroesLevelBaseJSONData:", heroesLevelBaseJSONData)

    const heroData = heroesJSONData.find((hero) => hero.heroId === parseInt(heroId, 10));

    const heroLevelBaseData = heroesLevelBaseJSONData.find((hero) => hero.heroId === parseInt(heroId, 10));

    // console.log("heroData", heroData);
    // console.log("heroLevelBaseData", heroLevelBaseData);

    const hero = {
        ...heroData,
        ...heroLevelBaseData,
    };

    // console.log("Compound hero data:", hero);

    if (!hero) {
        return res.status(404).json({ error: "Herói não encontrado." });
    }

    res.json(hero);
});

// Rota para obter os dados do heroLevelBase
app.get("/api/heroLevelBase", (req, res) => {
    fs.readFile(path.join(__dirname, "hero", "heroLevelBase.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao ler o arquivo heroLevelBase.json" });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
