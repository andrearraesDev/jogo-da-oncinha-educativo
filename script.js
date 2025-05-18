// Game state
let gameState = {
    balance: 100,
    spinning: false,
    betAmount: 10,
    statistics: {
        totalPlays: 0,
        totalWins: 0,
        playerProfit: 0,
        houseProfit: 0
    },
    psychologicalState: {
        easyWinsRemaining: 5,
        inLossPhase: false,
        initialDeposit: 100
    },
    // Armazenar o resultado final para garantir consistência
    finalResult: null
};

// Animal configurations
const animals = [
    { icon: '🦓', name: 'Zebra', chance: 50, multiplier: 1.2 },
    { icon: '🐘', name: 'Elefante', chance: 10, multiplier: 1.5 },
    { icon: '🦜', name: 'Arara', chance: 6, multiplier: 3.0 },
    { icon: '🦫', name: 'Castor', chance: 4, multiplier: 5.0 },
    { icon: '🐆', name: 'Onça', chance: 2, multiplier: 9.0 }
];

// Game settings
let gameSettings = {
    guaranteeProfit: false,
    houseEdge: 0,
    psychologicalTricks: {
        enabled: true,
        easyWinsCount: 5,
        easyWinsBonus: 30,
        lossPhaseReduction: 15,
        enableNearMiss: true,
        enableWinSounds: true,
        showPhaseInfo: true
    }
};

// DOM elements
const spinBtn = document.getElementById('spinBtn');
const smallBetBtn = document.getElementById('smallBetBtn');
const configBtn = document.getElementById('configBtn');
const infoBtn = document.getElementById('infoBtn');
const resetBtn = document.getElementById('resetBtn');
const balanceEl = document.getElementById('balance');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const resultsLog = document.getElementById('resultsLog');
const totalPlaysEl = document.getElementById('totalPlays');
const totalWinsEl = document.getElementById('totalWins');
const playerProfitEl = document.getElementById('playerProfit');
const houseProfitEl = document.getElementById('houseProfit');
const psychInfoEl = document.getElementById('psychInfo');
const currentPhaseEl = document.getElementById('currentPhase');
const winSound = document.getElementById('winSound');
const nearMissSound = document.getElementById('nearMissSound');

// Modals
const configModal = new bootstrap.Modal(document.getElementById('configModal'));
const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
const winModal = new bootstrap.Modal(document.getElementById('winModal'));

// Initialize the game
function initGame() {
    // Garantir que as configurações psicológicas estejam ativadas por padrão
    gameSettings.psychologicalTricks.enabled = true;
    
    // Definir o número correto de jogadas fáceis iniciais
    gameState.psychologicalState.easyWinsRemaining = gameSettings.psychologicalTricks.easyWinsCount;
    
    // Definir o depósito inicial
    gameState.psychologicalState.initialDeposit = gameState.balance;
    
    // Atualizar a interface
    updateBalance();
    updateStatistics();
    updatePsychologicalInfo();
    
    // Mostrar configurações psicológicas se estiverem ativadas
    document.getElementById('psychSettings').style.display = gameSettings.psychologicalTricks.enabled ? 'block' : 'none';
    
    // Registrar início do jogo
    logResult('<span class="text-info">Jogo iniciado! Fase de jogadas fáceis ativada.</span>');
}

// Update balance display
function updateBalance() {
    balanceEl.textContent = gameState.balance.toFixed(2).replace('.', ',');
    
    // Check if player deposited more money (psychological trigger)
    if (gameSettings.psychologicalTricks.enabled && 
        gameState.balance > gameState.psychologicalState.initialDeposit) {
        gameState.psychologicalState.initialDeposit = gameState.balance;
        
        // After deposit, give some easy wins again
        if (gameState.psychologicalState.inLossPhase) {
            gameState.psychologicalState.easyWinsRemaining = Math.floor(gameSettings.psychologicalTricks.easyWinsCount / 2);
            gameState.psychologicalState.inLossPhase = false;
            logResult('<span class="text-info">Depósito detectado! Ativando fase de ganhos temporários...</span>');
            updatePsychologicalInfo();
        }
    }
}

// Update statistics display
function updateStatistics() {
    totalPlaysEl.textContent = gameState.statistics.totalPlays;
    totalWinsEl.textContent = gameState.statistics.totalWins;
    playerProfitEl.textContent = 'R$' + gameState.statistics.playerProfit.toFixed(2).replace('.', ',');
    houseProfitEl.textContent = 'R$' + gameState.statistics.houseProfit.toFixed(2).replace('.', ',');
}

