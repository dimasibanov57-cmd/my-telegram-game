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