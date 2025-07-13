// Анимированные счетчики
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target);
        this.duration = duration;
        this.startTime = null;
        this.current = 0;
    }

    start() {
        this.startTime = performance.now();
        this.animate();
    }

    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        this.current = Math.floor(this.target * progress);
        this.element.textContent = this.current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame((time) => this.animate(time));
        }
    }
}

// Улучшенная аналитика
class EnhancedAnalytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.trackUserEngagement();
    }

    trackEvent(event, data = {}) {
        const eventData = {
            event,
            data,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.sessionStart,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(eventData);
        
        // Отправка в Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }

        // Отправка в собственную аналитику
        this.sendToServer(eventData);
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    trackUserEngagement() {
        let lastActivity = Date.now();
        const activityThreshold = 30000; // 30 секунд

        const updateActivity = () => {
            lastActivity = Date.now();
        };

        const checkEngagement = () => {
            const timeSinceLastActivity = Date.now() - lastActivity;
            if (timeSinceLastActivity > activityThreshold) {
                this.trackEvent('user_inactive', {
                    duration: timeSinceLastActivity
                });
            }
        };

        // Отслеживание активности пользователя
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });

        // Проверка каждые 30 секунд
        setInterval(checkEngagement, activityThreshold);
    }

    setupEventListeners() {
        // Отслеживание кликов по CTA кнопкам
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="t.me"], button')) {
                this.trackEvent('cta_click', {
                    element: e.target.textContent.trim(),
                    href: e.target.href || 'button'
                });
            }
        });

        // OPTIMIZED: Throttled scroll tracking for better performance
        let scrollTicking = false;
        let scrollDepth = 0;
        
        function updateScrollDepth() {
            const newScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
                this.trackEvent('scroll_depth', { depth: newScrollDepth });
                scrollDepth = newScrollDepth;
            }
            scrollTicking = false;
        }
        
        function requestScrollTick() {
            if (!scrollTicking) {
                requestAnimationFrame(updateScrollDepth.bind(this));
                scrollTicking = true;
            }
        }
        
        window.addEventListener('scroll', requestScrollTick.bind(this), { passive: true });
    }

    async sendToServer(eventData) {
        // Аналитика пока отключена - endpoint не существует
        console.log('Analytics event:', eventData.event, eventData.data);
        
        // TODO: Добавить endpoint для аналитики в backend
        // try {
        //     await fetch('/api/analytics', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(eventData)
        //     });
        // } catch (error) {
        //     console.warn('Failed to send analytics:', error);
        // }
    }
}

// Улучшенная мобильная навигация
class MobileNavigation {
    constructor() {
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        nav.innerHTML = `
            <a href="#hero" class="mobile-nav-item">
                <i class="fas fa-home"></i>
                <span>Главная</span>
            </a>
            <a href="#servers" class="mobile-nav-item">
                <i class="fas fa-server"></i>
                <span>Серверы</span>
            </a>
            <a href="#how-it-works" class="mobile-nav-item">
                <i class="fas fa-play"></i>
                <span>Как начать</span>
            </a>
            <a href="#faq" class="mobile-nav-item">
                <i class="fas fa-question"></i>
                <span>FAQ</span>
            </a>
        `;
        
        document.body.appendChild(nav);
        this.nav = nav;
    }

    setupEventListeners() {
        // Плавная прокрутка к секциям
        this.nav.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-nav-item')) {
                e.preventDefault();
                const href = e.target.closest('.mobile-nav-item').getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Обновление активного элемента при скролле
        window.addEventListener('scroll', () => {
            this.updateActiveSection();
        });
    }

    updateActiveSection() {
        const sections = ['#hero', '#servers', '#how-it-works', '#faq'];
        const scrollPosition = window.scrollY + 100;

        sections.forEach((sectionId, index) => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    this.setActiveItem(index);
                }
            }
        });
    }

    setActiveItem(index) {
        const items = this.nav.querySelectorAll('.mobile-nav-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
}

// Улучшенные уведомления
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            color: white;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="notification-icon">
                    ${this.getIcon(type)}
                </div>
                <div class="flex-1">
                    <div class="font-medium">${message}</div>
                </div>
                <button class="notification-close text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        // Кнопка закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hide(notification);
        });

        this.notifications.push(notification);
        return notification;
    }

    hide(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle text-green-400"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-400"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-400"></i>',
            info: '<i class="fas fa-info-circle text-blue-400"></i>'
        };
        return icons[type] || icons.info;
    }
}

// Улучшенная производительность
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.optimizeImages();
    }

    setupLazyLoading() {
        // Lazy loading для изображений
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    setupIntersectionObserver() {
        // Анимация элементов при появлении в viewport
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    optimizeImages() {
        // Оптимизация изображений для разных размеров экрана
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src) {
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        });
    }
}

// Инициализация всех улучшений
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация счетчиков
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
        const target = counter.dataset.target;
        if (target) {
            const animatedCounter = new AnimatedCounter(counter, target);
            
            // Запуск анимации при появлении в viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animatedCounter.start();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        }
    });

    // Инициализация аналитики
    const analytics = new EnhancedAnalytics();

    // Инициализация мобильной навигации
    if (window.innerWidth <= 768) {
        const mobileNav = new MobileNavigation();
    }

    // Инициализация уведомлений
    const notifications = new NotificationManager();

    // Инициализация оптимизации производительности
    const performanceOptimizer = new PerformanceOptimizer();

    // Глобальные объекты для доступа из других модулей
    window.ROXAnalytics = analytics;
    window.ROXNotifications = notifications;
});

// Экспорт классов для использования в других модулях
window.AnimatedCounter = AnimatedCounter;
window.EnhancedAnalytics = EnhancedAnalytics;
window.MobileNavigation = MobileNavigation;
window.NotificationManager = NotificationManager;
window.PerformanceOptimizer = PerformanceOptimizer; 