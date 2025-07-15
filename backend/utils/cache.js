class StatusCache {
    constructor(duration = 60 * 1000) {
        this.statuses = [];
        this.lastFetchTime = 0;
        this.duration = duration;
    }
    isFresh() {
        return this.statuses.length > 0 && (Date.now() - this.lastFetchTime < this.duration);
    }
    get() {
        return this.statuses;
    }
    set(statuses) {
        this.statuses = statuses;
        this.lastFetchTime = Date.now();
    }
    getAge() {
        return this.lastFetchTime > 0 ? Date.now() - this.lastFetchTime : null;
    }
    getLastUpdate() {
        return this.lastFetchTime > 0 ? new Date(this.lastFetchTime).toISOString() : null;
    }
}

class CookieCache {
    constructor(duration = 55 * 60 * 1000) {
        this.cache = {};
        this.duration = duration;
    }
    get(url) {
        const entry = this.cache[url];
        if (entry && entry.expiresAt > Date.now()) {
            return entry.cookie;
        }
        return null;
    }
    set(url, cookie) {
        this.cache[url] = {
            cookie,
            expiresAt: Date.now() + this.duration
        };
    }
}

module.exports = { StatusCache, CookieCache }; 