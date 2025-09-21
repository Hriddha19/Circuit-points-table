// points.js
// Loads teams + manualLastUpdated from stats.json (so you can edit that file)
// Minimal changes from your original file — rest of logic unchanged.

let teams = [];
let manualLastUpdated = "";

// Internal flags to ensure single initialization
let __pointsDataLoaded = false;
let __pointsInitDone = false;

// Fetch teams + manualLastUpdated from stats.json
fetch("stats.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load stats.json");
    return response.json();
  })
  .then((data) => {
    teams = Array.isArray(data.teams) ? data.teams : [];
    manualLastUpdated = data.manualLastUpdated || manualLastUpdated;
    __pointsDataLoaded = true;
    
    // If DOM already loaded, try to initialize immediately
    if (document.readyState !== "loading") {
      runInit();
    }
  })
  .catch((err) => {
    console.error("Error loading stats.json:", err);
    // proceed with defaults (teams empty) if desired
    __pointsDataLoaded = true; // avoid indefinite waiting
  });

// Function to show loading spinner
function showLoading() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "block";
}

// Function to hide loading spinner
function hideLoading() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "none";
}

// Function to build league table with enhanced animations
function buildTable() {
  showLoading();
  
  const tbody = document.querySelector("#pointsTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  // Sort by PTS descending
  teams.sort((a, b) => b.PTS - a.PTS);
  
  // Add delay for realistic loading effect
  setTimeout(() => {
    teams.forEach((team, index) => {
      const row = document.createElement("tr");
      
      // Add position classes
      if (index < 10) {
        row.classList.add("top-team");
      } else {
        row.classList.add("bottom-team");
      }
      
      // Determine status
      const status = index < 10 ? "qualified" : "not-qualified";
      const statusText = index < 10 ? "Qualification Zone" : "Elimination Zone";
      
      // Create team cell with logo
      const teamCell = `
        <div class="team-cell">
          <img src="${team.logo}" alt="${team.name}" class="team-logo"
               onerror="this.src='https://via.placeholder.com/35x35/58a6ff/ffffff?text=${encodeURIComponent(
                 team.name.charAt(0)
               )}'">
          <span class="team-name">${team.name}</span>
        </div>
      `;
      
      row.innerHTML = `
        <td class="rank-cell">${index + 1}</td>
        <td>${teamCell}</td>
        <td class="points-cell">${team.PTS}</td>
        <td><span class="status-badge ${status}">${statusText}</span></td>
      `;
      
      // Add staggered animation delay
      row.style.animationDelay = `${index * 0.1}s`;
      
      tbody.appendChild(row);
    });
    
    // Hide loading spinner and show table
    hideLoading();
    const tableContainer = document.querySelector(".table-container");
    if (tableContainer) tableContainer.style.opacity = "1";
    const legend = document.querySelector(".legend");
    if (legend) legend.style.opacity = "1";
  }, 1000); // Simulated loading time
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  const text = themeToggle.querySelector("span");
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    if (icon) icon.className = "fas fa-sun";
    if (text) text.textContent = "Light Mode";
  }
  
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    
    if (body.classList.contains("light-theme")) {
      if (icon) icon.className = "fas fa-sun";
      if (text) text.textContent = "Light Mode";
      localStorage.setItem("theme", "light");
    } else {
      if (icon) icon.className = "fas fa-moon";
      if (text) text.textContent = "Dark Mode";
      localStorage.setItem("theme", "dark");
    }
    
    // Add click animation
    themeToggle.style.transform = "scale(0.95)";
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 150);
  });
}

// Function to manually set last updated time with animation
function setLastUpdated(timeString) {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <i class="fas fa-clock"></i>
      <span>Last updated on ${timeString}</span>
    </div>
  `;
}

// Add scroll animations
function initScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    observerOptions
  );
  
  // Observe table rows
  document.querySelectorAll("tbody tr").forEach((row) => {
    observer.observe(row);
  });
}

// Add hover sound effects (optional - commented out for simplicity)
function addHoverEffects() {
  document.querySelectorAll("tbody tr").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      // Optional: Add subtle sound effect or haptic feedback
      row.style.transform = "translateX(5px) scale(1.02)";
    });
    row.addEventListener("mouseleave", () => {
      row.style.transform = "translateX(0) scale(1)";
    });
  });
}

// Initialization helper that runs after both DOM and data are ready
function runInit() {
  if (__pointsInitDone) return;
  
  // If data isn't loaded yet, wait until it is
  if (!__pointsDataLoaded) {
    const waitInterval = setInterval(() => {
      if (__pointsDataLoaded) {
        clearInterval(waitInterval);
        runInit();
      }
    }, 50);
    return;
  }
  
  __pointsInitDone = true;
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Build table with animations
  buildTable();
  
  // Use manual timestamp (will not be overwritten)
  setLastUpdated(manualLastUpdated);
  
  // Initialize additional effects after table is built
  setTimeout(() => {
    initScrollAnimations();
    addHoverEffects();
    // Auto-refresh removed by request so timestamp stays manual
  }, 1500);
  
  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "t" || e.key === "T") {
      const btn = document.getElementById("themeToggle");
      if (btn) btn.click();
    }
  });
}

// Initialize when page loads (will call runInit which waits for data if needed)
document.addEventListener("DOMContentLoaded", () => {
  runInit();
});

// Add window resize handler for responsive animations
window.addEventListener("resize", () => {
  // Reinitialize animations on window resize
  setTimeout(() => {
    addHoverEffects();
  }, 300);
});
