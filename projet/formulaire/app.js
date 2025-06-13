document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const statusElement = document.getElementById('status');

    try {
        const response = await fetch('https://outstanding-manifestation-production-9d52.up.railway.app/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, message })
        });

        const data = await response.json();
        statusElement.textContent = data.message;
        statusElement.style.color = response.ok ? 'green' : 'red';

    } catch (error) {
        statusElement.textContent = "Erreur de connexion au serveur";
        statusElement.style.color = 'red';
    }
});
