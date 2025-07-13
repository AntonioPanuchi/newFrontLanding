// Загружаем переменные окружения
require('dotenv').config({ path: './backend/.env' });

async function testVPNConnection() {
    const servers = [
        {
            name: "Germany",
            baseUrl: process.env.GERMANY_API_URL,
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        }
    ];

    for (const server of servers) {
        console.log(`\n=== Тестирование ${server.name} ===`);
        console.log(`URL: ${server.baseUrl}`);
        console.log(`Username: ${server.username}`);
        
        try {
            // Логин
            console.log('\n1. Логин...');
            const loginResponse = await fetch(`${server.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: server.username,
                    password: server.password
                }),
                timeout: 10000
            });
            
            if (!loginResponse.ok) {
                throw new Error(`Login failed: ${loginResponse.status}`);
            }
            
            const cookies = loginResponse.headers.get('set-cookie');
            console.log('✅ Логин успешен');
            
            // Тестируем различные endpoints для получения данных
            const endpoints = [
                { name: 'inbounds с параметрами', url: '/xui/inbounds', method: 'POST', body: { page: 1, limit: 10 } },
                { name: 'inbounds list с параметрами', url: '/xui/inbounds/list', method: 'POST', body: { page: 1, limit: 10 } },
                { name: 'inbounds stats с параметрами', url: '/xui/inbounds/stats', method: 'POST', body: { id: 1 } },
                { name: 'panel stats с параметрами', url: '/xui/panel/stats', method: 'POST', body: { start: 0, end: 100 } },
                { name: 'users с параметрами', url: '/xui/users', method: 'POST', body: { page: 1, limit: 10 } },
                { name: 'traffic с параметрами', url: '/xui/traffic', method: 'POST', body: { start: 0, end: 100 } },
                { name: 'api inbounds', url: '/api/inbounds', method: 'GET' },
                { name: 'api stats', url: '/api/stats', method: 'GET' },
                { name: 'api users', url: '/api/users', method: 'GET' },
                { name: 'api traffic', url: '/api/traffic', method: 'GET' },
                { name: 'api overview', url: '/api/overview', method: 'GET' },
                { name: 'api summary', url: '/api/summary', method: 'GET' }
            ];
            
            console.log('\n2. Тестирование endpoints для получения данных...');
            
            for (const endpoint of endpoints) {
                try {
                    console.log(`\nТестируем: ${endpoint.name} (${endpoint.method} ${endpoint.url})`);
                    
                    const requestOptions = {
                        method: endpoint.method,
                        headers: {
                            'Cookie': cookies,
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000
                    };
                    
                    if (endpoint.body) {
                        requestOptions.body = JSON.stringify(endpoint.body);
                    }
                    
                    const response = await fetch(`${server.baseUrl}${endpoint.url}`, requestOptions);
                    
                    console.log(`Статус: ${response.status}`);
                    
                    if (response.ok) {
                        const text = await response.text();
                        console.log(`Длина ответа: ${text.length} символов`);
                        
                        if (text.length > 0) {
                            try {
                                const json = JSON.parse(text);
                                console.log('✅ JSON парсится успешно!');
                                console.log('Структура ответа:', Object.keys(json));
                                
                                // Если это массив, показываем первый элемент
                                if (Array.isArray(json) && json.length > 0) {
                                    console.log('Первый элемент:', Object.keys(json[0]));
                                    console.log('Количество элементов:', json.length);
                                }
                                
                                // Если есть объект obj, показываем его структуру
                                if (json.obj) {
                                    console.log('Объект obj:', Object.keys(json.obj));
                                }
                                
                                // Если есть объект data, показываем его структуру
                                if (json.data) {
                                    console.log('Объект data:', Object.keys(json.data));
                                }
                                
                            } catch (parseError) {
                                console.log('❌ Ошибка парсинга JSON:', parseError.message);
                                if (text.includes('<!DOCTYPE')) {
                                    console.log('❌ Возвращается HTML страница');
                                } else {
                                    console.log('Ответ (первые 200 символов):', text.substring(0, 200));
                                }
                            }
                        } else {
                            console.log('❌ Пустой ответ');
                        }
                    } else {
                        console.log('❌ Ошибка HTTP');
                    }
                } catch (error) {
                    console.log(`❌ Ошибка запроса: ${error.message}`);
                }
            }
            
        } catch (error) {
            console.log(`Ошибка: ${error.message}`);
        }
    }
}

testVPNConnection().catch(console.error); 