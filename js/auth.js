
window.addEventListener('load', function () {
    const registerName = document.getElementById('registerName');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const userRole = document.getElementById('userRole');
    const form = document.getElementById('registerForm');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passError = document.getElementById('passError');
    const confirmError = document.getElementById('confirmError');
    const roleError = document.getElementById('roleError');

    const isValidName = (n) => /^[A-Za-z]{4,6}$/.test(n);
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const isValidPassword = (p) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(p);

    registerName.addEventListener('input', validateName);
    registerEmail.addEventListener('input', validateEmail);
    registerPassword.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);
    userRole.addEventListener('change', validateRole);

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const isFormValid = validateName() && 
                          validateEmail() && 
                          validatePassword() && 
                          validateConfirmPassword() && 
                          validateRole();

        if (isFormValid) {

            const emailExists = await checkEmailExists(registerEmail.value.trim());
            if (emailExists) {
                emailError.textContent = 'the email is already exists';
                emailError.style.display = 'block';
                registerEmail.style.border = '2px solid red';
                return;
            }
            
            await registerUser();
        }
    });

    async function checkEmailExists(email) {
        try {
            const response = await fetch('http://localhost:3000/users'); 
            const data = await response.json();
            return data.some(user => user.email.toLowerCase() === email.toLowerCase());
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    }
    

    function validateName() {
        const valid = isValidName(registerName.value.trim());
        nameError.style.display = valid ? 'none' : 'block';
        registerName.style.border = valid ? '2px solid green' : '2px solid red';
        return valid;
    }

    function validateEmail() {
        const valid = isValidEmail(registerEmail.value.trim());
        emailError.style.display = valid ? 'none' : 'block';
        registerEmail.style.border = valid ? '2px solid green' : '2px solid red';
        return valid;
    }

    function validatePassword() {
        const valid = isValidPassword(registerPassword.value.trim());
        passError.style.display = valid ? 'none' : 'block';
        registerPassword.style.border = valid ? '2px solid green' : '2px solid red';
        return valid;
    }

    function validateConfirmPassword() {
        const valid = confirmPassword.value.trim() === registerPassword.value.trim();
        confirmError.style.display = valid ? 'none' : 'block';
        confirmPassword.style.border = valid ? '2px solid green' : '2px solid red';
        return valid;
    }

    function validateRole() {
        const valid = userRole.value !== '';
        roleError.style.display = valid ? 'none' : 'block';
        userRole.style.border = valid ? '2px solid green' : '2px solid red';
        return valid;
    }

    async function registerUser() {
        try {
            const userData = {
                name: registerName.value.trim(),
                email: registerEmail.value.trim(),
                password: registerPassword.value.trim(), 
                role: userRole.value,
                id: Date.now().toString()
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));

            if (userData.role === 'customer') {
                window.location.href = 'index.html';
            } else if (userData.role === 'seller') {
                window.location.href = 'seller.html';
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error , try again');
        }
    }
});
