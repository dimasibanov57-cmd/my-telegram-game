// ========== ПЕРЕМЕННЫЕ ==========
var coins = parseFloat(localStorage.getItem('coins')) || 0;
var clickPower = parseFloat(localStorage.getItem('clickPower')) || 1;
var energy = parseFloat(localStorage.getItem('energy')) || 500;
var maxEnergy = parseFloat(localStorage.getItem('maxEnergy')) || 500;
var level = parseInt(localStorage.getItem('level')) || 1;
var passiveIncome = parseFloat(localStorage.getItem('passiveIncome')) || 0;
var totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
var prestige = parseInt(localStorage.getItem('prestige')) || 0;
var regenSpeed = parseFloat(localStorage.getItem('regenSpeed')) || 1;
var luckActive = false;
var luckTimer = null;

// ========== 40 УЛУЧШЕНИЙ ДО ГУГОЛА ==========
var upgradeNames = [
    // Tier 1: Начало (1-5)
    '⬆️ Улучшить тап', '💪 Сильный тап', '🔥 Мощный тап', '⚡ Сокрушительный тап', '💎 Титанический тап',
    // Tier 2: Героические (6-10)
    '⚔️ Гигантский тап', '🛡️ Колоссальный тап', '👑 Исполинский тап', '⭐ Легендарный тап', '🌟 Мифический тап',
    // Tier 3: Божественные (11-15)
    '🌌 Божественный тап', '🚀 Космический тап', '🌀 Галактический тап', '♾️ Вселенский тап', '✨ Мультивселенский тап',
    // Tier 4: Космические (16-20)
    '🌠 Звёздный тап', '☀️ Солнечный тап', '🌙 Лунный тап', '🪐 Планетарный тап', '🌌 Квазарный тап',
    // Tier 5: Абсолютные (21-25)
    '🔥 Сверхновый тап', '⚡ Омега-тап', '🌀 Альфа-тап', '💫 Сигма-тап', '⭐ Дельта-тап',
    // Tier 6: Трансцендентные (26-30)
    '♾️ Бесконечный тап', '✨ Вечный тап', '🌟 Нерушимый тап', '💎 Несокрушимый тап', '👑 Всемогущий тап',
    // Tier 7: Божественные (31-35)
    '⚡ Абсолютный тап', '🌀 Трансцендентный', '🌌 Экзистенциальный', '✨ Нуменальный', '🌟 Феноменальный',
    // Tier 8: Абсолютные (36-40)
    '♾️ Ноуменальный', '⚡ Эйдетический', '💫 Априорный', '🔥 Синтетический', '👑 БОЖЕСТВЕННЫЙ АБСОЛЮТ'
];

var upgrades = [];
for (var i = 0; i < 40; i++) {
    var saved = localStorage.getItem('upgrade_' + i);
    upgrades.push({
        level: saved ? parseInt(saved) : 0,
        cost: 50 * Math.pow(4, i * 0.3),
        power: Math.pow(2.5, i * 0.25),
        name: upgradeNames[i] || 'Улучшение ' + (i + 1),
        tier: Math.floor(i / 5) + 1
    });
}

// ========== БИЗНЕСЫ (15 УРОВНЕЙ) ==========
var businessNames = [
    '🥤 Ларёк', '🏪 Магазин', '🏬 Супермаркет', '🏭 Завод', '🚚 Логистика',
    '🏗️ Стройка', '🛢️ Нефть', '🛸 Космос', '🏦 Банк', '🌍 Корпорация',
    '🚀 Галактика', '🌌 Вселенная', '🌀 Мультивселенная', '⚡ Энергия Бога', '👑 АБСОЛЮТ'
];

