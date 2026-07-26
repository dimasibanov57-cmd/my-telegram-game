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

let crystalPowerBonus = parseFloat(localStorage.getItem('crystalPowerBonus')) || 0;
let crystalIncomeBonus = parseFloat(localStorage.getItem('crystalIncomeBonus')) || 0;
let crystalEnergyBonus = parseFloat(localStorage.getItem('crystalEnergyBonus')) || 0;
let crystalClickBonus = parseFloat(localStorage.getItem('crystalClickBonus')) || 0;

// ========== 50 УНИКАЛЬНЫХ УЛУЧШЕНИЙ ==========
const upgradeNames = [
    '🌟 Начало пути', '💪 Первая сила', '⚡ Искра тапа', '🔥 Разгон', '🌱 Рост мощи',
    '💎 Первый кристалл', '🦅 Орлиный глаз', '🐉 Драконья хватка', '⚔️ Стальной кулак', '👑 Королевский удар',
    '🏹 Меткий стрелок', '🗡️ Меч правосудия', '🛡️ Щит героя', '⚡ Молния Зевса', '🔥 Пламя Прометея',
    '🌊 Трезубец Посейдона', '🌪️ Вихрь Ареса', '🏛️ Сила Афины', '🎯 Точность Аполлона', '🌙 Лук Артемиды',
    '🐉 Коготь Фафнира', '🦅 Крыло Грифона', '🦄 Рог Единорога', '🔥 Дыхание Феникса', '🌊 Зов Кракена',
    '🗻 Кулак Титана', '⚡ Молния Тора', '🔱 Трезубец Нептуна', '🌌 Глаз Одина', '⚔️ Меч Экскалибур',
    '⭐ Сила Сверхновой', '🌌 Космический ветер', '🪐 Кольца Сатурна', '☀️ Энергия Солнца', '🌙 Лунный свет',
    '🚀 Звёздный десант', '🌀 Воронка галактики', '⚡ Квазарный луч', '🌠 Звездопад', '🔭 Глаз телескопа',
    '♾️ Бесконечность', '✨ Трансцендентность', '🌌 Всемогущество', '⚡ Божественный удар', '🔱 Абсолют',
    '🌀 Нуменальный тап', '💫 Феноменальный', '🌟 Ноуменальный', '♾️ Эйдетический', '👑 БОЖЕСТВЕННЫЙ АБСОЛЮТ'
];

const upgrades = [];
for (let i = 0; i < 50; i++) {
    let saved = localStorage.getItem('upgrade_' + i);
    upgrades.push({
        level: saved ? parseInt(saved) : 0,
        cost: 50 * Math.pow(3.5, i * 0.35),
        power: Math.pow(2, i * 0.25),
        name: upgradeNames[i] || 'Улучшение ' + (i + 1),
        era: Math.floor(i / 10) + 1
    });
}

// ========== БИЗНЕСЫ ==========
const businessNames = [
    '🥤 Ларёк', '🏪 Магазин', '🏬 Супермаркет', '🏭 Завод', '🚚 Логистика',
    '🏗️ Стройка', '🛢️ Нефть', '🛸 Космос', '🏦 Банк', '🌍 Корпорация',
    '🚀 Галактика', '🌌 Вселенная', '🌀 Мультивселенная', '⚡ Энергия Бога', '👑 АБСОЛЮТ'
];

const businesses = [];
for (let i = 0; i < businessNames.length; i++) {
    let saved = localStorage.getItem('business_' + i);
    let baseCost = 500 * Math.pow(6, i * 0.4);
    let baseIncome = 10 * Math.pow(4, i * 0.5);
    businesses.push({
        level: saved ? parseInt(saved) : 0,
        cost: baseCost,
        income: baseIncome,
        name: businessNames[i]
    });
    if (businesses[i].level > 0) {
        passiveIncome += businesses[i].level * businesses[i].income;
    }
}

// ========== ЭКСПЕДИЦИИ ==========
const expeditions = [
    { cost: 0, duration: 20, reward: 10, name: '🌲 Лесная прогулка' },
    { cost: 50, duration: 30, reward: 25, name: '⛰️ Горный поход' },
    { cost: 200, duration: 40, reward: 50, name: '⛵ Морское путешествие' },
    { cost: 500, duration: 50, reward: 100, name: '🏜️ Пустыня' },
    { cost: 1000, duration: 60, reward: 200, name: '🏛️ Древний храм' },
    { cost: 2500, duration: 75, reward: 400, name: '🌋 Вулкан' },
    { cost: 5000, duration: 90, reward: 800, name: '🚀 Космос' },
    { cost: 10000, duration: 110, reward: 1500, name: '🕳️ Чёрная дыра' },
    { cost: 25000, duration: 130, reward: 3000, name: '💥 Сверхновая' },
    { cost: 50000, duration: 160, reward: 6000, name: '⚡ Квазар' },
    { cost: 100000, duration: 200, reward: 12000, name: '⏳ Временной разлом' },
    { cost: 250000, duration: 250, reward: 25000, name: '✨ Измерение Богов' }
];

