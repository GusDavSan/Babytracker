import { appSettings, firebaseConfig } from "./firebase-config.js";

const firebaseConfigured = Object.values(firebaseConfig).every((value) => value && !String(value).startsWith("PASTE_"));

let fb = null;

const state = {
  lang: localStorage.getItem("nana.lang") || "en",
  tab: "today",
  user: null,
  userProfile: null,
  familyId: null,
  family: null,
  events: [],
  historyDate: localStorage.getItem("nana.historyDate") || "",
  mode: firebaseConfigured ? "firebase" : "demo-ready",
  error: "",
  sheet: null,
  unsubscribeEvents: null
};

const t = {
  en: {
    appName: "Nana",
    tagline: "Shared care, in sync.",
    intro: "Track sleep, feeds, diapers, and notes with your partner in real time.",
    google: "Continue with Google",
    demo: "Try demo",
    demoNotice: "Firebase is not configured yet. Demo mode stores data only in this browser.",
    today: "Today",
    history: "History",
    stats: "Stats",
    settings: "Settings",
    sleepingSince: "Sleeping since",
    awakeSince: "Awake since",
    nap: "nap",
    awake: "awake",
    synced: "Synced",
    offline: "Demo",
    sleep: "Sleep",
    wakeUp: "Wake up",
    feed: "Feed",
    diaper: "Diaper",
    note: "Note",
    summary: "Today's summary",
    sleepTotal: "Sleep",
    feeds: "Feeds",
    diapers: "Diapers",
    recent: "Recent activity",
    noEvents: "No events yet.",
    selectDate: "Select date",
    allDates: "All dates",
    noEventsOnDate: "No events on this date.",
    createFamily: "Create family",
    joinFamily: "Join family",
    babyName: "Baby name",
    familyName: "Family name",
    inviteCode: "Invite code",
    create: "Create",
    join: "Join",
    familyCode: "Family code",
    language: "Language",
    signOut: "Sign out",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    eventDate: "Date",
    eventTime: "Time",
    now: "Now",
    from: "From",
    to: "To",
    sleepSessions: "Sleep sessions",
    exportData: "Export data",
    exportCsv: "Export CSV",
    bottle: "Bottle",
    breast: "Breast",
    solids: "Solids",
    feedType: "Feed type",
    amount: "Amount",
    notes: "Notes",
    pee: "Pee",
    poop: "Poop",
    both: "Pee + poop",
    consistency: "Consistency",
    normal: "Normal",
    liquid: "Liquid",
    hard: "Hard",
    optional: "Optional",
    addedBy: "by",
    you: "you",
    setupTitle: "Set up Nana",
    setupCopy: "Create a baby profile or join your partner with the shared code.",
    last7Days: "Last 7 days",
    noStats: "Add a few events to see patterns.",
    copied: "Copied",
    currentFamily: "Current family",
    firebaseMissing: "Add your Firebase config to enable Google login and realtime sync."
  },
  es: {
    appName: "Nana",
    tagline: "Cuidados compartidos, sincronizados.",
    intro: "Registra sueño, tomas, pañales y notas con tu pareja en tiempo real.",
    google: "Continuar con Google",
    demo: "Probar demo",
    demoNotice: "Firebase aún no está configurado. El modo demo guarda datos solo en este navegador.",
    today: "Hoy",
    history: "Historial",
    stats: "Stats",
    settings: "Ajustes",
    sleepingSince: "Dormida desde",
    awakeSince: "Despierta desde",
    nap: "siesta",
    awake: "despierta",
    synced: "Sincronizado",
    offline: "Demo",
    sleep: "Dormir",
    wakeUp: "Despertar",
    feed: "Comida",
    diaper: "Pañal",
    note: "Nota",
    summary: "Resumen de hoy",
    sleepTotal: "Sueño",
    feeds: "Tomas",
    diapers: "Pañales",
    recent: "Actividad reciente",
    noEvents: "Todavía no hay registros.",
    selectDate: "Seleccionar fecha",
    allDates: "Todas las fechas",
    noEventsOnDate: "No hay registros en esta fecha.",
    createFamily: "Crear familia",
    joinFamily: "Unirse",
    babyName: "Nombre del bebé",
    familyName: "Nombre de familia",
    inviteCode: "Código de invitación",
    create: "Crear",
    join: "Unirse",
    familyCode: "Código familiar",
    language: "Idioma",
    signOut: "Cerrar sesión",
    save: "Guardar",
    update: "Actualizar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    eventDate: "Fecha",
    eventTime: "Hora",
    now: "Ahora",
    from: "Desde",
    to: "Hasta",
    sleepSessions: "Periodos de sueño",
    exportData: "Exportar datos",
    exportCsv: "Exportar CSV",
    bottle: "Biberón",
    breast: "Pecho",
    solids: "Sólidos",
    feedType: "Tipo de comida",
    amount: "Cantidad",
    notes: "Notas",
    pee: "Pipi",
    poop: "Popó",
    both: "Pipi + popó",
    consistency: "Aspecto",
    normal: "Normal",
    liquid: "Líquido",
    hard: "Duro",
    optional: "Opcional",
    addedBy: "por",
    you: "tú",
    setupTitle: "Configurar Nana",
    setupCopy: "Crea el perfil del bebé o únete con el código compartido por tu pareja.",
    last7Days: "Últimos 7 días",
    noStats: "Añade algunos registros para ver patrones.",
    copied: "Copiado",
    currentFamily: "Familia actual",
    firebaseMissing: "Añade la configuración de Firebase para activar Google login y sincronización."
  }
};

const app = document.querySelector("#app");

