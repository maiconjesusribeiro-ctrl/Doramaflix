async function carregarDoramas() {
  const container = document.getElementById("dorama-container");
  const resposta = await fetch("doramas.json");
  const doramas = await resposta.json();

  doramas.forEach(dorama => {
    const card = document.createElement("div");
    card.className = "dorama-card";
    card.innerHTML = `
      <img src="${dorama.capa}" alt="${dorama.titulo}" />
      <h3>${dorama.titulo}</h3>
      <a href="${dorama.link}" target="_blank" class="assistir">▶ Assistir</a>
    `;
    container.appendChild(card);
  });
}

carregarDoramas();
