// ========== ОСНОВНЫЕ ПЕРЕМЕННЫЕ ==========
let coins = parseFloat(localStorage.getItem('coins')) || 0;
let clickPower = parseFloat(localStorage.getItem('clickPower')) || 1;
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

let prestigePowerBonus = parseFloat(localStorage.getItem('prestigePowerBonus')) || 0;
let prestigeEnergyBonus = parseFloat(localStorage.getItem('prestigeEnergyBonus')) || 0;
let prestigeIncomeBonus = parseFloat(localStorage.getItem('prestigeIncomeBonus')) || 0;

// ========== 80 УЛУЧШЕНИЙ ==========
const upgradeNames = [
    // Tier 1 (1-10)
    'Улучшить тап', 'Сильный тап', 'Мощный тап', 'Сокрушительный тап', 'Титанический тап',
    'Гигантский тап', 'Колоссальный тап', 'Исполинский тап', 'Легендарный тап', 'Мифический тап',
    // Tier 2 (11-20)
    'Божественный тап', 'Космический тап', 'Галактический тап', 'Вселенский тап', 'Мультивселенский тап',
    'Омега-тап', 'Альфа-тап', 'Сигма-тап', 'Дельта-тап', 'Гамма-тап',
    // Tier 3 (21-30)
    'Звёздный тап', 'Солнечный тап', 'Лунный тап', 'Планетарный тап', 'Астероидный тап',
    'Кометный тап', 'Метеоритный тап', 'Туманностный тап', 'Сверхновый тап', 'Квазарный тап',
    // Tier 4 (31-40)
    'Драконий тап', 'Фениксовый тап', 'Грифоновый тап', 'Единорожий тап', 'Циклоповый тап',
    'Горгоновидный тап', 'Гиппогрифовый тап', 'Мантикоровий тап', 'Кентавровый тап', 'Пегасовый тап',
    // Tier 5 (41-50)
    'Зевсов тап', 'Посейдонов тап', 'Аидов тап', 'Афинин тап', 'Аполлоновый тап',
    'Артемидин тап', 'Аресов тап', 'Гермесов тап', 'Дионисов тап', 'Гестиин тап',
    // Tier 6 (51-60)
    'Бесконечный тап', 'Вечный тап', 'Нерушимый тап', 'Несокрушимый тап', 'Непобедимый тап',
    'Всемогущий тап', 'Всесильный тап', 'Вездесущий тап', 'Всеведущий тап', 'Абсолютный тап',
    // Tier 7 (61-70)
    'Трансцендентный I', 'Трансцендентный II', 'Трансцендентный III', 'Трансцендентный IV', 'Трансцендентный V',
    'Нуменальный тап', 'Феноменальный тап', 'Ноуменальный тап', 'Эйдетический тап', 'Априорный тап',
    // Tier 8 (71-80)
    'Абсолют I', 'Абсолют II', 'Абсолют III', 'Абсолют IV', 'Абсолют V',
    'Абсолют VI', 'Абсолют VII', 'Абсолют VIII', 'Абсолют IX', 'БОЖЕСТВЕННЫЙ АБСОЛЮТ'
];

const upgradeEmojis = [
    '⬆️','💪','🔥','⭐','💎','👑','🌌','⚡','♾️','💀',
    '🌟','🌀','✨','🔱','⚡','🌠','🪐','☀️','🌙','🪐',
    '⭐','🌟','✨','🔥','💫','🌈','⚡','🌀','🌌','🪐',
    '🐉','🦅','🦄','🐲','🦁','🐺','🦊','🐻','🐼','🐨',
    '⚡','🔥','💎','👑','🌟','✨','🌠','🌈','⚡','🔥',
    '♾️','∞','⚡','🔥','💎','👑','🌟','✨','🌠','🌈',
    '🌀','🌌','🪐','☀️','🌙','⭐','🌟','✨','🔥','💫',
    '💀','👾','🤖','👽','🛸','🚀','🌍','🌎','🌏','🔱'
];

function getUpgradeCost(index) {
    let base = 50;
    if (index < 10) return base * Math.pow(10, index);
    if (index < 20) return base * Math.pow(10, index + 5);
    if (index < 30) return base * Math.pow(10, index + 15);
    if (index < 40) return base * Math.pow(10, index + 25);
    if (index < 50) return base * Math.pow(10, index + 35);
    if (index < 60) return base * Math.pow(10, index + 45);
    if (index < 70) return base * Math.pow(10, index + 55);
    return base * Math.pow(10, index + 65);
}

function getUpgradePower(index) {
    if (index < 10) return Math.pow(2, index);
    if (index < 20) return Math.pow(10, index - 5);
    if (index < 30) return Math.pow(10, index - 15);
    if (index < 40) return Math.pow(10, index - 25);
    if (index < 50) return Math.pow(10, index - 35);
    if (index < 60) return Math.pow(10, index - 45);
    if (index < 70) return Math.pow(10, index - 55);
    return Math.pow(10, index - 65);
}