const iconPaths = {
  moon: '<path d="M18.5 15.8A7.8 7.8 0 0 1 8.2 5.5 8 8 0 1 0 18.5 15.8Z"/><path d="M17.4 3.8v3.6M15.6 5.6h3.6"/>',
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 2.6v2M12 19.4v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.6 12h2M19.4 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  bottle: '<path d="M9.5 3.2h5v3.1l1.6 1.4c.9.8 1.4 1.9 1.4 3.1v6.7a3.3 3.3 0 0 1-3.3 3.3h-4.4a3.3 3.3 0 0 1-3.3-3.3v-6.7c0-1.2.5-2.3 1.4-3.1l1.6-1.4V3.2Z"/><path d="M9.2 6.3h5.6M8.3 12h7.4M8.3 15.2h7.4"/>',
  breast: '<path d="M12 4.2c3.7 0 6.7 3.1 6.7 6.9 0 5.1-3.6 8.7-6.7 8.7s-6.7-3.6-6.7-8.7c0-3.8 3-6.9 6.7-6.9Z"/><circle cx="12" cy="13.2" r="2.5"/><path d="M8.7 5.3C9.4 3.6 10.5 2.7 12 2.7s2.6.9 3.3 2.6"/>',
  solids: '<path d="M6.3 3.6v6.6a2.3 2.3 0 0 0 2.3 2.3h0a2.3 2.3 0 0 0 2.3-2.3V3.6M8.6 3.6v17"/><path d="M16.8 3.6v17M14.2 7.4c0-2.1 1.2-3.8 2.6-3.8s2.6 1.7 2.6 3.8-1.2 3.8-2.6 3.8"/>',
  diaper: '<path d="M4.4 7.3c2.8 1.2 5.3 1.8 7.6 1.8s4.8-.6 7.6-1.8v6.1a6.2 6.2 0 0 1-6.2 6.2h-2.8a6.2 6.2 0 0 1-6.2-6.2V7.3Z"/><path d="M4.4 7.3l2-3.1c1.9 1 3.8 1.5 5.6 1.5s3.7-.5 5.6-1.5l2 3.1M8.2 14.5h.1M15.7 14.5h.1"/>',
  poop: '<path d="M8.2 11.2c.6-2 2.1-3.1 4.3-3.1 2.6 0 4.4 1.5 4.4 3.6 1.8.5 3 1.8 3 3.7 0 2.6-2.2 4.4-5 4.4H9.1c-2.8 0-5-1.8-5-4.4 0-2.2 1.6-3.8 4.1-4.2Z"/><path d="M11.2 8c.2-1.7 1.1-3 2.8-3.8M9.5 15.8h.1M14.5 15.8h.1"/>',
  note: '<path d="M6 4.8h9.2L18 7.6v11.6H6V4.8Z"/><path d="M15.2 4.8v3h2.9M8.5 11h7M8.5 14h7M8.5 17h4.2"/>',
	  edit: '<path d="M4.4 19.6h4.2L19 9.2 14.8 5 4.4 15.4v4.2Z"/><path d="M13.7 6.1l4.2 4.2"/>',
	  download: '<path d="M12 3.5v11"/><path d="m7.5 10 4.5 4.5 4.5-4.5"/><path d="M5 18.5h14"/>',
	  copy: '<path d="M8 8h10v11H8z"/><path d="M6 16H4V5h10v2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  google: '<path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.2Z"/><path d="M12 22c2.7 0 5-0.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path d="M6.4 13.8A6 6 0 0 1 6 12c0-.6.1-1.2.4-1.8V7.6H3.1A10 10 0 0 0 3.1 16.4l3.3-2.6Z"/><path d="M12 6.1c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2 10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 7.9 9.4 6.1 12 6.1Z"/>'
};

function iconSvg(name, label = "") {
  const path = iconPaths[name] || iconPaths.note;
  const aria = label ? ` role="img" aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
  return `<svg class="svg-icon" viewBox="0 0 24 24"${aria}>${path}</svg>`;
}

function appLogoSvg() {
  return `
    <svg class="app-logo" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="#7667d8"/>
      <path d="M31.3 13.1A12.8 12.8 0 1 1 16.7 27.7 13.4 13.4 0 0 0 31.3 13.1Z" fill="#fff8dd"/>
      <circle cx="34.5" cy="34" r="3.8" fill="#91d7c6"/>
      <circle cx="17.5" cy="33.5" r="2.8" fill="#f0c36b"/>
    </svg>
  `;
}

function msg(key) {
  return t[state.lang][key] || t.en[key] || key;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function id(size = 8) {
  return Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map((byte) => byte.toString(36).slice(-1))
    .join("");
}

function inviteCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(5)))
    .map((byte) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[byte % 32])
    .join("");
}

function nowIso() {
  return new Date().toISOString();
}

function dateFromEvent(event) {
  if (!event.timestamp) return new Date();
  if (typeof event.timestamp === "string") return new Date(event.timestamp);
  if (event.timestamp.toDate) return event.timestamp.toDate();
  if (typeof event.timestamp.seconds === "number") return new Date(event.timestamp.seconds * 1000);
  return new Date(event.timestamp);
}

function formatTime(date) {
  return new Intl.DateTimeFormat(state.lang === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat(state.lang === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatDateLong(date) {
  return new Intl.DateTimeFormat(state.lang === "es" ? "es-ES" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateFromLocalKey(key) {
  return new Date(`${key}T12:00:00`);
}

function localTimeKey(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function dateFromLocalDateTime(dateKey, timeKey) {
  return new Date(`${dateKey}T${timeKey}:00`);
}

function sortEventsDescending(events) {
  return [...events].sort((a, b) => dateFromEvent(b) - dateFromEvent(a));
}

function isCareType(type) {
  return type === "sleep_start" || type === "wake_up";
}

function isEditableEventType(type) {
  return ["sleep_start", "wake_up", "feed", "diaper", "note"].includes(type);
}

function editableEvent() {
  if (!String(state.sheet || "").startsWith("edit:")) return null;
  const eventId = state.sheet.slice(5);
  return state.events.find((event) => event.id === eventId) || null;
}

function canManageEvent() {
  return state.mode === "demo" || Boolean(state.user && state.familyId);
}

function duration(ms) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isToday(date) {
  return date >= startOfToday();
}

function dayRangeFromKey(key) {
  const start = new Date(`${key}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
}

function iconFor(event) {
  if (event.type === "sleep_start") return { className: "sleep", name: "moon", label: msg("sleep") };
  if (event.type === "wake_up") return { className: "awake", name: "sun", label: msg("wakeUp") };
  if (event.type === "feed") return { className: "feed", name: event.feedType || "bottle", label: msg(event.feedType || "bottle") };
  if (event.type === "diaper" && event.poop && !event.pee) return { className: "poop", name: "poop", label: msg("poop") };
  if (event.type === "diaper") return { className: "diaper", name: "diaper", label: msg("diaper") };
  return { className: "note", name: "note", label: msg("note") };
}

function labelFor(event) {
  if (event.type === "sleep_start") return msg("sleep");
  if (event.type === "wake_up") return msg("wakeUp");
  if (event.type === "feed") {
    const feedType = msg(event.feedType || "bottle");
    const amountValue = String(event.amountMl || "").trim();
    const amount = amountValue ? ` ${amountValue}${/[a-zA-Z]/.test(amountValue) ? "" : " ml"}` : "";
    return `${feedType}${amount}`;
  }
  if (event.type === "diaper") {
    if (event.pee && event.poop) return msg("both");
    if (event.poop) return msg("poop");
    return msg("pee");
  }
  return event.note ? event.note : msg("note");
}

