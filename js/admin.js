// =====================================================
// Admin Panel JavaScript
// Content Management System
// =====================================================

let siteData = null;
let currentEditItem = null;
let currentEditType = null;

// Default credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// =====================================================
// Initialize on DOM Load
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initLogin();
});

// =====================================================
// Authentication
// =====================================================
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (isAuthenticated) {
        showDashboard();
    }
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem('adminAuth', 'true');
                showDashboard();
            } else {
                alert('Invalid credentials! Please try again.');
            }
        });
    }
}

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadData();
    initDashboard();
}

// =====================================================
// Dashboard Initialization
// =====================================================
function initDashboard() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const section = item.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                switchSection(section);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminAuth');
            location.reload();
        }
    });
    
    // Save changes
    document.getElementById('saveChanges').addEventListener('click', saveAllChanges);
    
    // Add buttons
    document.getElementById('addServiceBtn').addEventListener('click', () => openAddModal('service'));
    document.getElementById('addProjectBtn').addEventListener('click', () => openAddModal('project'));
    document.getElementById('addTestimonialBtn').addEventListener('click', () => openAddModal('testimonial'));
    document.getElementById('addGalleryBtn').addEventListener('click', () => openAddModal('gallery'));
}

// =====================================================
// Section Switching
// =====================================================
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}Section`);
    if (section) {
        section.classList.add('active');
    }
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        services: 'Manage Services',
        projects: 'Manage Projects',
        testimonials: 'Manage Testimonials',
        gallery: 'Manage Gallery',
        newsticker: 'News Ticker Settings',
        settings: 'Website Settings',
        stats: 'Manage Statistics',
        contact: 'Manage Contact Information'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName] || 'Dashboard';
    
    // Special rendering for news ticker
    if (sectionName === 'newsticker') {
        renderNewsTicker();
    }
}

// =====================================================
// Load Data
// =====================================================
async function loadData() {
    try {
        // Try to fetch from API first (dynamic mode)
        let response;
        try {
            response = await fetch('/api/data');
            if (!response.ok) throw new Error('API not available');
            console.log('✅ Loading data from API (Dynamic Mode)');
        } catch (apiError) {
            // Fallback to static file if API is not available
            console.log('⚠️ API not available, loading static data...');
            response = await fetch('data/data.json');
        }
        
        siteData = await response.json();
        
        renderDashboardStats();
        renderServices();
        renderProjects();
        renderTestimonials();
        renderStats();
        renderContact();
        renderGallery();
        renderSettings();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check if data.json exists.');
    }
}

// =====================================================
// Dashboard Stats
// =====================================================
function renderDashboardStats() {
    if (!siteData) return;
    
    document.getElementById('servicesCount').textContent = siteData.services.length;
    document.getElementById('projectsCount').textContent = siteData.projects.length;
    document.getElementById('testimonialsCount').textContent = siteData.testimonials.length;
    document.getElementById('galleryCount').textContent = siteData.gallery ? siteData.gallery.length : 0;
}

// =====================================================
// Services Management
// =====================================================
function renderServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList || !siteData) return;
    
    servicesList.innerHTML = siteData.services.map(service => `
        <div class="item-card">
            <div class="item-info">
                <h3>${service.icon} ${service.title}</h3>
                <p>${service.description}</p>
                <div class="item-tags">
                    ${service.details.slice(0, 3).map(detail => `<span class="tag">${detail}</span>`).join('')}
                    ${service.details.length > 3 ? `<span class="tag">+${service.details.length - 3} more</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                <button class="icon-btn edit" onclick="editService(${service.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteService(${service.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editService(id) {
    const service = siteData.services.find(s => s.id === id);
    if (!service) return; // Safety check
    
    currentEditItem = { ...service };
    currentEditType = 'service';
    
    // Check if this is a new service (empty title) or existing
    const isNewService = !service.title || service.title === '';
    const modalTitle = isNewService ? 'Add New Service' : 'Edit Service';
    
    openEditModal(modalTitle, `
        <div class="editor-form">
            <div class="form-group">
                <label>Icon (Emoji)</label>
                <input type="text" id="editIcon" value="${service.icon}" placeholder="🚀">
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="editTitle" value="${service.title}" placeholder="Service Name">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="editDescription" placeholder="Brief description of the service">${service.description}</textarea>
            </div>
            <div class="form-group">
                <label>Service Details</label>
                <div class="details-list" id="detailsList">
                    ${service.details.map((detail, index) => `
                        <div class="detail-item">
                            <input type="text" value="${detail}" data-index="${index}">
                            <button class="btn btn-danger btn-sm" onclick="removeDetail(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary btn-sm" onclick="addDetail()">
                    <i class="fas fa-plus"></i> Add Detail
                </button>
            </div>
            <div class="modal-actions">
                <button class="btn btn-success" onclick="saveServiceEdit()">
                    <i class="fas fa-save"></i> Save Changes
                </button>
                <button class="btn btn-secondary" onclick="cancelServiceEdit()">
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        siteData.services = siteData.services.filter(s => s.id !== id);
        renderServices();
        renderDashboardStats();
    }
}

function saveServiceEdit() {
    const icon = document.getElementById('editIcon').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const detailInputs = document.querySelectorAll('#detailsList input');
    const details = Array.from(detailInputs).map(input => input.value).filter(v => v.trim());
    
    const serviceIndex = siteData.services.findIndex(s => s.id === currentEditItem.id);
    if (serviceIndex !== -1) {
        siteData.services[serviceIndex] = {
            ...siteData.services[serviceIndex],
            icon,
            title,
            description,
            details
        };
    }
    
    renderServices();
    renderDashboardStats();
    closeModal();
}

function cancelServiceEdit() {
    // If this was a new service (empty title), remove it
    if (currentEditItem && (!currentEditItem.title || currentEditItem.title === '')) {
        siteData.services = siteData.services.filter(s => s.id !== currentEditItem.id);
        renderServices();
        renderDashboardStats();
    }
    closeModal();
}

// =====================================================
// Projects Management
// =====================================================
function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList || !siteData) return;
    
    projectsList.innerHTML = siteData.projects.map(project => `
        <div class="item-card">
            <div class="item-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="item-tags">
                    <span class="tag">${project.category}</span>
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="item-actions">
                <button class="icon-btn edit" onclick="editProject(${project.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteProject(${project.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editProject(id) {
    const project = siteData.projects.find(p => p.id === id);
    currentEditItem = { ...project };
    currentEditType = 'project';
    
    openEditModal('Edit Project', `
        <div class="editor-form">
            <div class="form-group">
                <label>Project Title</label>
                <input type="text" id="editTitle" value="${project.title}">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="editCategory">
                    <option value="Full Stack Development" ${project.category === 'Full Stack Development' ? 'selected' : ''}>Full Stack Development</option>
                    <option value="Machine Learning" ${project.category === 'Machine Learning' ? 'selected' : ''}>Machine Learning</option>
                    <option value="UI/UX Design" ${project.category === 'UI/UX Design' ? 'selected' : ''}>UI/UX Design</option>
                    <option value="Data Services" ${project.category === 'Data Services' ? 'selected' : ''}>Data Services</option>
                    <option value="Automation" ${project.category === 'Automation' ? 'selected' : ''}>Automation</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="editDescription">${project.description}</textarea>
            </div>
            <div class="form-group">
                <label>GitHub Repository Link</label>
                <input type="url" id="editGithubLink" value="${project.githubLink || ''}" placeholder="https://github.com/username/repo">
                <small>Leave empty if not available</small>
            </div>
            <div class="form-group">
                <label>Live Project Link</label>
                <input type="url" id="editLiveLink" value="${project.liveLink || ''}" placeholder="https://example.com">
                <small>Leave empty if not deployed</small>
            </div>
            <div class="form-group">
                <label>Project Image</label>
                <div class="image-choice">
                    <button type="button" class="choice-btn active" onclick="switchImageMode('url')">Image URL</button>
                    <button type="button" class="choice-btn" onclick="switchImageMode('upload')">Upload Image</button>
                </div>
                <div id="urlMode">
                    <input type="text" id="editImage" value="${project.image}" placeholder="https://example.com/image.jpg">
                </div>
                <div id="uploadMode" style="display: none;">
                    <div class="image-upload-container" onclick="document.getElementById('projectImageUpload').click()">
                        <input type="file" id="projectImageUpload" accept="image/*" onchange="handleImageUpload(event, 'editImagePreview')">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="upload-text">Click to upload image</div>
                        <div class="upload-hint">JPG, PNG or WebP (Max 2MB)</div>
                    </div>
                    <div id="editImagePreview" class="image-preview"></div>
                </div>
            </div>
            <div class="form-group">
                <label>Technologies (comma-separated)</label>
                <input type="text" id="editTechnologies" value="${project.technologies.join(', ')}">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="editFeatured" ${project.featured ? 'checked' : ''}>
                    Featured Project
                </label>
            </div>
            <button class="btn btn-success" onclick="saveProjectEdit()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `);
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        siteData.projects = siteData.projects.filter(p => p.id !== id);
        renderProjects();
        renderDashboardStats();
    }
}

function saveProjectEdit() {
    const title = document.getElementById('editTitle').value;
    const category = document.getElementById('editCategory').value;
    const description = document.getElementById('editDescription').value;
    const image = document.getElementById('editImage').value;
    const technologies = document.getElementById('editTechnologies').value.split(',').map(t => t.trim());
    const featured = document.getElementById('editFeatured').checked;
    const githubLink = document.getElementById('editGithubLink').value;
    const liveLink = document.getElementById('editLiveLink').value;
    
    const projectIndex = siteData.projects.findIndex(p => p.id === currentEditItem.id);
    if (projectIndex !== -1) {
        siteData.projects[projectIndex] = {
            ...siteData.projects[projectIndex],
            title,
            category,
            description,
            image,
            technologies,
            featured,
            githubLink,
            liveLink
        };
    }
    
    renderProjects();
    closeModal();
}

// =====================================================
// Testimonials Management
// =====================================================
function renderTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    if (!testimonialsList || !siteData) return;
    
    testimonialsList.innerHTML = siteData.testimonials.map(testimonial => `
        <div class="item-card">
            <div class="item-info">
                <h3>${testimonial.avatar} ${testimonial.name}</h3>
                <p><strong>${testimonial.position}</strong></p>
                <p>${testimonial.text}</p>
                <div class="item-tags">
                    <span class="tag">${'⭐'.repeat(testimonial.rating)}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="icon-btn edit" onclick="editTestimonial(${testimonial.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteTestimonial(${testimonial.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editTestimonial(id) {
    const testimonial = siteData.testimonials.find(t => t.id === id);
    currentEditItem = { ...testimonial };
    currentEditType = 'testimonial';
    
    openEditModal('Edit Testimonial', `
        <div class="editor-form">
            <div class="form-group">
                <label>Avatar (Emoji)</label>
                <input type="text" id="editAvatar" value="${testimonial.avatar}">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="editName" value="${testimonial.name}">
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" id="editPosition" value="${testimonial.position}">
            </div>
            <div class="form-group">
                <label>Rating (1-5)</label>
                <input type="number" id="editRating" min="1" max="5" value="${testimonial.rating}">
            </div>
            <div class="form-group">
                <label>Testimonial Text</label>
                <textarea id="editText">${testimonial.text}</textarea>
            </div>
            <button class="btn btn-success" onclick="saveTestimonialEdit()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `);
}

function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        siteData.testimonials = siteData.testimonials.filter(t => t.id !== id);
        renderTestimonials();
        renderDashboardStats();
    }
}

