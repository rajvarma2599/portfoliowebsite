document.addEventListener('DOMContentLoaded', function() {
    const addModeBtn = document.getElementById('add-mode');
    const editModeBtn = document.getElementById('edit-mode');
    const editSection = document.getElementById('edit-section');
    const projectForm = document.getElementById('project-form');
    const submitBtn = document.getElementById('submit-btn');
    const projectSelect = document.getElementById('project-select');
    const loadProjectBtn = document.getElementById('load-project');

    let isEditMode = false;
    let editingProjectId = null;

    // Mode toggle
    addModeBtn.addEventListener('click', () => {
        addModeBtn.classList.add('active');
        editModeBtn.classList.remove('active');
        editSection.style.display = 'none';
        isEditMode = false;
        resetForm();
    });

    editModeBtn.addEventListener('click', () => {
        editModeBtn.classList.add('active');
        addModeBtn.classList.remove('active');
        editSection.style.display = 'block';
        isEditMode = true;
        loadProjectList();
    });

    // Load project list for editing from main portfolio
    async function loadProjectList() {
        try {
            // Fetch the main index.html from the live website
            const response = await fetch('https://rajvarma2599.github.io/portfoliowebsite/index.html');
            if (!response.ok) {
                throw new Error('Failed to fetch main index.html');
            }
            const content = await response.text();

            // Parse the HTML to find project links
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const projectLinks = doc.querySelectorAll('.project-content a[href]');

            const projects = [];
            projectLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('project') && href.endsWith('/index.html')) {
                    const projectId = href.replace('/index.html', '');
                    projects.push(projectId);
                }
            });

            // Sort projects by number
            projects.sort((a, b) => {
                const numA = parseInt(a.replace('project', ''));
                const numB = parseInt(b.replace('project', ''));
                return numA - numB;
            });

            projectSelect.innerHTML = '<option value="">Choose a project...</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project;
                option.textContent = project;
                projectSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading project list:', error);
            alert('Error loading project list. Please try again.');
        }
    }

    // Load project data for editing
    loadProjectBtn.addEventListener('click', async () => {
        const selectedProject = projectSelect.value;
        if (!selectedProject) {
            alert('Please select a project to edit.');
            return;
        }

        try {
            // Fetch the project's index.html from the live portfolio website
            const response = await fetch(`https://rajvarma2599.github.io/portfoliowebsite/${selectedProject}/index.html`);
            if (!response.ok) {
                throw new Error('Failed to fetch project index.html');
            }
            const content = await response.text();

            // Parse the HTML content to extract project data
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            // Extract data from the HTML
            const title = doc.querySelector('.project-hero h1')?.textContent || '';
            const subtitle = doc.querySelector('.project-hero p')?.textContent || '';
            const sectionCards = doc.querySelectorAll('.section-card');
            const overview = sectionCards[0]?.querySelector('p')?.textContent || '';

            const features = Array.from(doc.querySelectorAll('.feature-item')).map(item => {
                const h3 = item.querySelector('h3')?.textContent || '';
                const p = item.querySelector('p')?.textContent || '';
                return `${h3}: ${p}`;
            }).join('\n');

            const tools = Array.from(doc.querySelectorAll('.tool')).map(tool => tool.textContent).join(', ');

            const results = doc.querySelector('.results p')?.textContent || '';

            const metrics = Array.from(doc.querySelectorAll('.results > div')).slice(0, 3).map(div => {
                const h3 = div.querySelector('h3')?.textContent || '';
                const p = div.querySelector('p')?.textContent || '';
                return { value: h3, label: p };
            });

            // Extract additional data from data attributes if available
            const projectData = doc.querySelector('[data-project-info]');
            let categories = [];
            let techTags = [];
            let projectTag = 'Latest';
            let projectIcon = '';
            let websiteLink = '';

            if (projectData) {
                const data = JSON.parse(projectData.getAttribute('data-project-info') || '{}');
                categories = data.categories || [];
                techTags = data.techTags || [];
                projectTag = data.projectTag || 'Latest';
                projectIcon = data.projectIcon || '';
                websiteLink = data.websiteLink || '';
            }

            // Fill the form
            document.getElementById('project-title').value = title;
            document.getElementById('project-subtitle').value = subtitle;
            document.getElementById('project-overview').value = overview;
            document.getElementById('key-features').value = features;
            document.getElementById('tools-tech').value = tools;
            document.getElementById('results-impact').value = results;
            document.getElementById('tech-tags').value = techTags.join(', ');
            document.getElementById('project-tag').value = projectTag;
            document.getElementById('project-icon').value = projectIcon;
            document.getElementById('project-website').value = websiteLink;

            // Set categories checkboxes
            document.querySelectorAll('.categories input').forEach(cb => {
                cb.checked = categories.includes(cb.value);
            });

            if (metrics[0]) {
                document.getElementById('metric1-value').value = metrics[0].value;
                document.getElementById('metric1-label').value = metrics[0].label;
            }
            if (metrics[1]) {
                document.getElementById('metric2-value').value = metrics[1].value;
                document.getElementById('metric2-label').value = metrics[1].label;
            }
            if (metrics[2]) {
                document.getElementById('metric3-value').value = metrics[2].value;
                document.getElementById('metric3-label').value = metrics[2].label;
            }

            editingProjectId = selectedProject;
            submitBtn.textContent = 'Update Project';

        } catch (error) {
            console.error('Error loading project:', error);
            alert('Error loading project data. Please try again.');
        }
    });

    // Form submission
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Project...';

        try {
            const formData = getFormData();
            const dirHandle = await window.showDirectoryPicker();

            let projectId;
            if (isEditMode && editingProjectId) {
                projectId = editingProjectId;
            } else {
                // Find next project number
                const existingProjects = [];
                for await (const [name, handle] of dirHandle.entries()) {
                    if (name.startsWith('project') && handle.kind === 'directory') {
                        const num = parseInt(name.replace('project', ''));
                        if (!isNaN(num)) existingProjects.push(num);
                    }
                }
                const nextNum = existingProjects.length > 0 ? Math.max(...existingProjects) + 1 : 1;
                projectId = `project${nextNum}`;
            }

            // Create project folder
            const projectDir = await dirHandle.getDirectoryHandle(projectId, { create: true });

            // Create subdirectories
            await projectDir.getDirectoryHandle('css', { create: true });
            await projectDir.getDirectoryHandle('js', { create: true });
            await projectDir.getDirectoryHandle('favicon', { create: true });

            // Generate and write project HTML
            const projectHtml = generateProjectHtml(formData);
            const indexHandle = await projectDir.getFileHandle('index.html', { create: true });
            const indexStream = await indexHandle.createWritable();
            await indexStream.write(projectHtml);
            await indexStream.close();

            // Copy favicon files (assuming they exist in root)
            try {
                const rootFavicon = await dirHandle.getDirectoryHandle('favicon');
                for await (const [name, handle] of rootFavicon.entries()) {
                    if (handle.kind === 'file') {
                        const sourceFile = await handle.getFile();
                        const destHandle = await projectDir.getDirectoryHandle('favicon').getFileHandle(name, { create: true });
                        const destStream = await destHandle.createWritable();
                        await destStream.write(await sourceFile.arrayBuffer());
                        await destStream.close();
                    }
                }
            } catch (error) {
                console.warn('Could not copy favicon files:', error);
            }

            // Handle image upload
            const imageFile = document.getElementById('project-image').files[0];
            if (imageFile) {
                const imageHandle = await projectDir.getFileHandle(imageFile.name, { create: true });
                const imageStream = await imageHandle.createWritable();
                await imageStream.write(await imageFile.arrayBuffer());
                await imageStream.close();
            }

            // Update main index.html
            await updateMainIndex(dirHandle, formData, projectId);

            alert(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
            resetForm();

        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isEditMode ? 'Update Project' : 'Create Project';
        }
    });

    function getFormData() {
        const categories = Array.from(document.querySelectorAll('.categories input:checked')).map(cb => cb.value);

        return {
            title: document.getElementById('project-title').value,
            subtitle: document.getElementById('project-subtitle').value,
            overview: document.getElementById('project-overview').value,
            features: document.getElementById('key-features').value.split('\n').filter(f => f.trim()),
            tools: document.getElementById('tools-tech').value.split(',').map(t => t.trim()),
            results: document.getElementById('results-impact').value,
            metrics: [
                {
                    value: document.getElementById('metric1-value').value,
                    label: document.getElementById('metric1-label').value
                },
                {
                    value: document.getElementById('metric2-value').value,
                    label: document.getElementById('metric2-label').value
                },
                {
                    value: document.getElementById('metric3-value').value,
                    label: document.getElementById('metric3-label').value
                }
            ].filter(m => m.value && m.label),
            categories: categories,
            techTags: document.getElementById('tech-tags').value.split(',').map(t => t.trim()),
            projectTag: document.getElementById('project-tag').value,
            projectIcon: document.getElementById('project-icon').value,
            websiteLink: document.getElementById('project-website').value
        };
    }

    function generateProjectHtml(data) {
        const featuresHtml = data.features.map(feature => {
            const [title, desc] = feature.split(': ');
            return `
                <div class="feature-item">
                    <i class="fas fa-check-circle"></i>
                    <h3>${title || feature}</h3>
                    <p>${desc || ''}</p>
                </div>
            `;
        }).join('');

        const toolsHtml = data.tools.map(tool => `<span class="tool">${tool}</span>`).join('');

        const metricsHtml = data.metrics.map(metric => `
            <div>
                <h3>${metric.value}</h3>
                <p>${metric.label}</p>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Raj Varma</title>
    <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="manifest" href="favicon/site.webmanifest">
    <link rel="stylesheet" href="../css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Pacifico&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .project-hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0 60px;
            text-align: center;
        }
        .project-hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .project-hero p {
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto;
        }
        .project-content {
            padding: 60px 0;
        }
        .section-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            transition: transform 0.3s;
        }
        .section-card:hover {
            transform: translateY(-5px);
        }
        .section-card h2 {
            color: #3498db;
            margin-bottom: 1rem;
        }
        .features-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        .feature-item {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
        .tools-used {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .tool {
            background: #3498db;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
        }
        .results {
            text-align: center;
            background: #f4f4f4;
            padding: 2rem;
            border-radius: 10px;
        }
        .back-link {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .back-link:hover {
            background: #2980b9;
        }
        .logo {
            font-family: 'Pacifico', cursive;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">Raj Varma</div>
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="../index.html#about">About</a></li>
                <li><a href="../index.html#skills">Skills</a></li>
                <li><a href="../index.html#projects">Projects</a></li>
                <li><a href="../index.html#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="project-hero">
        <div class="container">
            <h1>${data.title}</h1>
            <p>${data.subtitle}</p>
        </div>
        <div style="display: none;" data-project-info='${JSON.stringify({ categories: data.categories, techTags: data.techTags, projectTag: data.projectTag, projectIcon: data.projectIcon, websiteLink: data.websiteLink })}'></div>
    </section>

    <section class="project-content">
        <div class="container">
            <div class="section-card">
                <h2><i class="fas fa-info-circle"></i> Project Overview</h2>
                <p>${data.overview}</p>
            </div>

            <div class="section-card">
                <h2><i class="fas fa-list-check"></i> Key Features Implemented</h2>
                <div class="features-list">
                    ${featuresHtml}
                </div>
            </div>

            <div class="section-card">
                <h2><i class="fas fa-tools"></i> Tools & Technologies Used</h2>
                <div class="tools-used">
                    ${toolsHtml}
                </div>
            </div>

            <div class="section-card results">
                <h2><i class="fas fa-trophy"></i> Results & Impact</h2>
                <p>${data.results}</p>
                <div style="display: flex; justify-content: space-around; margin-top: 2rem;">
                    ${metricsHtml}
                </div>
            </div>

            <div style="text-align: center; margin-top: 3rem;">
                <a href="../index.html#projects" class="back-link"><i class="fas fa-arrow-left"></i> Back to Projects</a>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; 2023 Raj Varma. All rights reserved.</p>
    </footer>

    <script src="../js/script.js"></script>
</body>
</html>`;
    }

    async function updateMainIndex(dirHandle, formData, projectId) {
        const indexHandle = await dirHandle.getFileHandle('index.html');
        const indexFile = await indexHandle.getFile();
        const content = await indexFile.text();

        // Find the projects grid section
        const projectsGridRegex = /<div class="projects-grid">([\s\S]*?)<\/div>/;
        const match = content.match(projectsGridRegex);

        if (!match) {
            console.error('Could not find projects grid in main index.html');
            return;
        }

        const existingProjects = match[1];

        // Generate new project card
        const categories = formData.categories.join(' ');
        const techTags = formData.techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
        const projectLink = formData.websiteLink ? formData.websiteLink : `${projectId}/index.html`;

        const newProjectCard = `
                <div class="project-card animate-stagger" data-category="${categories}">
                    <div class="project-image">
                        <div class="project-icon">
                            ${formData.projectIcon}
                        </div>
                        <div class="project-overlay">
                            <span class="project-tag">${formData.projectTag}</span>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3><a href="${projectLink}" target="_blank">${formData.title}</a></h3>
                        <p>${formData.subtitle}</p>
                        <div class="project-tech">
                            ${techTags}
                        </div>
                    </div>
                </div>`;

        // Insert new project card at the beginning
        const updatedProjects = newProjectCard + existingProjects;

        // Replace in content
        const updatedContent = content.replace(projectsGridRegex, `<div class="projects-grid">${updatedProjects}</div>`);

        // Write back
        const indexStream = await indexHandle.createWritable();
        await indexStream.write(updatedContent);
        await indexStream.close();
    }

    function resetForm() {
        projectForm.reset();
        editingProjectId = null;
        document.getElementById('project-tag').value = 'Latest';
    }
});