function currentCareState() {
  const latestSleep = state.events.find((event) => event.type === "sleep_start" || event.type === "wake_up");
  if (!latestSleep) return { sleeping: false, since: null };
  return {
    sleeping: latestSleep.type === "sleep_start",
    since: dateFromEvent(latestSleep)
  };
}

function todaySleepMs() {
  const events = [...state.events]
    .filter((event) => event.type === "sleep_start" || event.type === "wake_up")
    .sort((a, b) => dateFromEvent(a) - dateFromEvent(b));

  let start = null;
  let total = 0;
  const today = startOfToday();

  for (const event of events) {
    const date = dateFromEvent(event);
    if (event.type === "sleep_start") {
      start = date;
    } else if (start) {
      const from = start < today ? today : start;
      if (date > today) total += Math.max(0, date - from);
      start = null;
    }
  }

  if (start) {
    const from = start < today ? today : start;
    total += Math.max(0, Date.now() - from.getTime());
  }

  return total;
}

function todayEvents() {
  return state.events.filter((event) => isToday(dateFromEvent(event)));
}

function sleepSessionsForRange(start, end) {
  const sleepEvents = state.events
    .filter((event) => event.type === "sleep_start" || event.type === "wake_up")
    .sort((a, b) => dateFromEvent(a) - dateFromEvent(b));
  const sessions = [];
  let openStart = null;

  const addSession = (sessionStart, sessionEnd, ongoing = false) => {
    if (!sessionStart || !sessionEnd || sessionEnd <= sessionStart) return;
    const clampedStart = new Date(Math.max(sessionStart.getTime(), start.getTime()));
    const clampedEnd = new Date(Math.min(sessionEnd.getTime(), end.getTime()));
    if (clampedEnd <= clampedStart) return;
    sessions.push({
      start: sessionStart,
      end: sessionEnd,
      clampedStart,
      clampedEnd,
      ongoing,
      ms: clampedEnd - clampedStart
    });
  };

  for (const event of sleepEvents) {
    const date = dateFromEvent(event);
    if (event.type === "sleep_start") {
      openStart = date;
    } else if (openStart) {
      addSession(openStart, date);
      openStart = null;
    }
  }

  if (openStart) {
    addSession(openStart, new Date(), true);
  }

  return sessions.sort((a, b) => b.clampedStart - a.clampedStart);
}

function sleepMsForRange(start, end) {
  return sleepSessionsForRange(start, end).reduce((total, session) => total + session.ms, 0);
}

function daySummary(key, events) {
  const { start, end } = dayRangeFromKey(key);
  return {
    sleepMs: sleepMsForRange(start, end),
    feeds: events.filter((event) => event.type === "feed").length,
    diapers: events.filter((event) => event.type === "diaper").length
  };
}

function eventOwner(event) {
  if (event.createdBy && state.user && event.createdBy === state.user.uid) return msg("you");
  return event.createdByName || "Ana";
}

function shell(content, { topbar = true, tabs = false } = {}) {
  return `
    <div class="phone-shell">
      <div class="screen">
        ${topbar ? topbarHtml() : ""}
        ${content}
        ${tabs ? tabsHtml() : ""}
      </div>
    </div>
    ${state.sheet ? sheetHtml() : ""}
  `;
}

function topbarHtml() {
  const baby = state.family?.babyName || appSettings.defaultBabyName || "Luna";
  const subtitle = state.family ? formatDateLong(new Date()) : msg("tagline");
  return `
    <header class="topbar">
      <div class="brand">
        <div class="mark">${appLogoSvg()}</div>
        <div>
          <h2>${escapeHtml(state.family ? baby : msg("appName"))}</h2>
          <div class="subtle">${escapeHtml(subtitle)}</div>
        </div>
      </div>
      ${languageToggleHtml()}
    </header>
  `;
}

function languageToggleHtml() {
  return `
    <div class="lang-toggle" aria-label="${escapeHtml(msg("language"))}">
      <button type="button" class="${state.lang === "en" ? "active" : ""}" data-action="lang" data-lang="en">EN</button>
      <button type="button" class="${state.lang === "es" ? "active" : ""}" data-action="lang" data-lang="es">ES</button>
    </div>
  `;
}

function tabsHtml() {
  const tabs = [
    ["today", msg("today")],
    ["history", msg("history")],
    ["stats", msg("stats")],
    ["settings", msg("settings")]
  ];
  return `
    <nav class="tabs">
      ${tabs.map(([key, label]) => `
        <button type="button" class="tab ${state.tab === key ? "active" : ""}" data-action="tab" data-tab="${key}">
          ${escapeHtml(label)}
        </button>
      `).join("")}
    </nav>
  `;
}

function render() {
  if (!state.user) {
    app.innerHTML = shell(authHtml(), { topbar: true, tabs: false });
  } else if (!state.family) {
    app.innerHTML = shell(setupHtml(), { topbar: true, tabs: false });
  } else {
    app.innerHTML = shell(mainHtml(), { topbar: true, tabs: true });
  }
}

function authHtml() {
  return `
    <main class="auth-hero">
      <section class="hero-card">
        <h2>${escapeHtml(msg("appName"))}</h2>
        <p>${escapeHtml(msg("intro"))}</p>
      </section>
      ${!firebaseConfigured ? `<div class="notice">${escapeHtml(msg("firebaseMissing"))}</div>` : ""}
      <div class="auth-actions">
        <button type="button" class="btn primary" data-action="google" ${firebaseConfigured ? "" : "disabled"}>
          <span class="google-mark">${iconSvg("google", "Google")}</span>
          <span>${escapeHtml(msg("google"))}</span>
        </button>
        <button type="button" class="btn ghost" data-action="demo">${escapeHtml(msg("demo"))}</button>
      </div>
      ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ""}
    </main>
  `;
}

function setupHtml() {
  return `
    <main class="scroll">
      <section class="card">
        <div class="section-title">
          <h3>${escapeHtml(msg("setupTitle"))}</h3>
        </div>
        <p class="subtle">${escapeHtml(msg("setupCopy"))}</p>
      </section>
      <div class="setup-grid">
        <section class="card">
          <div class="section-title">
            <h3>${escapeHtml(msg("createFamily"))}</h3>
          </div>
          <form class="form" data-form="create-family">
            <div class="field">
              <label for="babyName">${escapeHtml(msg("babyName"))}</label>
              <input id="babyName" name="babyName" value="${escapeHtml(appSettings.defaultBabyName || "Luna")}" required>
            </div>
            <div class="field">
              <label for="familyName">${escapeHtml(msg("familyName"))}</label>
              <input id="familyName" name="familyName" value="${escapeHtml(appSettings.defaultFamilyName || "Family")}" required>
            </div>
            <button type="submit" class="btn primary">${escapeHtml(msg("create"))}</button>
          </form>
        </section>
        <section class="card">
          <div class="section-title">
            <h3>${escapeHtml(msg("joinFamily"))}</h3>
          </div>
          <form class="form" data-form="join-family">
            <div class="field">
              <label for="joinCode">${escapeHtml(msg("inviteCode"))}</label>
              <input id="joinCode" name="joinCode" placeholder="nana-ab12cd:7K9FP" required>
            </div>
            <button type="submit" class="btn ghost">${escapeHtml(msg("join"))}</button>
          </form>
        </section>
        ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ""}
      </div>
    </main>
  `;
}

