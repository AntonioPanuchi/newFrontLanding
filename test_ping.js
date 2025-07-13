async function pingServer(host) {
    try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут
        
        // Пробуем несколько методов ping
        const pingMethods = [
            // Метод 1: HTTPS HEAD запрос
            () => fetch(`https://${host}`, {
                method: 'HEAD',
                signal: controller.signal,
                headers: { 'User-Agent': 'ROX-VPN-Monitor/1.0' }
            }),
            // Метод 2: HTTP HEAD запрос
            () => fetch(`http://${host}`, {
                method: 'HEAD',
                signal: controller.signal,
                headers: { 'User-Agent': 'ROX-VPN-Monitor/1.0' }
            }),
            // Метод 3: HTTPS GET запрос
            () => fetch(`https://${host}`, {
                method: 'GET',
                signal: controller.signal,
                headers: { 'User-Agent': 'ROX-VPN-Monitor/1.0' }
            }),
            // Метод 4: HTTP GET запрос
            () => fetch(`http://${host}`, {
                method: 'GET',
                signal: controller.signal,
                headers: { 'User-Agent': 'ROX-VPN-Monitor/1.0' }
            })
        ];
        
        let lastError;
        for (let i = 0; i < pingMethods.length; i++) {
            try {
                console.log(`Пробуем метод ${i + 1} для ${host}...`);
                const response = await pingMethods[i]();
                clearTimeout(timeoutId);
                const endTime = Date.now();
                const pingTime = endTime - startTime;
                
                console.log(`✅ Метод ${i + 1} успешен для ${host}: ${pingTime}ms`);
                return { time: pingTime, alive: true };
            } catch (error) {
                console.log(`❌ Метод ${i + 1} не удался для ${host}: ${error.message}`);
                lastError = error;
                continue; // Пробуем следующий метод
            }
        }
        
        // Если все методы не сработали, возвращаем ошибку
        throw lastError;
        
    } catch (error) {
        console.log(`❌ Все методы ping не удались для ${host}: ${error.message}`);
        return { time: -1, alive: false };
    }
}

// Тестируем ping
async function testPing() {
    const hosts = ['www.google.com', 'www.cloudflare.com', 'www.github.com'];
    
    for (const host of hosts) {
        console.log(`\n--- Тестируем ping для ${host} ---`);
        const result = await pingServer(host);
        console.log(`Результат: ${JSON.stringify(result)}`);
    }
}

testPing().catch(console.error); 