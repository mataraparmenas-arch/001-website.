// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    
    if (document.body.getAttribute('data-theme') === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Particles.js Background
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00f3ff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00f3ff",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    }
});

// Voice Command System
const voiceIndicator = document.getElementById('voiceIndicator');
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        voiceIndicator.classList.add('listening');
        voiceIndicator.innerHTML = '<i class="fas fa-circle"></i>';
    };
    
    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
    };
    
    recognition.onend = function() {
        voiceIndicator.classList.remove('listening');
        voiceIndicator.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    voiceIndicator.addEventListener('click', () => {
        if (voiceIndicator.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    voiceIndicator.style.display = 'none';
}

function handleVoiceCommand(command) {
    // Simple voice command handling
    if (command.includes('home') || command.includes('go to home')) {
        window.location.href = '#home';
    } else if (command.includes('about') || command.includes('go to about')) {
        window.location.href = '#about';
    } else if (command.includes('projects') || command.includes('go to projects')) {
        window.location.href = '#projects';
    } else if (command.includes('contact') || command.includes('go to contact')) {
        window.location.href = '#contact';
    } else if (command.includes('blog') || command.includes('go to blog')) {
        window.location.href = '#blog';
    } else if (command.includes('light mode') || command.includes('light theme')) {
        document.body.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else if (command.includes('dark mode') || command.includes('dark theme')) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Typing Effect
const typingText = document.querySelector('.typing-text');
const texts = [
    "Crafting privacy-preserving systems for the future.",
    "Building with zero-knowledge proofs.",
    "Creating secure, scalable infrastructure."
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(type, isDeleting ? 50 : 100);
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(type, 1000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will be reaching out shortly.');
    this.reset();
});

// Fetch Resume from CMS
async function fetchResume() {
    try {
        const response = await fetch('/content/resume/latest.md');
        const text = await response.text();
        
        // Parse the YAML front matter
        const resumeData = parseFrontMatter(text);
        return resumeData;
    } catch (error) {
        console.log('Using default resume data');
        return {
            resume_file: "/images/uploads/resume.pdf",
            version: "1.0"
        };
    }
}

// Simple front matter parser
function parseFrontMatter(text) {
    const lines = text.split('\n');
    const data = {};
    
    let inFrontMatter = false;
    lines.forEach(line => {
        if (line.trim() === '---') {
            inFrontMatter = !inFrontMatter;
            return;
        }
        if (inFrontMatter) {
            const match = line.match(/(\w+):\s*(.*)/);
            if (match) {
                data[match[1]] = match[2].trim();
            }
        }
    });
    
    return data;
}

// Update Resume Button
async function updateResumeButton() {
    const resumeData = await fetchResume();
    const resumeButton = document.querySelector('.resume-download-btn');
    
    if (resumeButton && resumeData.resume_file) {
        resumeButton.href = resumeData.resume_file;
        resumeButton.download = `Matara_Parmenas_Resume_v${resumeData.version}.pdf`;
        
        // Add version info tooltip
        resumeButton.title = `Last updated: ${resumeData.last_updated || 'Recently'}`;
    }
}
// Initialize CMS Content
async function initializeCMSContent() {
    await displayProjects();
    await displaySkills();
    await updateResumeButton(); // Add this line
}