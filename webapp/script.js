fetch("doramas.json")
  .then(response => response.json())
  .then(doramas => {
    const container = document.getElementById("doramas-container");
    doramas.forEach(d => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${d.capa}" alt="${d.titulo}" />
        <h3>${d.titulo}</h3>
        <a href="${d.video}" target="_blank">Assistir</a>
      `;
      container.appendChild(card);
    });
  });

