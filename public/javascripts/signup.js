const form = document.querySelector('form');
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.pass.error');
    const usernameError = document.querySelector('.username.error');
    const genderError = document.querySelector('.gender.error');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // get vlaues
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const gender = form.gender.value;
        emailError.textContent = '';
        passwordError.textContent = '';
        usernameError.textContent = '';
        genderError.textContent = '';
        try {
            const res = await fetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password,gender }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (data.errors) {
                usernameError.textContent = data.errors.username
                emailError.textContent = data.errors.email
                passwordError.textContent = data.errors.password
                genderError.textContent = data.errors.gender
            }
            if (data.success) {
                location.assign('/')
            }
        } catch (err) {
            alert(err.message)

        }
    });
