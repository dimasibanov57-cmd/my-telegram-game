// ========== ПЕРЕМЕННЫЕ ==========
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
let luckActive = false;
let luckTimer = null;

let expeditionActive = false;
let expeditionTimer = null;

// ========== ДАННЫЕ ==========
const upgrades = [];
for (let i = 0; i < 20; i++) {
    let saved = localStorage.getItem('upgrade_' + i);
    upgrades.push({
        level: saved ? parseInt(saved) : 0,
        cost: 50 * Math.pow(2, i * 0.5),
        power: Math.pow(2, i * 0.3),
        name: 'Улучшение ' + (i + 1)
    });
}

const businesses = [];
for (let i = 0; i < 10; i++) {
    let saved = localStorage.getItem('business_' + i);
    let baseCost = 500 * Math.pow(5, i * 0.4);
    let baseIncome = 10 * Math.pow(3, i * 0.5);
    businesses.push({
        level: saved ? parseInt(saved) : 0,
        cost: baseCost,
        income: baseIncome,
        name: ['🥤 Ларёк','🏪 Магазин','🏬 Супермаркет','🏭 Завод','🚚 Логистика','🏗️ Стройка','🛢️ Нефть','🛸 Космос','🏦 Банк','🌍 Корпорация'][i]
    });
    if (businesses[i].level > 0) {
        passiveIncome += businesses[i].level * businesses[i].income;
    }
}

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
    { cost: 30, bonus: 2, type: 'click', name: '👆 Клики x2 30сек' },
    { cost: 80, bonus: 5, type: 'click', name: '👆 Клики x5 30сек' },
    { cost: 200, bonus: 10, type: 'click', name: '👆 Клики x10 30сек' }
];

let crystalPowerBonus = parseFloat(localStorage.getItem('crystalPowerBonus')) || 0;
let crystalIncomeBonus = parseFloat(localStorage.getItem('crystalIncomeBonus')) || 0;
let crystalEnergyBonus = parseFloat(localStorage.getItem('crystalEnergyBonus')) || 0;
let crystalClickBonus = parseFloat(localStorage.getItem('crystalClickBonus')) || 0;

