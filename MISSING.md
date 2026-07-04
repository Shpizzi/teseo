# MISSING — cosa manca per un flusso end-to-end credibile

> Report di chiusura (Step 3 del goal). Fotografia post-implementazione: cosa il prototipo
> ora fa, cosa ancora non esiste, e dove la spina narrativa di Giulia/Roberto si interrompe.
> Riferimento: `AUDIT_PLAN.md` per l'elenco dei problemi trovati e risolti.

## Stato attuale in sintesi

I due journey ora si chiudono **dentro la demo**: Giulia può andare da scan/upload → wizard
validato → conferma con feedback → progetto in lista → tracking con timeline vera → banner
ritiro collegato; Roberto può accettare/rifiutare (con conferma), passare l'ordine allo
slicing col contesto, mandarlo in coda col Play, riordinare la coda e gestire gli stati
delle stampanti. Tutto è però **in-memory**: al reload la demo torna allo stato iniziale
(scelta deliberata, `src/mock/orderStore.ts`).

---

## 1. Schermate / flussi non costruiti

| Cosa manca | Dove spezza il journey | Nota |
|---|---|---|
| **Step di ritiro vero** (QR code / codice ritiro / conferma "Ritirato") | Giulia: il journey finisce su "Vedi dettagli ritiro" → dettaglio progetto. Non esiste il momento fisico del ritiro; lo step "Ritirato" della timeline non diventa mai `done` | È l'ultimo anello del flusso fisico: senza, la storia si ferma al "pronto" |
| **Dashboard impatto lato cliente** (CO₂/€ risparmiati per progetto e cumulativi) | Il goal la nomina come chiusura del journey ("→ dashboard impatto"), ma `/impatto` è solo la pagina pubblica/marketing. In `/app` non c'è nessun KPI di impatto | I numeri della ricerca esistono già (−95% CO₂, −70€, 28Wh vs 2Wh): servirebbe solo una card in dashboard o nel dettaglio progetto completato |
| **Chat lato FabLab** | Roberto non ha una pagina messaggi: "Apri conversazione" è stato convertito in "Scrivi al cliente" (mailto reale) per non lasciare un vicolo cieco | La chat cliente esiste (`/app/messages`); manca la controparte |
| **`/fablab/community`** | Voce rimossa dalla sidebar (portava al lato cliente via catch-all). La pagina è "todo" anche in CLAUDE.md | Da ripristinare in sidebar solo quando esiste la route |
| **Aggiungi stampante** | CTA rimossa (era inerte). Non esiste un flusso di onboarding macchina | Bassa priorità per la demo |
| **Dettaglio progetto storico / ristampa con parametri** | "Ristampa" porta al wizard con il nome del modello, ma non ri-porta materiale/produttore dell'ordine originale | Basterebbe estendere `HistoryProject` con `producerId`/`material` e passarli nello state |
| **Notifiche** | Badge e pannello notifiche rimossi (erano finti). Non esiste un centro notifiche | I toast coprono il feedback immediato; le notifiche persistenti no |

## 2. Stati non gestiti

- **Persistenza**: `orderStore` (accetta/rifiuta/slicing→stampa), riordino coda, stato stampanti,
  messaggi inviati, "salvato" in CommunityDetail e il progetto appena confermato vivono in
  memoria/`location.state` → **si perdono al reload**. Per una demo multi-pagina robusta servirebbe
  `sessionStorage` (una riga per store) o un mock-server.
- **Avanzamento stampa che progredisce**: i `progress` sono statici (84%, 31%). Un timer che
  incrementa i progress renderebbe viva l'euristica #1 senza backend (attenzione al "sapore AI":
  farlo lento e credibile).
- **Slicing → coda**: il Play mette l'ordine `printing` e naviga alla coda, ma l'ordine **non
  compare come riga nuova** in `printQueue` (la coda parte dal mock statico). Serve collegare
  orderStore ↔ printQueue (oggi la coda ha il suo `useState` locale).
- **Ordine annullato dal cliente**: "Annulla ordine" fa toast+navigazione ma il progetto resta
  in lista al rientro (mock statico). Coerente col resto della demo, ma è il punto più visibile
  dove il feedback promette più di quanto lo stato mantenga.
