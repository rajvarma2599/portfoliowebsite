// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to navigation on scroll
window.addEventListener('scroll', function() {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('nav ul li a');

    sections.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const content = this.nextElementSibling;

            // Close all other accordions
            accordionButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.style.maxHeight = '0';
            });

            // Toggle current accordion
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                this.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
            }
        });
    });
});

// Visitor Counter
async function updateVisitorCount() {
    const visited = localStorage.getItem('visited');
    if (!visited) {
        try {
            await fetch('https://api.countapi.xyz/hit/portfolio-visitor-count/visitor-count');
            localStorage.setItem('visited', 'true');
        } catch (error) {
            console.error('Error incrementing count:', error);
        }
    }
    try {
        const response = await fetch('https://api.countapi.xyz/get/portfolio-visitor-count/visitor-count');
        const data = await response.json();
        document.getElementById('visitor-count').textContent = data.value;
    } catch (error) {
        console.error('Error fetching count:', error);
        // Fallback to localStorage if API fails
        let localCount = localStorage.getItem('localVisitorCount');
        if (!localCount) {
            localCount = 1;
        } else {
            localCount = parseInt(localCount) + 1;
        }
        localStorage.setItem('localVisitorCount', localCount);
        document.getElementById('visitor-count').textContent = localCount;
    }
}
updateVisitorCount();

// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.animate-section').forEach(section => {
        observer.observe(section);
    });

    // Observe stagger elements
    document.querySelectorAll('.animate-stagger').forEach(element => {
        observer.observe(element);
    });
});