const upgrades = [];
for (let i = 0; i < 80; i++) {
    upgrades.push({
        level: parseInt(localStorage.getItem('upgrade_' + i)) || 0,
        cost: getUpgradeCost(i),
        power: getUpgradePower(i),
        name: upgradeNames[i] || 'Улучшение ' + (i + 1),
        emoji: upgradeEmojis[i] || '⬆️',
        index: i
    });
}

// ========== 20 БИЗНЕСОВ ==========
const businessData = [
    { cost: 500, income: 10, name: '🥤 Ларёк' },
    { cost: 2000, income: 50, name: '🏪 Магазин' },
    { cost: 10000, income: 300, name: '🏬 Супермаркет' },
    { cost: 50000, income: 1500, name: '🏭 Завод' },
    { cost: 200000, income: 8000, name: '🚚 Логистика' },
    { cost: 1000000, income: 50000, name: '🏗️ Стройка' },
    { cost: 5000000, income: 300000, name: '🛢️ Нефть' },
    { cost: 25000000, income: 2000000, name: '🛸 Космос' },
    { cost: 100000000, income: 15000000, name: '🏦 Банк' },
    { cost: 500000000, income: 100000000, name: '🌍 Корпорация' },
    { cost: 2000000000, income: 1000000000, name: '🚀 Галактика' },
    { cost: 20000000000, income: 10000000000, name: '🌌 Вселенная' },
    { cost: 200000000000, income: 100000000000, name: '🌀 Мультивселенная' },
    { cost: 2000000000000, income: 1000000000000, name: '⚡ Энергия Бога' },
    { cost: 500000000000000, income: 100000000000000, name: '👑 АБСОЛЮТ' },
    { cost: 1e18, income: 1e17, name: '🌠 КОСМОС' },
    { cost: 1e22, income: 1e21, name: '🌌 МЕГАВСЕЛЕННАЯ' },
    { cost: 1e27, income: 1e26, name: '♾️ ОМНИВЕРСУМ' },
    { cost: 1e33, income: 1e32, name: '∞ БЕСКОНЕЧНОСТЬ' },
    { cost: 1e40, income: 1e39, name: '🔱 АБСОЛЮТНАЯ ВЛАСТЬ' }
];

const businesses = [];
for (let i = 0; i < businessData.length; i++) {
    businesses.push({
        level: parseInt(localStorage.getItem('business_' + i)) || 0,
        cost: businessData[i].cost,
        income: businessData[i].income,
        name: businessData[i].name,
        index: i
    });
    passiveIncome += businesses[i].level * businesses[i].income;
}

// ========== ФОРМАТИРОВАНИЕ ЧИСЕЛ ==========
function formatNumber(num) {
    if (num === Infinity || num >= 1e100) return '∞';
    if (num >= 1e90) return (num / 1e90).toFixed(1) + 'Gg';
    if (num >= 1e80) return (num / 1e80).toFixed(1) + 'No';
    if (num >= 1e70) return (num / 1e70).toFixed(1) + 'Sp';
    if (num >= 1e60) return (num / 1e60).toFixed(1) + 'Sx';
    if (num >= 1e50) return (num / 1e50).toFixed(1) + 'Qi';
    if (num >= 1e40) return (num / 1e40).toFixed(1) + 'Qu';
    if (num >= 1e30) return (num / 1e30).toFixed(1) + 'No';
    if (num >= 1e27) return (num / 1e27).toFixed(1) + 'Oc';
    if (num >= 1e24) return (num / 1e24).toFixed(1) + 'Sp';
    if (num >= 1e21) return (num / 1e21).toFixed(1) + 'Sx';
    if (num >= 1e18) return (num / 1e18).toFixed(1) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Qa';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    if (num < 0.01 && num > 0) return num.toExponential(2);
    return Math.floor(num);
}

// ========== РЕНДЕР УЛУЧШЕНИЙ ==========
function renderUpgrades() {
    const container = document.getElementById('upgradesContainer');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < upgrades.length; i++) {
        const upg = upgrades[i];
        const cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
        const tier = Math.floor(i / 10) + 1;
        const stars = upg.level > 0 ? ' ⭐'.repeat(Math.min(upg.level, 3)) : '';
        const canBuy = coins >= cost;
        
        html += `
            <button class="shop-btn tier${tier}" onclick="buyUpgrade(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
                <span class="icon">${upg.emoji}</span>
                <span class="text">${upg.name}${stars}</span>
                <span class="price">${formatNumber(cost)} 💵</span>
            </button>
        `;
    }
    container.innerHTML = html;
    updateUpgradeCount();
}

// ========== РЕНДЕР БИЗНЕСОВ ==========
function renderBusiness() {
    const container = document.getElementById('businessContainer');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < businesses.length; i++) {
        const biz = businesses[i];
        const cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
        const canBuy = coins >= cost;
        const lvl = biz.level > 0 ? ' [Ур.' + biz.level + ']' : '';
        
        html += `
            <button class="shop-btn business" onclick="buyBusiness(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
                <span class="icon">🏢</span>
                <span class="text">${biz.name}${lvl}</span>
                <span class="price">${formatNumber(cost)} 💵</span>
            </button>
        `;
    }
    container.innerHTML = html;
}

