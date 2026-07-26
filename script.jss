// ========== ОСНОВНЫЕ ПЕРЕМЕННЫЕ ==========
let coins = parseFloat(localStorage.getItem('coins')) || 0;
let crystals = parseFloat(localStorage.getItem('crystals')) || 0;
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

// Бонусы престижа
let prestigePowerBonus = parseFloat(localStorage.getItem('prestigePowerBonus')) || 0;
let prestigeEnergyBonus = parseFloat(localStorage.getItem('prestigeEnergyBonus')) || 0;
let prestigeIncomeBonus = parseFloat(localStorage.getItem('prestigeIncomeBonus')) || 0;

// Кристальные бонусы
let crystalPowerBonus = parseFloat(localStorage.getItem('crystalPowerBonus')) || 0;
let crystalIncomeBonus = parseFloat(localStorage.getItem('crystalIncomeBonus')) || 0;
let crystalEnergyBonus = parseFloat(localStorage.getItem('crystalEnergyBonus')) || 0;
let crystalClickBonus = parseFloat(localStorage.getItem('crystalClickBonus')) || 0;

// ЭКСПЕДИЦИИ
let expeditionActive = false;
let expeditionTimer = null;
let expeditionTimeLeft = 0;
let expeditionReward = 0;

// ========== 20 УЛУЧШЕНИЙ ==========
const upgradeNames = [
    'Улучшить тап', 'Сильный тап', 'Мощный тап', 'Сокрушительный тап', 'Титанический тап',
    'Гигантский тап', 'Колоссальный тап', 'Исполинский тап', 'Легендарный тап', 'Мифический тап',
    'Божественный тап', 'Космический тап', 'Галактический тап', 'Вселенский тап', 'Омега-тап',
    'Альфа-тап', 'Сигма-тап', 'Дельта-тап', 'Гамма-тап', 'БЕСКОНЕЧНЫЙ ТАП'
];

const upgrades = [];
for (let i = 0; i < 20; i++) {
    upgrades.push({
        level: parseInt(localStorage.getItem('upgrade_' + i)) || 0,
        cost: 50 * Math.pow(10, i * 0.5),
        power: Math.pow(2, i),
        name: upgradeNames[i] || 'Улучшение ' + (i + 1),
        index: i
    });
}

// ========== 10 БИЗНЕСОВ ==========
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
    { cost: 500000000, income: 100000000, name: '🌍 Корпорация' }
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

// ========== ЭКСПЕДИЦИИ ==========
const expeditions = [
    { cost: 0, duration: 30, reward: 5, name: '🏕️ Лесная прогулка' },
    { cost: 100, duration: 45, reward: 15, name: '🏔️ Горный поход' },
    { cost: 500, duration: 60, reward: 40, name: '🌊 Морское путешествие' },
    { cost: 2000, duration: 90, reward: 100, name: '🏜️ Пустыня' },
    { cost: 10000, duration: 120, reward: 250, name: '🗿 Древний храм' },
    { cost: 50000, duration: 180, reward: 600, name: '🔥 Вулкан' },
    { cost: 200000, duration: 240, reward: 1500, name: '🌌 Космос' },
    { cost: 1000000, duration: 300, reward: 4000, name: '🌀 Чёрная дыра' }
];

// ========== МАГАЗИН КРИСТАЛЛОВ ==========
const crystalShopItems = [
    { cost: 10, bonus: 5, type: 'power', name: '💪 Сила +5' },
    { cost: 25, bonus: 15, type: 'power', name: '💪 Сила +15' },
    { cost: 50, bonus: 35, type: 'power', name: '💪 Сила +35' },
    { cost: 15, bonus: 10, type: 'income', name: '📈 Доход +10/сек' },
    { cost: 40, bonus: 30, type: 'income', name: '📈 Доход +30/сек' },
    { cost: 100, bonus: 80, type: 'income', name: '📈 Доход +80/сек' },
    { cost: 20, bonus: 25, type: 'energy', name: '⚡ Энергия +25' },
    { cost: 60, bonus: 75, type: 'energy', name: '⚡ Энергия +75' },
    { cost: 150, bonus: 200, type: 'energy', name: '⚡ Энергия +200' },
    { cost: 30, bonus: 2, type: 'click', name: '👆 Клики x2 на 30сек' },
    { cost: 80, bonus: 5, type: 'click', name: '👆 Клики x5 на 30сек' },
    { cost: 200, bonus: 10, type: 'click', name: '👆 Клики x10 на 30сек' }
];

