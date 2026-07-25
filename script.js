// ========== ОСНОВНЫЕ ПЕРЕМЕННЫЕ ==========
let coins = parseFloat(localStorage.getItem('coins')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let energy = parseFloat(localStorage.getItem('energy')) || 500;
let maxEnergy = parseFloat(localStorage.getItem('maxEnergy')) || 500;
let level = parseInt(localStorage.getItem('level')) || 1;
let passiveIncome = parseFloat(localStorage.getItem('passiveIncome')) || 0;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let prestige = parseInt(localStorage.getItem('prestige')) || 0;
let regenSpeed = parseFloat(localStorage.getItem('regenSpeed')) || 1;
let offshore = parseInt(localStorage.getItem('offshore')) || 0;
let luckActive = false;
let luckTimer = null;

// ========== УЛУЧШЕНИЯ (10 УРОВНЕЙ) ==========
const upgrades = [
    { level: 0, cost: 50, power: 1, name: 'Улучшить тап' },
    { level: 0, cost: 200, power: 5, name: 'Мега-тап' },
    { level: 0, cost: 1000, power: 20, name: 'Ультра-тап' },
    { level: 0, cost: 10000, power: 100, name: 'Легендарный тап' },
    { level: 0, cost: 100000, power: 500, name: 'Мифический тап' },
    { level: 0, cost: 1000000, power: 2500, name: 'Божественный тап' },
    { level: 0, cost: 10000000, power: 15000, name: 'Космический тап' },
    { level: 0, cost: 100000000, power: 100000, name: 'Омега-тап' },
    { level: 0, cost: 500000000, power: 500000, name: 'Бесконечный тап' },
    { level: 0, cost: 1000000000, power: 2000000, name: 'УЛЬТИМАТУМ' }
];

// ========== БИЗНЕСЫ (10 УРОВНЕЙ) ==========
const businesses = [
    { level: 0, cost: 500, income: 10, name: 'Ларёк' },
    { level: 0, cost: 2000, income: 50, name: 'Магазин' },
    { level: 0, cost: 10000, income: 300, name: 'Супермаркет' },
    { level: 0, cost: 50000, income: 1500, name: 'Завод' },
    { level: 0, cost: 200000, income: 8000, name: 'Логистика' },
    { level: 0, cost: 1000000, income: 50000, name: 'Стройка' },
    { level: 0, cost: 5000000, income: 300000, name: 'Нефть' },
    { level: 0, cost: 25000000, income: 2000000, name: 'Космос' },
    { level: 0, cost: 100000000, income: 15000000, name: 'Банк' },
    { level: 0, cost: 500000000, income: 100000000, name: 'Корпорация' }
];

// Загружаем уровни улучшений
for (let i = 0; i < upgrades.length; i++) {
    let saved = localStorage.getItem('upgrade_' + i);
    if (saved !== null) {
        upgrades[i].level = parseInt(saved) || 0;
    }
}

// Загружаем уровни бизнесов
for (let i = 0; i < businesses.length; i++) {
    let saved = localStorage.getItem('business_' + i);
    if (saved !== null) {
        businesses[i].level = parseInt(saved) || 0;
        passiveIncome += businesses[i].level * businesses[i].income;
    }
}

// ========== ЭЛЕМЕНТЫ UI ==========
const coinCounter = document.getElementById('coinCounter');
const energyCounter = document.getElementById('energyCounter');
const energyFill = document.getElementById('energyFill');
const tapPowerDisplay = document.getElementById('tapPowerDisplay');
const incomeDisplay = document.getElementById('incomeDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const prestigeDisplay = document.getElementById('prestigeDisplay');
const maxEnergyDisplay = document.getElementById('maxEnergyDisplay');
const regenSpeedDisplay = document.getElementById('regenSpeedDisplay');
const coinImage = document.getElementById('coinImage');

// ========== ВКЛАДКИ ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        let panel = document.getElementById('tab-' + tabName);
        if (panel) panel.classList.add('active');
    });
});

// ========== ФОРМАТИРОВАНИЕ ЧИСЕЛ ==========
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num);
}

