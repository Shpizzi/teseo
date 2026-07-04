# AUDIT_PLAN — Flussi e processi delle due dashboard (Nielsen + UX)

> Step 1 del goal: solo audit, zero codice UI. Ogni finding ha severità, euristica di Nielsen (E1–E10),
> riferimento `file:linea` verificato nel codice, e fix proposto. L'estetica blueprint/spade, il brand
> copy e la landing sono fuori scope e non vengono toccati.

---

## Sintesi esecutiva

I due lati sono visivamente completi ma **i flussi non si chiudono mai**: le azioni core sono bottoni
senza handler. Il journey di Giulia si spezza in 4 punti chiave (scan→ordine, conferma→tracking,
pronto→ritiro, chat) e quello di Roberto in 3 (accetta/rifiuta, slicing→coda, pronto→consegna).
Il secondo problema sistemico è la **verità multipla**: conteggi hardcoded che contraddicono i mock
(tre versioni diverse del parco stampanti, tre versioni dei "modelli salvati").

**Problemi per categoria:**

| Categoria | Cliente | FabLab |
|---|---|---|
| Dead-end (CTA senza effetto) | 9 | 9 |
| Stato falso / dati incoerenti (E1) | 8 | 7 |
| Contesto perso tra step (E6) | 3 | 2 |
| Azioni irreversibili senza conferma (E5) | 2 | 3 |
| Label incoerenti (E4) | 4 | 5 |
| Empty state mancanti (E10) | 3 | 3 |
| Bug di correttezza (hover bianco-su-bianco) | 2 | 1 |

---

## Temi trasversali (fix una volta, vale ovunque)

| # | Problema | Dove | Fix proposto |
|---|---|---|---|
| T1 | **`SearchBar` decorativa**: il componente non ha `value`/`onChange` (`src/components/SearchBar.tsx`) — ogni ricerca/filtro in entrambi i lati è finta | Dashboard×2, Ordini, NuovaStampa step 2, Salvati, Community, Produttori | Aggiungere props controlled al componente; collegare il filtro dove ha senso (liste), rimuoverla dove non serve (E8) |
| T2 | **Bug hover bianco-su-bianco**: `onMouseLeave` imposta `background:'#fff'` su bottoni forest → dopo il primo hover testo bianco su fondo bianco | `ProgettoDetail.tsx:144`, `Messaggi.tsx:236`, `OrdineDetail.tsx:190` | Ripristinare `var(--forest)` |
| T3 | **Nessun sistema di feedback**: non esiste un toast/conferma riusabile → "Conferma ordine", "Accetta", "Rifiuta" ecc. non possono dare riscontro (E1/E4) | entrambi i lati | Un componente `Toast` minimale (mono, pill spade) + un pattern conferma-inline per azioni distruttive (E5). Unica aggiunta al design system, nello stile esistente |
| T4 | **Conteggi hardcoded vs mock**: sottotitoli e KPI sono stringhe fisse che contraddicono i dati renderizzati sotto | vedi finding per pagina | Derivare tutti i conteggi da `src/mock/*`; KPI calcolati, non stringhe |
| T5 | **Vocabolario stati non unificato**: `completed/cancelled` fuori da `StatusPill`; timeline con step diversi per lo stesso flusso ("In valutazione" vs "Accettato"); pausa renderizzata come errore | `Progetti.tsx:161`, `fablab-pages.ts:27,42`, `Coda.tsx:142` | Un solo vocabolario: Ricevuto → Accettato → In stampa → Pronto → Ritirato; estendere `StatusPill` con le varianti mancanti |
| T6 | **Empty state assenti ovunque** (E10) | filtri Community/Produttori, tab Ordini, coda | Pattern unico: messaggio + azione ("Nessun modello in questa categoria — Azzera filtro") |

---

## LATO CLIENTE — journey di Giulia

**Journey atteso:** guasto → scan/upload → riconoscimento → pezzo → produttore → preventivo/conferma → tracking → ritiro → impatto.

### C0 · Navigazione (UserLayout + Sidebar)

- **[ALTA] [E3/E7]** Profilo irraggiungibile: `/app/profile` e `/app/messages` senza voce in sidebar (`UserLayout.tsx:14-20`); il blocco utente ha `cursor:pointer` ma nessun `onClick` (`Sidebar.tsx:163-172`). → Fix: onClick sul blocco utente → profilo; voce "Messaggi" con `badge` (prop già esistente in `Sidebar.tsx:9`, mai usata) alimentato da `unread`.
- **[BASSA] [E4]** Route `/app/messages` in inglese, unica non italiana (`App.tsx:47`).