// ========== ОБНОВЛЕНИЕ UI ==========
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
    if (prestigeBonusEl) prestigeBonusEl.textContent = '+' + Math.floor(prestigeIncomeBonus) + '%';
    
    updateUpgradeCount();
    renderUpgrades();
    renderBusiness();
    updatePrices();
}

function updateUpgradeCount() {
    let count = 0;
    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].level > 0) count++;
    }
    if (upgradeCountEl) upgradeCountEl.textContent = count + '/80';
    const progress = document.getElementById('upgradeProgress');
    if (progress) progress.textContent = count + '/80';
}

function updatePrices() {
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
    el.style.color = color;
    
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ========== МАГАЗИН ==========
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
    showFloatingText('✅ ' + upg.name + ' +' + formatNumber(upg.power) + ' силы!');
}

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

// ========== ПРЕСТИЖ ==========
function doPrestige() {
    let cost = 1000000 * (prestige + 1);
    if (coins < cost) {
        showFloatingText('😅 Нужно ' + formatNumber(cost) + ' 💵!');
        return;
    }
    
    let prestigeLevel = prestige + 1;
    let powerBonus = 5 + prestigeLevel * 5;
    if (prestigeLevel >= 10) powerBonus = 50 + prestigeLevel * 10;
    if (prestigeLevel >= 25) powerBonus = 200 + prestigeLevel * 20;
    if (prestigeLevel >= 50) powerBonus = 500 + prestigeLevel * 50;
    if (prestigeLevel >= 100) powerBonus = 1000 + prestigeLevel * 100;
    
    let energyBonus = 50 + prestigeLevel * 20;
    if (prestigeLevel >= 10) energyBonus = 100 + prestigeLevel * 30;
    if (prestigeLevel >= 25) energyBonus = 200 + prestigeLevel * 50;
    if (prestigeLevel >= 50) energyBonus = 500 + prestigeLevel * 100;
    if (prestigeLevel >= 100) energyBonus = 1000 + prestigeLevel * 200;
    
    let incomeBonus = 10 + prestigeLevel * 5;
    if (prestigeLevel >= 10) incomeBonus = 30 + prestigeLevel * 8;
    if (prestigeLevel >= 25) incomeBonus = 50 + prestigeLevel * 10;
    if (prestigeLevel >= 50) incomeBonus = 100 + prestigeLevel * 15;
    if (prestigeLevel >= 100) incomeBonus = 200 + prestigeLevel * 20;
    
    let startCoins = 1000 * prestigeLevel;
    if (prestigeLevel >= 10) startCoins = 50000 * prestigeLevel;
    if (prestigeLevel >= 25) startCoins = 200000 * prestigeLevel;
    if (prestigeLevel >= 50) startCoins = 1000000 * prestigeLevel;
    if (prestigeLevel >= 100) startCoins = 10000000 * prestigeLevel;
    
    let totalUpgradeLevels = 0;
    upgrades.forEach(u => totalUpgradeLevels += u.level);
    
    coins = startCoins;
    clickPower = powerBonus + 1;
    energy = 500 + energyBonus;
    maxEnergy = 500 + energyBonus;
    passiveIncome = 0;
    level = 1;
    totalClicks = 0;
    upgrades.forEach(u => u.level = 0);
    businesses.forEach(b => b.level = 0);
    
    let bonusIncome = Math.floor(totalUpgradeLevels * 2);
    if (bonusIncome > 0) passiveIncome += bonusIncome;
    
    prestigePowerBonus += powerBonus;
    prestigeEnergyBonus += energyBonus;
    prestigeIncomeBonus += incomeBonus;
    prestige++;
    passiveIncome = Math.floor(passiveIncome * (1 + prestigeIncomeBonus / 100));
    
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '!');
    setTimeout(() => showFloatingText('⭐ +' + powerBonus + ' силы!'), 800);
    setTimeout(() => showFloatingText('⚡ +' + energyBonus + ' энергии!'), 1600);
    setTimeout(() => showFloatingText('📈 +' + incomeBonus + '% дохода!'), 2400);
    setTimeout(() => showFloatingText('💵 Старт ' + formatNumber(startCoins) + '💵'), 3200);
    
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

// ========== АВТОМАТИЧЕСКИЕ ПРОЦЕССЫ ==========
setInterval(() => {
    if (passiveIncome > 0) {
        let income = passiveIncome;
        if (luckActive) income *= 2;
        coins += income;
        updateUI();
        saveGame();
    }
}, 1000);

setInterval(() => {
    if (energy < maxEnergy) {
        energy += regenSpeed * 0.5;
        if (energy > maxEnergy) energy = maxEnergy;
        updateUI();
        saveGame();
    }
}, 1000);

setInterval(() => {
    if (offshore === 0 && coins > 0) {
        const tax = coins * 0.01;
        coins -= tax;
        showFloatingText('📉 Налог -' + formatNumber(tax) + '💵');
        updateUI();
        saveGame();
    }
}, 60000);

// ========== СОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', Math.floor(coins));
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', Math.floor(energy));
    localStorage.setItem('maxEnergy', Math.floor(maxEnergy