$(document).ready(function () {

    $(window).on('scroll', function () {
        const scroll = $(window).scrollTop();

        if (scroll >= 50) {
            $('.navbar').css('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.5)');
        } else {
            $('.navbar').css('box-shadow', 'none');
        }

        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const scrollPos = $(window).scrollTop() + 100;

        $('.nav-link').each(function () {
            const currLink = $(this);
            const refElement = $(currLink.attr('href'));

            if (refElement.length) {
                const refTop = refElement.offset().top;
                const refBottom = refTop + refElement.outerHeight();

                if (scrollPos >= refTop && scrollPos <= refBottom) {
                    $('.nav-link').removeClass('active');
                    currLink.addClass('active');
                }
            }
        });
    }

    $('a[href^="#"]').on('click', function (e) {
        const target = $(this.getAttribute('href'));

        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800, 'swing');

            $('.navbar-collapse').collapse('hide');
        }
    });

    $('#experienceAccordion .collapse').on('show.bs.collapse', function () {
        $(this).siblings('.job-header').removeClass('collapsed');
    });

    $('#experienceAccordion .collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.job-header').addClass('collapsed');
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('in-view');
                }
            });
        }, observerOptions);

        $('.reveal').each(function () {
            revealObserver.observe(this);
        });
    } else {
        $('.reveal').addClass('in-view');
    }

    $('.filter-btn').on('click', function () {
        const filter = $(this).data('filter');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (filter === 'all') {
            $('.skill-badge').fadeOut(200, function () {
                $(this).css('display', 'flex').hide().fadeIn(400);
            });
        } else {
            $('.skill-badge').fadeOut(200, function () {
                $('.skill-badge[data-category="' + filter + '"]').css('display', 'flex').hide().fadeIn(400);
            });
        }
    });

    $('.copy-btn').on('click', function () {
        const textToCopy = $(this).data('copy');

        const $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(textToCopy).select();

        try {
            document.execCommand('copy');
            showToast('Email copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy. Please copy manually.', 'error');
        }

        $temp.remove();
    });

    const contactForm = $('#contactForm');

    contactForm.find('input, textarea, select').on('blur', function () {
        validateField($(this));
    });

    contactForm.on('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        contactForm.find('input[required], textarea[required]').each(function () {
            if (!validateField($(this))) {
                isValid = false;
            }
        });

        if (isValid) {
            handleFormSubmit();
        } else {
            showToast('Please fill in all required fields correctly.', 'error');
        }
    });

    $('#clearForm').on('click', function () {
        contactForm[0].reset();
        contactForm.find('.is-invalid').removeClass('is-invalid');
    });

    function validateField($field) {
        const value = $field.val().trim();
        const fieldType = $field.attr('type');
        const fieldName = $field.attr('name');
        let isValid = true;

        $field.removeClass('is-invalid');

        if ($field.prop('required')) {
            if (value === '') {
                isValid = false;
            }
        }

        if (fieldType === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        if (fieldName === 'message' && value !== '') {
            if (value.length < 20) {
                isValid = false;
                $field.siblings('.invalid-feedback').text('Message must be at least 20 characters');
            } else {
                $field.siblings('.invalid-feedback').text('Please enter a message (min 20 characters)');
            }
        }

        if (!isValid) {
            $field.addClass('is-invalid');
        }

        return isValid;
    }

    function handleFormSubmit() {
        const fullName = $('#fullName').val().trim();
        const email = $('#email').val().trim();
        const subject = $('#subject').val().trim();
        const reason = $('#reason').val();
        const message = $('#message').val().trim();

        let emailBody = `Hello Murad,\n\n`;
        emailBody += `Name: ${fullName}\n`;
        emailBody += `Email: ${email}\n`;
        if (reason) {
            emailBody += `Reason: ${reason}\n`;
        }
        emailBody += `\nMessage:\n${message}\n\n`;
        emailBody += `Best regards,\n${fullName}`;

        const mailtoLink = `mailto:thekarimovmurad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        $('#mailtoLink').attr('href', mailtoLink);

        const emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
        emailModal.show();

        showToast('Message prepared successfully!');
    }

    function showToast(message, type = 'success') {
        const $toast = $('#toast');
        const $message = $('#toast-message');

        $message.text(message);

        if (type === 'error') {
            $toast.css('background', 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)');
        } else {
            $toast.css('background', 'linear-gradient(135deg, #10b981 0%, #059669 100%)');
        }

        $toast.addClass('show');

        setTimeout(function () {
            $toast.removeClass('show');
        }, 3000);
    }

    if (!prefersReducedMotion) {
        $(window).on('mousemove', function (e) {
            const moveX = (e.pageX * -1 / 50);
            const moveY = (e.pageY * -1 / 50);

            $('.cosmic-bg').css({
                'transform': 'translate(' + moveX + 'px, ' + moveY + 'px)'
            });
        });
    }

    window.showWorkModal = function (workType) {
        const workDetails = {
            payment: {
                title: 'Payment API Platform',
                content: `
                    <h4 class="mb-3">Technical Architecture</h4>
                    <p>Built RESTful API systems handling financial transactions with a focus on reliability, data consistency, and performance optimization.</p>
                    
                    <h5 class="mt-4 mb-3">Key Technologies</h5>
                    <ul class="work-tech-list">
                        <li><strong>Backend:</strong> ASP.NET Framework 4.x, ASP.NET Core 6+</li>
                        <li><strong>Data Layer:</strong> ADO.NET, Entity Framework, SQL Server</li>
                        <li><strong>Architecture:</strong> Layered architecture, Repository pattern, Dependency Injection</li>
                        <li><strong>Integration:</strong> Payment gateway APIs, Transaction processing</li>
                    </ul>
                    
                    <h5 class="mt-4 mb-3">Focus Areas</h5>
                    <ul class="work-focus-list">
                        <li>SQL query optimization and stored procedure development</li>
                        <li>Transaction reliability and data consistency</li>
                        <li>Clean code architecture and maintainable patterns</li>
                        <li>API versioning and backward compatibility</li>
                    </ul>
                `
            },
            async: {
                title: 'Async Processing & Caching',
                content: `
                    <h4 class="mb-3">Distributed System Design</h4>
                    <p>Implementation of asynchronous message processing and distributed caching strategies to handle high-performance, scalable systems.</p>
                    
                    <h5 class="mt-4 mb-3">Key Technologies</h5>
                    <ul class="work-tech-list">
                        <li><strong>Message Queue:</strong> RabbitMQ for asynchronous task processing</li>
                        <li><strong>Caching:</strong> Redis for distributed caching and session management</li>
                        <li><strong>Patterns:</strong> Producer-Consumer, Publish-Subscribe, CQRS concepts</li>
                        <li><strong>Performance:</strong> Load balancing, Rate limiting, Circuit breakers</li>
                    </ul>
                    
                    <h5 class="mt-4 mb-3">Implementation Details</h5>
                    <ul class="work-focus-list">
                        <li>Queue-based background job processing for long-running operations</li>
                        <li>Cache invalidation strategies and cache-aside pattern</li>
                        <li>Message retry logic and dead-letter queue handling</li>
                        <li>Performance monitoring and optimization</li>
                    </ul>
                `
            },
            azure: {
                title: 'Azure Deployed Admin Panel',
                content: `
                    <h4 class="mb-3">Full-Stack Administration Interface</h4>
                    <p>Complete administrative system built with ASP.NET MVC, SQL Server backend, and deployed to Azure App Services with automated CI/CD pipelines.</p>
                    
                    <h5 class="mt-4 mb-3">Key Technologies</h5>
                    <ul class="work-tech-list">
                        <li><strong>Frontend:</strong> ASP.NET MVC, Razor Views, Bootstrap, JavaScript</li>
                        <li><strong>Backend:</strong> C#, Entity Framework, SQL Server</li>
                        <li><strong>Cloud:</strong> Azure App Services, Azure SQL Database</li>
                        <li><strong>DevOps:</strong> CI/CD pipelines, Automated deployment</li>
                    </ul>
                    
                    <h5 class="mt-4 mb-3">Features Implemented</h5>
                    <ul class="work-focus-list">
                        <li>CRUD operations with form validation and error handling</li>
                        <li>User authentication and role-based authorization</li>
                        <li>Data management interface with filtering and pagination</li>
                        <li>Automated deployment pipeline from GitLab to Azure</li>
                        <li>Application monitoring and logging</li>
                    </ul>
                `
            }
        };

        const details = workDetails[workType];
        if (details) {
            $('#workModalLabel').text(details.title);
            $('#workModalBody').html(details.content);

            const workModal = new bootstrap.Modal(document.getElementById('workModal'));
            workModal.show();
        }
    };

    console.log('%c👨‍💻 Murad Karimov Portfolio', 'color: #0b6623; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with precision and clean architecture principles', 'color: #a0a0a0; font-size: 12px;');
    console.log('%cInterested in working together? Let\'s connect!', 'color: #0b6623; font-size: 12px;');
    console.log('%cEmail: thekarimovmurad@gmail.com', 'color: #e0e0e0; font-size: 12px;');

    updateActiveNavLink();

    console.log('Portfolio initialized successfully ✓');

});

$(window).on('load', function () {
    console.log('All assets loaded ✓');
});

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}