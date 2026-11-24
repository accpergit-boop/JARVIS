import React from 'react';
import {
  Activity,
  Apple,
  AudioLines,
  BatteryFull,
  Brain,
  Bluetooth,
  CalendarDays,
  Check,
  ChevronDown,
  Code2,
  Folder,
  House,
  Languages,
  Laptop,
  MessageSquare,
  Mic,
  Puzzle,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Scissors,
  UserRound,
  Wifi,
} from 'lucide-react';

const navigation = [
  { label: 'Home', page: 'Home', icon: House },
  { label: 'Conversazioni', page: 'Conversations', icon: MessageSquare },
  { label: 'Progetti', page: 'Overview', icon: Folder },
  { label: 'Memoria', page: 'Memory', icon: Activity },
  { label: 'Strumenti', page: 'Task Manager', icon: Scissors },
  { label: 'Automazioni', page: 'Mac Control', icon: Brain },
  { label: 'Impostazioni', page: 'Settings', icon: Settings },
  { label: 'Sicurezza', page: 'Security', icon: ShieldCheck },
];

const shortcuts = [
  { label: <>Conversazione<br />Naturale</>, icon: MessageSquare, page: 'Conversations' },
  { label: <>Controllo<br />Mac</>, icon: Laptop, page: 'Mac Control' },
  { label: <>Ricerca Web</>, icon: Search, page: 'Search' },
  { label: <>Automazioni</>, icon: Settings, page: 'Automations' },
  { label: <>Sviluppo</>, icon: Code2, page: 'Development' },
  { label: <>Analisi Dati</>, icon: Activity, page: 'Data Analysis' },
  { label: <>Sicurezza</>, icon: Shield, page: 'Security' },
  { label: <>Estensioni</>, icon: Puzzle, page: 'Integrations' },
];

function Reactor() {
  const ticks = Array.from({ length: 64 }, (_, index) => {
    const angle = (index / 64) * 360;
    const major = index % 4 === 0;
    return (
      <line
        key={angle}
        x1="180"
        y1={major ? '4' : '9'}
        x2="180"
        y2={major ? '18' : '13'}
        transform={`rotate(${angle} 180 180)`}
        stroke={major ? '#65e8ff' : '#3286b8'}
        strokeOpacity={major ? '.8' : '.48'}
        strokeWidth={major ? '2' : '1'}
      />
    );
  });

  return (
    <div className="reactor" aria-label="Nucleo luminoso JARVIS">
      <svg viewBox="0 0 360 360" role="presentation">
        <defs>
          <radialGradient id="jarvis-core" cx="50%" cy="42%">
            <stop offset="0" stopColor="#0d3650" />
            <stop offset=".58" stopColor="#041321" />
            <stop offset="1" stopColor="#01060d" />
          </radialGradient>
          <linearGradient id="jarvis-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b6f7ff" />
            <stop offset=".18" stopColor="#008ed6" />
            <stop offset=".34" stopColor="#071725" />
            <stop offset=".49" stopColor="#2bdfff" />
            <stop offset=".68" stopColor="#061522" />
            <stop offset=".84" stopColor="#3aa9e4" />
            <stop offset="1" stopColor="#06101b" />
          </linearGradient>
          <filter id="jarvis-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="180" cy="180" r="169" fill="none" stroke="#1b719e" strokeOpacity=".3" strokeWidth="1" />
        <circle cx="180" cy="180" r="158" fill="none" stroke="#3aa9df" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="180" cy="180" r="145" fill="none" stroke="#102c40" strokeWidth="10" />
        <circle cx="180" cy="180" r="139" fill="none" stroke="url(#jarvis-ring)" strokeWidth="8" filter="url(#jarvis-glow)" />
        <circle cx="180" cy="180" r="126" fill="none" stroke="#50ddff" strokeOpacity=".68" strokeWidth="2" />
        <circle cx="180" cy="180" r="116" fill="none" stroke="#174c69" strokeWidth="8" strokeDasharray="18 4 3 4" />
        <circle cx="180" cy="180" r="104" fill="none" stroke="#42d9ff" strokeWidth="5" strokeDasharray="38 9 10 8" filter="url(#jarvis-glow)" />
        <circle cx="180" cy="180" r="93" fill="none" stroke="#a2f5ff" strokeOpacity=".8" strokeWidth="2" />
        <circle cx="180" cy="180" r="81" fill="url(#jarvis-core)" stroke="#16749b" strokeWidth="3" />
        <circle cx="180" cy="180" r="70" fill="none" stroke="#06101b" strokeWidth="4" />
        <g>{ticks}</g>
        <circle cx="180" cy="180" r="64" fill="none" stroke="#27c8ed" strokeOpacity=".25" strokeWidth="1" />
        <text x="180" y="185" textAnchor="middle" fill="#40dfff" fontSize="21" letterSpacing="3">JARVIS</text>
      </svg>
    </div>
  );
}

