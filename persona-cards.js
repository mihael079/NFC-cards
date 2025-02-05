document.addEventListener("DOMContentLoaded", () => {
    const personaContainer = document.getElementById("personaContainer");

    if (!personaContainer) {
        console.error("Error: Persona container not found!");
        return;
    }

    // Dummy user data with updated usernames
    const users = [
        { name: "MIHF", tagline: "The Innovator 🔥", quote: "Dream big. Start small. Act now." },
        { name: "DAV79", tagline: "Code Warrior 💻", quote: "In the world of code, persistence wins." },
        { name: "SAHN", tagline: "The Strategist 🎯", quote: "Plans are nothing; planning is everything." },
        { name: "WYBIE", tagline: "Explorer of Worlds 🌎", quote: "Adventure is out there—go find it!" },
        { name: "LIN91", tagline: "The Creative Mind 🎨", quote: "Creativity is intelligence having fun." }
    ];

    function generatePersonaCard(user) {
        const card = document.createElement("div");
        card.classList.add("persona-card");

        card.innerHTML = `
            <h2>${user.name}</h2>
            <p class="tagline">${user.tagline}</p>
            <blockquote>${user.quote}</blockquote>
        `;

        return card;
    }

    // Render cards
    users.forEach(user => {
        const card = generatePersonaCard(user);
        personaContainer.appendChild(card);
    });
});
