// Add event listener for each image with the class "toggleClip"
const images = document.querySelectorAll('.toggleClip');
const exploreButtons = document.querySelectorAll('#exploreButton');

images.forEach(image => {
    image.addEventListener('click', () => {
        const oval = image.closest('.oval');
        const exploreButton = oval.nextElementSibling.nextElementSibling;
        
        if (oval.classList.contains('toggled')) {
            // If the clicked image is already expanded, collapse it
            oval.classList.remove('toggled');
            exploreButton.classList.add('hidden');
        } else {
            // Collapse any previously expanded image
            images.forEach(img => {
                const otherOval = img.closest('.oval');
                const otherExploreButton = otherOval.nextElementSibling.nextElementSibling;
                if (otherOval.classList.contains('toggled')) {
                    otherOval.classList.remove('toggled');
                    otherExploreButton.classList.add('hidden');
                }
            });

            // Expand the clicked image
            oval.classList.add('toggled');
            exploreButton.classList.remove('hidden');
        }
    });
});

// Remove this part as buttons now have direct links
// exploreButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         window.location.href = '../oval.html';
//     });
// });