function saveTestimonialEdit() {
    const avatar = document.getElementById('editAvatar').value;
    const name = document.getElementById('editName').value;
    const position = document.getElementById('editPosition').value;
    const rating = parseInt(document.getElementById('editRating').value);
    const text = document.getElementById('editText').value;
    
    const testimonialIndex = siteData.testimonials.findIndex(t => t.id === currentEditItem.id);
    if (testimonialIndex !== -1) {
        siteData.testimonials[testimonialIndex] = {
            ...siteData.testimonials[testimonialIndex],
            avatar,
            name,
            position,
            rating,
            text
        };
    }
    
    renderTestimonials();
    closeModal();
}

// =====================================================
// Stats Management
// =====================================================
function renderStats() {
    const statsEditor = document.getElementById('statsEditor');
    if (!statsEditor || !siteData) return;
    
    statsEditor.innerHTML = `
        <h3>Edit Statistics</h3>
        <div class="editor-form">
            ${siteData.stats.map((stat, index) => `
                <div class="form-group">
                    <label>Stat ${index + 1}</label>
                    <input type="text" placeholder="Number (e.g., 150+, 98%)" value="${stat.number}" onchange="updateStat(${index}, 'number', this.value)">
                    <input type="text" placeholder="Label" value="${stat.label}" onchange="updateStat(${index}, 'label', this.value)">
                </div>
            `).join('')}
        </div>
    `;
}

