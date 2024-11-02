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
        populateHeroSelect(heroData);
        return levelData; // Retorne os dados de nível para uso posterior
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
async function fetchAndDisplayHero(heroId) {
    try {
        const heroIdNum = parseInt(heroId, 10);
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error('Erro ao buscar os dados do herói.');
        const heroData = await response.json();

        const selectedHero = heroData.find(hero => hero.heroId === heroIdNum);
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
function calculateHeroAttributes(hero, level, levelData) {
    const baseAttributes = {
        accuracy: hero['accuracy*base'] || 0,
        defense: hero['defense*base'] || 0,
        max_health: hero['max_health*base'] || 0,
        phy_dmg: hero['phy_dmg*base'] || 0,
        resistance: hero['resistance*base'] || 0
    };

    // Aplica as alterações de acordo com levelData
    Object.keys(levelData).forEach(levelThreshold => {
        if (level >= levelThreshold) {
            baseAttributes.defense += levelData[levelThreshold].defense || 0;
            baseAttributes.max_health += levelData[levelThreshold].max_health || 0;
            baseAttributes.phy_dmg += levelData[levelThreshold].phy_dmg || 0;
        }
    });

    return baseAttributes;
}

// Função para exibir os atributos calculados
function displayCalculatedAttributes(hero, level, levelData) {
    const attributes = calculateHeroAttributes(hero, level, levelData); // Passa os dados de level

    $('#health-total').text(attributes.max_health.toFixed(2));
    $('#defense-total').text(attributes.defense.toFixed(2));
    $('#attack-total').text(attributes.phy_dmg.toFixed(2));
    $('#accuracy-total').text(attributes.accuracy.toFixed(2));
    $('#crit-chance-total').text((hero['crit_chance*bpct'] * 100).toFixed(2) + '%');
    $('#crit-damage-total').text((hero['crit_bonus*bpct'] * 100).toFixed(2) + '%');
    $('#resistance-total').text(attributes.resistance.toFixed(2));
    $('#haste-total').text('0'); // Placeholder
}

// Função para exibir os dados do herói
function displayHero(hero) {
    const heroContainer = $('#hero-container');
    const {
        heroname, ability_replace, accuracy_base, atk_speed_bpct,
        defense_base, max_health_base, phy_dmg_base, resistance_base,
        show_title, rarity, element, orientation, skill, atk_type,
        attack_frequency, captain_slot, captain_slot_path, mastery_base
    } = hero;

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
                <ul>
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
}

// // Evento para alterar o nível com o controle deslizante
// $('#hero-level').on('input', function() {
//     const level = parseInt($(this).val(), 10);
//     $('#level-display').text(`Nível: ${level}`);
//     const selectedHeroId = $('#hero-select').val();
//     if (selectedHeroId) {
//         fetchAndDisplayHero(selectedHeroId); // Recarrega o herói selecionado
//     }
// });

// Evento para alterar o nível com o controle deslizante
$('#hero-level').on('input', function() {
    const level = parseInt($(this).val(), 10);
    $('#level-display').text(`Nível: ${level}`);
    const selectedHeroId = $('#hero-select').val();
    if (selectedHeroId) {
        fetchAndDisplayHero(selectedHeroId); // Recarrega o herói e exibe atributos atualizados
    }
});

// Evento para quando um herói é selecionado
$('#hero-select').on('change', function() {
    const selectedHeroId = $(this).val();
    if (selectedHeroId) {
        fetchAndDisplayHero(selectedHeroId);
    }
});

// Inicializa o aplicativo ao carregar
async function initializeApp() {
    const levelData = await fetchHero(); // Chamando a função de fetch
    window.levelData = levelData; // Armazena os dados de nível globalmente
}

// Chamando a inicialização do aplicativo
$(document).ready(function() {
    initializeApp();
});
