document.addEventListener('DOMContentLoaded', function() {
    const threeImagesContainer = document.querySelector('.three-images');
    const images = threeImagesContainer.querySelectorAll('img');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    let currentIndex = 0;

    // Create navigation buttons
    prevButton.classList.add('nav-button', 'prev');
    prevButton.innerHTML = '←';
    nextButton.classList.add('nav-button', 'next');
    nextButton.innerHTML = '→';
    threeImagesContainer.appendChild(prevButton);
    threeImagesContainer.appendChild(nextButton);

    function updateSlide() {
        images.forEach((img, index) => {
            img.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    }

    function enableSlider() {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            updateSlide();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            updateSlide();
        });

        updateSlide();
    }

    function disableSlider() {
        prevButton.remove();
        nextButton.remove();
        images.forEach((img) => {
            img.style.transform = 'translateX(0)';
        });
    }

    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            enableSlider();
        } else {
            disableSlider();
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
});