function mainHtml() {
  if (state.tab === "history") return historyHtml();
  if (state.tab === "stats") return statsHtml();
  if (state.tab === "settings") return settingsHtml();
  return todayHtml();
}

function todayHtml() {
  const care = currentCareState();
  const today = todayEvents();
  const feedCount = today.filter((event) => event.type === "feed").length;
  const diaperCount = today.filter((event) => event.type === "diaper").length;
  const sinceText = care.since ? formatTime(care.since) : "--:--";
  const stateText = care.sleeping ? `${msg("sleepingSince")} ${sinceText}` : `${msg("awakeSince")} ${sinceText}`;
  const stateMeta = care.since ? `${duration(Date.now() - care.since.getTime())} ${care.sleeping ? msg("nap") : msg("awake")}` : msg("noEvents");

  return `
    <main class="scroll">
      <section class="card status-card">
        <div class="status-row">
          <div>
            <h3>${escapeHtml(state.family.babyName)}</h3>
            <div class="state-line">${escapeHtml(stateText)}</div>
            <div class="state-meta">${escapeHtml(stateMeta)}</div>
          </div>
          <span class="sync-chip">${escapeHtml(state.mode === "demo" ? msg("offline") : msg("synced"))}</span>
        </div>
      </section>

      <section class="section">
        <div class="quick-grid">
          <button type="button" class="btn quick-btn" data-action="open-sheet" data-sheet="sleep_start">
            <span class="icon sleep">${iconSvg("moon", msg("sleep"))}</span><span>${escapeHtml(msg("sleep"))}</span>
          </button>
          <button type="button" class="btn quick-btn" data-action="open-sheet" data-sheet="wake_up">
            <span class="icon awake">${iconSvg("sun", msg("wakeUp"))}</span><span>${escapeHtml(msg("wakeUp"))}</span>
          </button>
          <button type="button" class="btn quick-btn" data-action="open-sheet" data-sheet="feed">
            <span class="icon feed">${iconSvg("bottle", msg("feed"))}</span><span>${escapeHtml(msg("feed"))}</span>
          </button>
          <button type="button" class="btn quick-btn" data-action="open-sheet" data-sheet="diaper">
            <span class="icon diaper">${iconSvg("diaper", msg("diaper"))}</span><span>${escapeHtml(msg("diaper"))}</span>
          </button>
          <button type="button" class="btn quick-btn note-wide" data-action="open-sheet" data-sheet="note">
            <span class="icon note">${iconSvg("note", msg("note"))}</span><span>${escapeHtml(msg("note"))}</span>
          </button>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h3>${escapeHtml(msg("summary"))}</h3>
        </div>
        <div class="summary-grid">
          <div class="metric"><strong>${escapeHtml(duration(todaySleepMs()))}</strong><span>${escapeHtml(msg("sleepTotal"))}</span></div>
          <div class="metric"><strong>${feedCount}</strong><span>${escapeHtml(msg("feeds"))}</span></div>
          <div class="metric"><strong>${diaperCount}</strong><span>${escapeHtml(msg("diapers"))}</span></div>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h3>${escapeHtml(msg("recent"))}</h3>
        </div>
        ${timelineHtml(today.slice(0, 8))}
      </section>
    </main>
  `;
}

