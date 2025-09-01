// Global variables to store data
let brandingData = {};
let themeData = {};
let gamesData = {};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Kids Gaming Site loaded!");
  initializeApp();
});

// Main initialization function
async function initializeApp() {
  try {
    // Load all JSON data files
    await loadDataFiles();

    // Apply theme and branding
    applyTheme();
    applyBranding();

    // Populate content
    populateGames();
    setupCountdown();
    setupSearchListeners();

    console.log("App initialized successfully!");
  } catch (error) {
    console.error("Error initializing app:", error);
    // Fallback to default content if data loading fails
    setupFallbackContent();
  }
}

// Load all JSON data files
async function loadDataFiles() {
  try {
    // Load branding data
    const brandingResponse = await fetch("./data/branding.json");
    brandingData = await brandingResponse.json();

    // Load theme data
    const themeResponse = await fetch("./data/theme.json");
    themeData = await themeResponse.json();

    // Load games data
    const gamesResponse = await fetch("./data/games.json");
    gamesData = await gamesResponse.json();

    console.log("All data files loaded successfully");
  } catch (error) {
    console.error("Error loading data files:", error);
    throw error;
  }
}

// Apply theme colors and fonts
function applyTheme() {
  if (themeData.colors) {
    const root = document.documentElement;
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  if (themeData.font) {
    document.documentElement.style.setProperty("--font-family", themeData.font);
  }

  console.log("Theme applied");
}

// Apply branding elements
function applyBranding() {
  const brand = brandingData.brand || brandingData; // Handle both nested and flat structures

  // Set favicon
  if (brand.logo?.favicon) {
    const favicon = document.getElementById("favicon-link");
    if (favicon) {
      favicon.href = brand.logo.favicon;
    }
  }

  // Set logo
  if (brand.logo?.title) {
    const logo = document.getElementById("site-logo");
    if (logo) {
      logo.src = brand.logo.title;
      logo.alt = brand.organizationName || "Logo";
    }
  }

  // Set site title
  if (brand.organizationName) {
    const siteTitle = document.getElementById("site-title");
    if (siteTitle) {
      siteTitle.textContent = brand.organizationName;
    }
    document.title = `Kids Gaming Site - ${brand.organizationName}`;
  }

  // Set slogan
  if (brand.slogan) {
    const heroTagline = document.getElementById("hero-tagline");
    if (heroTagline && !gamesData.tagline) {
      heroTagline.textContent = brand.slogan;
    }
  }

  // Set contact information
  const contactEmail = document.getElementById("contact-email");
  const contactPhone = document.getElementById("contact-phone");

  if (contactEmail && (brand.email || brand.contact?.email)) {
    contactEmail.textContent = `Email: ${brand.email || brand.contact.email}`;
  }

  if (contactPhone && (brand.mobile || brand.contact?.mobile)) {
    contactPhone.textContent = `Phone: ${brand.mobile || brand.contact.mobile}`;
  }

  // Set social media links
  if (brand.socialMedia) {
    populateSocialLinks(brand.socialMedia);
  }

  // Apply brand colors to CSS variables
  if (brand.colors) {
    applyBrandColors(brand.colors);
  }

  console.log("Branding applied");
}

// Populate social media links
function populateSocialLinks(socialMedia) {
  const socialContainer = document.getElementById("social-links");
  if (!socialContainer || !socialMedia) return;

  const socialPlatforms = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    github: "GitHub",
    x: "X (Twitter)",
    youtube: "YouTube",
    blog: "Blog",
  };

  const socialLinksHTML = Object.entries(socialMedia)
    .filter(([platform, url]) => url && socialPlatforms[platform])
    .map(
      ([platform, url]) =>
        `<a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer" 
                aria-label="${socialPlatforms[platform]}">
                ${getSocialIcon(platform)}
            </a>`
    )
    .join("");

  socialContainer.innerHTML = `<h4>Follow Us</h4><div class="social-media">${socialLinksHTML}</div>`;
}