var businesses = [];
for (var i = 0; i < businessNames.length; i++) {
    var saved = localStorage.getItem('business_' + i);
    var baseCost = 500 * Math.pow(6, i * 0.4);
    var baseIncome = 10 * Math.pow(4, i * 0.5);
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

// ========== ФОРМАТИРОВАНИЕ ЧИСЕЛ ДО ГУГОЛА ==========
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
    var container = document.getElementById('floatingTexts');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (25 + Math.random() * 50) + '%';
    el.style.top = (25 + Math.random() * 40) + '%';
    container.appendChild(el);
    setTimeout(function() { el.remove(); }, 800);
}

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    document.getElementById('coinCounter').textContent = formatNumber(coins);
    document.getElementById('energyCounter').textContent = Math.floor(energy) + '/' + Math.floor(maxEnergy);
    document.getElementById('energyFill').style.width = (energy / maxEnergy * 100) + '%';
    document.getElementById('tapPowerDisplay').textContent = formatNumber(clickPower);
    document.getElementById('incomeDisplay').textContent = formatNumber(passiveIncome);
    document.getElementById('levelDisplay').textContent = level;
    document.getElementById('prestigeDisplay').textContent = prestige;
    document.getElementById('maxEnergyDisplay').textContent = Math.floor(maxEnergy);
    document.getElementById('regenSpeedDisplay').textContent = regenSpeed + '/сек';
    
    document.getElementById('energyCostDisplay').textContent = formatNumber(50 + level * 5) + ' 💵';
    document.getElementById('maxEnergyCostDisplay').textContent = formatNumber(100 + (maxEnergy - 500) * 0.5) + ' 💵';
    document.getElementById('regenCostDisplay').textContent = formatNumber(200 + regenSpeed * 100) + ' 💵';
    
    renderUpgrades();
    renderBusiness();
}

// ========== РЕНДЕР УЛУЧШЕНИЙ ==========
function renderUpgrades() {
    var container = document.getElementById('upgradesContainer');
    if (!container) return;
    var html = '';
    var tierEmojis = ['', '🌱', '⚔️', '🌌', '🌠', '💫', '♾️', '✨', '👑'];
    var tierColors = ['', '#c084fc', '#ff8a8a', '#7cf9ff', '#ffd700', '#ff6bff', '#6fdfaa', '#ffdd00', '#ff4444'];
    var tierNames = ['', 'Начало', 'Герои', 'Космос', 'Звёзды', 'Абсолют', 'Трансцендентность', 'Божественность', 'Абсолют'];
    
    for (var i = 0; i < upgrades.length; i++) {
        var upg = upgrades[i];
        var cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
        var tier = upg.tier;
        var canBuy = coins >= cost;
        var stars = upg.level > 0 ? '⭐'.repeat(Math.min(upg.level, 5)) : '';
        
        if (i % 5 === 0 && i > 0) {
            html += '<div style="text-align:center;font-size:9px;color:#666;padding:6px 0 4px;border-top:1px solid rgba(255,255,255,0.05);margin-top:4px;">';
            html += tierEmojis[tier] + ' Уровень ' + tierNames[tier];
            html += '</div>';
        }
        
        html += '<button class="shop-btn tier' + tier + '" onclick="buyUpgrade(' + i + ')" style="' + (canBuy ? '' : 'opacity:0.4;') + '">';
        html += '<span class="icon">' + (upg.name.split(' ')[0] || '⬆️') + '</span>';
        html += '<span class="text">' + upg.name + ' ' + stars + '</span>';
        html += '<span class="price" style="color:' + tierColors[tier] + ';">' + formatNumber(cost) + ' 💵</span>';
        html += '</button>';
    }
    container.innerHTML = html;
}

