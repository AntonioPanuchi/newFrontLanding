/**
 * Улучшенные функции для ROX.VPN
 * Включает навигацию, мобильное меню, анимации и интерактивные элементы
 */

class EnhancedFeatures {
    constructor() {
    this.isDarkMode = false;
    this.isMobileMenuOpen = false;
    this.currentSection = '';
        this.init();
    }

    init() {
    this.setupTheme();
    this.setupMobileMenu();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupAnimations();
    this.setupNotifications();
    this.setupAccessibility();
    this.setupFAQ();
        }

  // Настройка темы
  setupTheme() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      this.setTheme(prefersDarkScheme.matches);
            }

    // Обработчик переключения темы
    darkModeToggle?.addEventListener('click', () => {
      this.setTheme(!this.isDarkMode);
    });

    // Обработчик изменения системной темы
    prefersDarkScheme.addListener((e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches);
      }
    });
  }

  setTheme(isDark) {
    this.isDarkMode = isDark;
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Обновляем иконку
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = isDark ? 
        '<i class="fas fa-sun text-lg"></i>' : 
        '<i class="fas fa-moon text-lg"></i>';
    }
  }

  // Настройка мобильного меню
  setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');

    mobileMenuToggle?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Закрываем меню при клике на ссылку
    mobileNavLinks?.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
      if (this.isMobileMenuOpen && 
          !mobileMenu?.contains(e.target) && 
          !mobileMenuToggle?.contains(e.target)) {
        this.closeMobileMenu();
    }
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      if (mobileMenu) mobileMenu.classList.remove('hidden');
      if (mobileMenuToggle) mobileMenuToggle.innerHTML = '<i class="fas fa-times text-lg"></i>';
      document.body.style.overflow = 'hidden';
    } else {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      if (mobileMenuToggle) mobileMenuToggle.innerHTML = '<i class="fas fa-bars text-lg"></i>';
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  // Настройка навигации
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
                e.preventDefault();
          this.smoothScrollTo(href);
        }
      });
    });

    // Активная навигация при скролле
    this.updateActiveNavigation();
  }

  smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
                if (target) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
                    });
                }
            }

  updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          this.setActiveNavLink(currentId);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  setActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('text-blue-600', 'dark:text-blue-400');
        link.classList.remove('text-gray-700', 'dark:text-gray-300');
      } else {
        link.classList.remove('text-blue-600', 'dark:text-blue-400');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
            }
        });
    }

  // Эффекты при скролле
  setupScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Эффект скрытия/показа header
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header?.classList.add('-translate-y-full');
      } else {
        header?.classList.remove('-translate-y-full');
      }
      
      lastScrollY = currentScrollY;
  });
}

  // Настройка анимаций
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
    }
      });
    }, observerOptions);

    // Наблюдаем за элементами с анимациями
    document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
      observer.observe(el);
    });
  }

  // Настройка уведомлений
  setupNotifications() {
    const notification = document.getElementById('notification');
    if (!notification) return;

    let hideTimeout;
    let isVisible = false;
    
    const showNotification = () => {
      notification.style.transform = 'translateX(0)';
      isVisible = true;
    };
    
    const hideNotification = () => {
      notification.style.transform = 'translateX(100%)';
      isVisible = false;
    };
    
    // Показываем уведомление через 1 секунду
    setTimeout(() => {
      showNotification();
      hideTimeout = setTimeout(hideNotification, 5000);
    }, 1000);

    // Обработчик клика для закрытия
    notification.addEventListener('click', () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      hideNotification();
    });
  }

  // Настройка доступности
  setupAccessibility() {
    // Навигация с клавиатуры
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    // Фокус для скринридеров
    const skipLink = document.querySelector('.skip-link');
    skipLink?.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#main-content');
      target?.focus();
    });
  }

  // Настройка FAQ
  setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Закрываем все остальные вопросы
        faqQuestions.forEach(q => {
          q.classList.remove('active');
          q.nextElementSibling.classList.remove('active');
        });
        
        // Открываем текущий вопрос, если он был закрыт
        if (!isActive) {
          question.classList.add('active');
          answer.classList.add('active');
        }
      });
    });
  }

  // Утилитарные методы
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    const colors = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white'
    };
    
    toast.className += ` ${colors[type] || colors.info}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
        
    // Показываем
        setTimeout(() => {
      toast.classList.remove('translate-x-full');
        }, 100);

    // Скрываем
    setTimeout(() => {
      toast.classList.add('translate-x-full');
            setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
            }, duration);
        }

  // Метод для показа модального окна
  showModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        ${title ? `<div class="modal-header"><h3 class="text-lg font-semibold">${title}</h3></div>` : ''}
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Закрыть</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модала
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Закрытие по Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
            }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Метод для загрузки данных с индикатором
  async fetchWithLoader(url, options = {}) {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = '<div class="spinner spinner-lg"></div>';
    
    document.body.appendChild(loader);
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      this.showToast('Ошибка загрузки данных', 'error');
      throw error;
    } finally {
      document.body.removeChild(loader);
    }
  }

  // Метод для валидации форм
  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('border-red-500');
        isValid = false;
      } else {
        input.classList.remove('border-red-500');
                }
            });
    
    return isValid;
  }

  // Метод для форматирования чисел
  formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
  }

  // Метод для форматирования времени
  formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}д ${hours}ч ${minutes}м`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else {
      return `${minutes}м`;
    }
  }

  // Метод для форматирования размера файла
  formatFileSize(bytes) {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    if (bytes === 0) return '0 Б';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Метод для копирования в буфер обмена
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Скопировано в буфер обмена', 'success');
    } catch (error) {
      console.error('Ошибка копирования:', error);
      this.showToast('Ошибка копирования', 'error');
    }
  }

  // Метод для дебаунса
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Метод для throttle
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
            }
    };
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedFeatures = new EnhancedFeatures();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedFeatures;
} 