// ========== ФОРМАТИРОВАНИЕ ==========
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num);
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
    container.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    document.getElementById('coinCounter').textContent = formatNumber(coins);
    document.getElementById('crystalCounter').textContent = Math.floor(crystals);
    document.getElementById('crystalShopCounter').textContent = Math.floor(crystals);
    document.getElementById('energyCounter').textContent = Math.floor(energy) + '/' + Math.floor(maxEnergy);
    document.getElementById('energyFill').style.width = (energy / maxEnergy * 100) + '%';
    document.getElementById('tapPowerDisplay').textContent = formatNumber(clickPower + crystalPowerBonus);
    document.getElementById('incomeDisplay').textContent = formatNumber(passiveIncome + crystalIncomeBonus);
    document.getElementById('levelDisplay').textContent = level;
    document.getElementById('prestigeDisplay').textContent = prestige;
    document.getElementById('maxEnergyDisplay').textContent = Math.floor(maxEnergy + crystalEnergyBonus);
    document.getElementById('regenSpeedDisplay').textContent = regenSpeed + '/сек';
    
    document.getElementById('energyCostDisplay').textContent = formatNumber(50 + level * 5) + ' 💵';
    document.getElementById('maxEnergyCostDisplay').textContent = formatNumber(100 + (maxEnergy - 500) * 0.5) + ' 💵';
    document.getElementById('regenCostDisplay').textContent = formatNumber(200 + regenSpeed * 100) + ' 💵';
    
    renderUpgrades();
    renderBusiness();
    renderExpeditions();
    renderCrystalShop();
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
        const canBuy = coins >= cost;
        html += `<button class="shop-btn tier${tier}" onclick="buyUpgrade(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
            <span class="icon">⬆️</span>
            <span class="text">${upg.name} ${upg.level > 0 ? '⭐'.repeat(Math.min(upg.level,3)) : ''}</span>
            <span class="price">${formatNumber(cost)} 💵</span>
        </button>`;
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
        const canBuy = coins >= cost;
        html += `<button class="shop-btn business" onclick="buyBusiness(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
            <span class="icon">🏢</span>
            <span class="text">${biz.name} ${biz.level > 0 ? '[Ур.'+biz.level+']' : ''}</span>
            <span class="price">${formatNumber(cost)} 💵</span>
        </button>`;
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
        const canBuy = coins >= exp.cost && !expeditionActive;
        html += `<button class="shop-btn expedition" onclick="startExpedition(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
            <span class="icon">🗺️</span>
            <span class="text">${exp.name} (${exp.duration}с)</span>
            <span class="price">${exp.cost > 0 ? formatNumber(exp.cost)+' 💵' : 'Бесплатно'} → 💎${exp.reward}</span>
        </button>`;
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
        const canBuy = crystals >= item.cost;
        html += `<button class="shop-btn crystal-shop" onclick="buyCrystalItem(${i})" style="${canBuy ? '' : 'opacity:0.5;'}">
            <span class="icon">💎</span>
            <span class="text">${item.name}</span>
            <span class="price">${item.cost} 💎</span>
        </button>`;
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
    if (crystalClickBonus > 1) earned *= crystalClickBonus;
    coins += earned;
    totalClicks++;
    
    if (navigator.vibrate) navigator.vibrate(10);
    showFloatingText('+' + formatNumber(earned) + '💵');
    
    const needed = level * 100;
    if (totalClicks >= needed) {
        level++;
        totalClicks = 0;
        clickPower += 2;
        showFloatingText('🎉 УРОВЕНЬ ' + level + '!');
        coins += level * 50;
    }
    
    saveGame();
    updateUI();
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
    showFloatingText('✅ +' + formatNumber(upg.power) + ' силы!');
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
    let timeLeft = exp.duration;
    const status = document.getElementById('expeditionStatus');
    status.textContent = '⏳ Экспедиция идёт... ' + timeLeft + ' сек';
    status.className = 'expedition-status active';
    showFloatingText('🗺️ Экспедиция началась!');
    saveGame();
    updateUI();
    
    if (expeditionTimer) clearInterval(expeditionTimer);
    expeditionTimer = setInterval(() => {
        timeLeft--;
        if (status) status.textContent = '⏳ Экспедиция идёт... ' + timeLeft + ' сек';
        if (timeLeft <= 0) {
            clearInterval(expeditionTimer);
            expeditionActive = false;
            const bonus = exp.reward + Math.floor(Math.random() * 5);
            crystals += bonus;
            if (status) {
                status.textContent = '✅ Экспедиция завершена! +' + bonus + ' 💎 кристаллов!';
                status.className = 'expedition-status';
            }
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
    let totalUpgradeLevels = 0;
    upgrades.forEach(u => totalUpgradeLevels += u.level);
    coins = 1000 * (prestige + 1);
    clickPower = 1;
    energy = 500;
    maxEnergy = 500;
    passiveIncome = 0;
    level = 1;
    totalClicks = 0;
    upgrades.forEach(u => u.level = 0);
    businesses.forEach(b => b.level = 0);
    prestige++;
    passiveIncome += Math.floor(totalUpgradeLevels * 2);
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '!');
    saveGame();
    updateUI();
}

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
    localStorage.setItem('crystalPowerBonus', crystalPowerBonus);
    localStorage.setItem('crystalIncomeBonus', crystalIncomeBonus);
    localStorage.setItem('crystalEnergyBonus', crystalEnergyBonus);
    localStorage.setItem('crystalClickBonus', crystalClickBonus);
    for (let i = 0; i < upgrades.length; i++) {
        localStorage.setItem('upgrade_' + i, upgrades[i].level);
    }
    for (let i = 0; i < businesses.length; i++) {
        localStorage.setItem('business_' + i, businesses[i].level);
    }
}

// ========== АВТОМАТИЧЕСКИЕ ПРОЦЕССЫ ==========
setInterval(() => {
    if (passiveIncome + crystalIncomeBonus > 0) {
        coins += passiveIncome + crystalIncomeBonus;
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

// ========== ВКЛАДКИ ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('tab-' + this.dataset.tab);
        if (panel) panel.classList.add('active');
    });
});

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('coinImage').addEventListener('click', tap);
    updateUI();
    console.log('✅ Игра запущена!');
});