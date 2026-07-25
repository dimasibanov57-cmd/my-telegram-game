// ========== ПЕРЕМЕННЫЕ ==========
let coins = parseInt(localStorage.getItem('coins')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let energy = parseInt(localStorage.getItem('energy')) || 500;
const MAX_ENERGY = 500;

// ========== ЭЛЕМЕНТЫ ==========
const coinCounter = document.getElementById('coinCounter');
const energyCounter = document.getElementById('energyCounter');
const energyFill = document.getElementById('energyFill');
const tapPowerDisplay = document.getElementById('tapPowerDisplay');
const coinImage = document.getElementById('coinImage');

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    coinCounter.textContent = coins;
    energyCounter.textContent = `${energy}/${MAX_ENERGY}`;
    energyFill.style.width = (energy / MAX_ENERGY * 100) + '%';
    tapPowerDisplay.textContent = clickPower;
}

// ========== ТАП ==========
function tap() {
    if (energy <= 0) {
        showFloatingText('❌ Нет энергии!');
        return;
    }
    energy--;
    coins += clickPower;
    if (navigator.vibrate) navigator.vibrate(10);
    showFloatingText('+' + clickPower);
    saveGame();
    updateUI();
}

// ========== ПАРЯЩИЙ ТЕКСТ ==========
function showFloatingText(text) {
    const container = document.getElementById('floatingTexts');
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (30 + Math.random() * 40) + '%';
    el.style.top = (30 + Math.random() * 30) + '%';
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ========== МАГАЗИН ==========
function buyUpgrade(cost, power) {
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    clickPower += power;
    saveGame();
    updateUI();
    showFloatingText('✅ +' + power + ' силы!');
}

function buyEnergy(cost) {
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    if (energy >= MAX_ENERGY) {
        showFloatingText('⚡ Уже полная');
        return;
    }
    coins -= cost;
    energy = MAX_ENERGY;
    saveGame();
    updateUI();
    showFloatingText('🔋 Заряжено!');
}

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ==========
setInterval(() => {
    if (energy < MAX_ENERGY) {
        energy++;
        updateUI();
        saveGame();
    }
}, 2000);

// ========== СОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', energy);
}

// ========== ЗАПУСК ==========
updateUI();
coinImage.addEventListener('click', tap);

// Сохраняем при сворачивании
document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame();
});