function Jarvis() {
  const navigateToJarvisPage = (page) => {
    window.JarvisNavigation?.navigateTo?.(page);
  };

  return (
    <div id="jarvis-cinematic-home">
      <div className="mac-bar" aria-hidden="true">
        <Apple className="apple-mark" size={15} fill="currentColor" />
        <span>JARVIS</span><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span>
        <div className="mac-status"><Wifi size={16} /><Bluetooth size={15} /><BatteryFull size={17} /><span>Mar 22 Apr&nbsp; 21:47</span></div>
      </div>

      <header className="jarvis-header">
        <div className="brand">
          <span className="brand-reactor"><span>✦</span></span>
          <span><strong>JARVIS</strong><small>Personal AI Operating System</small></span>
        </div>
        <div className="brand-title"><strong>J A R V I S</strong><span>Intelligenza • Azione • Risultati</span></div>
        <div className="user-status"><span className="online-dot" /> Connesso <ChevronDown size={14} /></div>
        <div className="avatar" aria-label="Profilo utente"><UserRound size={30} strokeWidth={1.6} /></div>
      </header>

      <aside className="sidebar">
        <nav aria-label="Navigazione JARVIS">
          {navigation.map(({ label, page, icon: Icon }, index) => (
            <button
              className={index === 0 ? 'active' : ''}
              key={page}
              type="button"
              onClick={() => navigateToJarvisPage(page)}
            >
              <Icon size={20} strokeWidth={1.8} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <section className="system-status">
          <span>Stato Sistema</span>
          <strong><i /> Tutto operativo</strong>
          <div className="signal-chart" aria-hidden="true">
            <svg viewBox="0 0 140 40" preserveAspectRatio="none">
              <path d="M0 33 8 28 14 31 20 18 26 29 32 23 38 26 44 14 50 21 56 19 62 25 68 13 74 21 80 28 86 23 92 32 98 27 104 20 110 24 116 11 122 17 128 8 134 16 140 6" />
            </svg>
          </div>
        </section>
      </aside>

      <div className="quote-card">« Sempre al tuo fianco,<br />Zeen. »<small>— JARVIS</small></div>

      <main className="center">
        <div className="space-scene" aria-hidden="true">
          <div className="stars" />
          <div className="planet-horizon" />
          <div className="planet-surface" />
          <div className="floor-grid" />
          <div className="landing-ring"><i /><i /><i /></div>
          <span className="beam" />
        </div>
        <div className="greeting">
          <h1>Buonasera, Zeen.</h1>
          <p>Come posso aiutarti oggi?</p>
          <span />
        </div>
        <Reactor />

        <div className="jh-actions">
          {shortcuts.map(({ label, icon: Icon, page }) => (
            <button key={page} type="button" onClick={() => navigateToJarvisPage(page)}>
              <span className="shortcut-icon"><Icon size={23} strokeWidth={1.7} /></span>
              <small>{label}</small>
            </button>
          ))}
        </div>

        <div className="voice-dock">
          <div className="voice-inner">
            <AudioLines className="voice-level" size={25} />
            <span className="voice-placeholder">Parla con JARVIS...</span>
            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 44 }, (_, index) => (
                <i key={index} style={{ height: `${8 + ((index * 17 + 13) % 35)}px` }} />
              ))}
            </div>
            <button type="button" aria-label="Lingua"><Languages size={21} /></button>
            <span className="voice-divider" />
            <button className="send-button" type="button" aria-label="Invia"><Send size={20} /></button>
            <button className="mic-button" type="button" aria-label="Microfono">
              <Mic size={29} />
            </button>
          </div>
        </div>
      </main>

      <aside className="right">
        <section className="activity-card">
          <header><h2>Attività Recenti</h2><button type="button">Vedi tutto →</button></header>
          <div className="activity-row">
            <span className="activity-icon success"><Check size={19} /></span>
            <p>Analisi progetto SUPER IQ-FOAM<small>Completata • 2 min fa</small></p>
          </div>
          <div className="activity-row">
            <span className="activity-icon"><Search size={20} /></span>
            <p>Ricerca aggiornamenti ERP<small>Completata • 5 min fa</small></p>
          </div>
          <div className="activity-row">
            <span className="activity-icon"><Code2 size={20} /></span>
            <p>Verifica codice<small>In corso • 1 min</small></p>
          </div>
          <div className="activity-row">
            <span className="activity-icon"><CalendarDays size={19} /></span>
            <p>Prossimo: Meeting Team<small>Oggi • 19:00</small></p>
          </div>
        </section>

        <section className="memory-card">
          <header><Brain size={21} /><h2>Memoria Intelligente</h2><span><i /> Aggiornata</span></header>
          <div className="memory-content">
            <div className="brain-art" aria-hidden="true"><Brain size={82} strokeWidth={1.2} /></div>
            <p>3 nuovi ricordi aggiunti<br />questa settimana.</p>
          </div>
          <button type="button">Gestisci →</button>
        </section>
      </aside>

      <section className="operating-card">
        <div className="operating-heading"><span><AudioLines size={25} /></span><div>Modalità Operativa<strong>Ascolto attivo</strong></div></div>
        <div className="operating-wave" aria-hidden="true">
          {Array.from({ length: 38 }, (_, index) => (
            <i key={index} style={{ height: `${4 + ((index * 11 + 7) % 24)}px` }} />
          ))}
        </div>
        <p>Riconosco la tua voce in tempo reale...</p>
      </section>
    </div>
  );
}

export default Jarvis;
