// ==============================================
// СВАДЕБНЫЙ САЙТ - АРТЁМ & ТАТЬЯНА
// С интеграцией Google Sheets
// ==============================================

// Конфигурация
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzpL2Kou8xucA5lr9TQgZI8umYPrdUKfNRxy_dljR3ErXB6GXrmPiVIyRJ4wKzAeILL/exec', // ЗАМЕНИТЕ НА ВАШ URL
    TELEGRAM_CHAT_URL: 'https://max.ru/join/DClxg-eCcMrT7Nb3d15o9msX3lURma_dBszQm-CEKcE',
    WEDDING_DATE: '2026-07-09T15:25:00'
};

// Прелоадер
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 800);
    
    initTelegramLink();
    initMusic();
    initGallery();
});

// Таймер обратного отсчета
function updateCountdown() {
    const weddingDate = new Date(CONFIG.WEDDING_DATE).getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Настройка ссылки на чат
function initTelegramLink() {
    const chatLink = document.querySelector('.chat-link');
    if (chatLink && CONFIG.TELEGRAM_CHAT_URL) {
        chatLink.href = CONFIG.TELEGRAM_CHAT_URL;
        chatLink.target = '_blank';
        chatLink.rel = 'noopener noreferrer';
    }
}

// ========== БАЗОВЫЕ СТИЛИ АНИМАЦИЙ ==========
const coreStyles = document.createElement('style');
coreStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(coreStyles);

// ========== УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО ==========
function showModal(title, message, isError = false) {
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const icon = isError ? '✕' : '✓';
    const iconColor = isError ? '#c62828' : '#2e7d32';
    const bgIconColor = isError ? '#ffebee' : '#e8f5e9';
    const borderColor = isError ? '#c62828' : '#2e7d32';

    modal.innerHTML = `
        <div style="
            background: #ffffff;
            border-radius: 16px;
            padding: 32px 40px;
            max-width: 380px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s ease;
            border-top: 3px solid ${borderColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${bgIconColor};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px auto;
            ">
                <div style="
                    font-size: 32px;
                    font-weight: 400;
                    color: ${iconColor};
                    line-height: 1;
                ">${icon}</div>
            </div>
            <h3 style="
                font-size: 24px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            ">${title}</h3>
            <p style="
                font-size: 16px;
                color: #555555;
                margin-bottom: 28px;
                line-height: 1.5;
            ">${message}</p>
            <button onclick="this.closest('#customModal').remove()" style="
                background: #f5f5f5;
                color: #333333;
                border: none;
                padding: 12px 32px;
                border-radius: 40px;
                font-family: inherit;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    if (!isError) setTimeout(() => { if (modal.parentElement) modal.remove(); }, 4000);
}

// ========== МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ ==========
function showLoadingModal() {
    const existingLoading = document.getElementById('loadingModal');
    if (existingLoading) existingLoading.remove();
    
    const loadingModal = document.createElement('div');
    loadingModal.id = 'loadingModal';
    loadingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loadingModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 32px 40px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #e0e0e0;
                border-top-color: #d4b89c;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                font-size: 15px;
                color: #666;
                margin: 0;
            ">Отправка ответа...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);
    return loadingModal;
}

// ========== GOOGLE SHEETS ==========
class GoogleSheetsSender {
    constructor() {
        this.scriptUrl = CONFIG.APPS_SCRIPT_URL;
    }

    async sendFormData(formData) {
        const formBody = new URLSearchParams();
        Object.keys(formData).forEach(key => {
            formBody.append(key, formData[key]);
        });

        const response = await fetch(this.scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody.toString()
        });
        
        const result = await response.json();
        return result;
    }
}

const sheetsSender = new GoogleSheetsSender();

// Обработка формы RSVP
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        
        // Валидация
        const attendanceSelected = document.querySelector('input[name="attendance"]:checked');
        if (!attendanceSelected) {
            showModal('Ошибка', 'Пожалуйста, выберите, сможете ли вы прийти', true);
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name) {
            showModal('Ошибка', 'Пожалуйста, введите ваше имя', true);
            document.getElementById('name').focus();
            return;
        }
        
        // Показываем загрузку
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Отправка...</span>';
        submitBtn.disabled = true;
        
        const loadingModal = showLoadingModal();
        
        try {
            const formData = {
                name: name,
                attendance: attendanceSelected.value,
                message: message
            };
            
            const result = await sheetsSender.sendFormData(formData);
            
            loadingModal.remove();
            
            if (result.result === 'success') {
                const successMessage = document.getElementById('success-message');
                const form = document.getElementById('rsvp-form');
                const successTitle = successMessage.querySelector('h3');
                
                successTitle.textContent = `Спасибо, ${name}!`;
                
                form.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            loadingModal.remove();
            showModal('Ошибка', error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.', true);
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    });
}

// Кнопка "Заполнить ещё один ответ"
const newResponseBtn = document.getElementById('new-response');
if (newResponseBtn) {
    newResponseBtn.addEventListener('click', function() {
        const form = document.getElementById('rsvp-form');
        const successMessage = document.getElementById('success-message');
        const nameInput = document.getElementById('name');
        const messageTextarea = document.getElementById('message');
        
        form.reset();
        if (nameInput) nameInput.value = '';
        if (messageTextarea) messageTextarea.value = '';
        
        const errors = document.querySelectorAll('.form-error');
        errors.forEach(error => error.remove());
        
        successMessage.style.display = 'none';
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        
        if (nameInput) nameInput.focus();
    });
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация появления элементов
function animateOnScroll() {
    const elements = document.querySelectorAll('.timeline-item');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Предотвращение двойного тапа для масштабирования
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Улучшение UX для iOS
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    document.addEventListener('focus', function(e) {
        if (e.target.matches('input, textarea, select')) {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }, true);
}

// Анимация иконок
document.querySelectorAll('.icon-circle').forEach(icon => {
    icon.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    icon.addEventListener('touchend', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// ==============================================
// ГАЛЕРЕЯ С ГОРИЗОНТАЛЬНЫМ СВАЙПОМ
// ==============================================
function initGallery() {
    const track = document.getElementById('galleryTrack');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let scrollLeft = 0;
    
    function updateSlider() {
        const translateX = -(currentIndex * 100);
        track.style.transform = `translateX(${translateX}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlider();
            if (navigator.vibrate) navigator.vibrate(20);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            if (navigator.vibrate) navigator.vibrate(20);
        }
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            currentIndex = index;
            updateSlider();
        }
    }
    
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Touch события для свайпа
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 10) e.preventDefault();
    }, { passive: false });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const deltaX = e.changedTouches[0].clientX - startX;
        track.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0 && currentIndex > 0) prevSlide();
            else if (deltaX < 0 && currentIndex < slides.length - 1) nextSlide();
            else updateSlider();
        } else {
            updateSlider();
        }
        isDragging = false;
    });
    
    updateSlider();
}

// ==============================================
// МУЗЫКА НА САЙТЕ
// ==============================================
function initMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const audio = new Audio();
    audio.src = 'music.mp3';
    audio.loop = true;
    audio.volume = 0.5;
    
    let isPlaying = false;
    
    async function playMusic() {
        try {
            await audio.play();
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Музыка играет</span>';
        } catch (error) {
            console.log('Автовоспроизведение заблокировано');
            isPlaying = false;
        }
    }
    
    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Включить музыку</span>';
    }
    
    musicBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!isPlaying) playMusic();
        else pauseMusic();
        if (navigator.vibrate) navigator.vibrate(50);
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isPlaying) audio.pause();
        else if (!document.hidden && isPlaying) audio.play().catch(e => console.log('Не удалось возобновить'));
    });
}