// ========== ФОРМАТИРОВАНИЕ ==========
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num);
}

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    document.getElementById('coinCounter').textContent = formatNumber(coins);
    document.getElementById('crystalCounter').textContent = Math.floor(crystals);
    document.getElementById('crystalShopCounter').textContent = Math.floor(crystals);
    document.getElementById('energyCounter').textContent = Math.floor(energy) + '/' + Math.floor(maxEnergy);
    document.getElementById('energyFill').style.width = (energy / maxEnergy * 100) + '%';
    document.getElementById('tapPowerDisplay').textContent = formatNumber(clickPower);
    document.getElementById('incomeDisplay').textContent = formatNumber(passiveIncome);
    document.getElementById('levelDisplay').textContent = level;
    document.getElementById('prestigeDisplay').textContent = prestige;
    document.getElementById('maxEnergyDisplay').textContent = Math.floor(maxEnergy);
    document.getElementById('regenSpeedDisplay').textContent = regenSpeed + '/сек';
    
    updatePrices();
    renderUpgrades();
    renderBusiness();
    renderExpeditions();
    renderCrystalShop();
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
}

// ========== РЕНДЕР УЛУЧШЕНИЙ ==========
function renderUpgrades() {
    const container = document.getElementById('upgradesContainer');
    if (!container) return;
    let html = '';
    for (let i = 0; i < upgrades.length; i++) {
        const upg = upgrades[i];
        const cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
        const tier = Math.floor(i / 4) + 1;
        const stars = upg.level > 0 ? ' ⭐'.repeat(Math.min(upg.level, 3)) : '';
        html += `
            <button class="shop-btn tier${tier}" onclick="buyUpgrade(${i})" style="${coins >= cost ? '' : 'opacity:0.4;'}">
                <span class="icon">⬆️</span>
                <span class="text">${upg.name}${stars}</span>
                <span class="price">${formatNumber(cost)} 💵</span>
            </button>
        `;
    }
    container.innerHTML = html;
}

// ========== РЕНДЕР БИЗНЕСОВ ==========
function renderBusiness() {
    const container = document.getElementById('businessContainer');
    if (!container) return;
    let html = '';
    for (let i = 0; i < businesses.length; i++) {
        const biz = businesses[i];
        const cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
        const lvl = biz.level > 0 ? ' [Ур.' + biz.level + ']' : '';
        html += `
            <button class="shop-btn business" onclick="buyBusiness(${i})" style="${coins >= cost ? '' : 'opacity:0.4;'}">
                <span class="icon">🏢</span>
                <span class="text">${biz.name}${lvl}</span>
                <span class="price">${formatNumber(cost)} 💵</span>
            </button>
        `;
    }
    container.innerHTML = html;
}

// ========== РЕНДЕР ЭКСПЕДИЦИЙ ==========
function renderExpeditions() {
    const container = document.getElementById('expeditionContainer');
    if (!container) return;
    let html = '';
    for (let i = 0; i < expeditions.length; i++) {
        const exp = expeditions[i];
        const canAfford = coins >= exp.cost && !expeditionActive;
        html += `
            <button class="shop-btn expedition" onclick="startExpedition(${i})" style="${canAfford ? '' : 'opacity:0.4;'}">
                <span class="icon">🗺️</span>
                <span class="text">${exp.name} (${exp.duration}сек)</span>
                <span class="price">${exp.cost > 0 ? formatNumber(exp.cost) + ' 💵' : 'Бесплатно'} → 💎${exp.reward}</span>
            </button>
        `;
    }
    container.innerHTML = html;
}

// ========== РЕНДЕР МАГАЗИНА КРИСТАЛЛОВ ==========
function renderCrystalShop() {
    const container = document.getElementById('crystalShopContainer');
    if (!container) return;
    let html = '';
    for (let i = 0; i < crystalShopItems.length; i++) {
        const item = crystalShopItems[i];
        html += `
            <button class="shop-btn crystal-shop" onclick="buyCrystalItem(${i})" style="${crystals >= item.cost ? '' : 'opacity:0.4;'}">
                <span class="icon">💎</span>
                <span class="text">${item.name}</span>
                <span class="price">${item.cost} 💎</span>
            </button>
        `;
    }
    container.innerHTML = html;
}

