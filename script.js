const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const progressBar = document.getElementById('progressBar');
const strengthLabel = document.getElementById('strengthLabel');
const feedback = document.getElementById('feedback');

let showPassword = false;

passwordInput.addEventListener('input', evaluatePassword);
togglePassword.addEventListener('click', toggleVisibility);

function toggleVisibility() {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    togglePassword.textContent = showPassword ? '🙈' : '👁️';
}

function evaluatePassword() {
    const password = passwordInput.value;
    const analysis = analyzePassword(password);
    updateUI(analysis);
}

function analyzePassword(password) {
    const length = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [length, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    
    return {
        score,
        length,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        strength: getStrength(score)
    };
}

function getStrength(score) {
    switch(score) {
        case 0: return 'very-weak';
        case 1: return 'weak';
        case 2: case 3: return 'medium';
        case 4: return 'strong';
        case 5: return 'very-strong';
        default: return 'none';
    }
}

function updateUI(analysis) {
    const { score, length, hasUppercase, hasLowercase, hasNumber, hasSpecial, strength } = analysis;
    
    updateProgress(score);
    updateStrengthLabel(strength);
    updateRequirements(length, hasUppercase, hasLowercase, hasNumber, hasSpecial);
    updateFeedback(strength, score);
}

function updateProgress(score) {
    const percentage = (score / 5) * 100;
    progressBar.style.width = percentage + '%';
    progressBar.parentElement.parentElement.className = `strength-meter strength-${score}`;
}

function updateStrengthLabel(strength) {
    const labels = {
        'very-weak': 'Very Weak',
        'weak': 'Weak',
        'medium': 'Medium',
        'strong': 'Strong',
        'very-strong': 'Very Strong',
        'none': 'Enter a password'
    };
    strengthLabel.textContent = labels[strength] || 'Enter a password';
}

function updateRequirements(length, hasUppercase, hasLowercase, hasNumber, hasSpecial) {
    const icons = [
        document.getElementById('lengthIcon'),
        document.getElementById('uppercaseIcon'),
        document.getElementById('lowercaseIcon'),
        document.getElementById('numberIcon'),
        document.getElementById('specialIcon')
    ];
    
    const checks = [length, hasUppercase, hasLowercase, hasNumber, hasSpecial];
    
    icons.forEach((icon, index) => {
        if (checks[index]) {
            icon.textContent = '✓';
            icon.className = 'icon valid';
        } else {
            icon.textContent = '●';
            icon.className = 'icon invalid';
        }
    });
}

function updateFeedback(strength, score) {
    const messages = {
        'very-weak': 'Too short and simple. Add length, uppercase, numbers, and special characters.',
        'weak': 'Basic password. Add more character types for better security.',
        'medium': 'Moderate strength. Include all character types for maximum security.',
        'strong': 'Good password! Consider making it longer for extra security.',
        'very-strong': 'Excellent! This password is very secure.',
        'none': ''
    };
    
    feedback.textContent = messages[strength] || '';
    feedback.className = `feedback ${strength} ${strength ? 'show' : ''}`;
}
