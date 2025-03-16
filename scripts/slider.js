document.addEventListener('DOMContentLoaded', function() {
    const threeImagesContainer = document.querySelector('.three-images');
    const images = threeImagesContainer.querySelectorAll('img');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const swipeIndicator = document.createElement('div');
    let currentIndex = 0;
    let startX = 0;
    let endX = 0;

    // Create swipe indicator
    swipeIndicator.classList.add('swipe-indicator');
    swipeIndicator.innerHTML = '→ Swipe';
    threeImagesContainer.appendChild(swipeIndicator);

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
        threeImagesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        threeImagesContainer.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        threeImagesContainer.addEventListener('touchend', () => {
            if (startX > endX + 50) {
                currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            } else if (startX < endX - 50) {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            }
            updateSlide();
            swipeIndicator.style.display = 'none'; // Hide swipe indicator after first swipe
            prevButton.style.display = 'none'; // Hide prev button after first swipe
            nextButton.style.display = 'none'; // Hide next button after first swipe
        });

        updateSlide();
    }

    function disableSlider() {
        prevButton.remove();
        nextButton.remove();
        swipeIndicator.remove();
        threeImagesContainer.removeEventListener('touchstart', () => {});
        threeImagesContainer.removeEventListener('touchmove', () => {});
        threeImagesContainer.removeEventListener('touchend', () => {});
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
