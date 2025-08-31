// Example teams JSON
const teams = [
  { name: "Vanguard FC", PTS: 43 },
  { name: "Pro Challengers", PTS: 40 },
  { name: "COOKINHOS BRIGADE", PTS: 36 },
  { name: "Olympus FC", PTS: 33 },
  { name: "BaharSeLona", PTS: 30 },
  { name: "Hyper Crafters CF", PTS: 26 },
  { name: "TriForce FC", PTS: 15 },
  { name: "DesTroyer", PTS: 12 },
  { name: "Supa Strikers", PTS: 6 },
  { name: "Chuha Gang", PTS: 6 },
  { name: "T*m Haters", PTS: 5 },
];

// Function to build league table
function buildTable() {
  const tbody = document.querySelector("#pointsTable tbody");
  tbody.innerHTML = "";

  // Sort by PTS (highest first)
  teams.sort((a, b) => b.PTS - a.PTS);

  teams.forEach((team, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.PTS}</td>
    `;
    tbody.appendChild(row);
  });
}

// Build table when page loads
document.addEventListener("DOMContentLoaded", buildTable);