// ========== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ==========
function updateUI() {
    coinCounter.textContent = formatNumber(coins);
    energyCounter.textContent = Math.floor(energy) + '/' + Math.floor(maxEnergy);
    energyFill.style.width = (energy / maxEnergy * 100) + '%';
    tapPowerDisplay.textContent = formatNumber(clickPower);
    incomeDisplay.textContent = formatNumber(passiveIncome);
    levelDisplay.textContent = level;
    prestigeDisplay.textContent = prestige;
    if (maxEnergyDisplay) maxEnergyDisplay.textContent = Math.floor(maxEnergy);
    if (regenSpeedDisplay) regenSpeedDisplay.textContent = regenSpeed + '/сек';

    // Обновляем цены улучшений
    for (let i = 0; i < upgrades.length; i++) {
        const costEl = document.getElementById('upgradeCost' + i);
        if (costEl) {
            const cost = Math.floor(upgrades[i].cost * (1 + upgrades[i].level * 0.5));
            costEl.textContent = formatNumber(cost) + ' 💵';
        }
    }

    // Обновляем цены бизнесов
    for (let i = 0; i < businesses.length; i++) {
        const costEl = document.getElementById('businessCost' + i);
        if (costEl) {
            const cost = Math.floor(businesses[i].cost * (1 + businesses[i].level * 0.5));
            costEl.textContent = formatNumber(cost) + ' 💵';
        }
    }

    // Энергия
    const energyCost = Math.floor(50 + level * 5);
    let ecd = document.getElementById('energyCostDisplay');
    if (ecd) ecd.textContent = formatNumber(energyCost) + ' 💵';

    const maxEnergyCost = Math.floor(100 + (maxEnergy - 500) * 0.5);
    let mecd = document.getElementById('maxEnergyCostDisplay');
    if (mecd) mecd.textContent = formatNumber(maxEnergyCost) + ' 💵';

    const regenCost = Math.floor(200 + regenSpeed * 100);
    let rcd = document.getElementById('regenCostDisplay');
    if (rcd) rcd.textContent = formatNumber(regenCost) + ' 💵';

    const offshorePrice = 5000 + offshore * 10000;
    let op = document.getElementById('offshorePrice');
    if (op) op.textContent = formatNumber(offshorePrice) + ' 💵';
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
    showFloatingText('+' + formatNumber(earned) + '💵');

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
        coins += level * 50;
        updateUI();
    }
}

// ========== ПАРЯЩИЙ ТЕКСТ ==========
function showFloatingText(text) {
    const container = document.getElementById('floatingTexts');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (25 + Math.random() * 50) + '%';
    el.style.top = (25 + Math.random() * 40) + '%';

    let color = '#ffd700';
    if (text.includes('🎉')) color = '#ff6bff';
    else if (text.includes('✅')) color = '#6fdf8a';
    else if (text.includes('❌')) color = '#ff6b6b';
    else if (text.includes('🔋')) color = '#7cf9ff';
    else if (text.includes('📈')) color = '#c084fc';
    else if (text.includes('💵')) color = '#6fdf8a';
    else if (text.includes('🚀')) color = '#ff8a8a';
    el.style.color = color;

    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ========== МАГАЗИН (УЛУЧШЕНИЯ) ==========
function buyUpgrade(index) {
    if (index < 0 || index >= upgrades.length) return;
    const upg = upgrades[index];
    const cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    upg.level++;
    clickPower += upg.power;
    saveGame();
    updateUI();
    showFloatingText('✅ ' + upg.name + ' +' + upg.power + ' силы!');
}

// ========== МАГАЗИН (БИЗНЕС) ==========
function buyBusiness(index) {
    if (index < 0 || index >= businesses.length) return;
    const biz = businesses[index];
    const cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    biz.level++;
    passiveIncome += biz.income;
    saveGame();
    updateUI();
    showFloatingText('🏢 ' + biz.name + ' куплен!');
}

// ========== ЭНЕРГИЯ ==========
function buyEnergy() {
    const cost = Math.floor(50 + level * 5);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    if (energy >= maxEnergy) {
        showFloatingText('⚡ Энергия полная!');
        return;
    }
    coins -= cost;
    energy = Math.min(energy + Math.floor(maxEnergy * 0.5), maxEnergy);
    saveGame();
    updateUI();
    showFloatingText('🔋 +' + Math.floor(maxEnergy * 0.5) + ' энергии!');
}

function buyMaxEnergy() {
    const cost = Math.floor(100 + (maxEnergy - 500) * 0.5);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    maxEnergy += 50;
    energy = Math.min(energy + 25, maxEnergy);
    saveGame();
    updateUI();
    showFloatingText('📈 Максимум +50!');
}

function buyRegenSpeed() {
    const cost = Math.floor(200 + regenSpeed * 100);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    regenSpeed += 0.5;
    saveGame();
    updateUI();
    showFloatingText('⚡ Регенерация +0.5/сек!');
}

// ========== БОНУСЫ ==========
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

function playLottery() {
    if (coins < 100) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= 100;
    const multiplier = Math.floor(Math.random() * 9) + 2;
    const win = 100 * multiplier;
    coins += win;
    showFloatingText('🎰 x' + multiplier + '! +' + win + '💵');
    saveGame();
    updateUI();
}

function buyOffshore() {
    const cost = 5000 + offshore * 10000;
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    offshore++;
    saveGame();
    updateUI();
    showFloatingText('🛡️ Офшор куплен!');
}

function doPrestige() {
    let cost = 1000000 * (prestige + 1);
    if (coins < cost) {
        showFloatingText('😅 Нужно ' + cost + ' 💵!');
        return;
    }
    coins = 0;
    clickPower = 1 + prestige * 5;
    energy = 500;
    maxEnergy = 500 + prestige * 50;
    passiveIncome = 0;
    level = 1;
    totalClicks = 0;
    upgrades.forEach(u => u.level = 0);
    businesses.forEach(b => b.level = 0);
    prestige++;
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '!');
    saveGame();
    updateUI();
}

