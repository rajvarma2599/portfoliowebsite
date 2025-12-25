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

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('service-modal');
    const openModalBtn = document.getElementById('open-modal');
    const closeBtn = document.querySelector('.close');
    const selectPackageBtns = document.querySelectorAll('.select-package');
    const checkoutSection = document.getElementById('checkout-section');
    const selectedPackageInfo = document.getElementById('selected-package-info');
    const payButton = document.getElementById('pay-button');

    let selectedPackage = null;

    // Open modal
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        checkoutSection.style.display = 'none';
        selectedPackage = null;
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            checkoutSection.style.display = 'none';
            selectedPackage = null;
        }
    });

    // Select package
    selectPackageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const packageElement = this.parentElement;
            selectedPackage = {
                name: packageElement.dataset.package,
                price: parseInt(packageElement.dataset.price)
            };

            selectedPackageInfo.textContent = `Selected: ${selectedPackage.name}`;
            checkoutSection.style.display = 'block';
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Cancel checkout
    const cancelButton = document.getElementById('cancel-checkout');
    cancelButton.addEventListener('click', function() {
        checkoutSection.style.display = 'none';
        selectedPackage = null;
        selectedPackageInfo.textContent = '';
    });

    // Razorpay payment
    payButton.addEventListener('click', function() {
        if (!selectedPackage) {
            alert('Please select a package first.');
            return;
        }

        const options = {
            key: 'rzp_live_RvPg1zgE38Kyd0', // Replace with your Razorpay key_id
            amount: selectedPackage.price * 100, // Amount in paisa
            currency: 'USD',
            name: 'Raj Varma - UI/UX Services',
            description: `Payment for ${selectedPackage.name}`,
            handler: function(response) {
                alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                // Here you can send the payment details to your server
                console.log(response);
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                checkoutSection.style.display = 'none';
                // Redirect to services page with selected package
                window.location.href = `services/services.html?package=${selectedPackage.name.toLowerCase()}`;
                selectedPackage = null;
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: {
                color: '#3498db'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    });
});
