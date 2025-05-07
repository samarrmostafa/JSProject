function toggleMenu() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('active');
  }



// script.js
const squareData = [
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500",
  "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500",
  "https://images.unsplash.com/photo-1618921438889-d4bab3daa021?w=500",
  "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500",
  "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500",
  "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500",
  "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=500"
];

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  const shuffled = [...array];

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex]
    ];
  }

  return shuffled;
};

const grid = document.getElementById("shuffleGrid");

function renderSquares() {
  const shuffled = shuffle(squareData);
  grid.innerHTML = ""; // Clear existing squares

  shuffled.forEach((src) => {
    const div = document.createElement("div");
    div.style.backgroundImage = `url(${src})`;
    div.classList.add("visible");  // تظهر الصورة داخل المربع
    grid.appendChild(div);
  });
}

// Start the shuffle and display process
renderSquares();
setInterval(renderSquares, 3000);  // إعادة توليد المربعات كل 3 ثواني


// script.js
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slider = document.querySelector('.slider');

const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

// Function to go to the next slide
function nextSlide() {
currentIndex = (currentIndex + 1) % totalSlides;
updateSliderPosition();
}

// Function to go to the previous slide
function prevSlide() {
currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
updateSliderPosition();
}

// Update the slider position based on currentIndex
function updateSliderPosition() {
slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Event listeners for the buttons
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);