function historyHtml() {
  const groups = new Map();
  for (const event of state.events) {
    const date = dateFromEvent(event);
    const key = localDateKey(date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }

  const filteredEvents = state.historyDate
    ? state.events.filter((event) => localDateKey(dateFromEvent(event)) === state.historyDate)
    : [];
  const selectedRange = state.historyDate ? dayRangeFromKey(state.historyDate) : null;
  const hasSelectedData = Boolean(
    filteredEvents.length
    || (selectedRange && sleepSessionsForRange(selectedRange.start, selectedRange.end).length)
  );

  return `
    <main class="scroll">
      <section class="card history-jump">
        <div class="section-title"><h3>${escapeHtml(msg("selectDate"))}</h3></div>
        <div class="history-date-row">
          <input type="date" value="${escapeHtml(state.historyDate)}" data-action="history-date">
          <button type="button" class="btn ghost" data-action="clear-history-date">${escapeHtml(msg("allDates"))}</button>
        </div>
      </section>

      ${state.historyDate ? `
        <section class="card">
          <div class="section-title"><h3>${escapeHtml(formatDateLong(dateFromLocalKey(state.historyDate)))}</h3></div>
          ${hasSelectedData ? `
            ${daySummaryHtml(state.historyDate, filteredEvents)}
            ${sleepSessionsHtml(state.historyDate)}
            ${filteredEvents.length ? timelineHtml(filteredEvents) : ""}
          ` : `<div class="empty">${escapeHtml(msg("noEventsOnDate"))}</div>`}
        </section>
      ` : Array.from(groups.entries()).map(([key, events]) => `
          <section class="card">
            <div class="section-title"><h3>${escapeHtml(formatDateLong(dateFromLocalKey(key)))}</h3></div>
            ${daySummaryHtml(key, events)}
            ${sleepSessionsHtml(key)}
            ${timelineHtml(events)}
          </section>
        `).join("") || `<div class="empty">${escapeHtml(msg("noEvents"))}</div>`}
    </main>
  `;
}

function statsHtml() {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const values = days.map((day) => {
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = state.events.filter((event) => {
      const date = dateFromEvent(event);
      return date >= day && date < next;
    }).length;
    return { day, count };
  });

  const max = Math.max(1, ...values.map((item) => item.count));

  return `
    <main class="scroll">
      <section class="card">
        <div class="section-title"><h3>${escapeHtml(msg("last7Days"))}</h3></div>
        ${state.events.length ? `
          <div class="bar-chart">
            ${values.map((item) => `
              <div class="bar-row">
                <span>${escapeHtml(formatDate(item.day))}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, item.count / max * 100)}%"></div></div>
                <span>${item.count}</span>
              </div>
            `).join("")}
          </div>
        ` : `<div class="empty">${escapeHtml(msg("noStats"))}</div>`}
      </section>
      <section class="card">
        <div class="summary-grid">
          <div class="metric"><strong>${state.events.filter((event) => event.type === "sleep_start").length}</strong><span>${escapeHtml(msg("sleep"))}</span></div>
          <div class="metric"><strong>${state.events.filter((event) => event.type === "feed").length}</strong><span>${escapeHtml(msg("feeds"))}</span></div>
          <div class="metric"><strong>${state.events.filter((event) => event.type === "diaper").length}</strong><span>${escapeHtml(msg("diapers"))}</span></div>
        </div>
      </section>
    </main>
  `;
}

function settingsHtml() {
  const familyCode = `${state.familyId}:${state.family.inviteCode}`;
  return `
    <main class="scroll">
      <section class="card settings-list">
        <div class="section-title"><h3>${escapeHtml(msg("currentFamily"))}</h3></div>
        <div class="field">
          <label>${escapeHtml(msg("babyName"))}</label>
          <input value="${escapeHtml(state.family.babyName)}" data-input="babyName">
        </div>
        <button type="button" class="btn primary" data-action="save-baby">${escapeHtml(msg("save"))}</button>
      </section>

      <section class="card settings-list">
        <div class="section-title"><h3>${escapeHtml(msg("familyCode"))}</h3></div>
        <div class="code-box">
          <code>${escapeHtml(familyCode)}</code>
          <button type="button" class="icon-btn" data-action="copy" data-code="${escapeHtml(familyCode)}">${iconSvg("copy", msg("copied"))}</button>
        </div>
      </section>

      <section class="card settings-list">
        <div class="section-title"><h3>${escapeHtml(msg("language"))}</h3></div>
        ${languageToggleHtml()}
      </section>

      <section class="card settings-list">
        <div class="section-title"><h3>${escapeHtml(msg("exportData"))}</h3></div>
        <button type="button" class="btn ghost" data-action="export-csv">
          ${iconSvg("download", msg("exportCsv"))}
          <span>${escapeHtml(msg("exportCsv"))}</span>
        </button>
      </section>

      <section class="card settings-list">
        <button type="button" class="btn danger" data-action="sign-out">${escapeHtml(msg("signOut"))}</button>
      </section>
    </main>
  `;
}

function daySummaryHtml(key, events) {
  const summary = daySummary(key, events);
  return `
    <div class="summary-grid day-summary">
      <div class="metric"><strong>${escapeHtml(duration(summary.sleepMs))}</strong><span>${escapeHtml(msg("sleepTotal"))}</span></div>
      <div class="metric"><strong>${summary.feeds}</strong><span>${escapeHtml(msg("feeds"))}</span></div>
      <div class="metric"><strong>${summary.diapers}</strong><span>${escapeHtml(msg("diapers"))}</span></div>
    </div>
  `;
}

function sleepSessionsHtml(key) {
  const { start, end } = dayRangeFromKey(key);
  const sessions = sleepSessionsForRange(start, end);
  if (!sessions.length) return "";
  const isTodayKey = key === localDateKey(new Date());
  return `
    <div class="sleep-blocks">
      <div class="mini-title">${escapeHtml(msg("sleepSessions"))}</div>
      ${sessions.map((session) => {
        const endLabel = session.ongoing && isTodayKey ? msg("now") : formatTime(session.clampedEnd);
        return `
          <div class="sleep-session">
            <span>${escapeHtml(formatTime(session.clampedStart))} → ${escapeHtml(endLabel)}</span>
            <strong>${escapeHtml(duration(session.ms))}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function timelineHtml(events) {
  if (!events.length) return `<div class="empty">${escapeHtml(msg("noEvents"))}</div>`;
  return `
    <div class="timeline">
      ${events.map((event) => {
        const icon = iconFor(event);
        const owner = eventOwner(event);
        const notes = event.note && event.type !== "note" ? ` · ${event.note}` : "";
        const canManage = canManageEvent(event);
        const canEdit = canManage && isEditableEventType(event.type);
        return `
          <article class="event">
            <time class="event-time">${escapeHtml(formatTime(dateFromEvent(event)))}</time>
            <span class="event-icon ${icon.className}">${iconSvg(icon.name, icon.label)}</span>
            <div class="event-main">
              <div class="event-label">${escapeHtml(labelFor(event))}</div>
              <div class="event-meta">${escapeHtml(`${msg("addedBy")} ${owner}${notes}`)}</div>
            </div>
            ${canManage ? `
              <div class="event-actions">
                ${canEdit ? `<button type="button" class="icon-btn" data-action="edit-event" data-id="${escapeHtml(event.id)}" aria-label="${escapeHtml(msg("edit"))}">${iconSvg("edit", msg("edit"))}</button>` : ""}
                <button type="button" class="icon-btn" data-action="delete-event" data-id="${escapeHtml(event.id)}" aria-label="${escapeHtml(msg("delete"))}">${iconSvg("close", msg("delete"))}</button>
              </div>
            ` : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function sheetHtml() {
  const eventToEdit = editableEvent();
  const sheetType = eventToEdit ? eventToEdit.type : state.sheet;
  const title = isCareType(sheetType)
    ? msg(sheetType === "sleep_start" ? "sleep" : "wakeUp")
    : sheetType === "feed"
      ? msg("feed")
      : sheetType === "note"
        ? msg("note")
        : msg("diaper");
  const content = isCareType(sheetType)
    ? careFormHtml(sheetType, eventToEdit)
    : sheetType === "feed"
      ? feedFormHtml(eventToEdit)
      : sheetType === "note"
        ? noteFormHtml(eventToEdit)
        : diaperFormHtml(state.sheet === "poop", eventToEdit);
  return `
    <div class="sheet-backdrop" data-action="close-sheet">
      <section class="sheet" role="dialog" aria-modal="true" data-sheet-panel>
        <div class="sheet-head">
          <h3>${escapeHtml(title)}</h3>
          <button type="button" class="icon-btn" data-action="close-sheet">${iconSvg("close", msg("cancel"))}</button>
        </div>
        ${content}
      </section>
    </div>
  `;
}

function eventIdInput(eventToEdit) {
  return eventToEdit ? `<input type="hidden" name="eventId" value="${escapeHtml(eventToEdit.id)}">` : "";
}

function dateTimeFields(prefix, eventToEdit = null) {
  const selectedDate = eventToEdit ? dateFromEvent(eventToEdit) : new Date();
  return `
    <div class="split">
      <div class="field">
        <label for="${prefix}Date">${escapeHtml(msg("eventDate"))}</label>
        <input id="${prefix}Date" name="eventDate" type="date" value="${escapeHtml(localDateKey(selectedDate))}" required>
      </div>
      <div class="field">
        <label for="${prefix}Time">${escapeHtml(msg("eventTime"))}</label>
        <input id="${prefix}Time" name="eventTime" type="time" value="${escapeHtml(localTimeKey(selectedDate))}" required>
      </div>
    </div>
  `;
}

function careFormHtml(type, eventToEdit = null) {
  return `
    <form class="form" data-form="event-care">
      <input type="hidden" name="careType" value="${escapeHtml(type)}">
      ${eventIdInput(eventToEdit)}
      ${dateTimeFields("care", eventToEdit)}
      <div class="field">
        <label for="careNotes">${escapeHtml(msg("notes"))} (${escapeHtml(msg("optional"))})</label>
        <textarea id="careNotes" name="note">${escapeHtml(eventToEdit?.note || "")}</textarea>
      </div>
      <button type="submit" class="btn primary">${escapeHtml(eventToEdit ? msg("update") : msg("save"))}</button>
    </form>
  `;
}

function feedFormHtml(eventToEdit = null) {
  const feedType = eventToEdit?.feedType || "bottle";
  return `
    <form class="form" data-form="event-feed">
      ${eventIdInput(eventToEdit)}
      ${dateTimeFields("feed", eventToEdit)}
      <div class="field">
        <label>${escapeHtml(msg("feedType"))}</label>
        <div class="choice-grid">
          <label class="choice-card">
            <input type="radio" name="feedType" value="bottle" ${feedType === "bottle" ? "checked" : ""}>
            <span class="choice-icon feed">${iconSvg("bottle", msg("bottle"))}</span>
            <span>${escapeHtml(msg("bottle"))}</span>
          </label>
          <label class="choice-card">
            <input type="radio" name="feedType" value="breast" ${feedType === "breast" ? "checked" : ""}>
            <span class="choice-icon feed">${iconSvg("breast", msg("breast"))}</span>
            <span>${escapeHtml(msg("breast"))}</span>
          </label>
          <label class="choice-card">
            <input type="radio" name="feedType" value="solids" ${feedType === "solids" ? "checked" : ""}>
            <span class="choice-icon feed">${iconSvg("solids", msg("solids"))}</span>
            <span>${escapeHtml(msg("solids"))}</span>
          </label>
        </div>
      </div>
      <div class="split">
        <div class="field">
          <label for="amountMl">${escapeHtml(msg("amount"))}</label>
          <input id="amountMl" name="amountMl" inputmode="numeric" placeholder="90 ml" value="${escapeHtml(eventToEdit?.amountMl || "")}">
        </div>
      </div>
      <div class="field">
        <label for="feedNotes">${escapeHtml(msg("notes"))} (${escapeHtml(msg("optional"))})</label>
        <textarea id="feedNotes" name="note">${escapeHtml(eventToEdit?.note || "")}</textarea>
      </div>
      <button type="submit" class="btn primary">${escapeHtml(eventToEdit ? msg("update") : msg("save"))}</button>
    </form>
  `;
}

function diaperFormHtml(poopOnly = false, eventToEdit = null) {
  const peeChecked = eventToEdit ? Boolean(eventToEdit.pee) : !poopOnly;
  const poopChecked = eventToEdit ? Boolean(eventToEdit.poop) : poopOnly;
  const consistency = eventToEdit?.consistency || "";
  return `
    <form class="form" data-form="event-diaper">
      ${eventIdInput(eventToEdit)}
      ${dateTimeFields("diaper", eventToEdit)}
      <div class="check-row">
        <label class="check-card">
          <input type="checkbox" name="pee" ${peeChecked ? "checked" : ""}>
          <span>${escapeHtml(msg("pee"))}</span>
        </label>
        <label class="check-card">
          <input type="checkbox" name="poop" ${poopChecked ? "checked" : ""}>
          <span>${escapeHtml(msg("poop"))}</span>
        </label>
      </div>
      <div class="field">
        <label for="consistency">${escapeHtml(msg("consistency"))}</label>
        <select id="consistency" name="consistency">
          <option value="" ${consistency === "" ? "selected" : ""}>${escapeHtml(msg("optional"))}</option>
          <option value="normal" ${consistency === "normal" ? "selected" : ""}>${escapeHtml(msg("normal"))}</option>
          <option value="liquid" ${consistency === "liquid" ? "selected" : ""}>${escapeHtml(msg("liquid"))}</option>
          <option value="hard" ${consistency === "hard" ? "selected" : ""}>${escapeHtml(msg("hard"))}</option>
        </select>
      </div>
      <div class="field">
        <label for="diaperNotes">${escapeHtml(msg("notes"))} (${escapeHtml(msg("optional"))})</label>
        <textarea id="diaperNotes" name="note">${escapeHtml(eventToEdit?.note || "")}</textarea>
      </div>
      <button type="submit" class="btn primary">${escapeHtml(eventToEdit ? msg("update") : msg("save"))}</button>
    </form>
  `;
}

function noteFormHtml(eventToEdit = null) {
  return `
    <form class="form" data-form="event-note">
      ${eventIdInput(eventToEdit)}
      ${dateTimeFields("note", eventToEdit)}
      <div class="field">
        <label for="noteText">${escapeHtml(msg("note"))}</label>
        <textarea id="noteText" name="note" required>${escapeHtml(eventToEdit?.note || "")}</textarea>
      </div>
      <button type="submit" class="btn primary">${escapeHtml(eventToEdit ? msg("update") : msg("save"))}</button>
    </form>
  `;
}

async function addEvent(data) {
  const timestamp = data.timestamp || nowIso();
  const event = {
    ...data,
    timestamp,
    createdBy: state.user.uid,
    createdByName: state.user.displayName || "Gustavo"
  };

  if (state.mode === "demo") {
    state.events = sortEventsDescending([{ id: id(), ...event }, ...state.events]);
    saveDemo();
    render();
    return;
  }

  await fb.addDoc(fb.collection(fb.db, "families", state.familyId, "events"), {
    ...event,
    timestamp: fb.Timestamp.fromDate(new Date(event.timestamp)),
    createdAt: fb.serverTimestamp()
  });
}

async function updateEvent(eventId, data) {
  const timestamp = data.timestamp || nowIso();
  const patch = {
    ...data,
    timestamp
  };

  if (state.mode === "demo") {
    state.events = sortEventsDescending(state.events.map((event) => (
      event.id === eventId ? { ...event, ...patch } : event
    )));
    saveDemo();
    render();
    return;
  }

  await fb.setDoc(fb.doc(fb.db, "families", state.familyId, "events", eventId), {
    ...patch,
    timestamp: fb.Timestamp.fromDate(new Date(timestamp)),
    updatedAt: fb.serverTimestamp()
  }, { merge: true });
}

function timestampFromFormData(data) {
  const selectedDate = dateFromLocalDateTime(data.eventDate, data.eventTime);
  if (Number.isNaN(selectedDate.getTime())) return null;
  return selectedDate.toISOString();
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function safeFilename(value) {
  return String(value || "nana")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "nana";
}

function exportCsv() {
  const headers = [
    "timestamp_iso",
    "date",
    "time",
    "type",
    "label",
    "feed_type",
    "amount_ml",
    "pee",
    "poop",
    "consistency",
    "note",
    "created_by"
  ];
  const rows = sortEventsDescending(state.events).map((event) => {
    const date = dateFromEvent(event);
    return [
      date.toISOString(),
      localDateKey(date),
      localTimeKey(date),
      event.type || "",
      labelFor(event),
      event.feedType || "",
      event.amountMl || "",
      event.pee ? "yes" : "",
      event.poop ? "yes" : "",
	      event.consistency || "",
	      event.note || "",
	      event.createdByName || eventOwner(event)
	    ];
  });
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFilename(state.family?.babyName || msg("appName"))}-${localDateKey(new Date())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function deleteEvent(eventId) {
  if (state.mode === "demo") {
    state.events = state.events.filter((event) => event.id !== eventId);
    saveDemo();
    render();
    return;
  }

  await fb.deleteDoc(fb.doc(fb.db, "families", state.familyId, "events", eventId));
}

async function createFamily(form) {
  const data = Object.fromEntries(new FormData(form));
  const familyId = `nana-${id(6)}`;
  const family = {
    name: data.familyName.trim(),
    babyName: data.babyName.trim(),
    ownerUid: state.user.uid,
    inviteCode: inviteCode()
  };

  if (state.mode === "demo") {
    state.familyId = familyId;
    state.family = family;
    state.events = seedEvents();
    saveDemo();
    render();
    return;
  }

  await fb.setDoc(fb.doc(fb.db, "families", familyId), {
    ...family,
    createdAt: fb.serverTimestamp()
  });
  await fb.setDoc(fb.doc(fb.db, "families", familyId, "members", state.user.uid), {
    displayName: state.user.displayName,
    email: state.user.email,
    photoURL: state.user.photoURL || "",
    role: "owner",
    language: state.lang,
    inviteCode: family.inviteCode,
    joinedAt: fb.serverTimestamp()
  });
  await fb.setDoc(fb.doc(fb.db, "users", state.user.uid), { activeFamilyId: familyId, language: state.lang }, { merge: true });
  await loadFamily(familyId);
}

async function joinFamily(form) {
  const raw = new FormData(form).get("joinCode").trim();
  const [familyId, code] = raw.includes(":") ? raw.split(":") : [raw, ""];
  if (!familyId || !code) {
    state.error = "Use family-id:invite-code";
    render();
    return;
  }

  if (state.mode === "demo") {
    state.familyId = familyId;
    state.family = { name: "Family", babyName: appSettings.defaultBabyName || "Luna", ownerUid: "demo", inviteCode: code };
    state.events = seedEvents();
    saveDemo();
    render();
    return;
  }

  await fb.setDoc(fb.doc(fb.db, "families", familyId, "members", state.user.uid), {
    displayName: state.user.displayName,
    email: state.user.email,
    photoURL: state.user.photoURL || "",
    role: "partner",
    language: state.lang,
    inviteCode: code,
    joinedAt: fb.serverTimestamp()
  });
  await fb.setDoc(fb.doc(fb.db, "users", state.user.uid), { activeFamilyId: familyId, language: state.lang }, { merge: true });
  await loadFamily(familyId);
}

async function loadFamily(familyId) {
  state.error = "";
  state.familyId = familyId;

  if (state.unsubscribeEvents) state.unsubscribeEvents();

  const familySnap = await fb.getDoc(fb.doc(fb.db, "families", familyId));
  if (!familySnap.exists()) {
    state.family = null;
    state.error = "Family not found";
    render();
    return;
  }

  state.family = familySnap.data();
  const q = fb.query(
    fb.collection(fb.db, "families", familyId, "events"),
    fb.orderBy("timestamp", "desc"),
    fb.limit(1000)
  );

  state.unsubscribeEvents = fb.onSnapshot(q, (snapshot) => {
    state.events = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    render();
  });
  render();
}

async function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("nana.lang", lang);
  document.documentElement.lang = lang;
  if (state.mode === "demo") saveDemo();
  if (state.mode === "firebase" && state.user) {
    await fb.setDoc(fb.doc(fb.db, "users", state.user.uid), { language: lang }, { merge: true });
    if (state.familyId) {
      await fb.setDoc(fb.doc(fb.db, "families", state.familyId, "members", state.user.uid), { language: lang }, { merge: true });
    }
  }
  render();
}

async function saveBabyName() {
  const input = document.querySelector('[data-input="babyName"]');
  const babyName = input?.value.trim();
  if (!babyName) return;

  if (state.mode === "demo") {
    state.family.babyName = babyName;
    saveDemo();
    render();
    return;
  }

  await fb.setDoc(fb.doc(fb.db, "families", state.familyId), { babyName }, { merge: true });
  state.family.babyName = babyName;
  render();
}

async function signOutUser() {
  if (state.unsubscribeEvents) state.unsubscribeEvents();
  state.unsubscribeEvents = null;
  state.user = null;
  state.userProfile = null;
  state.family = null;
  state.familyId = null;
  state.events = [];
  if (state.mode === "firebase" && fb?.auth) await fb.signOut(fb.auth);
  state.mode = firebaseConfigured ? "firebase" : "demo-ready";
  render();
}

function startDemo() {
  const saved = JSON.parse(localStorage.getItem("nana.demo") || "null");
  state.mode = "demo";
  state.user = { uid: "demo-user", displayName: "Gustavo", email: "demo@nana.local" };
  state.userProfile = { language: state.lang };
  state.familyId = saved?.familyId || "nana-demo";
  state.family = saved?.family || {
    name: appSettings.defaultFamilyName || "Family",
    babyName: appSettings.defaultBabyName || "Luna",
    ownerUid: "demo-user",
    inviteCode: "DEMO7"
  };
  state.events = saved?.events || seedEvents();
  render();
}

function seedEvents() {
  const base = new Date();
  const make = (hoursAgo, event) => {
    const date = new Date(base);
    date.setMinutes(date.getMinutes() - hoursAgo * 60);
    return {
      id: id(),
      timestamp: date.toISOString(),
      createdBy: event.createdBy || "demo-user",
      createdByName: event.createdByName || "Gustavo",
      ...event
    };
  };

  return [
    make(0.7, { type: "sleep_start" }),
    make(1.3, { type: "feed", feedType: "bottle", amountMl: "90", createdBy: "partner", createdByName: "Ana" }),
    make(2, { type: "diaper", pee: true, poop: true, createdBy: "partner", createdByName: "Ana" }),
    make(3.2, { type: "wake_up" }),
    make(5.4, { type: "sleep_start", createdBy: "partner", createdByName: "Ana" }),
    make(7.1, { type: "feed", feedType: "breast" })
  ];
}

function saveDemo() {
  localStorage.setItem("nana.demo", JSON.stringify({
    familyId: state.familyId,
    family: state.family,
    events: state.events,
    lang: state.lang
  }));
}

async function bootFirebase() {
  if (!firebaseConfigured) {
    render();
    return;
  }

  const [
    appModule,
    authModule,
    firestoreModule
  ] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
  ]);

  const firebaseApp = appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(firebaseApp);
  const db = firestoreModule.getFirestore(firebaseApp);

  fb = {
    auth,
    db,
    GoogleAuthProvider: authModule.GoogleAuthProvider,
    signInWithPopup: authModule.signInWithPopup,
    onAuthStateChanged: authModule.onAuthStateChanged,
    signOut: authModule.signOut,
    doc: firestoreModule.doc,
    setDoc: firestoreModule.setDoc,
    getDoc: firestoreModule.getDoc,
    deleteDoc: firestoreModule.deleteDoc,
    addDoc: firestoreModule.addDoc,
    collection: firestoreModule.collection,
    query: firestoreModule.query,
    orderBy: firestoreModule.orderBy,
    limit: firestoreModule.limit,
    onSnapshot: firestoreModule.onSnapshot,
    serverTimestamp: firestoreModule.serverTimestamp,
    Timestamp: firestoreModule.Timestamp
  };

  fb.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      state.user = null;
      state.family = null;
      state.familyId = null;
      state.events = [];
      state.mode = "firebase";
      render();
      return;
    }

    state.mode = "firebase";
    state.user = {
      uid: user.uid,
      displayName: user.displayName || user.email,
      email: user.email,
      photoURL: user.photoURL
    };

    const userRef = fb.doc(db, "users", user.uid);
    const userSnap = await fb.getDoc(userRef);
    const profile = userSnap.exists() ? userSnap.data() : {};
    state.userProfile = profile;
    if (profile.language) state.lang = profile.language;
    localStorage.setItem("nana.lang", state.lang);
    document.documentElement.lang = state.lang;

    await fb.setDoc(userRef, {
      displayName: state.user.displayName,
      email: state.user.email,
      photoURL: state.user.photoURL || "",
      language: state.lang,
      lastSeenAt: fb.serverTimestamp()
    }, { merge: true });

    if (profile.activeFamilyId) {
      await loadFamily(profile.activeFamilyId);
    } else {
      render();
    }
  });
}

