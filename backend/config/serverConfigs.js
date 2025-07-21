import { validateUrl, validateCredentials } from './validation.js';

export function getServerConfigs(env = process.env) {
    const germanyUrl = validateUrl(env.GERMANY_API_URL, 'GERMANY_API_URL');
    const usaUrl = validateUrl(env.USA_API_URL, 'USA_API_URL');
    const finlandUrl = validateUrl(env.FINLAND_API_URL, 'FINLAND_API_URL');
    const credentials = validateCredentials(env.USERNAME, env.PASSWORD);
    return [
        {
            name: 'Germany',
            baseUrl: germanyUrl,
            username: credentials.username,
            password: credentials.password,
            pingHost: env.PINGHOST1
        },
        {
            name: 'USA',
            baseUrl: usaUrl,
            username: credentials.username,
            password: credentials.password,
            pingHost: env.PINGHOST2
        },
        {
            name: 'Finland',
            baseUrl: finlandUrl,
            username: credentials.username,
            password: credentials.password,
            pingHost: env.PINGHOST3
        }
    ];
}
