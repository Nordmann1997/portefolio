document.addEventListener("DOMContentLoaded", () => {
    const colorThief = new ColorThief();
    const images = document.querySelectorAll(".image-grid img"); // Kun bilder i .image-grid
    const backgroundLayer = document.querySelector(".background-layer");
    let hasUpdated = false; // Flagg for å spore om bakgrunnen er oppdatert

    function updateBackground() {
        const colors = [];
        
        // Hent farger kun fra bildene i .image-grid
        images.forEach((img) => {
            if (img.complete) {
                const color = colorThief.getColor(img);
                colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`); // 30% opacity
            } else {
                img.addEventListener("load", () => {
                    const color = colorThief.getColor(img);
                    colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.)`); // 30% opacity
                    applyGradient(colors);
                });
            }
        });

        // Bruk gradienten bare hvis vi har farger fra bildene
        if (colors.length > 0) {
            applyGradient(colors);
        }
    }

    function applyGradient(colors) {
        // Gradient basert kun på fargene fra .image-grid
        const gradient = `linear-gradient(100deg, ${colors.join(", ")})`;
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