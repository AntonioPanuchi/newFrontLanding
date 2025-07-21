export function validateUrl(url, name) {
    if (!url) {
        throw new Error(`Missing ${name} URL`);
    }
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            throw new Error(`${name} URL must use HTTP or HTTPS protocol`);
        }
        if (!urlObj.hostname) {
            throw new Error(`${name} URL must have a valid hostname`);
        }
        return url;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(`${name} URL is not a valid URL: ${url}`);
        }
        throw error;
    }
}

export function validateCredentials(username, password) {
    if (!username || username.trim().length === 0) {
        throw new Error('USERNAME cannot be empty');
    }
    if (username.length < 3) {
        throw new Error('USERNAME must be at least 3 characters long');
    }
    if (!password || password.trim().length === 0) {
        throw new Error('PASSWORD cannot be empty');
    }
    if (password.length < 8) {
        throw new Error('PASSWORD must be at least 8 characters long');
    }
    return { username: username.trim(), password: password.trim() };
}

export function validateOptionalVars(env = process.env) {
    const optionalVars = {
        PORT: env.PORT || '3000',
        NODE_ENV: env.NODE_ENV || 'development',
        LOG_LEVEL: env.LOG_LEVEL || 'info'
    };

    const port = parseInt(optionalVars.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`PORT must be a number between 1 and 65535, got: ${optionalVars.PORT}`);
    }

    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(optionalVars.NODE_ENV)) {
        throw new Error(`NODE_ENV must be one of: ${validEnvs.join(', ')}, got: ${optionalVars.NODE_ENV}`);
    }

    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    if (!validLogLevels.includes(optionalVars.LOG_LEVEL)) {
        throw new Error(`LOG_LEVEL must be one of: ${validLogLevels.join(', ')}, got: ${optionalVars.LOG_LEVEL}`);
    }

    return optionalVars;
}
