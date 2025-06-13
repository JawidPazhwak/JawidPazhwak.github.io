// Load Skills from JSON
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // Load Projects
    const loadProjects = async () => {
        try {
            console.log('Loading projects...');
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Projects loaded:', data);

            const projectsList = document.getElementById('projects-list');
            if (!projectsList) {
                throw new Error('Projects list element not found');
            }

            projectsList.innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach((project, index) => {
                    const div = document.createElement('div');
                    div.className = 'project-card';
                    div.style.animationDelay = `${index * 0.2}s`;
                    div.innerHTML = `
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <a href="${project.link}" target="_blank">Visit</a>
                    `;
                    projectsList.appendChild(div);
                });
            } else {
                throw new Error('Projects data is not an array');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            const projectsList = document.getElementById('projects-list');
            if (projectsList) {
                projectsList.innerHTML = `
                    <div class="project-card error">
                        <h3>Error Loading Projects</h3>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }
    };

    // Load Audio Files
    const loadAudioFiles = async () => {
        try {
            console.log('Starting audio file loading process...');
            
            // Check if we're on the music page
            console.log('Current page:', window.location.pathname);
            
            // Check if the container exists
            const musicContainer = document.querySelector('.row.g-4');
            console.log('Music container found:', !!musicContainer);
            
            if (!musicContainer) {
                throw new Error('Music container not found in the DOM');
            }

            // Define audio files directly since we're on GitHub Pages
            const audioFiles = [
                {
                    name: "Project 1",
                    file: "Project_1.mp3",
                    type: "mp3"
                },
                {
                    name: "Project 2",
                    file: "Project_2.mp3",
                    type: "mp3"
                }
            ];

            // Clear the container
            musicContainer.innerHTML = '';

            // Create and append each track
            audioFiles.forEach((file, index) => {
                console.log(`Processing file ${index + 1}:`, file);
                
                const trackId = `track-${index + 1}`;
                const filePath = `static/uploads/audio/${file.file}`;
                console.log('File path:', filePath);
                
                const trackElement = document.createElement('div');
                trackElement.className = 'col-12 col-md-6';
                trackElement.innerHTML = `
                    <div class="music-track">
                        <h5 class="neon-text">${file.name}</h5>
                        <h6 class="neon-text">Original Composition</h6>
                        <p class="neon-text">A unique musical piece showcasing creative sound design.</p>
                        
                        <div class="audio-player mb-3">
                            <audio 
                                id="audio-${trackId}"
                                controls 
                                class="w-100" 
                                preload="metadata"
                                controlsList="nodownload"
                            >
                                <source src="${filePath}" type="audio/${file.type}">
                                Your browser does not support the audio element.
                            </audio>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="like-section">
                                <button class="button like-btn" data-track-id="${trackId}">
                                    <i class="fas fa-heart"></i> <span class="like-count">0</span>
                                </button>
                            </div>
                            <small class="neon-text">Uploaded on ${new Date().toISOString().split('T')[0]}</small>
                        </div>

                        <div class="comments-section mt-3">
                            <h6 class="neon-text">Comments</h6>
                            <form class="comment-form mb-3" data-track-id="${trackId}">
                                <div class="input-group">
                                    <input type="text" class="form-control neon-input" placeholder="Add a comment..." required>
                                    <button type="submit" class="button">Post</button>
                                </div>
                            </form>
                            <div class="comments-list" data-track-id="${trackId}">
                                <!-- Comments will be loaded here -->
                            </div>
                        </div>
                    </div>
                `;
                musicContainer.appendChild(trackElement);

                // Add event listeners for audio loading
                const audioElement = document.getElementById(`audio-${trackId}`);
                if (audioElement) {
                    audioElement.addEventListener('error', (e) => {
                        console.error(`Error loading audio file ${filePath}:`, e);
                        const playerDiv = audioElement.parentElement;
                        playerDiv.innerHTML = `
                            <div class="alert alert-danger">
                                Error loading audio file: ${file.file}
                                <br>
                                <small>Please check if the file exists and is accessible.</small>
                            </div>
                        `;
                    });

                    audioElement.addEventListener('loadeddata', () => {
                        console.log(`Audio file loaded successfully: ${filePath}`);
                    });

                    // Prevent right-click on audio elements
                    audioElement.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                    });
                }
            });

            console.log('All tracks added to the page');

            // Initialize like buttons and comments for new tracks
            initializeTrackInteractions();
            console.log('Track interactions initialized');
            
        } catch (error) {
            console.error('Error in loadAudioFiles:', error);
            const musicContainer = document.querySelector('.row.g-4');
            if (musicContainer) {
                musicContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <h4>Error Loading Audio Files</h4>
                            <p>${error.message}</p>
                            <p>Please check the browser console for more details.</p>
                        </div>
                    </div>
                `;
            }
        }
    };

    // Initialize track interactions (likes and comments)
    const initializeTrackInteractions = () => {
        // Handle likes
        document.querySelectorAll('.like-btn').forEach(button => {
            const trackId = button.dataset.trackId;
            const likeCount = button.querySelector('.like-count');
            
            // Load saved likes
            const savedLikes = localStorage.getItem(`likes_${trackId}`) || '0';
            likeCount.textContent = savedLikes;
            
            if (localStorage.getItem(`liked_${trackId}`) === 'true') {
                button.classList.add('active');
            }

            button.addEventListener('click', function() {
                const currentCount = parseInt(likeCount.textContent);
                if (this.classList.contains('active')) {
                    likeCount.textContent = currentCount - 1;
                    this.classList.remove('active');
                    localStorage.setItem(`liked_${trackId}`, 'false');
                    localStorage.setItem(`likes_${trackId}`, (currentCount - 1).toString());
                } else {
                    likeCount.textContent = currentCount + 1;
                    this.classList.add('active');
                    localStorage.setItem(`liked_${trackId}`, 'true');
                    localStorage.setItem(`likes_${trackId}`, (currentCount + 1).toString());
                }
            });
        });

        // Handle comments
        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const trackId = this.dataset.trackId;
                const input = this.querySelector('input');
                const comment = input.value.trim();
                
                if (comment) {
                    const commentsList = document.querySelector(`.comments-list[data-track-id="${trackId}"]`);
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <p class="neon-text">${comment}</p>
                        <small class="neon-text">${new Date().toLocaleString()}</small>
                    `;
                    commentsList.appendChild(commentElement);
                    input.value = '';
                }
            });
        });
    };

    // Load audio files if we're on the music page
    if (window.location.pathname.includes('music.html')) {
        console.log('Music page detected, loading audio files...');
        loadAudioFiles();
    } else {
        console.log('Not on music page, skipping audio loading');
    }

    // Load projects if we're on the main page
    if (document.getElementById('projects-list')) {
        loadProjects();
    }

    // Load Skills
    const loadSkills = async () => {
        try {
            console.log('Loading skills...');
            const response = await fetch('skills.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Skills loaded:', data);

            const skillsList = document.getElementById('skills-list');
            if (!skillsList) {
                throw new Error('Skills list element not found');
            }

            skillsList.innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach((skill, index) => {
                    const li = document.createElement('li');
                    li.textContent = skill;
                    li.style.animationDelay = `${index * 0.1}s`;
                    skillsList.appendChild(li);
                });
            } else {
                throw new Error('Skills data is not an array');
            }
        } catch (error) {
            console.error('Error loading skills:', error);
            const skillsList = document.getElementById('skills-list');
            if (skillsList) {
                skillsList.innerHTML = `
                    <li class="error">Error loading skills: ${error.message}</li>
                `;
            }
        }
    };

    // Initialize loading
    loadSkills();

    // Form handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                // Here you would typically send the data to a server
                console.log('Form submitted:', data);
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your message. Please try again.');
            }
        });
    }
});

// Particle Effect on Button Click
function triggerParticleEffect(button) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = '#00ff00';
        particle.style.borderRadius = '50%';
        particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        particle.style.opacity = '0';
        particle.style.transition = 'all 1s ease-out';
        button.appendChild(particle);
        setTimeout(() => {
            particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
            particle.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission for demo
        triggerParticleEffect(button);
    });
}); 

// Matrix Rain Effect
const canvas = document.getElementById('matrix-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    setInterval(drawMatrix, 30);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
} 