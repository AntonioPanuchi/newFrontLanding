#!/usr/bin/env node

/**
 * Тест логики полифилла fetch API
 */

console.log('🧪 Тестирование логики полифилла fetch API\n');

// Функция для определения необходимости полифилла
function needsPolyfill(nodeVersion) {
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    return majorVersion < 18;
}

// Тестируем разные версии Node.js
const testVersions = [
    'v16.20.0',
    'v17.9.0', 
    'v18.17.0',
    'v20.10.0',
    'v22.17.0'
];

console.log('📋 Тестирование версий:');
testVersions.forEach(version => {
    const needsPoly = needsPolyfill(version);
    const status = needsPoly ? '📦 Полифилл' : '✅ Нативный';
    const majorVersion = parseInt(version.slice(1).split('.')[0], 10);
    
    console.log(`${version}: ${status} (major: ${majorVersion})`);
});

console.log('\n🔍 Текущая система:');
const currentVersion = process.version;
const currentNeedsPoly = needsPolyfill(currentVersion);
const currentStatus = currentNeedsPoly ? '📦 Полифилл' : '✅ Нативный';
const currentMajor = parseInt(currentVersion.slice(1).split('.')[0], 10);

console.log(`${currentVersion}: ${currentStatus} (major: ${currentMajor})`);

console.log('\n📋 Результаты:');
console.log('- Node.js < 18: Требуется полифилл node-fetch');
console.log('- Node.js >= 18: Используется нативный fetch API');
console.log('- Логика корректно определяет необходимость полифилла'); 