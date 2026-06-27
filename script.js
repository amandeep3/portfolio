document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Sticky Header Class
    const header = document.querySelector('header');
    let isScrolled = false;
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== isScrolled) {
            isScrolled = scrolled;
            header.classList.toggle('scrolled', isScrolled);
        }
    }, { passive: true });

    // 3. Typewriter Effect
    const roles = ["Lead Software Engineer", "5G OAM Developer", "Cloud-Native Engineer", "C++ Developer"];
    let currentRoleIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    const typedTextEl = document.getElementById('typed-text');
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenRoles = 2000;

    function type() {
        const currentRole = roles[currentRoleIdx];
        if (isDeleting) {
            typedTextEl.textContent = currentRole.substring(0, currentCharIdx - 1);
            currentCharIdx--;
        } else {
            typedTextEl.textContent = currentRole.substring(0, currentCharIdx + 1);
            currentCharIdx++;
        }

        let currentDelay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && currentCharIdx === currentRole.length) {
            isDeleting = true;
            currentDelay = delayBetweenRoles; // Wait before deleting
        } else if (isDeleting && currentCharIdx === 0) {
            isDeleting = false;
            currentRoleIdx = (currentRoleIdx + 1) % roles.length;
            currentDelay = 500; // Brief pause before typing next role
        }

        setTimeout(type, currentDelay);
    }

    if (typedTextEl) {
        setTimeout(type, 500);
    }

    // 4. Copy to Clipboard Utility & Toast System
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 3000);
    }

    window.copyToClipboard = function (text, typeLabel) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${typeLabel} copied to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy to clipboard.');
        });
    };

    // 5. Skill Highlighting Interactivity
    const skillTags = document.querySelectorAll('.skill-tag');
    const cards = document.querySelectorAll('.project-card, .timeline-item');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Categorized filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            // Toggle category card visibility
            const categories = document.querySelectorAll('.skill-category-card');
            categories.forEach(cat => {
                if (category === 'all' || cat.getAttribute('data-category') === category) {
                    cat.style.display = 'flex';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });

    // Clicking a skill tag highlights cards that contain it
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skillName = tag.textContent.trim().toLowerCase();

            // Check if tag is already highlighted
            const isAlreadyHighlighted = tag.classList.contains('highlight');

            // Remove highlight from all tags and reset card states
            skillTags.forEach(t => t.classList.remove('highlight'));
            cards.forEach(c => {
                c.classList.remove('dimmed', 'highlighted');
            });

            if (!isAlreadyHighlighted) {
                tag.classList.add('highlight');

                cards.forEach(card => {
                    const cardSkills = card.dataset.skills 
                        ? card.dataset.skills.split(',').map(s => s.trim().toLowerCase()) 
                        : [];
                    const hasSkill = cardSkills.includes(skillName);

                    if (hasSkill) {
                        card.classList.add('highlighted');
                    } else {
                        card.classList.add('dimmed');
                    }
                });

                showToast(`Highlighting projects & experience for: ${tag.textContent}`);
            } else {
                showToast("Cleared skill filters");
            }
        });
    });

    // 6. Scroll Fade-In Effect (Intersection Observer)
    const fadeEls = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeEls.forEach(el => observer.observe(el));

    // 7. Contact Form Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            if (name && email && message) {
                const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                
                // Using hidden anchor target link is cleaner and doesn't interrupt page lifecycle
                const mailtoUrl = `mailto:aman296anshu@gmail.com?subject=${subject}&body=${body}`;
                const tempLink = document.createElement('a');
                tempLink.href = mailtoUrl;
                tempLink.target = '_blank';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);

                showToast('Opening default email client...');
                contactForm.reset();
            } else {
                showToast('Please fill out all fields.');
            }
        });
    }
});
