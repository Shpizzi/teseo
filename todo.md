# TODO — Modifiche da Notion "Site Dashboard" (2026-07-05)

Stato: `[ ]` da fare · `[~]` in corso · `[x]` completato e verificato
> Notion non è accessibile dall'agente: spunta tu le checkbox su Notion usando questo file come riferimento.

## Sito (landing one-page)

- [x] One-page: pulsanti navbar scrollano alle sezioni della pagina
- [x] Navbar: nuovo logo (spirale filo di Arianna / percorso slicer, `TeseoLogo` in LandingChrome)
- [x] Navbar: togliere "Inizia gratis"
- [x] Navbar: lasciare "Accedi" + affianco "Iscrivi il tuo FabLab"
- [x] Hero: oggetti fluttuanti più grandi (~+45%)
- [x] Hero: togliere bottone secondario "Per i FabLab"
- [x] Hero: barra di ricerca sotto la CTA
- [x] Sezione numeri → claim bold "L'82% di chi cerca un ricambio non lo trova." (dato CSV survey)
- [x] Partner: loghi aziende (wordmark testuali: Bialetti, De'Longhi, Smeg… — sostituire con SVG reali quando ci sono)
- [x] Partner: marquee auto-scroll con fade gradiente colore background
- [x] Come funziona: 4 card (Scansiona / Riconoscimento / Seleziona FabLab / Ritira e ripara)
- [x] Come funziona: solo titolo + sottotitolo, niente numeri/stat
- [x] Come funziona: foto al posto delle icone (foto CC da Openverse in public/landing/)
- [x] Strato dopo strato: moka intera visibile, allo scroll si filla SOLO il manico
- [x] Strato dopo strato: via slider laterale e descrizione dinamica → titolo + descrizione statica
- [x] Due destini: bento box con differenza costi (75€ vs 5€, −70€ −95% CO₂)
- [x] Due destini: testimonianza con foto cliente
- [x] Due destini: dati dalla survey CSV (82% / 43% / 64%)
- [x] Due destini: merge sezione "Perché Teseo" nella bento
- [x] Due destini: merge sezione assistente AI nella bento, cancellata quella sotto
- [x] Due destini: CTA a /impatto dopo la bento
- [x] Sezione fablab: mappa reale (MapLibre + OpenFreeMap) con punti FabLab
- [x] Sezione fablab: numeri partecipanti (12 partner · 2.410 utenti · 318 maker)
- [x] Pagina community pubblica: versione light (cerca pezzo → trova → iscriviti)

## Dashboard Privato (/app)

- [x] Dashboard: solo progetti in corso + pronti al ritiro (più easy, via KPI strip)
- [x] Dashboard: togliere mappa produttori
- [x] Dashboard: aggiungere ricerca community (card con input + tag, → /app/community?q=)
- [x] Dashboard: togliere barra in alto (interpretato: KPI strip — screenshot non visibile)
- [x] Topbar stile Shopify oltre alla sidebar (`AppTopbar`)
- [x] Topbar: ricerca con tag fissi/azioni rapide + risultati raggruppati AZIONI/PROGETTI/PEZZI/FABLAB con icone e micro-label
- [x] Topbar: AI spostata in topbar accanto a notifiche/profilo, apre drawer laterale destro
- [x] /app/progetti/:id: back button vero + breadcrumb
- [x] /app/progetti/:id: modello reale di anteprima (/meshes/remote.glb)
- [x] /app/progetti/:id: timeline in evidenza (hero card, step corrente evidenziato, contatore)
- [x] /app/progetti/:id: CTA messaggi in header + in coda alla timeline
- [x] Progetti: toggle vista quadri/lista su entrambe le tab
- [x] Progetti: storico diviso per data (raggruppato per mese)
- [x] Produttori: mappa reale (MapLibre/OpenFreeMap) coi 30 FabLab reali dal KMZ
- [x] Produttori: foto di ogni fablab stile scheda Google Maps
- [x] Produttori: rating fablab per tipologia di materiale
- [x] Produttore detail: tolte stampanti
- [x] Produttore detail: blocco info generale (descrizione, rating materiali, stats, orari, indirizzo)
- [x] Produttore detail: foto header + galleria con foto degli utenti
- [x] Produttore detail: recensioni
- [x] Extra: 4 produttori in evidenza rinominati coi FabLab reali (Tillverka, FabLab Milano, DamA Space, Polifactory) + coordinate/indirizzi reali dal KMZ
- [x] Impatto: stile esempio Tesla (hero numero gigante + equivalenze alberi/km/ricariche + traguardo con progress)
- [x] Impatto: versione short in dashboard
- [x] Community: rinominata "Archivio pezzi" (sidebar + titolo pagina)
- [x] Community: versioning stile GitHub (commit log, fork, badge CORRENTE/IN VALIDAZIONE, contatore fork)
- [x] Community: prototipo upload con modello fake + diff evidenziato stile git (−/+ per proprietà)
- [x] Community: modifica via AI con diff generato dalla richiesta, accetta/pubblica o riprova, max 3 tentativi
- [x] Nuova stampa: anteprima componente 3D + "Annulla, non è questo" / "Conferma, scegli il FabLab" prima della scelta fablab

## Dashboard FabLab (/fablab)

- [x] Funzioni comuni prese dalla dashboard clienti (AppTopbar con ricerca/notifiche/AI + drawer TeseoAssistant)
- [x] Sidebar: tolte Stampanti e Slicing
- [x] Colori diversi: sidebar forest scura + chip "spazio produttore" in topbar
- [x] Coda + Stampanti: unite in "Coda e stampanti" (coda a sinistra, parco stampanti completo a destra)
- [x] Ordini: stesso linguaggio della pagina progetti del cliente (tab a pillola, toggle quadri/lista, card)
- [x] Slicing: interfaccia vera rimossa → pagina coming soon (mantiene ?ordine= dai link esistenti)

## Extra (richieste arrivate in corso)

- [x] KMZ FabLab reali Milano → `src/mock/fablab-milano.ts` (30 lab con coordinate/indirizzi/zone) usato nelle mappe
- [x] Produttori in evidenza rinominati coi lab reali: Tillverka, FabLab Milano, DamA Space, Polifactory
- [x] Logo nella topbar + topbar scura stile Shopify (logo+wordmark+chip a sinistra, search centro con ⌘K, icone destra); brand tolto dalla sidebar desktop
- [x] Viewer 3D: variante `tone="light"` (moss/forest) per le card bianche — prima il wireframe era quasi invisibile
- [x] Dashboard cliente come da mockup: hero centrata "Ciao, Francesca" + barra "Chiedi all'AI" (apre il pannello con la risposta) + subline stato, Nuova stampa in alto a destra, sezione "Eventi community" con 3 card evento in fondo, pagina scrollabile
- [x] Come funziona: card foto+titolo+sottotitolo ma con scorrimento orizzontale pinnato allo scroll verticale (come prima)
- [x] Pannello AI stile Shopify Sidekick: inline accanto al contenuto (che si restringe) con gap visibile, non più overlay; la conversazione resta viva tra apri/chiudi

## Note

- Mappe: `mapcdn.dev` non risolve (DNS) → MapLibre GL + OpenFreeMap (open-source, zero API key)
- Dati survey da CSV (n=100): 82% ricambio introvabile · 43% ha buttato un oggetto per un pezzo · 59% non conosce i FabLab · 64% pagherebbe 5–30€ · 57% ripara per risparmiare
- Foto: CC da Openverse/Flickr in `public/landing/` (card come-funziona, schede fablab, testimonianza) — sostituibili con foto proprie
- Loghi partner in marquee: wordmark testuali (Bialetti, De'Longhi, Smeg…) — sostituire con SVG reali quando ci sono
- "Toglierei anche sopra questa barra": screenshot non visibile → interpretato come la KPI strip della dashboard (rimossa); se intendevi altro, dimmelo
- Verificato: `tsc` pulito, `vite build` ok, screenshot Playwright su landing/dashboard/produttori/detail/fablab + flussi interattivi (anteprima componente, fork AI, ricerca topbar, drawer AI)
