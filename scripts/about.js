document.addEventListener("keydown", (event) => {
    let letter = document.createElement("div");
    letter.textContent = event.key;
    letter.style.position = "fixed";
    letter.style.left = `${Math.random() * window.innerWidth}px`;
    letter.style.top = `-50px`;
    letter.style.fontSize = "40px";
    letter.style.color = "black";
    letter.style.opacity = "1";
    letter.style.transition = "transform 3s ease-in, opacity 3s ease-in";
    document.body.appendChild(letter);

    setTimeout(() => {
        letter.style.transform = `translateY(100vh) rotate(${Math.random() * 360}deg)`;
    }, 10);

    setTimeout(() => {
        letter.remove();
    }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
    // Create "Clean up" button
    const fallButton = document.createElement("button");
    fallButton.textContent = "Clean up";
    fallButton.style.position = "absolute";
    fallButton.style.top = "30px";
    fallButton.style.right = "30px";
    fallButton.style.padding = "10px 20px";
    fallButton.style.background = "#000000";
    fallButton.style.color = "white";
    fallButton.style.border = "none";
    fallButton.style.borderRadius = "5px";
    fallButton.style.cursor = "pointer";
    fallButton.style.zIndex = "1000";
    document.body.appendChild(fallButton);

    // When button is clicked, start the falling effect
    fallButton.addEventListener("click", () => {
        const elementsToFall = document.querySelectorAll("main, footer, .about-image img");
        const fallDuration = 3000; // Matches the 3s transition duration

        elementsToFall.forEach((el) => {
            // Clone the element
            let newEl = el.cloneNode(true);
            const rect = el.getBoundingClientRect();

            // Ensure the cloned element matches the original exactly
            newEl.style.position = "absolute";
            newEl.style.top = `${rect.top + window.scrollY}px`; // Account for scroll position
            newEl.style.left = `${rect.left + window.scrollX}px`;
            newEl.style.width = `${rect.width}px`; // Use rect.width to capture rendered width
            newEl.style.height = `${rect.height}px`;
            newEl.style.margin = "0"; // Remove any margins that might affect positioning
            newEl.style.padding = "0"; // Remove padding
            newEl.style.boxSizing = "border-box";

            // If the element is an image, ensure it maintains its aspect ratio and styling
            if (el.tagName === "IMG") {
                newEl.style.objectFit = window.getComputedStyle(el).objectFit; // Copy object-fit
                newEl.style.borderRadius = window.getComputedStyle(el).borderRadius; // Copy border-radius
                newEl.style.boxSizing = window.getComputedStyle(el).boxSizing; // Copy box-sizing
            }

            newEl.style.transition = "transform 3s ease-in";
            newEl.style.transform = "translateY(0)"; // Initial position
            document.body.appendChild(newEl);

            // Start the falling animation
            setTimeout(() => {
                newEl.style.transform = `translateY(100vh)`;
            }, 10);

            // Remove the cloned element after animation
            setTimeout(() => {
                newEl.remove();
            }, fallDuration);

            // Hide the original element
            el.style.visibility = "hidden";
        });

        // Create and display typewriter text after elements have fallen
        const typewriterText = document.createElement("div");
        typewriterText.style.position = "fixed";
        typewriterText.style.top = "50%";
        typewriterText.style.left = "50%";
        typewriterText.style.transform = "translate(-50%, -50%)";
        typewriterText.style.fontSize = "5rem";
        typewriterText.style.color = "black";
        typewriterText.style.fontFamily = "Poppins, sans-serif";
        typewriterText.style.zIndex = "1000";
        document.body.appendChild(typewriterText);

        // Delay the typewriter effect until elements have fallen out of view
        setTimeout(() => {
            let text = "Clean";
            let index = 0;

            function typeWriter() {
                if (index < text.length) {
                    typewriterText.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 250);
                }
            }

            typeWriter();
        }, fallDuration); // Wait for the falling animation to complete (3 seconds)
    });
});
