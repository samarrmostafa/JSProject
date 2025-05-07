

// window.addEventListener('load', function () {
//     const registerName = document.getElementById('registerName');
//     const registerEmail = document.getElementById('registerEmail');
//     const registerPassword = document.getElementById('registerPassword');
//     const confirmPassword = document.getElementById('confirmPassword');
//     const userRole = document.getElementById('userRole');
//     const form = document.getElementById('registerForm');

//     const nameError = document.getElementById('nameError');
//     const emailError = document.getElementById('emailError');
//     const passError = document.getElementById('passError');
//     const confirmError = document.getElementById('confirmError');
//     const roleError = document.getElementById('roleError');

//     const isValidName = (n) => /^[A-Za-z]{4,6}$/.test(n);
//     const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
//     const isValidPassword = (p) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(p);

//     registerName.addEventListener('input', validateName);
//     registerEmail.addEventListener('input', validateEmail);
//     registerPassword.addEventListener('input', validatePassword);
//     confirmPassword.addEventListener('input', validateConfirmPassword);
//     userRole.addEventListener('change', validateRole);

//     document.querySelectorAll('.toggle-password').forEach(button => {
//         button.addEventListener('click', function() {
//             const input = this.parentElement.querySelector('input');
//             input.type = input.type === 'password' ? 'text' : 'password';
//             this.querySelector('i').classList.toggle('fa-eye-slash');
//         });
//     });

//     form.addEventListener('submit', async function(e) {
//         e.preventDefault();

//         const isFormValid = validateName() && 
//                           validateEmail() && 
//                           validatePassword() && 
//                           validateConfirmPassword() && 
//                           validateRole();

//         if (isFormValid) {
//             await registerUser();
//         }
//     });

//     function validateName() {
//         const valid = isValidName(registerName.value.trim());
//         nameError.style.display = valid ? 'none' : 'block';
//         registerName.style.border = valid ? '2px solid green' : '2px solid red';
//         return valid;
//     }

//     function validateEmail() {
//         const valid = isValidEmail(registerEmail.value.trim());
//         emailError.style.display = valid ? 'none' : 'block';
//         registerEmail.style.border = valid ? '2px solid green' : '2px solid red';
//         return valid;
//     }

//     function validatePassword() {
//         const valid = isValidPassword(registerPassword.value.trim());
//         passError.style.display = valid ? 'none' : 'block';
//         registerPassword.style.border = valid ? '2px solid green' : '2px solid red';
//         return valid;
//     }

//     function validateConfirmPassword() {
//         const valid = confirmPassword.value.trim() === registerPassword.value.trim();
//         confirmError.style.display = valid ? 'none' : 'block';
//         confirmPassword.style.border = valid ? '2px solid green' : '2px solid red';
//         return valid;
//     }

//     function validateRole() {
//         const valid = userRole.value !== '';
//         roleError.style.display = valid ? 'none' : 'block';
//         userRole.style.border = valid ? '2px solid green' : '2px solid red';
//         return valid;
//     }

//     async function registerUser() {
//         try {
//             const userData = {
//                 name: registerName.value.trim(),
//                 email: registerEmail.value.trim(),
//                 password: registerPassword.value.trim(), 
//                 role: userRole.value,
//                 id: Date.now().toString()
//             };

//             // تخزين بيانات المستخدم في localStorage
//             localStorage.setItem('currentUser', JSON.stringify(userData));

//             // توجيه المستخدم بناءً على الـ role
//             if (userData.role === 'customer') {
//                 window.location.href = 'index.html';
//             } else if (userData.role === 'seller') {
//                 window.location.href = 'seller.html';
//             }

//         } catch (error) {
//             console.error('Error:', error);
//             alert('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى');
//         }
//     }
// });

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

    // ... (جميع دوال التحقق مثل validateName و validateEmail تبقى كما هي)

    async function registerUser() {
        try {
            const userData = {
                name: registerName.value.trim(),
                email: registerEmail.value.trim(),
                password: registerPassword.value.trim(),
                role: userRole.value,
                id: Date.now().toString()
            };

            // التحقق من تكرار الإيميل في localStorage
            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            const emailExists = existingUsers.some(user => user.email === userData.email);

            if (emailExists) {
                alert('هذا الإيميل مسجل بالفعل!');
                registerEmail.style.border = '2px solid red';
                emailError.textContent = 'الإيميل موجود مسبقاً';
                emailError.style.display = 'block';
                return;
            }

            // حفظ المستخدم الجديد في localStorage
            existingUsers.push(userData);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // التوجيه بناءً على الدور
            window.location.href = userData.role === 'customer' ? 'index.html' : 'seller.html';

        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ أثناء التسجيل. الرجاء المحاولة لاحقًا.');
        }
    }

    // ... (بقية الأكواد مثل event listeners)
});