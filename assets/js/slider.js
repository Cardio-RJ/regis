/**
 * RJACC2025 Image Slider
 * Auto-slide ทุก 5 วินาที
 */

class ImageSlider {
    constructor(sliderElement, options = {}) {
        this.slider = sliderElement;
        this.track = sliderElement.querySelector('.slider-track');
        this.slides = sliderElement.querySelectorAll('.slider-slide');
        this.controlsContainer = sliderElement.querySelector('.slider-controls');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        this.transitionDuration = options.transitionDuration || 800;
        this.isPlaying = true;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        if (this.slideCount === 0) return;
        
        // สร้าง Dot Controls
        this.createDots();
        
        // เริ่ม Auto-play
        this.startAutoPlay();
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // คีย์บอร์ด Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch support
        this.addTouchSupport();
    }
    
    createDots() {
        if (!this.controlsContainer) return;
        
        this.controlsContainer.innerHTML = '';
        
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => this.goToSlide(i));
            this.controlsContainer.appendChild(dot);
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slideCount) return;
        
        this.currentIndex = index;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateSlider();
    }
    
    updateSlider() {
        // เลื่อน Track
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // อัพเดท Dots
        this.updateDots();
    }
    
    updateDots() {
        if (!this.controlsContainer) return;
        
        const dots = this.controlsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.autoPlayInterval);
    }
    
    pauseAutoPlay() {
        this.isPlaying = false;
    }
    
    resumeAutoPlay() {
        this.isPlaying = true;
    }
    
    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPlaying = false;
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                this.prevSlide();
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
}

// เริ่มต้น Sliders เมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // Main Slider (20 slides)
    const mainSlider = document.getElementById('mainSlider');
    if (mainSlider) {
        new ImageSlider(mainSlider, {
            autoPlayInterval: CONFIG.SLIDER_CONFIG.autoPlayInterval,
            transitionDuration: CONFIG.SLIDER_CONFIG.transitionDuration
        });
    }
    
    // Secondary Slider (5 slides)
    const secondarySlider = document.getElementById('secondarySlider');
    if (secondarySlider) {
        new ImageSlider(secondarySlider, {
            autoPlayInterval: CONFIG.SLIDER_CONFIG.autoPlayInterval,
            transitionDuration: CONFIG.SLIDER_CONFIG.transitionDuration
        });
    }
});