// Update psychological info display
function updatePsychologicalInfo() {
    if (gameSettings.psychologicalTricks.enabled && gameSettings.psychologicalTricks.showPhaseInfo) {
        psychInfoEl.style.display = 'block';
        
        if (gameState.psychologicalState.easyWinsRemaining > 0) {
            currentPhaseEl.textContent = `Fase Inicial (${gameState.psychologicalState.easyWinsRemaining} jogadas fáceis restantes)`;
            currentPhaseEl.className = 'text-success';
        } else if (gameState.psychologicalState.inLossPhase) {
            currentPhaseEl.textContent = 'Fase de Perda Progressiva';
            currentPhaseEl.className = 'text-danger';
        } else {
            currentPhaseEl.textContent = 'Fase Normal';
            currentPhaseEl.className = '';
        }
    } else {
        psychInfoEl.style.display = 'none';
    }
}

// Log a result
function logResult(message) {
    const logEntry = document.createElement('div');
    logEntry.innerHTML = message;
    resultsLog.prepend(logEntry);
    
    // Keep only the 20 most recent entries
    if (resultsLog.children.length > 20) {
        resultsLog.removeChild(resultsLog.lastChild);
    }
}

// Get a random animal based on configured probabilities
function getRandomAnimal() {
    // Calculate base probability weight
    let totalWeight = animals.reduce((sum, animal) => sum + animal.chance, 0);
    let adjustedAnimals = animals.map(animal => ({...animal}));
    
    // Apply psychological adjustments if enabled
    if (gameSettings.psychologicalTricks.enabled) {
        // In easy wins phase, boost chances of winning
        if (gameState.psychologicalState.easyWinsRemaining > 0) {
            // Increase chances for higher value animals
            adjustedAnimals.forEach(animal => {
                if (animal.multiplier > 1.5) {
                    animal.chance += gameSettings.psychologicalTricks.easyWinsBonus;
                }
            });
        }
        // In loss phase, reduce chances of winning
        else if (gameState.psychologicalState.inLossPhase) {
            // Reduce chances for higher value animals
            adjustedAnimals.forEach(animal => {
                if (animal.multiplier > 1.5) {
                    animal.chance = Math.max(1, animal.chance - gameSettings.psychologicalTricks.lossPhaseReduction);
                }
            });
        }
    }
    
    // Recalculate total weight after adjustments
    totalWeight = adjustedAnimals.reduce((sum, animal) => sum + animal.chance, 0);
    
    // Select random animal based on weighted probability
    let random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    
    for (const animal of adjustedAnimals) {
        cumulativeWeight += animal.chance;
        if (random <= cumulativeWeight) {
            return animals.find(a => a.name === animal.name);
        }
    }
    
    // Fallback (should never reach here)
    return animals[0];
}

// Get three random animals for the slots
function getThreeRandomAnimals() {
    // Get three random animals
    const animal1 = getRandomAnimal();
    const animal2 = getRandomAnimal();
    const animal3 = getRandomAnimal();
    
    // Check if we should create a near miss (two matching animals)
    if (gameSettings.psychologicalTricks.enabled && 
        gameSettings.psychologicalTricks.enableNearMiss && 
        animal1.name !== animal2.name && 
        animal2.name !== animal3.name && 
        animal1.name !== animal3.name) {
        
        // 40% chance of creating a near miss if no natural match
        if (Math.random() < 0.4) {
            // Choose which two slots will match
            const matchSlot = Math.floor(Math.random() * 3);
            
            // Create the near miss
            const selectedAnimals = [animal1, animal2, animal3];
            
            if (matchSlot === 0) {
                selectedAnimals[2] = selectedAnimals[0]; // Make slots 1 and 3 match
            } else if (matchSlot === 1) {
                selectedAnimals[2] = selectedAnimals[1]; // Make slots 2 and 3 match
            } else {
                selectedAnimals[1] = selectedAnimals[0]; // Make slots 1 and 2 match
            }
            
            // Play near miss sound if enabled
            if (gameSettings.psychologicalTricks.enableWinSounds) {
                nearMissSound.currentTime = 0;
                nearMissSound.play().catch(e => console.log("Erro ao reproduzir som:", e));
            }
            
            // Add visual effect
            const slots = [slot1, slot2, slot3];
            slots.forEach(slot => slot.classList.add('near-miss'));
            setTimeout(() => {
                slots.forEach(slot => slot.classList.remove('near-miss'));
            }, 500);
            
            return selectedAnimals;
        }
    }
    
    return [animal1, animal2, animal3];
}

