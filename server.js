const { configDotenv } = require("dotenv");
const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

configDotenv();

function calcTotalExp(level, heroLevelBaseData) {
    let totalExp = 0;
    for (let i = 1; i <= level; i++) {
        totalExp += heroLevelBaseData.find((level) => level.id === i).need_exp;
    }
    return totalExp;
}

function calcAttribute(level, attribute, heroLevelBaseData, heroData) {
    let attributeValue = heroData[attribute];

    if (level === 1) {
        return attributeValue;
    }

    for (let i = 1; i <= level; i++) {
        plusAttribute =
            heroLevelBaseData.find((levelData) => levelData.id === i)[attribute] * heroData.lv_up_base[attribute];
        attributeValue += plusAttribute;
    }

    return attributeValue ?? heroData[attribute];
}

async function levelsData(level, heroLevelBaseData, heroData) {
    const levels = [];
    for (let i = 1; i <= level; i++) {
        levels.push({
            level: i,
            accuracy: Math.round(calcAttribute(i, "accuracy*base", heroLevelBaseData, heroData)),
            atk_speed: Math.round(calcAttribute(i, "atk_speed*base", heroLevelBaseData, heroData)),
            crit_bonus: Math.round(calcAttribute(i, "crit_bonus*base", heroLevelBaseData, heroData)),
            crit_chance: Math.round(calcAttribute(i, "crit_chance*base", heroLevelBaseData, heroData)),
            resistance: Math.round(calcAttribute(i, "resistance*base", heroLevelBaseData, heroData)),
            defense: Math.round(calcAttribute(i, "defense*base", heroLevelBaseData, heroData)),
            max_health: Math.round(calcAttribute(i, "max_health*base", heroLevelBaseData, heroData)),
            physical_damage: Math.round(calcAttribute(i, "phy_dmg*base", heroLevelBaseData, heroData)),
            need_exp: heroLevelBaseData.find((levelData) => levelData.id === i).need_exp,
            total_exp: calcTotalExp(i, heroLevelBaseData),
        });
    }

    return levels;
}

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

    const heroData = heroesJSONData.find((hero) => hero.heroId === parseInt(heroId, 10));

    const heroLevelBaseData = heroesLevelBaseJSONData;

    // console.log("heroData", heroData);
    // console.log("heroLevelBaseData", heroLevelBaseData);

    const hero = {
        ...heroData,
        levels: await levelsData(100, heroLevelBaseData, heroData),
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