function updateStat(index, field, value) {
    if (siteData && siteData.stats[index]) {
        siteData.stats[index][field] = value;
    }
}

// =====================================================
// Contact Management
// =====================================================
function renderContact() {
    const contactEditor = document.getElementById('contactEditor');
    if (!contactEditor || !siteData) return;
    
    contactEditor.innerHTML = `
        <h3>Edit Contact Information</h3>
        <div class="editor-form">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="contactEmail" value="${siteData.contact.email}">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="contactPhone" value="${siteData.contact.phone}">
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" id="contactAddress" value="${siteData.contact.address}">
            </div>
            <button class="btn btn-success" onclick="saveContact()">
                <i class="fas fa-save"></i> Save Contact Info
            </button>
        </div>
    `;
}

function saveContact() {
    siteData.contact.email = document.getElementById('contactEmail').value;
    siteData.contact.phone = document.getElementById('contactPhone').value;
    siteData.contact.address = document.getElementById('contactAddress').value;
    alert('Contact information updated!');
}

// =====================================================
// Gallery Management
// =====================================================
function renderGallery() {
    const galleryList = document.getElementById('galleryList');
    if (!galleryList || !siteData) return;
    
    // Initialize gallery if it doesn't exist
    if (!siteData.gallery) {
        siteData.gallery = [];
    }
    
    galleryList.innerHTML = siteData.gallery.map(item => `
        <div class="item-card">
            <div class="item-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="item-tags">
                    <span class="tag">${item.category}</span>
                </div>
                <img src="${item.image}" style="max-width: 200px; margin-top: 10px; border-radius: 8px;" alt="${item.title}">
            </div>
            <div class="item-actions">
                <button class="icon-btn edit" onclick="editGalleryItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteGalleryItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editGalleryItem(id) {
    const item = siteData.gallery.find(g => g.id === id);
    currentEditItem = { ...item };
    currentEditType = 'gallery';
    
    openEditModal('Edit Gallery Image', `
        <div class="editor-form">
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="editTitle" value="${item.title}">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="editDescription">${item.description}</textarea>
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" id="editCategory" value="${item.category}" placeholder="e.g., Events, Projects, Team">
            </div>
            <div class="form-group">
                <label>Image</label>
                <div class="image-choice">
                    <button type="button" class="choice-btn active" onclick="switchImageMode('url')">Image URL</button>
                    <button type="button" class="choice-btn" onclick="switchImageMode('upload')">Upload Image</button>
                </div>
                <div id="urlMode">
                    <input type="text" id="editImage" value="${item.image}" placeholder="https://example.com/image.jpg">
                </div>
                <div id="uploadMode" style="display: none;">
                    <div class="image-upload-container" onclick="document.getElementById('galleryImageUpload').click()">
                        <input type="file" id="galleryImageUpload" accept="image/*" onchange="handleImageUpload(event, 'editImagePreview')">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="upload-text">Click to upload image</div>
                        <div class="upload-hint">JPG, PNG or WebP (Max 2MB)</div>
                    </div>
                    <div id="editImagePreview" class="image-preview"></div>
                </div>
            </div>
            <button class="btn btn-success" onclick="saveGalleryEdit()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `);
}

function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        siteData.gallery = siteData.gallery.filter(g => g.id !== id);
        renderGallery();
        renderDashboardStats();
    }
}

