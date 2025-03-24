document.addEventListener("DOMContentLoaded", () => {
    const colorThief = new ColorThief();
    const images = document.querySelectorAll(".image-grid img");
    const backgroundLayer = document.querySelector(".background-layer");
    let hasUpdated = false; // Flagg for å spore om bakgrunnen er oppdatert

    function updateBackground() {
        const colors = [];
        
        images.forEach((img) => {
            if (img.complete) {
                const color = colorThief.getColor(img);
                colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`);
            } else {
                img.addEventListener("load", () => {
                    const color = colorThief.getColor(img);
                    colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`);
                    applyGradient(colors);
                });
            }
        });

        if (colors.length > 0) {
            applyGradient(colors);
        }
    }

    function applyGradient(colors) {
        const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;
        backgroundLayer.style.background = gradient;
    }

    // Initial oppdatering når siden lastes
    updateBackground();

    // Oppdater kun én gang når image-grid blir synlig
    window.addEventListener("scroll", () => {
        if (!hasUpdated) { // Kjør kun hvis det ikke allerede er oppdatert
            const gridPosition = document.querySelector(".image-grid").getBoundingClientRect();
            if (gridPosition.top < window.innerHeight && gridPosition.bottom > 0) {
                updateBackground();
                hasUpdated = true; // Sett flagget til true etter oppdatering
            }
        }
    });

    const menuButton = document.getElementById("menuButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
        menuButton.classList.toggle("active");
    });
});