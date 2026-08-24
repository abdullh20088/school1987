document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الموقع بنجاح');

    try {
        // ===================================================
        // القائمة المتنقلة
        // ===================================================
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-link').forEach(n => {
                n.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // ===================================================
        // دالة التمرير السلس
        // ===================================================
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // ربط الأزرار الرئيسية
        const btnAbout = document.getElementById('btn-about');
        const btnLibrary = document.getElementById('btn-library');

        if (btnAbout) {
            btnAbout.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection('about');
            });
        }

        if (btnLibrary) {
            btnLibrary.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection('library');
            });
        }

        // ربط روابط التذييل والتنقل
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    scrollToSection(targetId);
                }
            });
        });

        // ===================================================
        // السلايدر (كلاس عام)
        // ===================================================
        class SimpleSlider {
            constructor(sliderElement, options = {}) {
                this.slider = sliderElement;
                this.slides = sliderElement.querySelectorAll('.slide');
                this.dots = sliderElement.querySelectorAll('.dot');

                const prevSelector = options.prevSelector || '.prev-btn';
                const nextSelector = options.nextSelector || '.next-btn';
                this.prevBtn = sliderElement.querySelector(prevSelector);
                this.nextBtn = sliderElement.querySelector(nextSelector);

                this.currentSlide = 0;
                this.totalSlides = this.slides.length;
                this.slideInterval = null;
                this.autoPlayDelay = options.autoPlayDelay || 5000;
                this.hasControls = options.hasControls !== undefined ? options.hasControls : true;

                this.init();
            }

            init() {
                // التأكد من أن الشريحة الأولى فقط هي النشطة
                this.slides.forEach((slide, index) => {
                    if (index === 0) {
                        slide.classList.add('active');
                        slide.style.opacity = '1';
                        slide.style.visibility = 'visible';
                    } else {
                        slide.classList.remove('active');
                        slide.style.opacity = '0';
                        slide.style.visibility = 'hidden';
                    }
                });

                this.dots.forEach((dot, index) => {
                    if (index === 0) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });

                this.addEventListeners();
                this.startAutoPlay();
                console.log('تم تهيئة السلايدر');
            }

            addEventListeners() {
                if (this.prevBtn && this.hasControls) {
                    this.prevBtn.addEventListener('click', () => this.prevSlide());
                }
                if (this.nextBtn && this.hasControls) {
                    this.nextBtn.addEventListener('click', () => this.nextSlide());
                }

                this.dots.forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        this.goToSlide(index);
                    });
                });

                this.slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
                this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            goToSlide(index) {
                // إخفاء الشريحة الحالية
                this.slides[this.currentSlide].classList.remove('active');
                this.slides[this.currentSlide].style.opacity = '0';
                this.slides[this.currentSlide].style.visibility = 'hidden';
                this.dots[this.currentSlide].classList.remove('active');

                // إظهار الشريحة الجديدة
                this.currentSlide = index;
                this.slides[this.currentSlide].classList.add('active');
                this.slides[this.currentSlide].style.opacity = '1';
                this.slides[this.currentSlide].style.visibility = 'visible';
                this.dots[this.currentSlide].classList.add('active');

                // التحكم في تشغيل الفيديو
                this.handleVideoPlay(index);
                this.restartAutoPlay();
            }

            handleVideoPlay(index) {
                const slide = this.slides[index];
                const video = slide.querySelector('video');
                if (video) {
                    this.slides.forEach((s, i) => {
                        if (i !== index) {
                            const otherVideo = s.querySelector('video');
                            if (otherVideo) {
                                otherVideo.pause();
                            }
                        }
                    });
                    video.play().catch(() => {});
                } else {
                    this.slides.forEach(s => {
                        const v = s.querySelector('video');
                        if (v) v.pause();
                    });
                }
            }

            nextSlide() {
                const nextIndex = (this.currentSlide + 1) % this.totalSlides;
                this.goToSlide(nextIndex);
            }

            prevSlide() {
                const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
                this.goToSlide(prevIndex);
            }

            startAutoPlay() {
                this.slideInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
            }

            pauseAutoPlay() {
                if (this.slideInterval) {
                    clearInterval(this.slideInterval);
                    this.slideInterval = null;
                }
            }

            restartAutoPlay() {
                this.pauseAutoPlay();
                this.startAutoPlay();
            }
        }

        // تهيئة السلايدر الرئيسي (بدون أزرار)
        setTimeout(() => {
            const heroSlider = document.getElementById('hero-slider');
            if (heroSlider) {
                window.heroSlider = new SimpleSlider(heroSlider, {
                    autoPlayDelay: 5000,
                    hasControls: false
                });
            }
            enhanceImageLoading();
        }, 100);

        // تهيئة سلايدر "عن المدرسة" (مع أزرار)
        setTimeout(() => {
            const aboutSlider = document.getElementById('about-slider');
            if (aboutSlider) {
                window.aboutSlider = new SimpleSlider(aboutSlider, {
                    prevSelector: '.prev-btn',
                    nextSelector: '.next-btn',
                    autoPlayDelay: 4000,
                    hasControls: true
                });

                // زر التحكم بالفيديو
                const videoControlBtn = document.getElementById('aboutVideoControl');
                const aboutVideo = document.getElementById('about-video');
                if (videoControlBtn && aboutVideo) {
                    videoControlBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (aboutVideo.paused) {
                            aboutVideo.play();
                            this.innerHTML = '<i class="fas fa-pause"></i>';
                        } else {
                            aboutVideo.pause();
                            this.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    });

                    aboutVideo.addEventListener('pause', function() {
                        videoControlBtn.innerHTML = '<i class="fas fa-play"></i>';
                    });
                    aboutVideo.addEventListener('play', function() {
                        videoControlBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    });
                }
            }
        }, 200);

        function enhanceImageLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                // منع أي شفافية على صور السلايدر
                if (img.closest('.slide-media')) {
                    img.style.opacity = '1';
                    return;
                }
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                img.addEventListener('error', function() {
                    console.warn('فشل تحميل الصورة:', this.src);
                    this.style.opacity = '1';
                });
            });
        }

        // ===================================================
        // بيانات الكتب
        // ===================================================
        const books = [
            // ---- اتصالات (المرحلة الأولى) ----
            { id: 1, title: "التربية الاسلاميه اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/التربية الاسلاميه اول مهني.pdf" },
            { id: 2, title: "عربي اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/عربي اول مهني.pdf" },
            { id: 3, title: "رياضيات اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/رياضيات اول مهني.pdf" },
            { id: 4, title: "انكليزي اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/انكليزي اول مهني.pdf" },
            { id: 5, title: "تدريب عملي اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/تدريب عملي اول مهني اتصالات.pdf" },
            { id: 6, title: "رسم هندسي اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/رسم هندسي اول مهني اتصالات.pdf" },
            { id: 7, title: "طبيعيات اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/طبيعيات اول مهني اتصالات.pdf" },
            { id: 8, title: "علوم صناعية اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/علوم صناعية اول مهني اتصالات.pdf" },
            { id: 9, title: "تطبيقات اول مهني اتصالات", category: "اتصالات", level: "الأول", file: "media/books/تطبيقات اول مهني.pdf" },

            // ---- اتصالات (المرحلة الثانية) ----
            { id: 10, title: "التربية الاسلاميه ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/التربية الاسلاميه ثاني مهني.pdf" },
            { id: 11, title: "عربي ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/عربي ثاني مهني.pdf" },
            { id: 12, title: "رياضيات ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/رياضيات ثاني مهني.pdf" },
            { id: 13, title: "انكليزي ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/انكليزي ثاني مهني.pdf" },
            { id: 14, title: "تدريب عملي ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/تدريب عملي ثاني مهني اتصالات.pdf" },
            { id: 15, title: "رسم صناعي ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/رسم صناعي ثاني مهني اتصالات.pdf" },
            { id: 16, title: "طبيعيات ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/طبيعيات ثاني مهني اتصالات.pdf" },
            { id: 17, title: "علوم صناعية ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/علوم صناعية ثاني مهني اتصالات.pdf" },
            { id: 18, title: "تطبيقات ثاني مهني اتصالات", category: "اتصالات", level: "الثاني", file: "media/books/تطبيقات ثاني مهني.pdf" },

            // ---- اتصالات (المرحلة الثالثة) ----
            { id: 19, title: "التربية الاسلاميه ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/التربية الاسلاميه ثالث مهني.pdf" },
            { id: 20, title: "عربي ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/عربي ثالث مهني.pdf" },
            { id: 21, title: "رياضيات ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/رياضيات ثالث مهني.pdf" },
            { id: 22, title: "انكليزي ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/انكليزي ثالث مهني.pdf" },
            { id: 23, title: "تدريب عملي ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/تدريب عملي ثالث مهني اتصالات.pdf" },
            { id: 24, title: "رسم صناعي ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/رسم صناعي ثالث مهني اتصالات.pdf" },
            { id: 25, title: "طبيعيات ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/طبيعيات ثالث مهني اتصالات.pdf" },
            { id: 26, title: "علوم صناعية ثالث مهني اتصالات", category: "اتصالات", level: "الثالث", file: "media/books/علوم صناعية ثالث مهني اتصالات.pdf" },

            // ---- تجميع (المرحلة الأولى) ----
            { id: 27, title: "التربية الاسلاميه اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/التربية الاسلاميه اول مهني.pdf" },
            { id: 28, title: "عربي اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/عربي اول مهني.pdf" },
            { id: 29, title: "رياضيات اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/رياضيات اول مهني.pdf" },
            { id: 30, title: "انكليزي اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/انكليزي اول مهني.pdf" },
            { id: 31, title: "المبادئ الاساسية للحاسوب اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/المبادئ الاساسية للحاسوب اول مهني تجميع.pdf" },
            { id: 32, title: "اساسيات الكهرباء والالكترونيك اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/اساسيات الكهرباء والالكترونيك اول مهني تجميع.pdf" },
            { id: 33, title: "تجميع الحاسوب اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/تجميع الحاسوب اول مهني تجميع.pdf" },
            { id: 34, title: "تطبيقات اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/تطبيقات اول مهني.pdf" },
            { id: 35, title: "مبادئ الاتصالات والشبكات اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/مبادئ الاتصالات والشبكات اول مهني تجميع.pdf" },
            { id: 36, title: "طبيعيات اول مهني تجميع", category: "تجميع", level: "الأول", file: "media/books/طبيعيات اول مهني تجميع.pdf" },

            // ---- تجميع (المرحلة الثانية) ----
            { id: 37, title: "التربية الاسلاميه ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/التربية الاسلاميه ثاني مهني.pdf" },
            { id: 38, title: "عربي ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/عربي ثاني مهني.pdf" },
            { id: 39, title: "رياضيات ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/رياضيات ثاني مهني.pdf" },
            { id: 40, title: "انكليزي ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/انكليزي ثاني مهني.pdf" },
            { id: 41, title: "التصميم المنطقي ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/التصميم المنطقي ثاني مهني تجميع.pdf" },
            { id: 42, title: "شبكات حاسوب ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/شبكات حاسوب ثاني مهني تجميع.pdf" },
            { id: 43, title: "صيانة الحاسوب ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/صيانة الحاسوب ثاني مهني تجميع.pdf" },
            { id: 44, title: "تطبيقات ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/تطبيقات ثاني مهني.pdf" },
            { id: 45, title: "طبيعيات ثاني مهني تجميع", category: "تجميع", level: "الثاني", file: "media/books/طبيعيات ثاني مهني تجميع.pdf" },

            // ---- تجميع (المرحلة الثالثة) ----
            { id: 46, title: "التربية الاسلاميه ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/التربية الاسلاميه ثالث مهني.pdf" },
            { id: 47, title: "عربي ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/عربي ثالث مهني.pdf" },
            { id: 48, title: "رياضيات ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/رياضيات ثالث مهني.pdf" },
            { id: 49, title: "انكليزي ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/انكليزي ثالث مهني.pdf" },
            { id: 50, title: "صيانة الحاسوب ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/صيانة الحاسوب ثالث مهني تجميع.pdf" },
            { id: 51, title: "مختبر وشبكات الانترنت ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/مختبر وشبكات الانترنت ثالث مهني تجميع.pdf" },
            { id: 52, title: "معالجات دقيقة ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/معالجات دقيقة ثالث مهني تجميع.pdf" },
            { id: 53, title: "طبيعيات ثالث مهني تجميع", category: "تجميع", level: "الثالث", file: "media/books/طبيعيات ثالث مهني تجميع.pdf" },

            // ---- أجهزة طبية (المرحلة الأولى) ----
            { id: 54, title: "التربية الاسلاميه اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/التربية الاسلاميه اول مهني.pdf" },
            { id: 55, title: "عربي اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/عربي اول مهني.pdf" },
            { id: 56, title: "رياضيات اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/رياضيات اول مهني.pdf" },
            { id: 57, title: "انكليزي اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/انكليزي اول مهني.pdf" },
            { id: 58, title: "تدريب عملي اول مهني اجهزة الطبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/تدريب عملي اول مهني اجهزة الطبية.pdf" },
            { id: 59, title: "رسم هندسي اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/رسم هندسي اول مهني اجهزة طبية.pdf" },
            { id: 60, title: "طبيعيات اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/طبيعيات اول مهني اجهزة طبية.pdf" },
            { id: 61, title: "علوم صناعية اول مهني اجهزة الطبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/علوم صناعية اول مهني اجهزة الطبية.pdf" },
            { id: 62, title: "تطبيقات اول مهني اجهزة طبية", category: "أجهزة-طبية", level: "الأول", file: "media/books/تطبيقات اول مهني.pdf" },

            // ---- أجهزة طبية (المرحلة الثانية) ----
            { id: 63, title: "التربية الاسلاميه ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/التربية الاسلاميه ثاني مهني.pdf" },
            { id: 64, title: "عربي ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/عربي ثاني مهني.pdf" },
            { id: 65, title: "رياضيات ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/رياضيات ثاني مهني.pdf" },
            { id: 66, title: "انكليزي ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/انكليزي ثاني مهني.pdf" },
            { id: 67, title: "تدريب عملي ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/تدريب عملي ثاني مهني اجهزة طبية.pdf" },
            { id: 68, title: "رسم صناعي ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/رسم صناعي ثاني مهني اجهزة طبية.pdf" },
            { id: 69, title: "طبيعيات ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/طبيعيات ثاني مهني اجهزة طبية.pdf" },
            { id: 70, title: "علوم صناعية ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/علوم صناعية ثاني مهني اجهزة طبية.pdf" },
            { id: 71, title: "تطبيقات ثاني مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثاني", file: "media/books/تطبيقات ثاني مهني.pdf" },

            // ---- أجهزة طبية (المرحلة الثالثة) ----
            { id: 72, title: "التربية الاسلاميه ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/التربية الاسلاميه ثالث مهني.pdf" },
            { id: 73, title: "عربي ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/عربي ثالث مهني.pdf" },
            { id: 74, title: "رياضيات ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/رياضيات ثالث مهني.pdf" },
            { id: 75, title: "انكليزي ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/انكليزي ثالث مهني.pdf" },
            { id: 76, title: "تدريب عملي ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/تدريب عملي ثالث مهني اجهزة طبية.pdf" },
            { id: 77, title: "رسم صناعي ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/رسم صناعي ثالث مهني اجهزة طبية.pdf" },
            { id: 78, title: "طبيعيات ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/طبيعيات ثالث مهني اجهزة طبية.pdf" },
            { id: 79, title: "علوم صناعية ثالث مهني اجهزة طبية", category: "أجهزة-طبية", level: "الثالث", file: "media/books/علوم صناعية ثالث مهني اجهزة طبية.pdf" }
        ];

        // ===================================================
        // معلومات الأقسام وإعدادات المكتبة
        // ===================================================
        const departmentsInfo = {
            all: { name: "جميع الكتب", description: "استعرض جميع الكتب المتاحة في مكتبة المدرسة" },
            اتصالات: { name: "قسم الاتصالات", description: "يضم هذا القسم كتباً متخصصة في نظم الاتصالات، الشبكات، معالجة الإشارات، وتقنيات الإرسال والاستقبال." },
            تجميع: { name: "قسم تجميع الحاسوب", description: "يحتوي هذا القسم على مراجع وكتب في مجالات تجميع الحواسيب، البرمجة، قواعد البيانات، وأمن المعلومات." },
            "أجهزة-طبية": { name: "قسم الأجهزة الطبية", description: "يشمل هذا القسم كتباً في صيانة وتشغيل الأجهزة الطبية، أنظمة التحكم الطبي، وأجهزة التشخيص الحديثة." }
        };

        let currentCategory = 'all';
        let currentLevel = 'all';
        let currentSearchTerm = '';
        let booksPerPage = 8;
        let currentPage = 1;

        // ===================================================
        // دوال عرض الكتب والتصفية
        // ===================================================
        function displayBooks() {
            const booksGrid = document.getElementById('booksGrid');
            if (!booksGrid) return;
            booksGrid.innerHTML = '';

            let filteredBooks = books.filter(book => {
                const categoryMatch = currentCategory === 'all' || book.category === currentCategory;
                const levelMatch = currentLevel === 'all' || book.level === currentLevel;
                const searchMatch = !currentSearchTerm ||
                    book.title.toLowerCase().includes(currentSearchTerm);
                return categoryMatch && levelMatch && searchMatch;
            });

            const resultsCount = document.getElementById('resultsCount');
            if (resultsCount) resultsCount.textContent = filteredBooks.length;

            if (filteredBooks.length === 0) {
                booksGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>لا توجد نتائج</h3>
                        <p>لم نتمكن من العثور على كتب تطابق بحثك.</p>
                    </div>
                `;
                document.getElementById('loadMoreContainer').style.display = 'none';
                return;
            }

            const startIndex = (currentPage - 1) * booksPerPage;
            const endIndex = startIndex + booksPerPage;
            const booksToShow = filteredBooks.slice(0, endIndex);

            booksToShow.forEach(book => {
                const card = document.createElement('div');
                card.classList.add('book-card');
                card.innerHTML = `
                    <div class="book-header">
                        <h3 class="book-title">${book.title}</h3>
                        <div>
                            <span class="book-category">${getCategoryName(book.category)}</span>
                            <span class="book-level">${getLevelName(book.level)}</span>
                        </div>
                    </div>
                    <div class="book-footer">
                        <a href="${book.file}" class="book-download" download>
                            <i class="fas fa-download"></i> تحميل
                        </a>
                    </div>
                `;
                booksGrid.appendChild(card);
            });

            const loadMoreContainer = document.getElementById('loadMoreContainer');
            if (endIndex >= filteredBooks.length) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'block';
            }
        }

        function loadMoreBooks() {
            currentPage++;
            displayBooks();
        }

        function getCategoryName(category) {
            switch(category) {
                case 'اتصالات': return 'الاتصالات';
                case 'تجميع': return 'تجميع الحاسوب';
                case 'أجهزة-طبية': return 'الأجهزة الطبية';
                default: return category;
            }
        }

        function getLevelName(level) {
            switch(level) {
                case 'الأول': return 'الأولى';
                case 'الثاني': return 'الثانية';
                case 'الثالث': return 'الثالثة';
                default: return level;
            }
        }

        function updateDepartmentInfo(category) {
            const info = departmentsInfo[category];
            if (!info) return;
            document.getElementById('departmentName').textContent = info.name;
            document.getElementById('departmentDescription').textContent = info.description;
        }

        function resetPagination() {
            currentPage = 1;
            displayBooks();
        }

        // ===================================================
        // أحداث التصفية والبحث
        // ===================================================
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                currentCategory = card.getAttribute('data-category');
                updateDepartmentInfo(currentCategory);
                resetPagination();
            });
        });

        document.querySelectorAll('.level-dropdown-content a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const dropbtn = document.querySelector('.level-dropbtn span');
                if (dropbtn) dropbtn.textContent = link.textContent;
                currentLevel = link.getAttribute('data-level');
                resetPagination();
            });
        });

        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        function performSearch() {
            currentSearchTerm = searchInput.value.trim().toLowerCase();
            resetPagination();
        }

        if (searchButton) searchButton.addEventListener('click', performSearch);
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }

        const loadMoreButton = document.getElementById('loadMoreButton');
        if (loadMoreButton) loadMoreButton.addEventListener('click', loadMoreBooks);

        // ===================================================
        // أزرار الأقسام (توجيه إلى المكتبة)
        // ===================================================
        document.querySelectorAll('.card-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.department-card');
                if (!card) return;
                const dept = card.getAttribute('data-department');
                let arabicCategory = '';
                switch(dept) {
                    case 'communications': arabicCategory = 'اتصالات'; break;
                    case 'computer-assembly': arabicCategory = 'تجميع'; break;
                    case 'medical-devices': arabicCategory = 'أجهزة-طبية'; break;
                    default: arabicCategory = dept;
                }
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
                document.querySelector(`.category-card[data-category="${arabicCategory}"]`).classList.add('active');
                currentCategory = arabicCategory;
                updateDepartmentInfo(arabicCategory);
                resetPagination();
                document.querySelector('#library').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // ===================================================
        // تأثير تمرير شريط التنقل
        // ===================================================
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.padding = '0.5rem 0';
                    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.padding = '1rem 0';
                    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
            }
        });

        // ===================================================
        // التهيئة النهائية
        // ===================================================
        displayBooks();
        console.log('تم تهيئة الموقع بنجاح مع ' + books.length + ' كتاب');

    } catch (error) {
        console.error('حدث خطأ أثناء تهيئة الموقع:', error);
    }
});

// ===================================================
// دالة مساعدة للتحميل
// ===================================================
function downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
