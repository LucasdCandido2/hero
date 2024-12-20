// Função para buscar os dados do herói
async function fetchHero() {
    try {
        const [heroResponse, levelResponse] = await Promise.all([
            fetch('/api/hero'),
            fetch('/api/heroLevelBase')
        ]);
        if (!heroResponse.ok) throw new Error("Erro ao buscar a lista de heróis.");
        if (!levelResponse.ok) throw new Error("Erro ao buscar os dados de level base.");

        const heroData = await heroResponse.json();
        const levelData = await levelResponse.json(); // Assume que levelData será um objeto ou array que contém os dados necessários
        populateHeroSelect(heroData)
        return { heroData, levelData }; // Retorne os dados de nível para uso posterior
    } catch (error) {
        console.error(error);
    }
}

// Função para preencher o select com os heróis
function populateHeroSelect(heroData) {    
    const heroSelect = $('#hero-select');
    heroSelect.empty(); // Limpa as opções anteriores
    heroSelect.append('<option value="" disabled selected>Selecione um herói</option>'); // Adiciona a opção padrão
    heroData.forEach(hero => {
        const option = $('<option></option>');
        option.val(hero.heroId);
        option.text(hero.heroname);
        heroSelect.append(option);
    });
}

// Função para buscar e exibir os dados do herói selecionado
async function fetchAndDisplayHero(heroId, heroData) {
    try {
        const heroIdNum = parseInt(heroId, 10);
        
        // Procura o herói específico usando o heroData já carregado
        const selectedHero = window.heroData.find(hero => hero.heroId === heroIdNum);
        if (selectedHero) {
            displayHero(selectedHero);
            const level = parseInt($("#hero-level").val(), 10);
            displayCalculatedAttributes(selectedHero, level, window.levelData); // Atualiza os atributos
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
        accuracy: hero['accuracy*base'],
        atk_speed: hero['atk_speed*bpct'],
        crit_bonus: hero['crit_bonus*bpct'],
        crit_chance: hero['crit_chance*bpct'],
        defense: hero['defense*base'],
        max_health: hero['max_health*base'],
        phy_dmg: hero['phy_dmg*base'],
        resistance: hero['resistance*base'],
    };

    // Aumentos para cada nível
    const levelUpData = {
        30: { defense: 8.51, max_health: 8.51, phy_dmg: 8.51 },
        50: { defense: 12.97, max_health: 12.97, phy_dmg: 12.97 },
        70: { defense: 19.74, max_health: 19.74, phy_dmg: 19.74 },
        90: { defense: 28.45, max_health: 28.45, phy_dmg: 28.45 },
        100: { defense: 0.0, max_health: 0.0, phy_dmg: 0.0 }, // Não há aumento, mas pode ser ajustado se necessário
    };

    // Aplicar aumentos de atributos conforme o nível
    if (level >= 30) {
        baseAttributes.defense += levelUpData[30].defense;
        baseAttributes.max_health += levelUpData[30].max_health;
        baseAttributes.phy_dmg += levelUpData[30].phy_dmg;
    }
    if (level >= 50) {
        baseAttributes.defense += levelUpData[50].defense;
        baseAttributes.max_health += levelUpData[50].max_health;
        baseAttributes.phy_dmg += levelUpData[50].phy_dmg;
    }
    if (level >= 70) {
        baseAttributes.defense += levelUpData[70].defense;
        baseAttributes.max_health += levelUpData[70].max_health;
        baseAttributes.phy_dmg += levelUpData[70].phy_dmg;
    }
    if (level >= 90) {
        baseAttributes.defense += levelUpData[90].defense;
        baseAttributes.max_health += levelUpData[90].max_health;
        baseAttributes.phy_dmg += levelUpData[90].phy_dmg;
    }
    if (level >= 100) {
        // Adicione a lógica que desejar para o nível 100
    }

    return baseAttributes;
}



// // Função para calcular os atributos do herói com base no nível
// function calculateHeroAttributes(hero, level, levelData) {
//     const baseAttributes = {
//         accuracy: hero['accuracy*base'] || 0,
//         defense: hero['defense*base'] || 0,
//         max_health: hero['max_health*base'] || 0,
//         phy_dmg: hero['phy_dmg*base'] || 0,
//         resistance: hero['resistance*base'] || 0
//     };

//     // Aplica as alterações de acordo com levelData
//     Object.keys(levelData).forEach(levelThreshold => {
//         if (level >= levelThreshold) {
//             baseAttributes.defense += levelData[levelThreshold].defense || 0;
//             baseAttributes.max_health += levelData[levelThreshold].max_health || 0;
//             baseAttributes.phy_dmg += levelData[levelThreshold].phy_dmg || 0;
//         }
//     });

//     return baseAttributes;
// }

// Exibir atributos calculados
function displayCalculatedAttributes(hero, level) {
    const attributes = calculateHeroAttributes(hero, level);

    const accuracy = hero['accuracy*base'];
    const atk_speed = hero['atk_speed*bpct'];
    const crit_bonus = hero['crit_bonus*bpct'];
    const crit_chance = hero['crit_chance*bpct'];
    const defense = hero['defense*base'];
    const max_health = hero['max_health*base'];
    const phy_dmg = hero['phy_dmg*base'];
    const resistance = hero['resistance*base'];
    
    const attributesContainer = $('#hero-atributo');
    attributesContainer.html(`
        <h6>Atributos Calculados (Nível ${level}):</h6>
        <p><strong>Precisão:</strong> ${accuracy}</p>
        <p><strong>Velocidade de Ataque:</strong> ${atk_speed}</p>
        <p><strong>Bônus Crítico:</strong> ${crit_bonus}</p>
        <p><strong>Chance Crítica:</strong> ${crit_chance}</p>
        <p><strong>Defesa:</strong> ${defense}</p>
        <p><strong>Saúde Máxima:</strong> ${max_health}</p>
        <p><strong>Dano Físico:</strong> ${phy_dmg}</p>
        <p><strong>Resistência:</strong> ${resistance}</p>
    `);
}

// // Função para exibir os atributos calculados
// function displayCalculatedAttributes(hero, level, levelData) {
//     const attributes = calculateHeroAttributes(hero, level, levelData); // Passa os dados de level

//     $('#health-total').text(attributes.max_health.toFixed(2));
//     $('#defense-total').text(attributes.defense.toFixed(2));
//     $('#attack-total').text(attributes.phy_dmg.toFixed(2));
//     $('#accuracy-total').text(attributes.accuracy.toFixed(2));
//     $('#crit-chance-total').text((hero['crit_chance*bpct'] * 100).toFixed(2) + '%');
//     $('#crit-damage-total').text((hero['crit_bonus*bpct'] * 100).toFixed(2) + '%');
//     $('#resistance-total').text(attributes.resistance.toFixed(2));
//     $('#haste-total').text('0'); // Placeholder
// }

// Função para exibir os dados do herói
function displayHero(hero) {
    console.log(hero);
    
    const heroContainer = $('#hero-container');
    const {
        heroname, ability_replace, show_title, rarity, element, orientation, skill, atk_type,
        attack_frequency, captain_slot, captain_slot_path} = hero;

    const accuracy = hero['accuracy*base'];
    const atk_speed = hero['atk_speed*bpct'];
    const crit_bonus = hero['crit_bonus*bpct'];
    const crit_chance = hero['crit_chance*bpct'];
    const defense = hero['defense*base'];
    const max_health = hero['max_health*base'];
    const phy_dmg = hero['phy_dmg*base'];
    const resistance = hero['resistance*base'];
    const mastery = hero['mastery*base'];

    const captainIconBase = captain_slot_path ? captain_slot_path.split('/').slice(-1)[0] : null; // Obtém o nome do arquivo, ex: icon_duizhangji_2.png
    const heroImagePath = `${hero.heroIdPath.split('/').pop()}`;
    
    heroContainer.html(`
        <div class="card mb-4">
            <img src="${heroImagePath}" id="img-head" class="card-img-top" alt="${heroname}">
            <div class="card-body">
                <h5 class="card-title">${heroname || 'Hero'}</h5>
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
                ${captainIconBase ? `<p><strong>Slot do Capitão:</strong> ${captain_slot}</p><img src="${captainIconBase}" alt="Ícone do Slot do Capitão" class="skill-icon" />` : ''}

                <div class="form-group">
                    <label for="hero-level">Escolha o nível:</label>
                    <input type="range" id="hero-level" min="1" max="100" value="1" class="form-control-range">
                    <span id="level-display">Nível: 1</span>
                </div>

                <h6>Informações Base:</h6>
                <ul id="hero-atributo">
                    <li><strong>Precisão:</strong> ${accuracy}</li>
                    <li><strong>Velocidade de Ataque:</strong> ${atk_speed}</li>
                    <li><strong>Defesa:</strong> ${defense}</li>
                    <li><strong>Saúde Máxima:</strong> ${max_health}</li>
                    <li><strong>Dano Físico:</strong> ${phy_dmg}</li>
                    <li><strong>Resistência:</strong> ${resistance}</li>
                    <li><strong>Bonus Crítico:</strong> ${crit_bonus}</li>
                    <li><strong>Chance Crítica:</strong> ${crit_chance}</li>
                    <li><strong>Maestria:</strong> ${mastery}</li>
                </ul>

                <h6>Habilidades:</h6>
                <ul>
                    ${Object.values(skill).map(s => `
                        <li>
                            <strong>${s.skillname}</strong>: ${s.skilldesc}
                            ${[1, 2, 3].map(i => `
                                <img src="icon_skill_${hero.heroId}_${i}.png" alt="${s.skillname} - nível ${i}" class="skill-icon" />
                            `).join('')}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `);
    // Evento para alterar o nível com o controle deslizante
    $('#hero-level').on('input', function() {
        const level = parseInt($(this).val(), 10);
        $('#level-display').text(`Nível: ${level}`);
        const selectedHeroId = $('#hero-select').val();
        if (selectedHeroId) {
            displayCalculatedAttributes(hero, level, window.levelData); // Recarrega o herói e exibe atributos atualizados
        }
    });
    

    // Inicializa a exibição de atributos com o nível 1
    displayCalculatedAttributes(hero, 1, window.levelData);
}


// Inicializa o aplicativo ao carregar
async function initializeApp() {
    const { heroData, levelData } = await fetchHero(); // Chamando a função de fetch
    window.levelData = levelData; // Armazena os dados de nível globalmente
    window.heroData = heroData; // Armazena os dados de heróis globalmente
}

// Evento para quando um herói é selecionado
$('#hero-select').on('change', function() {
    const selectedHeroId = $(this).val();
    if (selectedHeroId) {
        fetchAndDisplayHero(selectedHeroId); // Atualiza a exibição ao trocar de herói
    }
});


// Chamando a inicialização do aplicativo
$(document).ready(function() {
    initializeApp();
});