### C1 · Dashboard (`pages/user/Dashboard.tsx`)

- **[ALTA] [E3]** "Prenota ritiro" senza onClick (`Dashboard.tsx:317-322`): il banner crea urgenza ("fino a venerdì 18:00") ma la CTA è morta. → Fix: naviga al progetto pronto con stato ritiro visibile.
- **[ALTA] [E1/E4]** Verità multiple: sottotitolo hardcoded "2 STAMPE IN CORSO · 1 PRONTO AL RITIRO" (`:52`); KPI "01 Pronti al ritiro" ma **nessun progetto `ready`** nel mock (`mock/index.ts:33-61`); il banner cita "Ricambio cardine finestra" che nel mock è nello storico, completato (`user-pages.ts:14`). → Fix: aggiungere un progetto `ready` coerente nel mock e derivare i conteggi.
- **[MEDIA] [E4]** "STORICO ›" (`:140`) atterra sulla tab "In corso" di Progetti. → Fix: deep-link alla tab storico.
- **[BASSA] [E7]** KPI non cliccabili ("01 In attesa di produttore" è l'ingresso naturale per completare la bozza). → Fix: onClick verso la vista pertinente.

### C2 · Progetti (`pages/user/Progetti.tsx`)

- **[ALTA] [E1/E6]** **La bozza sparisce**: il filtro `p.status !== 'draft' || p.fablab` (`:15`) esclude p3, che non è nemmeno nello storico → "Vaso parametrico" esiste solo in Dashboard. Il journey "bozza → trova produttore" non ha casa. → Fix: bozze in "In corso" con CTA "Trova produttore" → `/app/new` step 2.
- **[ALTA] [E3]** Card storico senza onClick (`:124-147`): niente dettaglio, niente ristampa — il caso d'uso più frequente di Giulia. → Fix: card cliccabile + CTA "Ristampa" che entra in `/app/new` col contesto.
- **[MEDIA] [E1]** Conteggi hardcoded "4 TOTALI · 2 IN LAVORAZIONE" (`:38`), tab "In corso 2 / Storico 3" (`:62-65`). → Fix: `length` reali (T4).
- **[MEDIA] [E4]** Pill inline `completed/cancelled` fuori da `StatusPill` (`:161-164`) (T5).

### C3 · Dettaglio progetto (`pages/user/ProgettoDetail.tsx`)

- **[ALTA] [E1]** Timeline hardcoded module-level (`:9-14`): ogni progetto — bozza inclusa — mostra "Accettato da FabLab Lambrate / In stampa". → Fix: timeline per-progetto nel mock, derivata dallo status.
- **[ALTA] [E1]** Doppio avanzamento in conflitto: colonna sinistra `project.progress` (84%, `:100`), badge centrale `viewerProgress` dell'animazione 3D (`:190,229-231`). Due percentuali per la stessa stampa. → Fix: pilotare il viewer con `project.progress` o togliere il numero dal badge.
- **[ALTA] [bug]** Hover bianco-su-bianco su "Contatta produttore" (`:144`) (T2).
- **[MEDIA] [E2/E1]** Aprendo la bozza p3: timeline "In stampa" e CTA "Contatta produttore" con `fablab:''` — stato falso, CTA impossibile. → Fix: variante draft con CTA "Scegli produttore".
- **[MEDIA] [E3]** Nessuna azione "Annulla ordine" da nessuna parte: zero controllo su un ordine inviato. → Fix: azione con conferma (E5).
- **[MEDIA] [E6]** "Contatta produttore" (`:124`) → `/app/messages` generico, senza aprire la conversazione del progetto. → Fix: deep-link alla conversazione.
- **[MEDIA] [E3]** Nome FabLab stilizzato da link (`:94`) ma senza onClick. → Fix: naviga a `/app/produttori/:id` (serve `producerId` nel mock).
- **[MEDIA] [E1]** Costo "€ 12.80" e data "15 mag 2025" hardcoded per tutti (`:112,118`). → Fix: per-progetto nel mock.
- **[BASSA] [E9]** "Progetto non trovato" senza CTA di ritorno (`:23-28`; idem `CommunityDetail.tsx:14`, `ProduttoreDetail.tsx:20`). → Fix: "← Torna ai progetti".

### C4 · Nuova stampa (`pages/user/NuovaStampa.tsx`) — cuore del journey

- **[ALTA] [E5]** Validazione assente: "Avanti →" sempre abilitato senza file (`:184`); a step 3 il placeholder `fileName || 'modello.stl'` (`:322`) maschera l'assenza → si può confermare un ordine di niente. → Fix: Avanti disabilitato finché manca il file; niente placeholder.
- **[ALTA] [E1/E4]** "Conferma ordine" = `navigate('/app/progetti')` secco (`:401-403`): nessun toast "Ordine confermato", nessun nuovo progetto in lista — l'ordine svanisce. → Fix: toast di successo (T3) + il progetto compare/viene evidenziato in lista.
- **[ALTA] [E6]** Contesto perso in ingresso: arrivando da Community ("Stampa questo", `Community.tsx:197`), CommunityDetail (`:155`) o ProduttoreDetail (`:124`), il wizard riparte da zero — modello non precaricato, produttore non preselezionato. → Fix: leggere `location.state` (modello/produttore) e precompilare gli step.
- **[MEDIA] [E5]** Produttore preselezionato in silenzio = fab1 che è `available:false` (`:14` + `user-pages.ts:37`). → Fix: nessuna preselezione; i non disponibili non selezionabili o con avviso.
- **[MEDIA] [E3]** Nessun "Annulla" esplicito nel wizard (`:75-83`): l'unica uscita è la sidebar. → Fix: "Annulla" in topbar con ritorno alla provenienza.
- **[MEDIA] [E2]** Materiale/infill del riepilogo (`:324-326`) mai scelti dall'utente: il preventivo appare dal nulla. → Fix minimo: riga "Parametri consigliati da TESEO" (riconoscere, non ricordare).

### C5 · Scan (`scan/ScanView.tsx`)

Buona visibilità di stato (progress, demo fallback, uscite presenti). Ma:

- **[ALTA] [E3/E6]** Fase `match`: "Richiedi" senza onClick (`:376`) — lo sbocco scan → ordine è un vicolo cieco; il contesto raccolto (oggetto, pezzo, materiale) muore lì. → Fix: naviga al wizard con pezzo+contesto in `state`.
- **[MEDIA] [E3]** "Genera con AI" nel result senza onClick (`:309`) mentre altrove funziona. → Fix: `setPhase('ai-generate')`.
- **[BASSA] [E2]** Copy di sistema: "NODI COMPATIBILI" (`:354`), "bounty all'esperto" (`:337,382`). → Fix: "FabLab compatibili", "chiedi a un esperto della community".

### C6 · Salvati (`pages/user/Salvati.tsx`)

- **[ALTA] [E3/E7]** Card con `cursor:pointer` (`:51`) ma inerti, nessuna CTA "Stampa": la collezione non serve a niente. → Fix: CTA "Stampa questo modello" → `/app/new` col modello (stesso pattern di Community).
- **[MEDIA] [E4]** "Aggiungi" chiama `setQuery('')` (`:25`): CTA primaria finta. → Fix: rimuovere o dare destinazione.
- **[MEDIA] [E1]** "128 MODELLI" hardcoded (`:20`) vs 6 nel mock vs KPI "06" (T4).

### C7 · Community + CommunityDetail

- **[MEDIA] [E10]** Categorie 'Meccanica', 'Gaming', 'Elettronica' senza modelli nel mock → griglia vuota senza messaggio (`Community.tsx:8`). → Fix: empty state + reset filtro (T6).
- **[MEDIA] [E3]** "Salva modello" senza onClick né feedback (`CommunityDetail.tsx:158-186`). → Fix: toggle salvato + feedback.
- **[BASSA] [E4]** Quattro label per la stessa destinazione: "Stampa questo" / "Stampa questo modello" / "Invia richiesta di stampa" / "Nuova stampa". → Fix: uniformare su "Stampa questo modello".

### C8 · Produttori + ProduttoreDetail

- **[MEDIA] [E10]** Combinazioni filtri (SLA + "< 2 km") → lista vuota senza empty state (`Produttori.tsx:17-27`) (T6).
- **[MEDIA] [E6]** "Avvia chat" (`ProduttoreDetail.tsx:265`) → `/app/messages` senza aprire la conversazione. → Fix: deep-link.
- **[BASSA] [E1]** `fakePrinters` identiche per ogni produttore, orari/indirizzo identici (`ProduttoreDetail.tsx:7-12,253-260`).

### C9 · Messaggi (`pages/user/Messaggi.tsx`)

- **[ALTA] [E1/E3]** "Invia" senza onClick (`:217-240`): scrivi e non succede nulla. → Fix: append locale in state + clear input.
- **[MEDIA] [E1]** Aprire la conversazione non azzera `unread` (`:87-102`). → Fix: state locale.
- **[BASSA] [E2]** Pill "ATTIVO" ambigua (`:137`). → Fix: "Online" o rimuovere.

### C10 · Profilo (`pages/user/Profilo.tsx`)

- **[ALTA] [E5]** "Elimina account" senza conferma (`:200-216`). → Fix: conferma inline/dialog.
- **[MEDIA]** Pagina irraggiungibile (vedi C0); "Cambia password" inerte (`:193`).
- **[BASSA] [E1]** "03 stampe attive · 128 modelli salvati · 8 community" (`:95`): terza versione dei numeri (T4).

---

## LATO FABLAB — flusso di Roberto (power user)

**Flusso atteso:** ordini in arrivo → accetta/rifiuta → slicing → coda → produzione → pronto/ritiro → parco stampanti.

### F0 · Navigazione (FablabLayout + FablabSlicingLayout)

- **[ALTA] [E3/E4]** Voce sidebar "Community" → `/fablab/community`, route inesistente: il catch-all (`App.tsx:61`) **espelle Roberto sulla dashboard del cliente** (`FablabLayout.tsx:21`, `FablabSlicingLayout.tsx:18`). → Fix: rimuovere la voce (la pagina è todo in CLAUDE.md).
- **[MEDIA] [E1]** Badge "Ordini" hardcoded `badge: 2` (`FablabLayout.tsx:17`). → Fix: derivare da `fablabOrders.filter(o => o.status==='new').length`.

### F1 · Dashboard (`pages/fablab/Dashboard.tsx`)

- **[ALTA] [E1/E5]** "Rifiuta" fa solo `stopPropagation` (`:108-123`): zero effetto, zero conferma per un'azione irreversibile. → Fix: conferma inline + rimozione dalla lista + toast "Ordine rifiutato".
- **[ALTA] [E4/E2]** "Accetta" non accetta: naviga al dettaglio (`:125`). La label promette un'azione che non avviene. → Fix: accetta davvero (stato → toast "Ordine accettato").
- **[ALTA] [E1/E4]** **Tre verità sul parco stampanti**: ring "8/12, 66% utilizzo" hardcoded (`:515-536`), lista sotto con `fablabPrinters` (4, 2 attive), pagina Stampanti con `printersFull` (6). → Fix: un'unica lista (`printersFull`), tutto derivato.
- **[ALTA] [E1]** KPI scollegati: "05 in stampa" (mock: 2), "08 in attesa di slicing" (coda: 3), "02 da consegnare" (ready: 1) (`mock/index.ts:149-154`). → Fix: KPI calcolati.
- **[MEDIA] [E1/E9]** "Avvisa" (`:165-180`) e "Risolvi" (`:185-200`) senza onClick: gli ultimi passi del journey (pronto→ritiro, recupero errore) non esistono. → Fix: "Avvisa" → toast "Cliente avvisato"; "Risolvi" → dettaglio con errore in evidenza.
- **[MEDIA] [E8]** CTA primaria della topbar è "Esporta report" (inerte, `:269-272`) mentre il lavoro urgente (2 nuovi ordini, 1 errore) non ha CTA. Gerarchia invertita. → Fix: CTA → nuovi ordini; esporta secondaria.
- **[MEDIA] [E1]** Sottotitolo task-first hardcoded "2 NUOVI ORDINI…" (`:261`): oggi coincide, ma è statico. → Fix: derivarlo — è la riga più importante della pagina, deve essere vera.
- **[BASSA] [a11y]** "VISTA CODA ›" e "GESTISCI ›" sono `span` con onClick (`:355-367`, `:470-482`). → Fix: `<button>`/`<Link>`.

### F2 · Ordini (`pages/fablab/Ordini.tsx`)

- **[ALTA] [E1/E5]** "Accetta"/"Rifiuta" senza onClick (`:196-210`): la coppia di azioni core è inerte anche qui, rifiuto senza conferma. → Fix: stato locale condiviso + conferma su rifiuto + toast coerenti.
- **[MEDIA] [E7]** Zero strumenti power user: niente selezione multipla, niente bulk, niente sort; i tab sono l'unico filtro (`:86-118`). → Fix minimo: checkbox + "Accetta selezionati".
- **[MEDIA] [E2/E4]** Colonna "Scadenza" con valori che non sono scadenze: `deadlineLabel: 'pronto'`, `'errore materiale'` (`mock/index.ts:138-139`); formati misti ("⚡ ENTRO 3H" / "entro 3 giorni" / "oggi"). → Fix: normalizzare i label nel mock.
- **[MEDIA] [E1]** "6 TOTALI · 2 NUOVI" hardcoded (`:72`); "Esporta lista" e SearchBar inerti (`:76-80`).
- **[BASSA]** `OrderStatusPill` reimplementata inline (`:41-46`); `DeadlineChip` copiato in 3 file. → Fix: estrarre/riusare (T5).

### F3 · Dettaglio ordine (`pages/fablab/OrdineDetail.tsx`)

- **[ALTA] [E1]** Avanzamento inventato: `useState(62)` (`:44`) mostra "62%" **anche per un ordine nuovo mai accettato**. → Fix: progress solo se `status==='printing'`, da `order.progress`.
- **[ALTA] [E6/E4]** "Avvia stampa" → `/fablab/slicing` senza passare l'ordine (`:188`): lo slicing mostra sempre "DEMOGOR". Inoltre la CTA è identica per ogni status: per un `new` l'azione giusta è "Accetta". → Fix: CTA condizionale allo status + `?ordine=id` allo slicing.
- **[ALTA] [E5]** "Rifiuta ordine" senza onClick né conferma (`:194-200`).
- **[ALTA] [bug]** Hover bianco-su-bianco sul bottone primario (`:190`) (T2).
- **[MEDIA] [E3]** "Apri conversazione" inerte (`:357-364`): non esiste chat lato FabLab. → Fix: vedi MISSING; nel frattempo rimuovere o degradare.
- **[MEDIA] [dati]** `orderDetails` copre solo o1 e o3 (`fablab-pages.ts:17-46`): o2/o4/o5/o6 → "Ordine non trovato". → Fix: completare il mock.
- **[BASSA] [E4]** Timeline con vocabolari diversi: o1 "In valutazione", o3 "Accettato" (T5).

### F4 · Coda (`pages/fablab/Coda.tsx`)

- **[ALTA] [E7/E1]** Riordino inerte: `ArrowUp/ArrowDown` senza handler né `<button>` (`:132-135`). La funzione-firma della pagina per il power user non esiste. → Fix: bottoni veri che scambiano `position` in state.
- **[MEDIA] [E3/E6]** Righe con hover da cliccabile (`:76-83`) ma senza onClick: dalla coda non si arriva al dettaglio ordine. → Fix: naviga a `/fablab/ordini/:id` (serve mapping ordNum→id nel mock).
- **[MEDIA] [E2/E1]** "Ottimizza coda" senza onClick né spiegazione (`:27-38`). → Fix: riordino per scadenza + toast "Coda riordinata per scadenza" (o rimuovere).
- **[MEDIA] [E4]** "In pausa" usa la pill di errore `sp-err` (`:142`): pausa ≠ errore (T5).
- **[MEDIA] [E1]** "5 ELEMENTI · 2 IN STAMPA" (`:23`) e "ETA ~14h 30m" (`:159`) hardcoded. → Fix: derivare da `printQueue`.
- **[BASSA] [E4]** Utilizzo 33% qui (`:184-194`) vs 66% in dashboard: stessa metrica, due valori (risolto da F1).

### F5 · Stampanti (`pages/fablab/Stampanti.tsx`)

- **[MEDIA] [E3/E9]** "Gestisci" senza onClick su ogni card (`:177-187`). Per pr4 in errore il messaggio dice già il rimedio ("sostituire filamento" — bene E9) ma non c'è azione. → Fix: su errore la CTA diventa "Segna risolto"; altrove rimuovere o dare destinazione.
- **[MEDIA] [E4]** `maintenance` cade nel ramo errore del dot (`:21-25`) mentre la pill dice "Manutenzione"; label non allineate con la dashboard ("Inattiva" vs "IDLE"). → Fix: dot dedicato + vocabolario unico (T5).
- **[BASSA] [E1/E7]** "+ Aggiungi stampante" inerte (`:50-52`); sottotitolo hardcoded (`:46`); counter in alto non cliccabili come filtri (`:82-98`).

### F6 · Slicing (`pages/fablab/Slicing.tsx`)

- **[ALTA] [E6]** Pagina scollegata dal flusso: nessun ordine in ingresso, "FIG. 01 — DEMOGOR" hardcoded (`:133`). Arrivando da "Avvia stampa" sull'Ingranaggio si slice-a il Demogor. → Fix: accettare `?ordine=id` e mostrare nome/ordNum reali.
- **[ALTA] [E1/E3]** Il Play (`:569-583`) non ha onClick: il passo finale slicing→coda non esiste; nessuna uscita esplicita dal flusso. → Fix: Play → toast "In coda su [stampante]" + navigate a `/fablab/coda`.
- **[MEDIA] [E1]** "AVANZAMENTO STAMPA 62%" (`:483-553`) in una pagina di **preparazione**: la stampa non è iniziata. → Fix: label "Anteprima layer" o rimuovere il numero.
- **[MEDIA] [E4]** Due toggle indipendenti per lo stesso concetto: `aiMode` (`:351`) e `dockAi` (`:637`) possono contraddirsi. → Fix: un solo stato.
- **[BASSA] [E2]** Icone preset senza semantica ("Tecnico"=X, "Bozza"=Plus, `:63-64`); controlli decorativi senza handler (`:171-191`, `:386-397`, `:586-622`).

---

## Coerenza narrativa cross-side

Il filo "Demogor" regge (cliente Francesca R. lato utente = customer di o3 lato FabLab), ma il brief
nomina **Giulia/Marco/Roberto** mentre l'app impersona "Francesca R." (`UserLayout.tsx:41`).
Non lo cambio in Step 2 (è brand/narrativa, decidi tu) — lo segnalo in MISSING.md.

---

## Piano di implementazione proposto (Step 2, dopo il tuo ok)

Piccoli commit, prima cliente poi FabLab. Solo componenti esistenti + un `Toast` minimale (T3).

**Fase 0 — Fondamenta trasversali** (1–2 commit)
1. Fix bug hover bianco-su-bianco (3 file) — correttezza pura.
2. `Toast` component (mono/spade, nessun colore nuovo) + `SearchBar` controlled.
3. Mock: progetto `ready` coerente, `producerId`/`conversationId`/timeline/costo per-progetto, `orderDetails` completi, mapping ordNum→id, `deadlineLabel` normalizzati, una sola lista stampanti, KPI derivati.

**Fase 1 — Cliente** (un commit per schermata, ordine = journey)
4. NuovaStampa: validazione step 1, contesto in ingresso da `location.state`, "Annulla", niente preselezione produttore non disponibile, "Conferma ordine" → toast + progetto in lista.
5. Scan: "Richiedi" → wizard con contesto; "Genera con AI" collegato; copy funzionale ("FabLab compatibili").
6. Progetti + ProgettoDetail: bozza visibile con CTA "Trova produttore", storico cliccabile + "Ristampa", timeline/costo per-progetto, viewer pilotato dal progress reale, "Annulla ordine" con conferma, deep-link chat e produttore.
7. Dashboard: conteggi derivati, "Prenota ritiro" collegato, deep-link storico.
8. Salvati/Community/Produttori: card attive, label uniformata "Stampa questo modello", empty state, "Salva modello" funzionante.
9. Messaggi + Profilo: "Invia" funzionante, unread azzerato, voci in sidebar, conferma su "Elimina account".

**Fase 2 — FabLab** (un commit per schermata)
10. Sidebar: via "Community", badge ordini derivato.
11. Ordini + Dashboard: Accetta/Rifiuta reali con stato condiviso, conferma su rifiuto, toast coerenti, KPI e stampanti derivati da un'unica fonte, CTA topbar → nuovi ordini, bulk "Accetta selezionati" (E7).
12. OrdineDetail: CTA condizionale allo status, progress reale, passaggio contesto a Slicing.
13. Slicing: ordine in ingresso via query param, Play → coda con toast, un solo toggle AI, "Anteprima layer".
14. Coda: riordino reale, righe → dettaglio, "Ottimizza" = sort per scadenza, pill pausa corretta, header derivato.
15. Stampanti: "Segna risolto" su errore, dot manutenzione, vocabolario stati unico.

**Fase 3 — Report:** `MISSING.md`.

**Cosa NON tocco:** landing e pagine pubbliche, GSAP, palette/tipografia/design system, brand copy,
nessuna nuova route, niente mobile, nessuna nuova dipendenza.

---

*Audit basato su lettura integrale del codice al commit `18a2fdc` (+ modifiche working tree). Ogni riferimento file:linea è stato verificato.*
