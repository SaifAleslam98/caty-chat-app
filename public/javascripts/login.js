const form = document.querySelector('form');
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.pass.error');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // get vlaues
        const email = form.email.value;
        const password = form.password.value;
        emailError.textContent = '';
        passwordError.textContent = '';
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (data.errors) {
                emailError.textContent = data.errors.email
                passwordError.textContent = data.errors.password
            }
            if (data.user) {
                location.assign('/')
            }
        } catch (err) {
            console.log(err)

        }
    });