// ========== ТАП ==========
function tap() {
    if (energy <= 0) {
        showFloatingText('❌ Нет энергии!');
        return;
    }
    energy--;
    let earned = clickPower + crystalPowerBonus;
    if (luckActive) earned *= 2;
    if (crystalClickBonus > 0) earned *= crystalClickBonus;
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
    else if (text.includes('💎')) color = '#7cf9ff';
    else if (text.includes('📈')) color = '#c084fc';
    el.style.color = color;
    container.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// ========== ПОКУПКА УЛУЧШЕНИЙ ==========
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

// ========== ПОКУПКА БИЗНЕСА ==========
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

// ========== ЭКСПЕДИЦИИ ==========
function startExpedition(index) {
    if (expeditionActive) {
        showFloatingText('⏳ Экспедиция уже идёт!');
        return;
    }
    if (index < 0 || index >= expeditions.length) return;
    const exp = expeditions[index];
    if (coins < exp.cost) {
        showFloatingText('😅 Не хватает денег!');
        return;
    }
    coins -= exp.cost;
    expeditionActive = true;
    expeditionTimeLeft = exp.duration;
    expeditionReward = exp.reward;
    
    const status = document.getElementById('expeditionStatus');
    status.textContent = '⏳ Экспедиция идёт... ' + expeditionTimeLeft + ' сек';
    status.className = 'expedition-status active';
    
    showFloatingText('🗺️ Экспедиция началась!');
    saveGame();
    updateUI();
    
    if (expeditionTimer) clearInterval(expeditionTimer);
    expeditionTimer = setInterval(() => {
        expeditionTimeLeft--;
        status.textContent = '⏳ Экспедиция идёт... ' + expeditionTimeLeft + ' сек';
        if (expeditionTimeLeft <= 0) {
            clearInterval(expeditionTimer);
            expeditionActive = false;
            const bonus = expeditionReward + Math.floor(Math.random() * 5);
            crystals += bonus;
            status.textContent = '✅ Экспедиция завершена! +' + bonus + ' 💎 кристаллов!';
            status.className = 'expedition-status';
            showFloatingText('💎 +' + bonus + ' кристаллов!');
            saveGame();
            updateUI();
        }
    }, 1000);
}

// ========== МАГАЗИН КРИСТАЛЛОВ ==========
function buyCrystalItem(index) {
    if (index < 0 || index >= crystalShopItems.length) return;
    const item = crystalShopItems[index];
    if (crystals < item.cost) {
        showFloatingText('😅 Не хватает кристаллов!');
        return;
    }
    crystals -= item.cost;
    
    switch(item.type) {
        case 'power':
            crystalPowerBonus += item.bonus;
            showFloatingText('💪 Сила +' + item.bonus + '!');
            break;
        case 'income':
            crystalIncomeBonus += item.bonus;
            passiveIncome += item.bonus;
            showFloatingText('📈 Доход +' + item.bonus + '/сек!');
            break;
        case 'energy':
            crystalEnergyBonus += item.bonus;
            maxEnergy += item.bonus;
            showFloatingText('⚡ Энергия +' + item.bonus + '!');
            break;
        case 'click':
            crystalClickBonus = item.bonus;
            showFloatingText('👆 Клики x' + item.bonus + ' на 30 сек!');
            setTimeout(() => {
                crystalClickBonus = 0;
                showFloatingText('⏰ Бонус кликов закончился');
                updateUI();
            }, 30000);
            break;
    }
    saveGame();
    updateUI();
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
    let energyBonus = 50 + prestigeLevel * 20;
    let incomeBonus = 10 + prestigeLevel * 5;
    let startCoins = 1000 * prestigeLevel;
    
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
    prestige++;
    
    let bonusIncome = Math.floor(totalUpgradeLevels * 2);
    if (bonusIncome > 0) passiveIncome += bonusIncome;
    prestigePowerBonus += powerBonus;
    prestigeEnergyBonus += energyBonus;
    prestigeIncomeBonus += incomeBonus;
    passiveIncome = Math.floor(passiveIncome * (1 + prestigeIncomeBonus / 100));
    
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '!');
    setTimeout(() => showFloatingText('⭐ +' + powerBonus + ' силы!'), 800);
    setTimeout(() => showFloatingText('⚡ +' + energyBonus + ' энергии!'), 1600);
    setTimeout(() => showFloatingText('📈 +' + incomeBonus + '% дохода!'), 2400);
    
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
    localStorage.setItem('crystals', Math.floor(crystals));
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', Math.floor(energy));
    localStorage.setItem('maxEnergy', Math.floor(maxEnergy));
    localStorage.setItem('level', level);
    localStorage.setItem('passiveIncome', passiveIncome);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('prestige', prestige);
    localStorage.setItem('regenSpeed', regenSpeed);
    localStorage.setItem('offshore', offshore);
    localStorage.setItem('prestigePowerBonus', prestigePowerBonus);
    localStorage.setI