function saveGalleryEdit() {
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const category = document.getElementById('editCategory').value;
    const image = document.getElementById('editImage').value;
    
    const itemIndex = siteData.gallery.findIndex(g => g.id === currentEditItem.id);
    if (itemIndex !== -1) {
        siteData.gallery[itemIndex] = {
            ...siteData.gallery[itemIndex],
            title,
            description,
            category,
            image
        };
    }
    
    renderGallery();
    closeModal();
}

// =====================================================
// Image Upload Handler
// =====================================================
function handleImageUpload(event, previewId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        
        // Update the image input with base64 data
        const imageInput = document.getElementById('editImage');
        if (imageInput) {
            imageInput.value = e.target.result;
        }
        
        // Show instructions
        alert('Image uploaded! Note: This is a demo. In production, upload to a server or use the images folder. For now, you can:\n\n1. Save the image manually to /images/projects/ or /images/gallery/\n2. Use the filename as: images/projects/your-image.jpg\n3. Or use external image URLs');
    };
    reader.readAsDataURL(file);
}

function switchImageMode(mode) {
    const urlMode = document.getElementById('urlMode');
    const uploadMode = document.getElementById('uploadMode');
    const buttons = document.querySelectorAll('.choice-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'url') {
        urlMode.style.display = 'block';
        uploadMode.style.display = 'none';
        buttons[0].classList.add('active');
    } else {
        urlMode.style.display = 'none';
        uploadMode.style.display = 'block';
        buttons[1].classList.add('active');
    }
}

