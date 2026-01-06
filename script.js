console.log("Script chargé !");



const video = document.getElementById("maillotVideo");
const slider = document.getElementById("maillotSlider");

// empêcher toute lecture automatique
video.pause();
video.currentTime = 0;

// attendre que la durée soit connue
video.addEventListener("loadedmetadata", () => {
  slider.min = 0;
  slider.max = video.duration;
  slider.step = 0.01;
});

// contrôler la vidéo UNIQUEMENT avec la barre
slider.addEventListener("input", () => {
    video.pause();
  video.currentTime = slider.value;
});

const buttons = document.querySelectorAll('.gallery-filter button');
const photos = document.querySelectorAll('.photo-card');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        photos.forEach(photo => {
            if (category === 'all' || photo.getAttribute('data-category') === category) {
                photo.style.display = 'block';
            } else {
                photo.style.display = 'none';
            }
        });
    });
});

const items = document.querySelectorAll(".carousel-item");
let current = 0;

function updateCarousel() {
    items.forEach(item => {
        item.classList.remove("active", "prev", "next");
    });

    items[current].classList.add("active");

    const prev = (current - 1 + items.length) % items.length;
    const next = (current + 1) % items.length;

    items[prev].classList.add("prev");
    items[next].classList.add("next");
}

// défilement automatique
setInterval(() => {
    current = (current + 1) % items.length;
    updateCarousel();
}, 4000);

updateCarousel();
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".photo-card img").forEach(img => {
    img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.style.display = "flex";
    });
});

// fermer au clic
lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
});
function downloadDocument(fileName) {
    // chemin du fichier (ajuste selon ton dossier)
    const filePath = `documents/${fileName}.pdf`; // ou .docx, .png selon le fichier

    // crée un lien temporaire
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName; // nom du fichier lors du téléchargement
    document.body.appendChild(link);
    link.click(); // clique automatique pour télécharger
    document.body.removeChild(link);
}
const matchCards = document.querySelectorAll('.competition-card');
const eventCards = document.querySelectorAll('.evenement-card');

function getNextItem(cards) {
    const now = new Date();
    let closest = null;
    let minDiff = Infinity;

    cards.forEach(card => {
        const dateText = card.querySelector('.date-compet, .date-event')?.textContent;
        if (!dateText) return;

        const parts = dateText.match(/\d{2}\/\d{2}\/\d{4}/);
        if (!parts) return;

        const [day, month, year] = parts[0].split('/').map(Number);
        const date = new Date(year, month - 1, day);

        const diff = date - now;
        if (diff >= 0 && diff < minDiff) {
            minDiff = diff;
            closest = card;
        }
    });

    return closest;
}

document.addEventListener("DOMContentLoaded", () => {

    // --- PROCHAIN MATCH ---
    const matchCards = Array.from(document.querySelectorAll('.match-card'));
    const now = new Date();

    let nextMatch = null;

    matchCards.forEach(card => {
        const dateText = card.querySelector('.match-date').textContent.trim();
        const dateParts = dateText.split("/"); // format DD/MM/YYYY
        const matchDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        if(matchDate >= now) {
            if(!nextMatch || matchDate < nextMatch.dateObj) {
                nextMatch = {
                    dateObj: matchDate,
                    dateText: dateText,
                    teams: card.querySelectorAll('.team-name'),
                    logos: card.querySelectorAll('.logo-team'),
                    location: card.querySelector('.match-location').textContent,
                    type: card.querySelector('.match-type').textContent
                };
            }
        }
    });

    if(nextMatch) {
        const matchWidget = document.querySelector('.header-widget-match');
        matchWidget.querySelector('.match-date').textContent = nextMatch.dateText;
        matchWidget.querySelector('.team-home .team-name').textContent = nextMatch.teams[0].textContent.trim();
        matchWidget.querySelector('.team-home .logo-team').src = nextMatch.logos[0].src;
        matchWidget.querySelector('.team-away .team-name').textContent = nextMatch.teams[1].textContent.trim();
        matchWidget.querySelector('.team-away .logo-team').src = nextMatch.logos[1].src;
        matchWidget.querySelector('.match-location').textContent = nextMatch.location;
        matchWidget.querySelector('.match-type').textContent = nextMatch.type;
    }

    // --- PROCHAIN ÉVÉNEMENT ---
    const eventCards = Array.from(document.querySelectorAll('.evenement-card'));
    let nextEvent = null;

    eventCards.forEach(card => {
        const dateEl = card.querySelector('.event-date');
        let dateText = dateEl.textContent.replace(/🗓️\s*/, '').trim();
        let eventDate;
        if(dateText.toLowerCase() === "à venir") {
            eventDate = new Date(9999, 0, 1); // événement indéfini -> très loin
        } else {
            const dateParts = dateText.split("/"); // format DD/MM/YYYY
            eventDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        }

        if(!nextEvent || eventDate < nextEvent.dateObj) {
            nextEvent = {
                dateObj: eventDate,
                title: card.querySelector('.event-title').textContent,
                location: card.querySelector('.event-info') ? card.querySelector('.event-info').textContent : "",
                image: card.querySelector('.Presentation-img') ? card.querySelector('.Presentation-img').src : ""
            };
        }
    });

    if(nextEvent) {
        const eventWidget = document.querySelector('.header-widget-event');
        eventWidget.querySelector('.event-title').textContent = nextEvent.title;
        eventWidget.querySelector('.event-date').textContent = nextEvent.dateObj.getFullYear() === 9999 ? "À définir" : nextEvent.dateObj.toLocaleDateString("fr-FR");
        eventWidget.querySelector('.event-location').textContent = nextEvent.location;
        eventWidget.querySelector('.event-image').src = nextEvent.image;
    }

});

const burger = document.getElementById("burger");
const nav = document.querySelector(".nav-right");

burger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

  // Coordonnées de Meymac (Complexe sportif)
  const meymac = [45.53219, 2.14176];

  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView(meymac, 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.marker(meymac)
    .addTo(map)
    .bindPopup('<b>Volley Ball Meymac</b><br>Complexe sportif de Grandchamp')
    .openPopup();

function ouvrirItineraire(e) {
    // Si geo: n’est pas supporté (PC)
    if (!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        e.preventDefault();
        window.open(
            "https://www.openstreetmap.org/?mlat=45.5342&mlon=2.1498#map=18/45.5342/2.1498",
            "_blank"
        );
    }
}

