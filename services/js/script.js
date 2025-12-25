// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Package configurations
const packageConfigs = {
    starter: {
        name: 'Starter Package',
        questions: [
            { type: 'text', label: 'Project Name', placeholder: 'Enter your project name', required: true },
            { type: 'textarea', label: 'Project Description', placeholder: 'Briefly describe your project', required: true },
            { type: 'select', label: 'Project Type', options: ['Mobile App', 'Website', 'Web App', 'Other'], required: true },
            { type: 'text', label: 'Target Audience', placeholder: 'Who is your target audience?', required: true },
            { type: 'textarea', label: 'Key Features', placeholder: 'List the key features you want (max 3)', required: true },
            { type: 'file', label: 'Reference Images (optional)', accept: 'image/*', multiple: true, required: false }
        ]
    },
    professional: {
        name: 'Professional Package',
        questions: [
            { type: 'text', label: 'Project Name', placeholder: 'Enter your project name', required: true },
            { type: 'textarea', label: 'Project Description', placeholder: 'Describe your project in detail', required: true },
            { type: 'select', label: 'Project Type', options: ['Mobile App', 'Website', 'Web App', 'E-commerce', 'Dashboard', 'Other'], required: true },
            { type: 'text', label: 'Target Audience', placeholder: 'Who is your target audience?', required: true },
            { type: 'textarea', label: 'Key Features', placeholder: 'List all the key features you want', required: true },
            { type: 'textarea', label: 'User Flow Requirements', placeholder: 'Describe the main user flows', required: true },
            { type: 'select', label: 'Platform', options: ['iOS', 'Android', 'Web', 'Cross-platform'], required: true },
            { type: 'text', label: 'Brand Colors (optional)', placeholder: 'Any specific brand colors?', required: false },
            { type: 'file', label: 'Reference Images or Mockups', accept: 'image/*', multiple: true, required: false },
            { type: 'file', label: 'Existing Logo (optional)', accept: 'image/*', required: false }
        ]
    },
    enterprise: {
        name: 'Enterprise Package',
        questions: [
            { type: 'text', label: 'Project Name', placeholder: 'Enter your project name', required: true },
            { type: 'textarea', label: 'Project Description', placeholder: 'Provide a comprehensive project description', required: true },
            { type: 'select', label: 'Project Type', options: ['Mobile App', 'Website', 'Web App', 'E-commerce', 'Dashboard', 'SaaS Platform', 'Enterprise Software', 'Other'], required: true },
            { type: 'text', label: 'Company Name', placeholder: 'Your company name', required: true },
            { type: 'text', label: 'Target Audience', placeholder: 'Detailed description of target audience', required: true },
            { type: 'textarea', label: 'Business Goals', placeholder: 'What are your main business objectives?', required: true },
            { type: 'textarea', label: 'Key Features', placeholder: 'Comprehensive list of required features', required: true },
            { type: 'textarea', label: 'User Flow Requirements', placeholder: 'Detailed user journey requirements', required: true },
            { type: 'textarea', label: 'Technical Requirements', placeholder: 'Any specific technical requirements?', required: false },
            { type: 'select', label: 'Platform', options: ['iOS', 'Android', 'Web', 'Cross-platform', 'Desktop'], required: true },
            { type: 'text', label: 'Brand Guidelines', placeholder: 'Link to brand guidelines or describe', required: false },
            { type: 'file', label: 'Reference Images or Mockups', accept: 'image/*', multiple: true, required: false },
            { type: 'file', label: 'Existing Logo and Assets', accept: 'image/*', multiple: true, required: false },
            { type: 'file', label: 'User Research Data (optional)', accept: '.pdf,.doc,.docx', required: false }
        ]
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const packageType = getUrlParameter('package');

    if (!packageType || !packageConfigs[packageType]) {
        // Invalid or missing package, redirect to main page
        window.location.href = '../index.html';
        return;
    }

    const config = packageConfigs[packageType];
    const container = document.getElementById('package-content');

    // Update page title
    document.title = `${config.name} - Project Details - Raj Varma`;

    // Create form
    const form = document.createElement('form');
    form.className = 'project-form';
    form.action = `mailto:itzrajvarma@gmail.com?subject=${encodeURIComponent(config.name + ' Project Details')}`;
    form.method = 'post';
    form.enctype = 'text/plain';

    // Add package info
    const packageInfo = document.createElement('div');
    packageInfo.innerHTML = `<h2 style="text-align: center; color: #2c3e50; margin-bottom: 2rem;">${config.name}</h2>`;
    form.appendChild(packageInfo);

    // Create form fields
    config.questions.forEach(question => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = question.label + (question.required ? ' *' : '');
        formGroup.appendChild(label);

        let input;
        if (question.type === 'textarea') {
            input = document.createElement('textarea');
            input.placeholder = question.placeholder;
        } else if (question.type === 'select') {
            input = document.createElement('select');
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Select an option';
            defaultOption.value = '';
            input.appendChild(defaultOption);
            question.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });
        } else if (question.type === 'file') {
            const fileUpload = document.createElement('div');
            fileUpload.className = 'file-upload';

            input = document.createElement('input');
            input.type = 'file';
            input.accept = question.accept || '';
            input.multiple = question.multiple || false;

            const fileLabel = document.createElement('label');
            fileLabel.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> Choose files`;
            fileLabel.appendChild(input);

            fileUpload.appendChild(fileLabel);
            formGroup.appendChild(fileUpload);
        } else {
            input = document.createElement('input');
            input.type = question.type;
            input.placeholder = question.placeholder;
        }

        if (input && question.type !== 'file') {
            input.required = question.required;
            formGroup.appendChild(input);
        }

        form.appendChild(formGroup);
    });

    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Submit Project Details';
    form.appendChild(submitBtn);

    // Add note
    const note = document.createElement('p');
    note.style.textAlign = 'center';
    note.style.marginTop = '1rem';
    note.style.fontSize = '0.9rem';
    note.style.color = '#666';
    note.textContent = '* Required fields. Your information will be sent via email.';
    form.appendChild(note);

    container.appendChild(form);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Build formatted email body
        let emailBody = `🎉 New Project Inquiry - ${config.name}\n\n`;
        emailBody += `Hello Raj Varma,\n\n`;
        emailBody += `You've received a new project inquiry for the ${config.name}. Here are the details:\n\n`;
        emailBody += `📋 PROJECT DETAILS\n`;
        emailBody += `==================\n\n`;

        // Add each field with formatting
        config.questions.forEach(question => {
            const fieldName = question.label;
            const fieldValue = data[fieldName] || 'Not provided';
            emailBody += `🔸 ${fieldName}:\n`;
            if (Array.isArray(fieldValue)) {
                emailBody += `   ${fieldValue.join(', ')}\n\n`;
            } else {
                emailBody += `   ${fieldValue}\n\n`;
            }
        });

        emailBody += `🚀 NEXT STEPS\n`;
        emailBody += `============\n\n`;
        emailBody += `1. Review the project details above\n`;
        emailBody += `2. Check attached files (if any)\n`;
        emailBody += `3. Respond to the client within 24 hours\n`;
        emailBody += `4. Schedule a discovery call if interested\n\n`;
        emailBody += `💼 CLIENT CONTACT\n`;
        emailBody += `=================\n\n`;
        emailBody += `Please reply to this email to connect with the client.\n\n`;
        emailBody += `Best regards,\n`;
        emailBody += `Raj Varma's Portfolio System\n`;
        emailBody += `itzrajvarma@gmail.com\n\n`;
        emailBody += `---\n`;
        emailBody += `This email was generated from your portfolio website form submission.`;

        // Encode for URL
        const encodedBody = encodeURIComponent(emailBody);
        const subject = encodeURIComponent(`${config.name} Project Details`);
        const mailtoUrl = `mailto:itzrajvarma@gmail.com?subject=${subject}&body=${encodedBody}`;

        // Open email client
        window.location.href = mailtoUrl;

        // Show confirmation
        alert('Thank you for submitting your project details! Your email client should open with the formatted inquiry. Please send it to complete the submission.');
    });
});
