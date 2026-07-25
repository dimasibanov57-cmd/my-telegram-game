// ========== ПЕРЕМЕННЫЕ ==========
let coins = parseInt(localStorage.getItem('coins')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let energy = parseInt(localStorage.getItem('energy')) || 500;
const MAX_ENERGY = 500;

let level = parseInt(localStorage.getItem('level')) || 1;
let passiveIncome = parseInt(localStorage.getItem('passiveIncome')) || 0;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;

let luckActive = false;
let luckTimer = null;

// ========== ЭЛЕМЕНТЫ UI ==========
const coinCounter = document.getElementById('coinCounter');
const energyCounter = document.getElementById('energyCounter');
const energyFill = document.getElementById('energyFill');
const tapPowerDisplay = document.getElementById('tapPowerDisplay');
const incomeDisplay = document.getElementById('incomeDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const coinImage = document.getElementById('coinImage');

// ========== ВКЛАДКИ ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + tabName).classList.add('active');
    });
});

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    coinCounter.textContent = Math.floor(coins);
    energyCounter.textContent = `${Math.floor(energy)}/${MAX_ENERGY}`;
    energyFill.style.width = (energy / MAX_ENERGY * 100) + '%';
    tapPowerDisplay.textContent = clickPower;
    incomeDisplay.textContent = passiveIncome;
    levelDisplay.textContent = level;
}

// ========== ТАП ==========
function tap() {
    if (energy <= 0) {
        showFloatingText('❌ Нет энергии!');
        return;
    }
    energy--;
    let earned = clickPower;
    if (luckActive) earned *= 2;
    coins += earned;
    totalClicks++;
    
    if (navigator.vibrate) navigator.vibrate(10);
    showFloatingText('+' + earned);
    
    // Проверка на повышение уровня
    checkLevelUp();
    
    saveGame();
    updateUI();
}

// ========== ПОВЫШЕНИЕ УРОВНЯ ==========
function checkLevelUp() {
    const needed = level * 100;
    if (totalClicks >= needed) {
        level++;
        totalClicks = 0;
        clickPower += 2;
        showFloatingText('🎉 УРОВЕНЬ ' + level + '!');
        // Бонус за уровень
        coins += level * 50;
        updateUI();
    }
}

// ========== ПАРЯЩИЙ ТЕКСТ ==========
function showFloatingText(text) {
    const container = document.getElementById('floatingTexts');
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (25 + Math.random() * 50) + '%';
    el.style.top = (25 + Math.random() * 40) + '%';
    
    // Цветной текст
    if (text.includes('🎉')) el.style.color = '#ff6bff';
    else if (text.includes('✅')) el.style.color = '#6fdf8a';
    else if (text.includes('⚡')) el.style.color = '#7cf9ff';
    else if (text.includes('❌')) el.style.color = '#ff6b6b';
    else el.style.color = '#ffd700';
    
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ========== МАГАЗИН (УЛУЧШЕНИЯ) ==========
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

// ========== МАГАЗИН (БИЗНЕС) ==========
function buyBusiness(cost, income) {
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    passiveIncome += income;
    saveGame();
    updateUI();
    showFloatingText('🏢 +' + income + '/сек!');
}

// ========== МАГАЗИН (ЭНЕРГИЯ) ==========
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

// ========== МАГАЗИН (УДАЧА) ==========
function buyLuck() {
    if (coins < 300) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    if (luckActive) {
        showFloatingText('⏳ Удача уже активна!');
        return;
    }
    coins -= 300;
    luckActive = true;
    showFloatingText('🍀 УДАЧА x2 НА 30 СЕК!');
    updateUI();
    
    if (luckTimer) clearTimeout(luckTimer);
    luckTimer = setTimeout(() => {
        luckActive = false;
        showFloatingText('⏰ Удача закончилась');
    }, 30000);
    saveGame();
}

// ========== ЕЖЕДНЕВНЫЙ БОНУС ==========
let lastBonusDate = localStorage.getItem('lastBonusDate') || '';

function claimDailyBonus() {
    const today = new Date().toDateString();
    if (lastBonusDate === today) {
        showFloatingText('⏳ Бонус уже получен!');
        document.getElementById('bonusTimer').textContent = '⏳ Завтра';
        return;
    }
    const bonus = 100 + level * 20;
    coins += bonus;
    lastBonusDate = today;
    localStorage.setItem('lastBonusDate', today);
    showFloatingText('🎁 +' + bonus + ' бонус!');
    document.getElementById('bonusTimer').textContent = '✅ Получен!';
    updateUI();
    saveGame();
}

// ========== ПАССИВНЫЙ ДОХОД ==========
setInterval(() => {
    if (passiveIncome > 0) {
        coins += passiveIncome;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ==========
setInterval(() => {
    if (energy < MAX_ENERGY) {
        energy += 0.5;
        if (energy > MAX_ENERGY) energy = MAX_ENERGY;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== СОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', Math.floor(coins));
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', Math.floor(energy));
    localStorage.setItem('level', level);
    localStorage.setItem('passiveIncome', passiveIncome);
    localStorage.setItem('totalClicks', totalClicks);
}

// ========== ЗАПУСК ==========
updateUI();
coinImage.addEventListener('click', tap);

// Восстановление бонусной кнопки
if (lastBonusDate === new Date().toDateString()) {
    document.getElementById('bonusTimer').textContent = '✅ Получен!';
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame();
});