/**
 * EnhancedMobileNavigation - Улучшенная мобильная навигация
 */
class EnhancedMobileNavigation {
    constructor() {
        this.isVisible = false;
        this.currentSection = 0;
        this.sections = ['#hero', '#servers', '#social-proof', '#how-it-works', '#faq'];
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
        this.setupSwipeGestures();
        this.setupHapticFeedback();
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'enhanced-mobile-nav fixed bottom-0 left-0 right-0 z-50 hidden md:hidden';
        nav.innerHTML = `
            <div class="flex items-center justify-around px-4 py-3">
                <a href="#hero" class="enhanced-mobile-nav-item flex flex-col items-center gap-1 text-xs transition-all duration-300" data-section="hero">
                    <i class="fas fa-home text-lg"></i>
                    <span>Главная</span>
                    <div class="nav-indicator w-1 h-1 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"></div>
                </a>
                <a href="#servers" class="enhanced-mobile-nav-item flex flex-col items-center gap-1 text-xs transition-all duration-300" data-section="servers">
                    <i class="fas fa-server text-lg"></i>
                    <span>Серверы</span>
                    <div class="nav-indicator w-1 h-1 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"></div>
                </a>
                <a href="#social-proof" class="enhanced-mobile-nav-item flex flex-col items-center gap-1 text-xs transition-all duration-300" data-section="social-proof">
                    <i class="fas fa-users text-lg"></i>
                    <span>Отзывы</span>
                    <div class="nav-indicator w-1 h-1 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"></div>
                </a>
                <a href="#how-it-works" class="enhanced-mobile-nav-item flex flex-col items-center gap-1 text-xs transition-all duration-300" data-section="how-it-works">
                    <i class="fas fa-play text-lg"></i>
                    <span>Как начать</span>
                    <div class="nav-indicator w-1 h-1 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"></div>
                </a>
                <a href="#faq" class="enhanced-mobile-nav-item flex flex-col items-center gap-1 text-xs transition-all duration-300" data-section="faq">
                    <i class="fas fa-question text-lg"></i>
                    <span>FAQ</span>
                    <div class="nav-indicator w-1 h-1 bg-green-400 rounded-full opacity-0 transition-opacity duration-300"></div>
                </a>
            </div>
            
            <!-- Floating Action Button -->
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <a href="https://t.me/RX_VPN_Seller_bot" target="_blank" 
                   class="floating-action-btn w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <i class="fab fa-telegram-plane text-xl"></i>
                </a>
            </div>
        `;
        
        document.body.appendChild(nav);
        this.nav = nav;
        this.navItems = nav.querySelectorAll('.enhanced-mobile-nav-item');
    }

    setupEventListeners() {
        // Плавная прокрутка к секциям
        this.nav.addEventListener('click', (e) => {
            const navItem = e.target.closest('.enhanced-mobile-nav-item');
            if (navItem) {
                e.preventDefault();
                const href = navItem.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    this.scrollToSection(target);
                    this.setActiveSection(navItem.dataset.section);
                    this.triggerHapticFeedback();
                }
            }
        });

        // Обработка клика по FAB
        this.nav.addEventListener('click', (e) => {
            if (e.target.closest('.floating-action-btn')) {
                this.triggerHapticFeedback('medium');
            }
        });

        // Обновление активного элемента при скролле
        window.addEventListener('scroll', () => {
            this.updateActiveSection();
        });

        // Показ/скрытие навигации при скролле
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            
            if (scrollDelta > 10 && currentScrollY > 100) {
                this.hideNavigation();
            } else if (scrollDelta < -10) {
                this.showNavigation();
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                isSwiping = true;
                e.preventDefault();
            }
        });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const deltaX = e.changedTouches[0].clientX - startX;
            const deltaY = e.changedTouches[0].clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    this.navigateToPreviousSection();
                } else {
                    this.navigateToNextSection();
                }
                this.triggerHapticFeedback();
            }

            startX = 0;
            startY = 0;
            isSwiping = false;
        });
    }

    setupHapticFeedback() {
        // Проверяем поддержку haptic feedback
        this.supportsHaptic = 'vibrate' in navigator;
    }

    triggerHapticFeedback(type = 'light') {
        if (!this.supportsHaptic) return;

        const patterns = {
            light: 10,
            medium: 20,
            heavy: 50
        };

        navigator.vibrate(patterns[type] || patterns.light);
    }

    scrollToSection(target) {
        const offset = 80; // Отступ для мобильной навигации
        const targetPosition = target.offsetTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setActiveSection(sectionName) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            const indicator = item.querySelector('.nav-indicator');
            indicator.style.opacity = '0';
        });

        const activeItem = this.nav.querySelector(`[data-section="${sectionName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            const indicator = activeItem.querySelector('.nav-indicator');
            indicator.style.opacity = '1';
        }
    }

    updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        let currentSection = 'hero';

        this.sections.forEach((section, index) => {
            const element = document.querySelector(section);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;

                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                    currentSection = section.replace('#', '');
                }
            }
        });

        this.setActiveSection(currentSection);
    }

    navigateToNextSection() {
        const currentIndex = this.sections.findIndex(section => {
            const element = document.querySelector(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            }
            return false;
        });

        const nextIndex = Math.min(currentIndex + 1, this.sections.length - 1);
        const nextSection = document.querySelector(this.sections[nextIndex]);
        
        if (nextSection) {
            this.scrollToSection(nextSection);
        }
    }

    navigateToPreviousSection() {
        const currentIndex = this.sections.findIndex(section => {
            const element = document.querySelector(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            }
            return false;
        });

        const prevIndex = Math.max(currentIndex - 1, 0);
        const prevSection = document.querySelector(this.sections[prevIndex]);
        
        if (prevSection) {
            this.scrollToSection(prevSection);
        }
    }

    showNavigation() {
        if (!this.isVisible) {
            this.nav.style.transform = 'translateY(0)';
            this.nav.style.opacity = '1';
            this.isVisible = true;
        }
    }

    hideNavigation() {
        if (this.isVisible) {
            this.nav.style.transform = 'translateY(100%)';
            this.nav.style.opacity = '0';
            this.isVisible = false;
        }
    }

    // Публичные методы
    refresh() {
        this.updateActiveSection();
    }

    destroy() {
        if (this.nav) {
            this.nav.remove();
        }
    }
}

// Добавляем CSS стили
const mobileNavStyles = document.createElement('style');
mobileNavStyles.textContent = `
    .enhanced-mobile-nav {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(100%);
        opacity: 0;
    }

    .enhanced-mobile-nav.visible {
        transform: translateY(0);
        opacity: 1;
    }

    .floating-action-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .floating-action-btn:active {
        transform: scale(0.95);
    }

    .nav-indicator {
        transition: all 0.3s ease;
    }

    .enhanced-mobile-nav-item.active {
        color: #22c55e;
        transform: translateY(-2px);
    }

    .enhanced-mobile-nav-item.active i {
        color: #22c55e;
    }

    @media (max-width: 768px) {
        .enhanced-mobile-nav {
            display: flex !important;
        }
    }
`;
document.head.appendChild(mobileNavStyles);

// Экспорт для использования
window.EnhancedMobileNavigation = EnhancedMobileNavigation; 