- **Loading/errore di rete**: non esistono (niente API). L'unico loading reale è il download del
  modello CLIP nello scan (gestito) e il GLB nel viewer (gestito).
- **Errore stampa lato cliente**: `ProjectStatus` prevede `error` ma nessun progetto mock lo usa;
  il dettaglio progetto non ha una variante errore ("cosa è andato storto e come rimediare").

## 3. Dati mock assenti o incompleti

- **`conversationId` per p2** (Supporto cuffie / Bovisa): "Contatta produttore" apre la chat sulla
  prima conversazione, non su Bovisa. Manca anche una conversazione per il p2.
- **Orari/indirizzo/stampanti per-produttore**: in `ProduttoreDetail` le 4 `fakePrinters`, l'orario
  e l'indirizzo sono identici per tutti i produttori (hardcoded in pagina).
- **Coda ↔ ordini accettati**: `printQueue` non contiene o2 (Custodia IoT) né gli ordini accettati
  a runtime; o6 (errore) non compare in coda né tra le stampanti come job fallito.
- **Impatto per progetto** (gCO₂, € risparmiati vs ricambio nuovo): non esiste nel mock — serve per
  la dashboard impatto (punto 1).
- **Immagini/thumbnail dei modelli**: tutte le card usano il placeholder `.thumb-mini` o il box
  blueprint; per la credibilità della community servirebbero anteprime distinte.
- **Versioning community**: le versioni sono elencate ma non c'è diff/download per versione, né
  "remix" collegati tra modelli.

## 4. Punti dove la spina narrativa si interrompe ancora

1. **Personas**: il brief nomina **Giulia/Marco/Roberto**, ma l'app impersona "Francesca R."
   (`UserLayout.tsx`) e lato FabLab l'account è "Lambrate" senza persona. Il filo Demogor
   (Francesca cliente ↔ ordine o3 di Lambrate) è coerente, ma non è la storia delle personas.
   → Decisione di branding tua: rinominare l'account demo in Giulia (e un ordine intestato a
   Marco esiste già: o2 "Marco T.") chiuderebbe il cerchio con la ricerca.
2. **Scan → ordine → FabLab**: lo scan sfocia nel preventivo con pezzo+produttore (fatto), ma il
   pezzo scansionato ("Battery cover" ecc.) non diventa un progetto con quel nome nel mock dopo
   la conferma — diventa il progetto evidenziato "Inviato" e poi svanisce al reload (vedi §2).
3. **Cerchio cliente ↔ FabLab**: l'ordine confermato da Giulia non appare tra i "nuovi ordini" di
   Roberto (i due lati leggono mock separati). È la singola aggiunta con più resa narrativa:
   un solo store condiviso ordini cliente↔fablab farebbe vedere in demo *l'intera piattaforma*.
4. **Ritiro**: vedi §1 — ultimo passo fisico assente su entrambi i lati ("Avvisa cliente" c'è,
   "Consegnato/Ritirato" no).

## 5. Segnalazioni fuori scope (non toccate, come da istruzioni)

- **Landing**: lo scroll-print GSAP con pin sticky può rendere lento il primo scroll su macchine
  deboli e "sequestra" lo scroll per molti viewport — da verificare in usabilità. Non corretta.
- **Bundle**: `index.js` ~1.5MB minificato (three + transformers). Un `manualChunks` o lazy-import
  di `/fablab/slicing` e dello scan taglierebbe il first load — refactor non richiesto, non fatto.
- **`IconButton` con badge**: ora quasi inutilizzato dopo la rimozione delle notifiche finte;
  candidato a pulizia futura.

---

## Riepilogo priorità (se si continua)

1. **Store unico ordini cliente↔FabLab + sessionStorage** — chiude il cerchio narrativo (§4.3) e
   la persistenza (§2) in un colpo solo.
2. **Step ritiro** (codice/QR + "Ritirato" in timeline, entrambi i lati) — chiude il journey fisico.
3. **Card impatto in `/app`** — chiude il journey emotivo di Giulia con i numeri della ricerca.
4. Slicing→coda collegati (riga vera in coda), conversazione per p2, personas Giulia/Marco/Roberto.