// Apply brand colors to CSS variables
function applyBrandColors(colors) {
  const root = document.documentElement;
  if (colors.primary) {
    root.style.setProperty("--primary", colors.primary);
  }
  if (colors.secondary) {
    root.style.setProperty("--accent", colors.secondary);
    root.style.setProperty("--text", colors.secondary);
  }
  console.log("Brand colors applied");
}

// Get social media icons (simple text for now)
function getSocialIcon(platform) {
  const icons = {
    linkedin: "LI",
    instagram: "IG",
    github: "GH",
    x: "X",
    youtube: "YT",
    blog: "B",
  };
  return icons[platform] || platform.charAt(0).toUpperCase();
}

// Populate games from JSON data
function populateGames() {
  const gamesGrid = document.getElementById("games-grid");
  if (!gamesGrid || !gamesData.games) return;

  // Set hero title from games data
  if (gamesData.title) {
    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) {
      heroTitle.textContent = gamesData.title;
    }
  }

  // Set hero tagline from games data
  if (gamesData.tagline) {
    const heroTagline = document.getElementById("hero-tagline");
    if (heroTagline) {
      heroTagline.textContent = gamesData.tagline;
    }
  }

  // Populate category filter
  populateCategoryFilter();

  // Create game cards
  renderGames(gamesData.games);

  console.log("Games populated");
}

