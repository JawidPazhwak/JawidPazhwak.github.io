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
    loadProjects();
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