// ========== РЕНДЕР БИЗНЕСОВ ==========
function renderBusiness() {
    var container = document.getElementById('businessContainer');
    if (!container) return;
    var html = '';
    for (var i = 0; i < businesses.length; i++) {
        var biz = businesses[i];
        var cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
        var canBuy = coins >= cost;
        var stars = biz.level > 0 ? '⭐'.repeat(Math.min(biz.level, 5)) : '';
        html += '<button class="shop-btn business" onclick="buyBusiness(' + i + ')" style="' + (canBuy ? '' : 'opacity:0.4;') + '">';
        html += '<span class="icon">🏢</span>';
        html += '<span class="text">' + biz.name + ' ' + stars + '</span>';
        html += '<span class="price">' + formatNumber(cost) + ' 💵</span>';
        html += '</button>';
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
    var earned = clickPower;
    if (luckActive) earned *= 2;
    coins += earned;
    totalClicks++;
    
    if (navigator.vibrate) navigator.vibrate(10);
    showFloatingText('+' + formatNumber(earned) + '💵');
    
    var needed = level * 100;
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
    var upg = upgrades[index];
    var cost = Math.floor(upg.cost * (1 + upg.level * 0.5));
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
    var biz = businesses[index];
    var cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
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
    var cost = Math.floor(50 + level * 5);
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
    var cost = Math.floor(100 + (maxEnergy - 500) * 0.5);
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
    var cost = Math.floor(200 + regenSpeed * 100);
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
    luckTimer = setTimeout(function() {
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
    var multiplier = Math.floor(Math.random() * 9) + 2;
    var win = 100 * multiplier;
    coins += win;
    showFloatingText('🎰 x' + multiplier + '! +' + win + '💵');
    saveGame();
    updateUI();
}

// ========== ЕЖЕДНЕВНЫЙ БОНУС ==========
var lastBonusDate = localStorage.getItem('lastBonusDate') || '';

function claimDailyBonus() {
    var today = new Date().toDateString();
    if (lastBonusDate === today) {
        showFloatingText('⏳ Бонус уже получен!');
        var bt = document.getElementById('bonusTimer');
        if (bt) bt.textContent = '⏳ Завтра';
        return;
    }
    var bonus = 100 + level * 20 + prestige * 100;
    coins += bonus;
    lastBonusDate = today;
    localStorage.setItem('lastBonusDate', today);
    showFloatingText('🎁 +' + bonus + '💵 бонус!');
    var bt = document.getElementById('bonusTimer');
    if (bt) bt.textContent = '✅ Получен!';
    updateUI();
    saveGame();
}

// ========== ПРЕСТИЖ ==========
function doPrestige() {
    var cost = 1000000 * (prestige + 1);
    if (coins < cost) {
        showFloatingText('😅 Нужно ' + formatNumber(cost) + ' 💵!');
        return;
    }
    var totalUpgradeLevels = 0;
    for (var i = 0; i < upgrades.length; i++) {
        totalUpgradeLevels += upgrades[i].level;
    }
    coins = 1000 * (prestige + 1);
    clickPower = 1;
    energy = 500;
    maxEnergy = 500;
    passiveIncome = 0;
    level = 1;
    totalClicks = 0;
    for (var i = 0; i < upgrades.length; i++) {
        upgrades[i].level = 0;
    }
    for (var i = 0; i < businesses.length; i++) {
        businesses[i].level = 0;
    }
    prestige++;
    passiveIncome += Math.floor(totalUpgradeLevels * 2);
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '!');
    saveGame();
    updateUI();
}

// ========== ПАССИВНЫЙ ДОХОД ==========
setInterval(function() {
    if (passiveIncome > 0) {
        coins += passiveIncome;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ==========
setInterval(function() {
    if (energy < maxEnergy) {
        energy += regenSpeed * 0.5;
        if (energy > maxEnergy) energy = maxEnergy;
        updateUI();
        saveGame();
    }
}, 1000);

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
    for (var i = 0; i < upgrades.length; i++) {
        localStorage.setItem('upgrade_' + i, upgrades[i].level);
    }
    for (var i = 0; i < businesses.length; i++) {
        localStorage.setItem('business_' + i, businesses[i].level);
    }
}

// ========== ВКЛАДКИ ==========
var tabButtons = document.querySelectorAll('.tab-btn');
for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function() {
        var allButtons = document.querySelectorAll('.tab-btn');
        for (var j = 0; j < allButtons.length; j++) {
            allButtons[j].classList.remove('active');
        }
        this.classList.add('active');
        var allPanels = document.querySelectorAll('.tab-panel');
        for (var j = 0; j < allPanels.length; j++) {
            allPanels[j].classList.remove('active');
        }
        var panel = document.getElementById('tab-' + this.dataset.tab);
        if (panel) panel.classList.add('active');
    });
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', function() {
    var coinImage = document.getElementById('coinImage');
    if (coinImage) {
        coinImage.addEventListener('click', tap);
    }
    if (lastBonusDate === new Date().toDateString()) {
        var bt = document.getElementById('bonusTimer');
        if (bt) bt.textContent = '✅ Получен!';
    }
    updateUI();
    console.log('✅ ИГРА ЗАПУЩЕНА!');
    console.log('40 улучшений до ГУГОЛА');
    console.log('15 бизнесов');
});