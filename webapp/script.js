const DORAMAS_JSON = "doramas.json";
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const modal = document.getElementById("playerModal");
const player = document.getElementById("player");
const modalClose = document.getElementById("modalClose");
const closeBtn = document.getElementById("closeBtn");
const meta = document.getElementById("meta");
const btnRefresh = document.getElementById("btn-refresh");

let doramas = [];

async function carregarDoramas(){
  try{
    const res = await fetch(DORAMAS_JSON);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    doramas = data;
    renderGrid(doramas);
  }catch(err){
    console.error("Erro ao carregar doramas:", err);
    grid.innerHTML = `<div class="error" style="color:#f88;padding:20px">Erro ao carregar doramas: ${err.message}</div>`;
  }
}

function renderGrid(list){
  grid.innerHTML = "";
  if(!list.length){
    grid.innerHTML = `<div style="padding:40px;color:#ccc">Nenhum dorama encontrado.</div>`;
    return;
  }
  list.forEach(d => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      ${d.badge ? `<div class="badge">${escapeHtml(d.badge)}</div>` : ""}
      <img loading="lazy" src="${escapeHtml(d.capa)}" alt="${escapeHtml(d.titulo)}" />
      <div class="info">
        <h3>${escapeHtml(d.titulo)}</h3>
        <p>${escapeHtml(d.ano ?? "")}</p>
        <div class="actions">
          <a class="btn" data-video="${escapeHtml(d.video)}" data-titulo="${escapeHtml(d.titulo)}" data-desc="${escapeHtml(d.descricao ?? "")}">▶ Assistir</a>
          <a class="ghost" href="${escapeHtml(d.video)}" target="_blank" rel="noopener">Abrir em nova aba</a>
        </div>
      </div>
    `;
    grid.appendChild(el);

    // botão assistir (delegation)
    el.querySelector(".btn").addEventListener("click", (e) => {
      const url = e.currentTarget.getAttribute("data-video");
      const titulo = e.currentTarget.getAttribute("data-titulo");
      const desc = e.currentTarget.getAttribute("data-desc");
      openPlayer(url, titulo, desc);
    });
  });
}

function openPlayer(url, titulo = "", desc = ""){
  if(!url) return alert("Link do vídeo indisponível.");
  player.pause();
  player.src = url;
  player.load();
  player.play().catch(()=>{ /* autoplay may be blocked */ });
  meta.innerHTML = `<strong style="color:#fff">${escapeHtml(titulo)}</strong><div style="color:var(--muted);margin-top:6px">${escapeHtml(desc)}</div>`;
  modal.setAttribute("aria-hidden","false");
}

function closePlayer(){
  player.pause();
  player.src = "";
  modal.setAttribute("aria-hidden","true");
}

modalClose.addEventListener("click", closePlayer);
closeBtn.addEventListener("click", closePlayer);
btnRefresh.addEventListener("click", () => carregarDoramas());

// search
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = doramas.filter(d => (d.titulo + " " + (d.descricao||"")).toLowerCase().includes(q));
  renderGrid(filtered);
});

// helper
function escapeHtml(str){
  if(!str) return "";
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// start
carregarDoramas();
