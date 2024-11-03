/**
 * Função para buscar a lista de heróis para preencher o select.
 * @returns {Promise} Promise com os nomes e IDs dos heróis
 */
async function fetchHeroes() {
    try {
        const response = await fetch("/api/heroes");
        if (!response.ok) throw new Error("Erro ao buscar a lista de heróis.");
        const heroesData = await response.json();
        heroesData.sort((a, b) => (a.heroName > b.heroName ? 1 : -1));
        populateHeroSelect(heroesData);
        return heroesData;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Função para buscar os dados do herói
 * @param {heroId} heroId - ID do herói
 * @returns {Promise} Promise com os dados do herói
 */
async function fetchHero(heroId) {
    const response = await fetch(`/api/hero/${heroId}`);

    if (!response.ok) {
        console.error("Erro ao buscar os dados do herói:", response);
        return null;
    }

    return response.json();
}

// Função para preencher o select com os heróis
function populateHeroSelect(heroesData) {
    const heroSelect = $("#hero-select");
    heroSelect.empty(); // Limpa as opções anteriores
    heroSelect.append('<option value="" disabled selected>Selecione um herói</option>'); // Adiciona a opção padrão
    heroesData.forEach((hero) => {
        const option = $("<option></option>");
        option.val(hero.heroId);
        option.text(hero.heroName);
        heroSelect.append(option);
    });
}

// Função para buscar e exibir os dados do herói selecionado
async function fetchAndDisplayHero(heroId) {
    try {
        const heroIdNum = parseInt(heroId, 10);

        // Procura o herói específico usando o heroData já carregado
        const selectedHero = await fetchHero(heroIdNum);
        if (selectedHero) {
            displayHero(selectedHero);
            const level = parseInt($("#hero-level").val(), 10);
            displayCalculatedAttributes(selectedHero, level); // Atualiza os atributos
        } else {
            console.log("Herói não encontrado:", heroIdNum);
        }
    } catch (error) {
        console.error(error);
    }
}

// Função para calcular os atributos do herói com base no nível
function calculateHeroAttributes(hero, level) {
    const baseAttributes = {
        accuracy: hero["accuracy*base"],
        atk_speed: hero["atk_speed*bpct"],
        crit_bonus: hero["crit_bonus*bpct"],
        crit_chance: hero["crit_chance*bpct"],
        defense: hero["defense*base"],
        max_health: hero["max_health*base"],
        phy_dmg: hero["phy_dmg*base"],
        resistance: hero["resistance*base"],
    };

    // console.log(
    //     "hero.levels",
    //     hero.levels.find((heroLevel) => heroLevel.level === level),
    // );

    baseAttributes.accuracy = hero.levels.find((heroLevel) => heroLevel.level === level).accuracy;
    baseAttributes.atk_speed = hero.levels.find((heroLevel) => heroLevel.level === level).atk_speed;
    baseAttributes.crit_bonus = hero.levels.find((heroLevel) => heroLevel.level === level).crit_bonus;
    baseAttributes.crit_chance = hero.levels.find((heroLevel) => heroLevel.level === level).crit_chance;
    baseAttributes.defense = hero.levels.find((heroLevel) => heroLevel.level === level).defense;
    baseAttributes.max_health = hero.levels.find((heroLevel) => heroLevel.level === level).max_health;
    baseAttributes.phy_dmg = hero.levels.find((heroLevel) => heroLevel.level === level).physical_damage;
    baseAttributes.resistance = hero.levels.find((heroLevel) => heroLevel.level === level).resistance;

    // const levelUpData = {
    //     30: { defense: 8.51, max_health: 8.51, phy_dmg: 8.51 },
    //     50: { defense: 12.97, max_health: 12.97, phy_dmg: 12.97 },
    //     70: { defense: 19.74, max_health: 19.74, phy_dmg: 19.74 },
    //     90: { defense: 28.45, max_health: 28.45, phy_dmg: 28.45 },
    //     100: { defense: 0.0, max_health: 0.0, phy_dmg: 0.0 },
    // };

    // Aplicar aumentos de atributos conforme o nível
    // if (level >= 30) {
    //     baseAttributes.defense += levelUpData[30].defense;
    //     baseAttributes.max_health += levelUpData[30].max_health;
    //     baseAttributes.phy_dmg += levelUpData[30].phy_dmg;
    // }
    // if (level >= 50) {
    //     baseAttributes.defense += levelUpData[50].defense;
    //     baseAttributes.max_health += levelUpData[50].max_health;
    //     baseAttributes.phy_dmg += levelUpData[50].phy_dmg;
    // }
    // if (level >= 70) {
    //     baseAttributes.defense += levelUpData[70].defense;
    //     baseAttributes.max_health += levelUpData[70].max_health;
    //     baseAttributes.phy_dmg += levelUpData[70].phy_dmg;
    // }
    // if (level >= 90) {
    //     baseAttributes.defense += levelUpData[90].defense;
    //     baseAttributes.max_health += levelUpData[90].max_health;
    //     baseAttributes.phy_dmg += levelUpData[90].phy_dmg;
    // }

    return baseAttributes;
}

// Função para exibir atributos calculados
function displayCalculatedAttributes(hero, level) {
    const attributes = calculateHeroAttributes(hero, level);
    console.log("🚀 ~ displayCalculatedAttributes ~ attributes:", attributes)

    const attributesContainer = $("#hero-atributo");
    attributesContainer.empty(); // Limpa os atributos anteriores
    attributesContainer.html(`
        <h6>Atributos Calculados (Nível ${level}):</h6>
        <p><strong>Precisão:</strong> ${attributes.accuracy ?? 0}</p>
        <p><strong>Velocidade de Ataque:</strong> ${attributes.atk_speed ?? 0}</p>
        <p><strong>Bônus Crítico:</strong> ${attributes.crit_bonus ?? 0}</p>
        <p><strong>Chance Crítica:</strong> ${attributes.crit_chance ?? 0}</p>
        <p><strong>Defesa:</strong> ${attributes.defense ?? 0}</p>
        <p><strong>Saúde Máxima:</strong> ${attributes.max_health ?? 0}</p>
        <p><strong>Dano Físico:</strong> ${attributes.phy_dmg ?? 0}</p>
        <p><strong>Resistência:</strong> ${attributes.resistance ?? 0}</p>
    `);
}

// Função para exibir os dados do herói
function displayHero(hero) {
    const heroContainer = $("#hero-container");
    const heroImagePath = `${hero.heroIdPath.split("/").pop()}` ?? null; // Obtém o nome do arquivo, ex: icon_duizhangji.png
    const {
        heroName,
        ability_replace,
        show_title,
        rarity,
        element,
        orientation,
        skill,
        atk_type,
        attack_frequency,
        captain_slot,
        captain_slot_path,
        captain_slot_path_2,
        captain_slot_path_3,
    } = hero;

    const accuracy = hero["accuracy*base"];
    const atk_speed = hero["atk_speed*bpct"];
    const crit_bonus = hero["crit_bonus*bpct"];
    const crit_chance = hero["crit_chance*bpct"];
    const defense = hero["defense*base"];
    const max_health = hero["max_health*base"];
    const phy_dmg = hero["phy_dmg*base"];
    const resistance = hero["resistance*base"];
    const mastery = hero["mastery*base"];

    const captainIconBase = captain_slot_path ? captain_slot_path.split("/").slice(-1)[0] : null;
    
    // Obtém o nome do arquivo, ex: icon_duizhangji_2.png

    heroContainer.html(`
        <div class="card mb-4">
            <img src="${heroImagePath}" id="img-head" class="card-img-top" alt="${heroName}">
            <div class="card-body">
                <h5 class="card-title">${heroName || "Hero"}</h5>
                <p><strong>Nome:</strong> ${hero.heroname}</p>
                <p><strong>Título:</strong> ${show_title}</p>
                <p><strong>Raridade:</strong> ${rarity}</p>
                <p><strong>Elemento:</strong> ${element}</p>
                <p><strong>Orientação:</strong> ${orientation}</p>
                <p><strong>Habilidade Substituta:</strong> ${ability_replace}</p>
                <p><strong>Tipo de Ataque:</strong> ${atk_type}</p>
                <p><strong>Frequência de Ataque:</strong> ${attack_frequency}</p>
                <p><strong>Precisão Base:</strong> ${accuracy}</p>
                <p><strong>Defesa Base:</strong> ${defense}</p>
                <p><strong>Saúde Máxima Base:</strong> ${max_health}</p>
                <p><strong>Dano Físico Base:</strong> ${phy_dmg}</p>
                <p><strong>Resistência Base:</strong> ${resistance}</p>
                <p><strong>Maestria Base:</strong> ${mastery}</p>
                ${captainIconBase ? `<p><strong>Slot do Capitão:</strong> ${captain_slot}</p><img src="${captainIconBase}" alt="Ícone do Slot do Capitão" class="skill-icon" />` : ""}

                <div class="form-group">
                    <label for="hero-level">Escolha o nível:</label>
                    <input type="range" id="hero-level" min="1" max="100" value="1" class="form-control-range">
                    <span id="level-display">Nível: 1</span>
                </div>

                <h6>Informações Base:</h6>
                <ul id="hero-atributo">
                    
                </ul>

                <h6>Habilidades:</h6>
                <ul>
                    ${Object.values(skill)
                        .map((s) => {
                            const skillPath = s.skillPath ? s.skillPath.split("/").pop() : null;
                            return `
                                <li>
                                    <strong>${s.skillname}</strong>: ${s.skilldesc}
                                    ${skillPath ? `<img src="${skillPath}" alt="${s.skillname}" class="skill-icon" />` : ""}
                                </li>
                            `;
                        })
                        .join("")}
                </ul>
            </div>
        </div>
    `);

    // Evento para alterar o nível com o controle deslizante
    $("#hero-level").on("input", function () {
        const level = parseInt($(this).val(), 10);
        $("#level-display").text(`Nível: ${level}`);
        displayCalculatedAttributes(hero, level);
    });

    // Inicializa a exibição de atributos com o nível 1
    displayCalculatedAttributes(hero, 1);
}

// Inicializa o aplicativo ao carregar
async function initializeApp() {
    window.heroData = await fetchHeroes();
    localStorage.setItem("heroData", JSON.stringify(window.heroData)); // Salva os dados no localStorage
    const selectedHeroId = $("#hero-select").val();
    if (selectedHeroId) {
        fetchAndDisplayHero(selectedHeroId);
    }
}

// Evento para quando um herói é selecionado
$("#hero-select").on("change", function () {
    const selectedHeroId = $(this).val();
    if (selectedHeroId) {
        fetchAndDisplayHero(selectedHeroId);
    }
});

// Chamando a inicialização do aplicativo
$(document).ready(function () {
    initializeApp();
});