// Check if game result should be rigged based on house edge setting
function shouldRigResult(selectedAnimals) {
    if (!gameSettings.guaranteeProfit) return false;
    
    // Check if this would be a win
    const isWin = selectedAnimals[0].name === selectedAnimals[1].name && 
                  selectedAnimals[1].name === selectedAnimals[2].name;
    
    if (!isWin) return false;
    
    // Calculate expected payout
    const payoutMultiplier = selectedAnimals[0].multiplier;
    const payout = gameState.betAmount * payoutMultiplier;
    
    // Calculate current house edge from all plays so far
    const currentHouseProfit = gameState.statistics.houseProfit;
    const totalBets = gameState.statistics.totalPlays * 10; // Assuming average bet is 10
    
    // Calculate what house edge would be after this win
    const newHouseProfit = currentHouseProfit - payout + gameState.betAmount;
    const newTotalBets = totalBets + gameState.betAmount;
    const newHouseEdge = (newHouseProfit / newTotalBets) * 100;
    
    // If new house edge would be lower than desired, consider rigging
    if (newHouseEdge < gameSettings.houseEdge) {
        // Probability of rigging increases as the difference increases
        const rigProbability = Math.min(0.95, (gameSettings.houseEdge - newHouseEdge) / 10);
        return Math.random() < rigProbability;
    }
    
    return false;
}

// Animate slot machine spinning
function animateSlots(duration = 2000) {
    return new Promise(resolve => {
        const slots = [slot1, slot2, slot3];
        const animalIcons = animals.map(a => a.icon);
        
        // Add rolling class to slots
        slots.forEach(slot => {
            slot.classList.add('slot-rolling');
        });
        
        // Fast animation of changing animals
        const animationInterval = setInterval(() => {
            slots.forEach(slot => {
                const randomAnimal = animalIcons[Math.floor(Math.random() * animalIcons.length)];
                slot.querySelector('.animal-icon').textContent = randomAnimal;
            });
        }, 100);
        
        // Stop animation after duration with staggered timing
        setTimeout(() => {
            clearInterval(animationInterval);
            
            // Definir os emojis finais antes de parar a animação
            if (gameState.finalResult) {
                slot1.querySelector('.animal-icon').textContent = gameState.finalResult[0].icon;
                slot2.querySelector('.animal-icon').textContent = gameState.finalResult[1].icon;
                slot3.querySelector('.animal-icon').textContent = gameState.finalResult[2].icon;
            }
            
            // Parar a animação com efeito escalonado
            slots.forEach((slot, index) => {
                setTimeout(() => {
                    slot.classList.remove('slot-rolling');
                }, index * 300);
            });
            
            // Resolve after all slots have stopped
            setTimeout(resolve, 900);
        }, duration);
    });
}

