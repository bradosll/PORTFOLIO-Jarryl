document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME SELECTION & TOGGLE (LIGHT / DARK)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('jovenir-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('jovenir-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // ==========================================================================
    // MOBILE DRAWER NAVIGATION
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Sticky Header Styling on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // HERO 3D TILT EFFECT
    // ==========================================================================
    const tiltCard = document.getElementById('hero-tilt-card');
    const heroSection = document.querySelector('.hero-section');

    if (tiltCard && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate normalized positions (-0.5 to 0.5)
            const xc = ((x / rect.width) - 0.5);
            const yc = ((y / rect.height) - 0.5);

            // Calculate rotation degrees
            const rotateX = yc * -12;
            const rotateY = xc * 12;

            // Apply 3D transform
            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            
            // Move glow spot on the card
            const glowPoint = tiltCard.querySelector('.card-glow-point');
            if (glowPoint) {
                const cardRect = tiltCard.getBoundingClientRect();
                const cardX = e.clientX - cardRect.left;
                const cardY = e.clientY - cardRect.top;
                glowPoint.style.left = `${cardX}px`;
                glowPoint.style.top = `${cardY}px`;
                glowPoint.style.opacity = '1';
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
            const glowPoint = tiltCard.querySelector('.card-glow-point');
            if (glowPoint) {
                glowPoint.style.opacity = '0';
            }
        });
    }

    // ==========================================================================
    // AMBIENT LIGHT RAY DRIFT PARALLAX
    // ==========================================================================
    const lightRays = document.querySelectorAll('.light-ray');
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        lightRays.forEach((ray, index) => {
            const factor = (index + 1) * 35;
            const moveX = mouseX * factor;
            const moveY = mouseY * factor;
            ray.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .journey-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger progress animations if this is the about section content
                if (entry.target.classList.contains('about-content')) {
                    animateProgressFills();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function animateProgressFills() {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 150);
        });
    }

    // ==========================================================================
    // SCROLL-ACTIVE HEADER LINK SYNC
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                const targetLink = document.querySelector(`.nav-list a[href="#${sectionId}"]`);
                if (targetLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    });

    // ==========================================================================
    // PROJECTS CATEGORY FILTERING
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage button active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 40);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM INTERACTION
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeOverlayBtn = document.getElementById('overlay-close');

    if (contactForm && successOverlay && closeOverlayBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending message... <i class="fa-solid fa-circle-notch fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate form submission delay
            setTimeout(() => {
                successOverlay.classList.add('active');
                
                // Reset form
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
            }, 1500);
        });

        closeOverlayBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    // ==========================================================================
    // CERTIFICATES LIGHTBOX DIALOG
    // ==========================================================================
    const certCards = document.querySelectorAll('.cert-card');
    const certLightbox = document.getElementById('cert-lightbox');
    const certLightboxImg = document.getElementById('cert-lightbox-img');
    const certLightboxClose = document.getElementById('cert-lightbox-close');

    if (certCards.length && certLightbox && certLightboxImg && certLightboxClose) {
        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const imgElement = card.querySelector('.cert-img');
                if (imgElement) {
                    certLightboxImg.src = imgElement.src;
                    certLightboxImg.alt = imgElement.alt;
                    certLightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock scrolling
                }
            });
        });

        const dismissLightbox = () => {
            certLightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            setTimeout(() => {
                certLightboxImg.src = '';
            }, 300);
        };

        certLightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissLightbox();
        });

        certLightbox.addEventListener('click', () => {
            dismissLightbox();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certLightbox.classList.contains('active')) {
                dismissLightbox();
            }
        });
    }
});
