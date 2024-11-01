// Função para buscar os dados do herói
async function fetchHero() {
    try {
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error('Erro ao buscar os dados do herói.');
        const heroData = await response.json();
        
        // Busca os dados do heroLevelBase
        const levelBaseResponse = await fetch('/api/heroLevelBase');
        if (!levelBaseResponse.ok) throw new Error('Erro ao buscar os dados do heroLevelBase.');
        const levelBaseData = await levelBaseResponse.json();

        // Exibir os dados no console para depuração
        console.log('Hero Data:', heroData);
        console.log('Level Base Data:', levelBaseData);

        displayHero(heroData, levelBaseData);
    } catch (error) {
        console.error(error);
        document.getElementById('hero-info').innerText = 'Erro ao carregar os dados.';
    }
}

// Função para exibir os dados do herói
function displayHero(heroData, levelBaseData) {
    const heroContainer = document.getElementById('hero-container');
    heroContainer.innerHTML = ''; // Limpa o container antes de adicionar novos heróis
  
    heroData.forEach(hero => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('hero-card', 'col-md-4'); // Coloca uma classe Bootstrap para o layout

        // Extraindo os dados necessários do objeto hero
        const { heroname, ability_replace, accuracy_base, atk_speed_bpct, atk_type, attack_frequency, 
                captain_enable_combat_types, captain_slot, crit_bonus_bpct, crit_chance_bpct, 
                defense_base, max_health_base, phy_dmg_base, resistance_base, show_title, rarity, 
                element, orientation, skill } = hero;

        // Criando a estrutura HTML
        heroDiv.innerHTML = `
            <div class="card mb-4">
                <img src="hero/${hero.heroIdPath.split('/').pop()}" class="card-img-top" alt="${heroname}">
                <div class="card-body">
                    <h5 class="card-title">${heroname || 'Hero'}</h5>
                    <p><strong>Título:</strong> ${show_title}</p>
                    <p><strong>Raridade:</strong> ${rarity}</p>
                    <p><strong>Elemento:</strong> ${element}</p>
                    <p><strong>Orientação:</strong> ${orientation}</p>
                    <p><strong>Habilidade Substituta:</strong> ${ability_replace}</p>
                    <p><strong>Precisão Base:</strong> ${accuracy_base}</p>
                    <p><strong>Velocidade de Ataque BPCT:</strong> ${atk_speed_bpct}</p>
                    <p><strong>Tipo de Ataque:</strong> ${atk_type}</p>
                    <p><strong>Frequência de Ataque:</strong> ${attack_frequency}</p>
                    <p><strong>Habilidade do Capitão:</strong> ${captain_slot}</p>
                    <p><strong>Defesa Base:</strong> ${defense_base}</p>
                    <p><strong>Saúde Máxima Base:</strong> ${max_health_base}</p>
                    <p><strong>Dano Físico Base:</strong> ${phy_dmg_base}</p>
                    <p><strong>Resistência Base:</strong> ${resistance_base}</p>
                    <p><strong>Bônus Crítico BPCT:</strong> ${crit_bonus_bpct}</p>
                    <p><strong>Chance Crítica BPCT:</strong> ${crit_chance_bpct}</p>
                    <p><strong>Capacidade de Combate do Capitão:</strong> ${captain_enable_combat_types}</p>
                    <h6>Habilidades:</h6>
                    <ul>
                        ${Object.values(skill).map(s => {
                            const skillId = s.skillid; // ID da habilidade
                            return `
                                <li>
                                    <strong>${s.skillname}</strong>: ${s.skilldesc}
                                    ${[1, 2, 3].map(i => `
                                        <img src="hero/icon_skill_${skillId}_${i}.png" alt="${s.skillname} - nível ${i}" class="skill-icon" />
                                    `).join('')}
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
  
        heroContainer.appendChild(heroDiv);
    });
}

// Chama a função para buscar os dados ao carregar a página
window.onload = fetchHero;