async function signInGoogle() {
  if (!fb) return;
  const provider = new fb.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await fb.signInWithPopup(fb.auth, provider);
}

app.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  try {
    if (action === "lang") await setLanguage(target.dataset.lang);
    if (action === "google") await signInGoogle();
    if (action === "demo") startDemo();
    if (action === "tab") {
      state.tab = target.dataset.tab;
      render();
    }
    if (action === "clear-history-date") {
      state.historyDate = "";
      localStorage.removeItem("nana.historyDate");
      render();
    }
    if (action === "open-sheet") {
      state.sheet = target.dataset.sheet;
      render();
    }
    if (action === "edit-event") {
      state.sheet = `edit:${target.dataset.id}`;
      render();
    }
    if (action === "close-sheet") {
      if (event.target.closest("[data-sheet-panel]") && target.classList.contains("sheet-backdrop")) return;
      state.sheet = null;
      render();
    }
    if (action === "delete-event") await deleteEvent(target.dataset.id);
    if (action === "copy") {
      await navigator.clipboard.writeText(target.dataset.code);
      target.textContent = "✓";
      setTimeout(render, 800);
    }
    if (action === "export-csv") exportCsv();
    if (action === "save-baby") await saveBabyName();
    if (action === "sign-out") await signOutUser();
  } catch (error) {
    state.error = error.message;
    render();
  }
});

