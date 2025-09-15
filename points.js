// Example teams JSON
const teams = [
  { name: "Vanguard FC", PTS: 128 },
  { name: "Pro Challengers", PTS: 87 },
  { name: "COOKINHOS BRIGADE", PTS: 56 },
  { name: "Olympus FC", PTS: 133 },
  { name: "BaharSeLona", PTS: 63 },
  { name: "Hyper Crafters CF", PTS: 80 },
  { name: "TriForce FC", PTS: 141 },
  { name: "DesTroyer", PTS: 52 },
  { name: "Supa Strikers", PTS: 40 },
  { name: "Chuha Gang", PTS: 6 },
  { name: "T*m Haters", PTS: 70 },
  { name: "Haramball Stevie Slippers", PTS: 0 },
];

// Function to build league table
function buildTable() {
  const tbody = document.querySelector("#pointsTable tbody");
  tbody.innerHTML = "";
  
  // Sort by PTS descending
  teams.sort((a, b) => b.PTS - a.PTS);
  
  teams.forEach((team, index) => {
    const row = document.createElement("tr");
    
    // Add top-team class for first 10 teams, bottom-team for rest
    if (index < 10) {
      row.classList.add("top-team");
    } else {
      row.classList.add("bottom-team");
    }
    
    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.PTS}</td>
    `;
    tbody.appendChild(row);
  });
}

// Function to manually set last updated time
function setLastUpdated(timeString) {
  const footer = document.getElementById("footer");
  footer.textContent = `Last updated on ${timeString}`;
}

// Build table on page load
document.addEventListener("DOMContentLoaded", () => {
  buildTable();
  // Example: set manually — you can change this string anytime
  setLastUpdated("September 12, 2025 - 10:35 PM");
});
