(() => {
  if (document.getElementById("jarvis-cinematic-home")) return;
  const root = document.createElement("div");
  root.id = "jarvis-cinematic-home";
  root.innerHTML = `
    <div class="layout">
      <aside class="glass sidebar">
        <h2>✧ JARVIS</h2>
        <button>⌂ Home</button>
        <button>▤ Conversazioni</button>
        <button>▱ Progetti</button>
        <button>◉ Memoria</button>
        <button>⚒ Strumenti</button>
        <button>⌘ Automazioni</button>
        <button>⚙ Impostazioni</button>
        <p>● Interfaccia disponibile</p>
      </aside>
      <main class="center">
        <div class="reactor"></div>
        <h1 style="position:absolute;top:12%;left:5%">
          Buonasera, Zeen.<br>
          <small>Come posso aiutarti oggi?</small>
        </h1>
        <div class="voice">◖▮◗ &nbsp; JARVIS — Standby</div>
      </main>
      <aside class="right">
        <section class="glass">
          <h3>Attività recenti</h3>
          <p>Nessuna attività verificata.</p>
        </section>
        <section class="glass">
          <h3>Memoria intelligente</h3>
          <p>Centro memoria non ancora collegato.</p>
        </section>
        <section class="glass">
          <h3>Modalità operativa</h3>
          <p>Microfono non attivo.</p>
        </section>
      </aside>
    </div>`;

  const actions = [
    ["▤","Chat","Conversations"],["⌘","Mac Control","Mac Control"],
    ["⌕","Search","Search"],["⚙","Settings","Settings"],
    ["◉","Memory","Memory"],["⬡","Integrations","Integrations"]
  ];
  const bar = document.createElement("div");
  bar.className = "jh-actions";
  bar.innerHTML = actions.map(([i,n,p]) =>
    `<button data-page="${p}"><b>${i}</b><small>${n}</small></button>`
  ).join("");
  root.querySelector(".center").appendChild(bar);

  const pages = ["Home","Conversations","Overview","Memory",
    "Task Manager","Mac Control","Settings"];
  root.querySelectorAll(".sidebar button").forEach((b,i) => {
    b.dataset.page = pages[i];
  });

  root.querySelectorAll("[data-page]").forEach(b => {
    b.addEventListener("click", () => {
      const page = b.dataset.page;
      if (page === "Home") {
        root.style.display = "";
        return;
      }
      root.style.display = "none";
      window.JarvisNavigation?.navigateTo(page);
    });
  });

  document.body.appendChild(root);
})();
