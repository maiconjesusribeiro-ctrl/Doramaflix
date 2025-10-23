const DORAMAS_JSON = "/doramas.json.json"; // JSON na mesma pasta do index.html
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const modal = document.getElementById("playerModal");
const modalClose = document.getElementById("modalClose");
const closeBtn = document.getElementById("closeBtn");
const meta = document.getElementById("meta");

let doramas = [];

// Carrega doramas do JSON
async function carregarDoramas() {
  try {
    const res = await fetch(DORAMAS_JSON);
    if (!res.ok) throw new Error("Erro ao carregar JSON");
    doramas = await res.json();
    renderGrid(doramas);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div style="padding:20px;color:#f88">Erro ao carregar doramas</div>`;
  }
}

// Renderiza os cards na tela
function renderGrid(list) {
  grid.innerHTML = "";
  list.forEach(d => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img loading="lazy" src="${d.capa}" alt="${d.titulo}" />
      <div class="info">
        <h3>${d.titulo}</h3>
        <div class="actions">
          <a class="btn" data-titulo="${d.titulo}">💳 Comprar</a>
        </div>
      </div>
    `;
    grid.appendChild(el);

    // Botão comprar
    el.querySelector(".btn").addEventListener("click", e => {
      openModal(e.currentTarget.getAttribute("data-titulo"));
    });
  });
}

// Modal de aviso de compra
function openModal(titulo) {
  meta.innerHTML = `Você selecionou <br><strong style="color:#ff0000">${titulo}</strong><br><br>O sistema de pagamento será configurado em breve.`;
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
}

// Eventos do modal
modalClose.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);

// Pesquisa ao digitar Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const q = searchInput.value.toLowerCase();
    const filtered = doramas.filter(d => d.titulo.toLowerCase().includes(q));
    renderGrid(filtered);
  }
});

// Inicializa
carregarDoramas();
