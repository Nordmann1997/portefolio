document.addEventListener("keydown", (event) => {
    let letter = document.createElement("div");
    letter.textContent = event.key;
    letter.style.position = "fixed";
    letter.style.left = `${Math.random() * window.innerWidth}px`;
    letter.style.top = `-50px`;
    letter.style.fontSize = "40px";
    letter.style.color = "black";  // Change color to black
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
    // Opprett "Let It Fall!"-knapp
    const fallButton = document.createElement("button");
    fallButton.textContent = "Clean up";
    fallButton.style.position = "fixed";
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

    // Når knappen trykkes, starter effekten
    fallButton.addEventListener("click", () => {
        document.querySelectorAll("h1, h2, p, span, li").forEach((el) => {
            // Change the existing text to white
            el.style.color = "white";
            el.style.listStyleType = "none"; // Remove bullet point from li elements

            // Create a new identical element
            let newEl = el.cloneNode(true);
            newEl.style.position = "absolute";
            newEl.style.top = `${el.getBoundingClientRect().top}px`;
            newEl.style.left = `${el.getBoundingClientRect().left}px`;
            newEl.style.width = `${el.offsetWidth}px`;
            newEl.style.height = `${el.offsetHeight}px`;
            newEl.style.color = "black"; // Set the color of the new element to black
            newEl.style.fontSize = window.getComputedStyle(el).fontSize; // Match font size
            newEl.style.fontWeight = window.getComputedStyle(el).fontWeight; // Match font weight
            newEl.style.fontFamily = window.getComputedStyle(el).fontFamily; // Match font family
            newEl.style.listStyleType = "none"; // Remove bullet point from new li elements
            document.body.appendChild(newEl);

            let velocityY = 0;
            let gravity = 0.1;
            function fall() {
                velocityY += gravity;
                let currentY = parseFloat(newEl.style.top || 0);
                let newY = currentY + velocityY;

                if (newY > window.innerHeight) {
                    newEl.remove(); // Remove the element when it reaches the bottom
                    return; // Stopper når teksten er ute av skjermen
                }
                newEl.style.top = `${newY}px`;
                requestAnimationFrame(fall);
            }
            fall();
        });
    });
});