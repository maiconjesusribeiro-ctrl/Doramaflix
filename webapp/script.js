const DORAMAS_JSON = "doramas.json";
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const modal = document.getElementById("playerModal");
const modalClose = document.getElementById("modalClose");
const closeBtn = document.getElementById("closeBtn");
const meta = document.getElementById("meta");
const btnRefresh = document.getElementById("btn-refresh");

let doramas = [];

async function carregarDoramas(){
  try{
    const res = await fetch(DORAMAS_JSON);
    const data = await res.json();
    doramas = data;
    renderGrid(doramas);
  }catch(err){
    grid.innerHTML = `<div style="padding:20px;color:#f88">Erro ao carregar doramas</div>`;
  }
}

function renderGrid(list){
  grid.innerHTML = "";
  list.forEach(d => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img loading="lazy" src="${escapeHtml(d.capa)}" alt="${escapeHtml(d.titulo)}" />
      <div class="info">
        <h3>${escapeHtml(d.titulo)}</h3>
        <p>${escapeHtml(d.ano ?? "")}</p>
        <div class="actions">
          <a class="btn" data-titulo="${escapeHtml(d.titulo)}">💳 Comprar</a>
        </div>
      </div>
    `;
    grid.appendChild(el);
    el.querySelector(".btn").addEventListener("click", (e)=>{
      const titulo = e.currentTarget.getAttribute("data-titulo");
      openModal(titulo);
    });
  });
}

function openModal(titulo){
  meta.innerHTML = `Você selecionou <br><strong style="color:#ff0000">${escapeHtml(titulo)}</strong><br><br>O sistema de pagamento será configurado em breve.`;
  modal.setAttribute("aria-hidden","false");
}

function closeModal(){
  modal.setAttribute("aria-hidden","true");
}

modalClose.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
btnRefresh.addEventListener("click", carregarDoramas);

searchInput.addEventListener("input", e=>{
  const q = e.target.value.toLowerCase();
  const filtered = doramas.filter(d => (d.titulo+d.descricao).toLowerCase().includes(q));
  renderGrid(filtered);
});

function escapeHtml(str){
  if(!str) return "";
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

carregarDoramas();