// Process a spin result
function processSpinResult(selectedAnimals) {
    // Check for win (all three animals are the same)
    const isWin = selectedAnimals[0].name === selectedAnimals[1].name && 
                  selectedAnimals[1].name === selectedAnimals[2].name;
    
    // Update psychological state
    if (gameSettings.psychologicalTricks.enabled) {
        if (gameState.psychologicalState.easyWinsRemaining > 0) {
            gameState.psychologicalState.easyWinsRemaining--;
            logResult(`<span class="text-info">Jogadas fáceis restantes: ${gameState.psychologicalState.easyWinsRemaining}</span>`);
            
            if (gameState.psychologicalState.easyWinsRemaining === 0) {
                gameState.psychologicalState.inLossPhase = true;
                logResult('<span class="text-warning">Fase de perda progressiva ativada</span>');
            }
        }
    }
    
    // Update UI with selected animals
    slot1.querySelector('.animal-icon').textContent = selectedAnimals[0].icon;
    slot2.querySelector('.animal-icon').textContent = selectedAnimals[1].icon;
    slot3.querySelector('.animal-icon').textContent = selectedAnimals[2].icon;
    
    // Update statistics
    gameState.statistics.totalPlays++;
    gameState.statistics.houseProfit += gameState.betAmount;
    
    // Process win or loss
    if (isWin) {
        const multiplier = selectedAnimals[0].multiplier;
        const winAmount = gameState.betAmount * multiplier;
        
        // Update game state
        gameState.balance += winAmount;
        gameState.statistics.totalWins++;
        
        // O lucro do jogador é o ganho total menos a aposta
        const profit = winAmount - gameState.betAmount;
        gameState.statistics.playerProfit += profit;
        
        // O lucro da casa é reduzido pelo valor do prêmio, mas já foi incrementado pela aposta
        gameState.statistics.houseProfit -= winAmount;
        
        // Log result
        logResult(`<span class="text-success">Ganhou R$${winAmount.toFixed(2)} com ${selectedAnimals[0].icon} ${selectedAnimals[0].name} (${multiplier}x)</span>`);
        
        // Show win modal
        document.getElementById('winAmount').textContent = 'R$' + winAmount.toFixed(2).replace('.', ',');
        document.getElementById('winAnimal').textContent = selectedAnimals[0].icon;
        setTimeout(() => winModal.show(), 500);
        
        // Play win sound if enabled
        if (gameSettings.psychologicalTricks.enabled && gameSettings.psychologicalTricks.enableWinSounds) {
            winSound.currentTime = 0;
            winSound.play().catch(e => console.log("Erro ao reproduzir som:", e));
        }
        
        // Animate winning slots
        slot1.classList.add('win-animation');
        slot2.classList.add('win-animation');
        slot3.classList.add('win-animation');
        setTimeout(() => {
            slot1.classList.remove('win-animation');
            slot2.classList.remove('win-animation');
            slot3.classList.remove('win-animation');
        }, 3000);
    } else {
        // Atualizar o lucro do jogador (perda)
        gameState.statistics.playerProfit -= gameState.betAmount;
        
        // Log loss
        logResult(`<span class="text-danger">Perdeu R$${gameState.betAmount.toFixed(2)}</span>`);
    }
    
    // Update UI
    updateBalance();
    updateStatistics();
    updatePsychologicalInfo();
}

// Spin the slot machine
async function spin() {
    if (gameState.spinning) return;
    
    // Check if player has enough balance
    if (gameState.balance < gameState.betAmount) {
        alert('Saldo insuficiente!');
        return;
    }
    
    // Update game state
    gameState.spinning = true;
    gameState.balance -= gameState.betAmount;
    updateBalance();
    
    // Disable buttons during spin
    spinBtn.disabled = true;
    smallBetBtn.disabled = true;
    
    // Get random animals for the slots
    let selectedAnimals = getThreeRandomAnimals();
    
    // Check if result should be rigged based on house edge setting
    if (shouldRigResult(selectedAnimals)) {
        // Rig the result to ensure a loss
        selectedAnimals = [getRandomAnimal(), getRandomAnimal(), getRandomAnimal()];
        // Make sure it's not a win by changing one animal if needed
        if (selectedAnimals[0].name === selectedAnimals[1].name && 
            selectedAnimals[1].name === selectedAnimals[2].name) {
            const differentAnimal = animals.find(a => a.name !== selectedAnimals[0].name);
            selectedAnimals[Math.floor(Math.random() * 3)] = differentAnimal;
        }
    }
    
    // Armazenar o resultado final para garantir consistência visual
    gameState.finalResult = selectedAnimals;
    
    // Animate the slots
    await animateSlots();
    
    // Process the result
    processSpinResult(selectedAnimals);
    
    // Reset spinning state
    gameState.spinning = false;
    spinBtn.disabled = false;
    smallBetBtn.disabled = false;
}