// ========== МАГАЗИН КРИСТАЛЛОВ ==========
const crystalShopItems = [
    { cost: 10, bonus: 5, type: 'power', name: '💪 Сила +5' },
    { cost: 25, bonus: 15, type: 'power', name: '💪 Сила +15' },
    { cost: 50, bonus: 35, type: 'power', name: '💪 Сила +35' },
    { cost: 100, bonus: 80, type: 'power', name: '💪 Сила +80' },
    { cost: 15, bonus: 10, type: 'income', name: '📈 Доход +10/сек' },
    { cost: 40, bonus: 30, type: 'income', name: '📈 Доход +30/сек' },
    { cost: 100, bonus: 80, type: 'income', name: '📈 Доход +80/сек' },
    { cost: 250, bonus: 200, type: 'income', name: '📈 Доход +200/сек' },
    { cost: 20, bonus: 25, type: 'energy', name: '⚡ Энергия +25' },
    { cost: 60, bonus: 75, type: 'energy', name: '⚡ Энергия +75' },
    { cost: 150, bonus: 200, type: 'energy', name: '⚡ Энергия +200' },
    { cost: 30, bonus: 2, type: 'click', name: '👆 Клики x2 30сек' },
    { cost: 80, bonus: 5, type: 'click', name: '👆 Клики x5 30сек' },
    { cost: 200, bonus: 10, type: 'click', name: '👆 Клики x10 30сек' }
];

// ========== ФОРМАТИРОВАНИЕ ==========
function formatNumber(num) {
    if (num === Infinity || num >= 1e100) return '∞';
    if (num >= 1e60) return (num / 1e60).toFixed(1) + 'Qd';
    if (num >= 1e57) return (num / 1e57).toFixed(1) + 'Qi';
    if (num >= 1e54) return (num / 1e54).toFixed(1) + 'Qa';
    if (num >= 1e51) return (num / 1e51).toFixed(1) + 'Tr';
    if (num >= 1e48) return (num / 1e48).toFixed(1) + 'T';
    if (num >= 1e45) return (num / 1e45).toFixed(1) + 'Bi';
    if (num >= 1e42) return (num / 1e42).toFixed(1) + 'B';
    if (num >= 1e39) return (num / 1e39).toFixed(1) + 'Mi';
    if (num >= 1e36) return (num / 1e36).toFixed(1) + 'M';
    if (num >= 1e33) return (num / 1e33).toFixed(1) + 'k';
    if (num >= 1e30) return (num / 1e30).toFixed(1) + 'Dc';
    if (num >= 1e27) return (num / 1e27).toFixed(1) + 'No';
    if (num >= 1e24) return (num / 1e24).toFixed(1) + 'Oc';
    if (num >= 1e21) return (num / 1e21).toFixed(1) + 'Sp';
    if (num >= 1e18) return (num / 1e18).toFixed(1) + 'Sx';
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Qa';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    if (num < 0.01 && num > 0) return num.toExponential(2);
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
    const eraEmojis = ['🌱', '⚔️', '🏛️', '🌌', '♾️'];
    const eraColors = ['#c084fc', '#ff8a8a', '#ffd700', '#7cf9ff', '#ff6bff'];
    const eraNames = ['Начала', 'Героев', 'Мифов', 'Космоса', 'Абсолюта'];
    
    for (let i = 0; i < upgrades.length; i++) {
        const upg = upgrades[i];
        const cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
        const era = Math.floor(i / 10);
        const canBuy = coins >= cost;
        const stars = upg.level > 0 ? '⭐'.repeat(Math.min(upg.level, 4)) : '';
        
        if (i % 10 === 0) {
            html += `<div style="text-align:center;font-size:10px;color:#888;padding:4px 0;border-top:1px solid rgba(255,255,255,0.05);margin-top:4px;">
                ${eraEmojis[era]} Эпоха ${eraNames[era]}
            </div>`;
        }
        
        html += `<button class="shop-btn tier${era + 1}" onclick="buyUpgrade(${i})" style="${canBuy ? '' : 'opacity:0.4;'}">
            <span class="icon">${upg.name.split(' ')[0] || '⬆️'}</span>
            <span class="text">${upg.name} ${stars}</span>
            <span class="price" style="color:${eraColors[era]};">${formatNumber(cost)} 💵</span>
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
        html += `<button class="shop-btn business" onclick="buyBusiness(${i})" style="${canBuy ? '' : 'opacity:0.4;'}">
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
        html += `<button class="shop-btn expedition" onclick="startExpedition(${i})" style="${canBuy ? '' : 'opacity:0.4;'}">
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
        html += `<button class="shop-btn crystal-shop" onclick="buyCrystalItem(${i})" style="${canBuy ? '' : 'opacity:0.4;'}">
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
    let timeLeft = exp.duration;
    const reward = exp.reward;
    const status = document.getElementById('expeditionStatus');
    
    status.textContent = '⏳ ' + exp.name + '... ' + timeLeft + ' сек';
    status.className = 'expedition-status active';
    showFloatingText('🗺️ ' + exp.name + ' началась!');
    saveGame();
    updateUI();
    
    if (expeditionTimer) clearInterval(expeditionTimer);
    
    expeditionTimer = setInterval(function() {
        timeLeft--;
        if (status) {
            status.textContent = '⏳ ' + exp.name + '... ' + timeLeft + ' сек';
        }
        
        if (timeLeft <= 0) {
            clearInterval(expeditionTimer);
            expeditionTimer = null;
            expeditionActive = false;
            
            const bonus = reward + Math.floor(Math.random() * Math.floor(reward * 0.3));
            crystals += bonus;
            
            if (status) {
                status.textContent = '✅ ' + exp.name + ' завершена! +' + bonus + ' 💎 кристаллов!';
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
   