// =====================================================
// Modal Functions
// =====================================================
function openEditModal(title, content) {
    const modal = document.getElementById('editModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.classList.add('active');
}

function openAddModal(type) {
    // Generate new ID
    let newId = 1;
    if (type === 'service') {
        newId = Math.max(...siteData.services.map(s => s.id), 0) + 1;
        currentEditItem = { id: newId, icon: '🆕', title: '', description: '', details: [] };
        currentEditType = 'service';
        // Push to array FIRST, then edit
        siteData.services.push(currentEditItem);
        editService(newId);
    } else if (type === 'project') {
        newId = Math.max(...siteData.projects.map(p => p.id), 0) + 1;
        currentEditItem = { id: newId, title: '', category: 'Full Stack Development', description: '', technologies: [], image: '', featured: false, githubLink: '', liveLink: '' };
        currentEditType = 'project';
        siteData.projects.push(currentEditItem);
        editProject(newId);
    } else if (type === 'testimonial') {
        newId = Math.max(...siteData.testimonials.map(t => t.id), 0) + 1;
        currentEditItem = { id: newId, name: '', position: '', avatar: '👤', rating: 5, text: '' };
        currentEditType = 'testimonial';
        siteData.testimonials.push(currentEditItem);
        editTestimonial(newId);
    } else if (type === 'gallery') {
        if (!siteData.gallery) siteData.gallery = [];
        newId = Math.max(...siteData.gallery.map(g => g.id), 0) + 1;
        currentEditItem = { id: newId, title: '', description: '', image: '', category: 'General' };
        currentEditType = 'gallery';
        siteData.gallery.push(currentEditItem);
        editGalleryItem(newId);
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
}

// =====================================================
// Detail Management (for services)
// =====================================================
function addDetail() {
    const detailsList = document.getElementById('detailsList');
    const index = detailsList.children.length;
    const detailItem = document.createElement('div');
    detailItem.className = 'detail-item';
    detailItem.innerHTML = `
        <input type="text" placeholder="New detail" data-index="${index}">
        <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    detailsList.appendChild(detailItem);
}

function removeDetail(index) {
    const detail = document.querySelector(`[data-index="${index}"]`);
    if (detail && detail.parentElement) {
        detail.parentElement.remove();
    }
}

// =====================================================
// Save All Changes
// =====================================================
async function saveAllChanges() {
    // Show saving indicator
    const saveBtn = document.getElementById('saveChanges');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    try {
        // Try to save via API (pushes to GitHub)
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Changes saved successfully!\n\n' + 
                  result.message + '\n\n' +
                  'Your website will update automatically in 30 seconds.\n' +
                  'Vercel is rebuilding your site now...');
            console.log('✅ Data saved via GitHub API');
        } else {
            // Show instructions if not configured
            alert('⚠️ Configuration Required!\n\n' + 
                  result.message + '\n\n' +
                  'Please follow the setup guide to enable dynamic updates.');
        }
    } catch (error) {
        console.error('Error saving:', error);
        
        // Fallback: Download file (manual mode)
        const dataStr = JSON.stringify(siteData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
        
        alert('⚠️ Manual Mode: Changes downloaded!\n\n' +
              'Replace data/data.json with the downloaded file\n' +
              'and push to GitHub to update your website.\n\n' +
              'To enable automatic updates, see the setup guide.');
    } finally {
        // Restore button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// =====================================================
// Settings Section
// =====================================================
function renderSettings() {
    if (!siteData) return;
    
    // Render logo preview
    renderLogoPreview();
    
    // Render hero slides
    renderHeroSlides();
    
    // Render social media links
    renderSocialMedia();
    
    // Render WhatsApp settings
    renderWhatsAppSettings();
    
    // Set logo text input
    if (siteData.logo) {
        document.getElementById('logoText').value = siteData.logo.text || 'ProView Cadence';
        
        // Set active mode
        if (siteData.logo.type === 'image') {
            switchLogoMode('image');
        } else {
            switchLogoMode('text');
        }
    }
}

function renderLogoPreview() {
    const logoPreview = document.getElementById('logoPreview');
    if (!logoPreview || !siteData.logo) return;
    
    if (siteData.logo.type === 'image' && siteData.logo.image) {
        logoPreview.innerHTML = `<img src="${siteData.logo.image}" alt="${siteData.logo.text}" style="max-width: 200px; max-height: 60px;">`;
    } else {
        const words = siteData.logo.text.split(' ');
        if (words.length === 2) {
            logoPreview.innerHTML = `<h2>${words[0]} <span>${words[1]}</span></h2>`;
        } else {
            logoPreview.innerHTML = `<h2>${siteData.logo.text}</h2>`;
        }
    }
}

function switchLogoMode(mode) {
    const textBtn = document.querySelector('.choice-btn:nth-child(1)');
    const imageBtn = document.querySelector('.choice-btn:nth-child(2)');
    const textInput = document.getElementById('textLogoInput');
    const imageInput = document.getElementById('imageLogoInput');
    
    if (mode === 'text') {
        textBtn.classList.add('active');
        imageBtn.classList.remove('active');
        textInput.classList.add('active');
        imageInput.classList.remove('active');
    } else {
        textBtn.classList.remove('active');
        imageBtn.classList.add('active');
        textInput.classList.remove('active');
        imageInput.classList.add('active');
    }
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, or WebP)');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
    }
    
    // Show file name
    document.getElementById('logoFileName').textContent = file.name;
    
    // Convert to base64 and preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoImagePreview = document.getElementById('logoImagePreview');
        const logoImagePreviewContainer = document.getElementById('logoImagePreviewContainer');
        
        logoImagePreview.src = e.target.result;
        logoImagePreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function saveLogo() {
    if (!siteData.logo) {
        siteData.logo = { type: 'text', text: 'ProView Cadence', image: '' };
    }
    
    const textInput = document.getElementById('textLogoInput');
    const imageInput = document.getElementById('imageLogoInput');
    
    if (textInput.classList.contains('active')) {
        // Text logo mode
        siteData.logo.type = 'text';
        siteData.logo.text = document.getElementById('logoText').value || 'ProView Cadence';
        siteData.logo.image = '';
    } else {
        // Image logo mode
        const logoImagePreview = document.getElementById('logoImagePreview');
        if (logoImagePreview.src && logoImagePreview.src !== window.location.href) {
            siteData.logo.type = 'image';
            siteData.logo.image = logoImagePreview.src;
            siteData.logo.text = document.getElementById('logoText').value || 'ProView Cadence';
        } else {
            alert('Please upload a logo image first');
            return;
        }
    }
    
    renderLogoPreview();
    alert('Logo saved! Click "Save All Changes" to download the updated data.json file.');
}

function renderHeroSlides() {
    const heroSlidesList = document.getElementById('heroSlidesList');
    if (!heroSlidesList || !siteData.hero || !siteData.hero.slides) return;
    
    heroSlidesList.innerHTML = siteData.hero.slides.map((slide, index) => `
        <div class="hero-slide-item">
            <div class="hero-slide-preview">
                <div class="hero-slide-image" style="background-image: url('${slide.backgroundImage}');">
                    <div class="hero-slide-overlay">
                        <h4>${slide.title}</h4>
                    </div>
                </div>
            </div>
            <div class="hero-slide-details">
                <h4>Slide ${index + 1}: ${slide.tag}</h4>
                <p>${slide.title}</p>
                <button class="btn btn-primary btn-sm" onclick="editHeroSlide(${slide.id})">
                    <i class="fas fa-edit"></i> Edit Background
                </button>
            </div>
        </div>
    `).join('');
}

function editHeroSlide(slideId) {
    const slide = siteData.hero.slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Edit Hero Slide - ${slide.tag}`;
    
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Tag</label>
            <input type="text" id="editSlideTag" value="${slide.tag}" class="form-input">
        </div>
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="editSlideTitle" value="${slide.title}" class="form-input">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="editSlideDescription" class="form-input" rows="3">${slide.description}</textarea>
        </div>
        <div class="form-group">
            <label>Button Text</label>
            <input type="text" id="editSlideButtonText" value="${slide.buttonText}" class="form-input">
        </div>
        <div class="form-group">
            <label>Button Link</label>
            <input type="text" id="editSlideButtonLink" value="${slide.buttonLink}" class="form-input">
        </div>
        <div class="form-group">
            <label>Background Image</label>
            <div class="choice-buttons">
                <button class="choice-btn active" onclick="switchImageMode('url', 'editSlideImage')">
                    <i class="fas fa-link"></i> Image URL
                </button>
                <button class="choice-btn" onclick="switchImageMode('upload', 'editSlideImage')">
                    <i class="fas fa-upload"></i> Upload Image
                </button>
            </div>
            <div id="editSlideImage-url-mode" class="image-input-mode active">
                <input type="text" id="editSlideImageUrl" value="${slide.backgroundImage}" class="form-input" placeholder="Enter image URL">
            </div>
            <div id="editSlideImage-upload-mode" class="image-input-mode">
                <div class="image-upload-container">
                    <input type="file" id="editSlideImageUpload" accept="image/*" onchange="handleImageUpload(event, 'editSlideImagePreview')" style="display: none;">
                    <button class="upload-btn" onclick="document.getElementById('editSlideImageUpload').click()">
                        <i class="fas fa-upload"></i> Choose Image
                    </button>
                </div>
            </div>
            <div class="image-preview" id="editSlideImagePreview" style="background-image: url('${slide.backgroundImage}');"></div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-success" onclick="saveHeroSlideEdit(${slideId})">
                <i class="fas fa-save"></i> Save Changes
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Cancel
            </button>
        </div>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

function saveHeroSlideEdit(slideId) {
    const slide = siteData.hero.slides.find(s => s.id === slideId);
    if (!slide) return;
    
    slide.tag = document.getElementById('editSlideTag').value;
    slide.title = document.getElementById('editSlideTitle').value;
    slide.description = document.getElementById('editSlideDescription').value;
    slide.buttonText = document.getElementById('editSlideButtonText').value;
    slide.buttonLink = document.getElementById('editSlideButtonLink').value;
    
    // Get background image
    const urlMode = document.getElementById('editSlideImage-url-mode');
    if (urlMode.classList.contains('active')) {
        slide.backgroundImage = document.getElementById('editSlideImageUrl').value;
    } else {
        const preview = document.getElementById('editSlideImagePreview');
        const bgImage = preview.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const url = bgImage.slice(5, -2); // Remove url(" and ")
            slide.backgroundImage = url;
        }
    }
    
    renderHeroSlides();
    closeModal();
    alert('Hero slide updated! Click "Save All Changes" to download the updated data.json file.');
}

// =====================================================
// Social Media Management
// =====================================================
function renderSocialMedia() {
    if (!siteData || !siteData.contact || !siteData.contact.social) return;
    
    const social = siteData.contact.social;
    
    // Set input values
    if (document.getElementById('linkedinUrl')) {
        document.getElementById('linkedinUrl').value = social.linkedin || '';
    }
    if (document.getElementById('githubUrl')) {
        document.getElementById('githubUrl').value = social.github || '';
    }
    if (document.getElementById('twitterUrl')) {
        document.getElementById('twitterUrl').value = social.twitter || '';
    }
    if (document.getElementById('facebookUrl')) {
        document.getElementById('facebookUrl').value = social.facebook || '';
    }
    if (document.getElementById('instagramUrl')) {
        document.getElementById('instagramUrl').value = social.instagram || '';
    }
}

function saveSocialMedia() {
    if (!siteData.contact) {
        siteData.contact = {};
    }
    if (!siteData.contact.social) {
        siteData.contact.social = {};
    }
    
    // Get values from inputs
    siteData.contact.social.linkedin = document.getElementById('linkedinUrl').value || '';
    siteData.contact.social.github = document.getElementById('githubUrl').value || '';
    siteData.contact.social.twitter = document.getElementById('twitterUrl').value || '';
    siteData.contact.social.facebook = document.getElementById('facebookUrl').value || '';
    siteData.contact.social.instagram = document.getElementById('instagramUrl').value || '';
    
    alert('Social media links saved! Click "Save All Changes" to download the updated data.json file.\n\nVisitors will be redirected to these links when they click the social media icons in the footer.');
}

// =====================================================
// WhatsApp Settings
// =====================================================
function renderWhatsAppSettings() {
    if (!siteData || !siteData.contact) return;
    
    const whatsappInput = document.getElementById('whatsappNumber');
    if (whatsappInput) {
        whatsappInput.value = siteData.contact.whatsapp || '';
    }
}

function saveWhatsAppSettings() {
    if (!siteData.contact) {
        siteData.contact = {};
    }
    
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    
    // Validate WhatsApp number
    if (whatsappNumber && !/^\d+$/.test(whatsappNumber)) {
        alert('Please enter a valid WhatsApp number with only digits (no spaces or special characters).\n\nExample: 919876543210');
        return;
    }
    
    siteData.contact.whatsapp = whatsappNumber;
    
    alert('WhatsApp settings saved! Click "Save All Changes" to download the updated data.json file.\n\nThe floating WhatsApp button will open a chat with this number when clicked.');
}

// =====================================================
// News Ticker Management
// =====================================================
function renderNewsTicker() {
    if (!siteData || !siteData.newsTicker) {
        // Initialize with default values if not exists
        siteData.newsTicker = {
            enabled: true,
            text: '🎉 Welcome to ProView Cadence | Expert Technical Services Available | Contact Us for Free Consultation | Special Offers on ML & AI Projects | 24/7 Support Available'
        };
    }
    
    const newsTickerEnabled = document.getElementById('newsTickerEnabled');
    const newsTickerText = document.getElementById('newsTickerText');
    const newsTickerPreview = document.getElementById('newsTickerPreview');
    
    if (newsTickerEnabled) {
        newsTickerEnabled.checked = siteData.newsTicker.enabled !== false;
    }
    
    if (newsTickerText) {
        newsTickerText.value = siteData.newsTicker.text;
    }
    
    if (newsTickerPreview) {
        newsTickerPreview.textContent = siteData.newsTicker.text;
    }
}

function updateNewsTickerPreview() {
    const newsTickerText = document.getElementById('newsTickerText');
    const newsTickerPreview = document.getElementById('newsTickerPreview');
    
    if (newsTickerText && newsTickerPreview) {
        newsTickerPreview.textContent = newsTickerText.value;
    }
}

function saveNewsTicker() {
    const newsTickerEnabled = document.getElementById('newsTickerEnabled');
    const newsTickerText = document.getElementById('newsTickerText');
    
    if (!newsTickerText.value.trim()) {
        alert('Please enter some text for the news ticker.');
        return;
    }
    
    if (!siteData.newsTicker) {
        siteData.newsTicker = {};
    }
    
    siteData.newsTicker.enabled = newsTickerEnabled.checked;
    siteData.newsTicker.text = newsTickerText.value;
    
    alert('News Ticker settings saved! Click "Save All Changes" at the top to download the updated data.json file.');
}

// Global functions
window.editService = editService;
window.deleteService = deleteService;
window.saveServiceEdit = saveServiceEdit;
window.cancelServiceEdit = cancelServiceEdit;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.saveProjectEdit = saveProjectEdit;
window.editTestimonial = editTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.saveTestimonialEdit = saveTestimonialEdit;
window.editGalleryItem = editGalleryItem;
window.deleteGalleryItem = deleteGalleryItem;
window.saveGalleryEdit = saveGalleryEdit;
window.updateStat = updateStat;
window.saveContact = saveContact;
window.closeModal = closeModal;
window.addDetail = addDetail;
window.removeDetail = removeDetail;
window.handleImageUpload = handleImageUpload;
window.switchLogoMode = switchLogoMode;
window.handleLogoUpload = handleLogoUpload;
window.saveLogo = saveLogo;
window.editHeroSlide = editHeroSlide;
window.saveHeroSlideEdit = saveHeroSlideEdit;
window.saveSocialMedia = saveSocialMedia;
window.saveWhatsAppSettings = saveWhatsAppSettings;
window.switchImageMode = switchImageMode;
window.renderNewsTicker = renderNewsTicker;
window.updateNewsTickerPreview = updateNewsTickerPreview;
window.saveNewsTicker = saveNewsTicker;
window.renderNewsTicker = renderNewsTicker;
window.updateNewsTickerPreview = updateNewsTickerPreview;
window.saveNewsTicker = saveNewsTicker;

// =====================================================
// News Ticker Management
// =====================================================
function renderNewsTicker() {
    if (!siteData || !siteData.newsTicker) {
        // Initialize if not exists
        siteData.newsTicker = {
            enabled: true,
            text: '🎉 Welcome to ProView Cadence | Expert Technical Services Available | Contact Us for Free Consultation | Special Offers on ML & AI Projects | 24/7 Support Available'
        };
    }
    
    // Set values
    document.getElementById('newsTickerEnabled').checked = siteData.newsTicker.enabled !== false;
    document.getElementById('newsTickerText').value = siteData.newsTicker.text || '';
    document.getElementById('newsTickerPreview').textContent = siteData.newsTicker.text || '';
}

function updateNewsTickerPreview() {
    const text = document.getElementById('newsTickerText').value;
    document.getElementById('newsTickerPreview').textContent = text || 'Your news ticker text will appear here...';
}

function saveNewsTicker() {
    const enabled = document.getElementById('newsTickerEnabled').checked;
    const text = document.getElementById('newsTickerText').value.trim();
    
    if (!text) {
        alert('Please enter news ticker text!');
        return;
    }
    
    if (!siteData.newsTicker) {
        siteData.newsTicker = {};
    }
    
    siteData.newsTicker.enabled = enabled;
    siteData.newsTicker.text = text;
    
    alert('News ticker settings saved! Click "Save All Changes" at the top to download the updated data.json file.');
}