// Save configuration from modal
function saveConfiguration() {
    // Update animal chances and multipliers
    animals[0].chance = parseFloat(document.getElementById('preguicaChance').value) || 50;
    animals[0].multiplier = parseFloat(document.getElementById('preguicaMultiplier').value) || 1.2;
    
    animals[1].chance = parseFloat(document.getElementById('elefanteChance').value) || 10;
    animals[1].multiplier = parseFloat(document.getElementById('elefanteMultiplier').value) || 1.5;
    
    animals[2].chance = parseFloat(document.getElementById('araraChance').value) || 6;
    animals[2].multiplier = parseFloat(document.getElementById('araraMultiplier').value) || 3.0;
    
    animals[3].chance = parseFloat(document.getElementById('capivaraChance').value) || 4;
    animals[3].multiplier = parseFloat(document.getElementById('capivaraMultiplier').value) || 5.0;
    
    animals[4].chance = parseFloat(document.getElementById('oncaChance').value) || 2;
    animals[4].multiplier = parseFloat(document.getElementById('oncaMultiplier').value) || 9.0;
    
    // Update game settings
    gameSettings.guaranteeProfit = document.getElementById('guaranteeProfit').checked;
    gameSettings.houseEdge = parseFloat(document.getElementById('houseEdge').value) || 0;
    
    // Update psychological settings
    gameSettings.psychologicalTricks.enabled = document.getElementById('enablePsychologicalTricks').checked;
    gameSettings.psychologicalTricks.easyWinsCount = parseInt(document.getElementById('easyWinsCount').value) || 5;
    gameSettings.psychologicalTricks.easyWinsBonus = parseInt(document.getElementById('easyWinsBonus').value) || 30;
    gameSettings.psychologicalTricks.lossPhaseReduction = parseInt(document.getElementById('lossPhaseReduction').value) || 15;
    gameSettings.psychologicalTricks.enableNearMiss = document.getElementById('enableNearMiss').checked;
    gameSettings.psychologicalTricks.enableWinSounds = document.getElementById('enableWinSounds').checked;
    gameSettings.psychologicalTricks.showPhaseInfo = document.getElementById('showPhaseInfo').checked;
    
    // Reset psychological state
    if (gameSettings.psychologicalTricks.enabled) {
        gameState.psychologicalState.easyWinsRemaining = gameSettings.psychologicalTricks.easyWinsCount;
        gameState.psychologicalState.inLossPhase = false;
        logResult('<span class="text-info">Configurações atualizadas! Fase de jogadas fáceis reiniciada.</span>');
    }
    
    // Calculate and display expected return
    const calculateExpectedReturn = () => {
        // Calculate total probability weight
        const totalWeight = animals.reduce((sum, animal) => sum + animal.chance, 0);
        
        // Calculate expected value
        let expectedReturn = 0;
        for (const animal of animals) {
            // Probability of getting this animal three times in a row
            const probability = Math.pow(animal.chance / totalWeight, 3);
            // Expected value contribution
            expectedReturn += probability * animal.multiplier;
        }
        
        return expectedReturn;
    };
    
    const expectedReturn = calculateExpectedReturn();
    const houseEdge = (1 - expectedReturn) * 100;
    
    logResult(`<span class="text-info">Configuração atualizada! Retorno esperado: ${(expectedReturn * 100).toFixed(2)}%, Vantagem da casa: ${houseEdge.toFixed(2)}%</span>`);
    
    // Update UI
    updatePsychologicalInfo();
    document.getElementById('psychSettings').style.display = gameSettings.psychologicalTricks.enabled ? 'block' : 'none';
    
    configModal.hide();
}

// Reset the game
function resetGame() {
    if (confirm('Tem certeza que deseja reiniciar o jogo? Seu saldo e estatísticas serão redefinidos.')) {
        gameState = {
            balance: 100,
            spinning: false,
            betAmount: 10,
            statistics: {
                totalPlays: 0,
                totalWins: 0,
                playerProfit: 0,
                houseProfit: 0
            },
            psychologicalState: {
                easyWinsRemaining: gameSettings.psychologicalTricks.enabled ? 
                                 gameSettings.psychologicalTricks.easyWinsCount : 0,
                inLossPhase: false,
                initialDeposit: 100
            },
            finalResult: null
        };
        
        updateBalance();
        updateStatistics();
        updatePsychologicalInfo();
        resultsLog.innerHTML = '';
        logResult('<span class="text-info">Jogo reiniciado! Fase de jogadas fáceis ativada.</span>');
    }
}

// Event listeners
spinBtn.addEventListener('click', () => {
    gameState.betAmount = 10;
    spin();
});

smallBetBtn.addEventListener('click', () => {
    gameState.betAmount = 5;
    spin();
});

configBtn.addEventListener('click', () => {
    configModal.show();
});

infoBtn.addEventListener('click', () => {
    infoModal.show();
});

resetBtn.addEventListener('click', resetGame);

document.getElementById('saveConfigBtn').addEventListener('click', saveConfiguration);

// Initialize the game
document.addEventListener('DOMContentLoaded', initGame);

// Verificar orientação inicial
if (window.innerWidth < window.innerHeight) {
    document.querySelectorAll('.slot').forEach(slot => {
        slot.style.fontSize = '36px';
    });
    document.querySelectorAll('.animal-icon').forEach(icon => {
        icon.style.fontSize = '36px';
    });
}