// ========== ЕЖЕДНЕВНЫЙ БОНУС ==========
let lastBonusDate = localStorage.getItem('lastBonusDate') || '';

function claimDailyBonus() {
    const today = new Date().toDateString();
    if (lastBonusDate === today) {
        showFloatingText('⏳ Бонус уже получен!');
        let bt = document.getElementById('bonusTimer');
        if (bt) bt.textContent = '⏳ Завтра';
        return;
    }
    const bonus = 100 + level * 20 + prestige * 100;
    coins += bonus;
    lastBonusDate = today;
    localStorage.setItem('lastBonusDate', today);
    showFloatingText('🎁 +' + bonus + '💵 бонус!');
    let bt = document.getElementById('bonusTimer');
    if (bt) bt.textContent = '✅ Получен!';
    updateUI();
    saveGame();
}

// ========== ПАССИВНЫЙ ДОХОД ==========
setInterval(() => {
    if (passiveIncome > 0) {
        let income = passiveIncome;
        if (luckActive) income *= 2;
        coins += income;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ==========
setInterval(() => {
    if (energy < maxEnergy) {
        energy += regenSpeed * 0.5;
        if (energy > maxEnergy) energy = maxEnergy;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== НАЛОГИ ==========
setInterval(() => {
    if (offshore === 0 && coins > 0) {
        const tax = coins * 0.01;
        coins -= tax;
        showFloatingText('📉 Налог -' + formatNumber(tax) + '💵');
        updateUI();
        saveGame();
    }
}, 60000); // Каждую минуту

// ========== СОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', Math.floor(coins));
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', Math.floor(energy));
    localStorage.setItem('maxEnergy', Math.floor(maxEnergy));
    localStorage.setItem('level', level);
    localStorage.setItem('passiveIncome', passiveIncome);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('prestige', prestige);
    localStorage.setItem('regenSpeed', regenSpeed);
    localStorage.setItem('offshore', offshore);
    for (let i = 0; i < upgrades.length; i++) {
        localStorage.setItem('upgrade_' + i, upgrades[i].level);
    }
    for (let i = 0; i < businesses.length; i++) {
        localStorage.setItem('business_' + i, businesses[i].level);
    }
}

// ========== ЗАПУСК ==========
updateUI();

if (coinImage) {
    coinImage.addEventListener('click', tap);
}

if (lastBonusDate === new Date().toDateString()) {
    let bt = document.getElementById('bonusTimer');
    if (bt) bt.textContent = '✅ Получен!';
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame();
});

console.log('✅ МЕГА ТАПАЛКА 1B ЗАПУЩЕНА!');
console.log('Монет:', coins);
console.log('Сила тапа:', clickPower);
console.log('Улучшений:', upgrades.length);
console.log('Бизнесов:', businesses.length);