// Render games to the grid
function renderGames(games) {
  const gamesGrid = document.getElementById("games-grid");
  if (!gamesGrid) return;

  const gameCards = games
    .map((game) => {
      const stars =
        "★".repeat(Math.floor(game.rating || 4)) +
        "☆".repeat(5 - Math.floor(game.rating || 4));
      const features = game.features
        ? game.features
            .slice(0, 3)
            .map((feature) => `<span class="game-feature">${feature}</span>`)
            .join("")
        : "";

      return `
            <div class="game-card" onclick="openGame('${game.url}')" 
                 role="button" tabindex="0" aria-label="Play ${game.name}"
                 data-category="${
                   game.category
                 }" data-name="${game.name.toLowerCase()}">
                <img src="${
                  game.thumb || "./assets/images/placeholder-game.png"
                }" 
                     alt="${game.name}" class="game-image" loading="lazy">
                <div class="game-content">
                    <h4 class="game-title">${game.name}</h4>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span class="game-difficulty">${game.difficulty}</span>
                        <div class="game-rating">
                            <span class="stars">${stars}</span>
                            <span>${game.rating || 4.0}</span>
                        </div>
                    </div>
                    <div class="game-features">
                        ${features}
                    </div>
                    <div class="game-info">
                        <small>Ages: ${game.ageGroup} | Time: ${
        game.playTime
      }</small>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  gamesGrid.innerHTML = gameCards;

  // Add keyboard navigation for game cards
  document.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Populate category filter dropdown
function populateCategoryFilter() {
  const filterSelect = document.getElementById("category-filter");
  if (!filterSelect || !gamesData.categories) return;

  const categories = gamesData.categories
    .map(
      (cat) => `<option value="${cat.name}">${cat.icon} ${cat.name}</option>`
    )
    .join("");

  filterSelect.innerHTML =
    '<option value="">All Categories</option>' + categories;
}

// Setup countdown timer
function setupCountdown() {
  if (!gamesData.countdownTarget) return;

  const targetDate = new Date(gamesData.countdownTarget).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("countdown-timer").innerHTML =
        "<p>Event has started!</p>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  console.log("Countdown timer setup");
}

// Open game in new tab
function openGame(url) {
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    alert("Game coming soon!");
  }
}

// Smooth scroll to games section
function scrollToGames() {
  const gamesSection = document.getElementById("games");
  if (gamesSection) {
    gamesSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Fallback content if data loading fails
function setupFallbackContent() {
  console.log("Setting up fallback content");

  // Fallback games data
  const fallbackGames = [
    {
      id: 1,
      name: "Memory Match",
      description: "Test your memory with this fun card matching game!",
      difficulty: "Easy",
      thumb: "./assets/images/memory-game.png",
      url: "#",
    },
    {
      id: 2,
      name: "Math Adventure",
      description: "Solve math puzzles and go on an exciting adventure!",
      difficulty: "Medium",
      thumb: "./assets/images/math-game.png",
      url: "#",
    },
  ];

  // Populate fallback games
  const gamesGrid = document.getElementById("games-grid");
  if (gamesGrid) {
    const gameCards = fallbackGames
      .map(
        (game) => `
            <div class="game-card" onclick="openGame('${game.url}')" 
                 role="button" tabindex="0" aria-label="Play ${game.name}">
                <img src="${game.thumb}" alt="${game.name}" class="game-image" loading="lazy">
                <div class="game-content">
                    <h4 class="game-title">${game.name}</h4>
                    <p class="game-description">${game.description}</p>
                    <span class="game-difficulty">${game.difficulty}</span>
                </div>
            </div>
        `
      )
      .join("");

    gamesGrid.innerHTML = gameCards;
  }

  // Setup fallback countdown (30 days from now)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  gamesData.countdownTarget = futureDate.toISOString();
  setupCountdown();
}

// TODO: student exercise - Add search functionality for games
function searchGames(query) {
  const searchInput = document.getElementById("game-search");
  const searchQuery = query || searchInput?.value?.toLowerCase() || "";

  if (!gamesData.games) return;

  const filteredGames = gamesData.games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery) ||
      game.description.toLowerCase().includes(searchQuery) ||
      game.category.toLowerCase().includes(searchQuery)
  );

  renderGames(filteredGames);

  // Update search results message
  const gamesSection = document.querySelector(".games-section");
  let resultMessage = gamesSection.querySelector(".search-results");

  if (!resultMessage) {
    resultMessage = document.createElement("p");
    resultMessage.className = "search-results";
    gamesSection.insertBefore(
      resultMessage,
      document.getElementById("games-grid")
    );
  }

  if (searchQuery) {
    resultMessage.textContent = `Found ${filteredGames.length} games matching "${searchQuery}"`;
    resultMessage.style.display = "block";
  } else {
    resultMessage.style.display = "none";
  }
}

// TODO: student exercise - Add game categories filter
function filterGamesByCategory(category) {
  if (!gamesData.games) return;

  const filteredGames = category
    ? gamesData.games.filter((game) => game.category === category)
    : gamesData.games;

  renderGames(filteredGames);

  // Clear search when filtering by category
  const searchInput = document.getElementById("game-search");
  if (searchInput) {
    searchInput.value = "";
  }

  // Update filter results message
  const gamesSection = document.querySelector(".games-section");
  let resultMessage = gamesSection.querySelector(".search-results");

  if (!resultMessage) {
    resultMessage = document.createElement("p");
    resultMessage.className = "search-results";
    gamesSection.insertBefore(
      resultMessage,
      document.getElementById("games-grid")
    );
  }

  if (category) {
    resultMessage.textContent = `Showing ${filteredGames.length} games in ${category} category`;
    resultMessage.style.display = "block";
  } else {
    resultMessage.style.display = "none";
  }
}

// TODO: student exercise - Add dark mode toggle
function toggleDarkMode() {
  // Students can implement dark/light mode toggle here
  console.log("Dark mode toggle to be implemented by students");
}

// Utility function for debugging
function debugInfo() {
  console.log("Branding Data:", brandingData);
  console.log("Theme Data:", themeData);
  console.log("Games Data:", gamesData);
}

// Setup search event listeners
function setupSearchListeners() {
  const searchInput = document.getElementById("game-search");
  if (searchInput) {
    // Search on input change with debounce
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchGames(this.value);
      }, 300);
    });

    // Search on Enter key
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchGames(this.value);
      }
    });
  }

  console.log("Search listeners setup");
}