app.addEventListener("change", (event) => {
  const target = event.target.closest('[data-action="history-date"]');
  if (!target) return;
  state.historyDate = target.value;
  if (state.historyDate) {
    localStorage.setItem("nana.historyDate", state.historyDate);
  } else {
    localStorage.removeItem("nana.historyDate");
  }
  render();
});

app.addEventListener("submit", async (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();

  try {
    state.error = "";
    if (form.dataset.form === "create-family") await createFamily(form);
    if (form.dataset.form === "join-family") await joinFamily(form);
    if (form.dataset.form === "event-care") {
      const data = Object.fromEntries(new FormData(form));
      const timestamp = timestampFromFormData(data);
      if (!timestamp) return;
      const payload = {
        timestamp,
        note: data.note.trim()
      };
      if (data.eventId) {
        await updateEvent(data.eventId, payload);
      } else {
        await addEvent({ ...payload, type: data.careType });
      }
      state.sheet = null;
      render();
    }
    if (form.dataset.form === "event-feed") {
      const data = Object.fromEntries(new FormData(form));
      const timestamp = timestampFromFormData(data);
      if (!timestamp) return;
      const payload = {
        timestamp,
        feedType: data.feedType,
        amountMl: data.amountMl.trim(),
        note: data.note.trim()
      };
      if (data.eventId) {
        await updateEvent(data.eventId, payload);
      } else {
        await addEvent({ ...payload, type: "feed" });
      }
      state.sheet = null;
      render();
    }
    if (form.dataset.form === "event-diaper") {
      const data = new FormData(form);
      const timestamp = timestampFromFormData(Object.fromEntries(data));
      if (!timestamp) return;
      const pee = data.has("pee");
      const poop = data.has("poop");
      if (!pee && !poop) return;
      const payload = {
        timestamp,
        pee,
        poop,
        consistency: data.get("consistency"),
        note: data.get("note").trim()
      };
      if (data.get("eventId")) {
        await updateEvent(data.get("eventId"), payload);
      } else {
        await addEvent({ ...payload, type: "diaper" });
      }
      state.sheet = null;
      render();
    }
    if (form.dataset.form === "event-note") {
      const data = Object.fromEntries(new FormData(form));
      const timestamp = timestampFromFormData(data);
      if (!timestamp) return;
      const payload = { timestamp, note: data.note.trim() };
      if (data.eventId) {
        await updateEvent(data.eventId, payload);
      } else {
        await addEvent({ ...payload, type: "note" });
      }
      state.sheet = null;
      render();
    }
  } catch (error) {
    state.error = error.message;
    render();
  }
});

if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

document.documentElement.lang = state.lang;
bootFirebase().catch((error) => {
  state.error = error.message;
  render();
});
