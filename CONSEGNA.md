# Lab L28 - Recuperare un rilascio rifiutato

## Contesto

Questa repository contiene una nuova release dell'applicazione ticketing. La
pipeline GitHub deve terminare in verde, ma Render non riesce a rendere il
servizio `Live`.

La release include una modifica visibile chiamata **Controllo prima del
salvataggio**. Devi conservarla e pubblicarla correttamente.

## Prima di iniziare

1. Crea una nuova repository GitHub usando questa cartella.
2. Assicurati che sia presente anche `.github/workflows/quality.yml`.
3. Pubblica il contenuto sul branch `main`.
4. Attendi la pipeline `Quality` verde.
5. Su Render crea un nuovo Blueprint collegato a questa repository e a
   `render.yaml`.

Non devi cambiare branch o riutilizzare la repository L27.

## Stato iniziale atteso

Dopo il primo tentativo devi poter osservare:

- GitHub Actions verde;
- Render che prova a distribuire lo stesso commit;
- il deploy che non raggiunge lo stato `Live`;
- log ed eventi sufficienti per individuare la prima fase non riuscita.

Se la pipeline GitHub e' rossa, fermati: non sei ancora nello scenario previsto.

## Obiettivo

Individua la causa del rilascio rifiutato e applica la modifica minima che
consenta a Render di pubblicare la release senza perdere **Controllo prima del
salvataggio**.

Il percorso e la soluzione non sono indicati. Parti dalle evidenze prodotte da
GitHub e Render prima di modificare file.

## Metodo di lavoro

1. Descrivi in una frase risultato atteso e risultato osservato.
2. Individua l'ultima fase riuscita e la prima non riuscita.
3. Formula una sola ipotesi verificabile.
4. Controlla il contratto coinvolto e applica una modifica circoscritta.
5. Esegui i controlli locali, poi commit e push.
6. Verifica nuovamente pipeline, deploy, `/health`, interfaccia e commit remoto.

## Strumenti disponibili

- stato e log di GitHub Actions;
- eventi, log e stato del deploy Render;
- `git diff` e cronologia dei commit;
- endpoint `/health`;
- pagina `/incident.html`;
- `pnpm check`, `pnpm test`, `pnpm test:e2e`;
- `pnpm verify:remote -- <URL_STAGING> <COMMIT_ATTESO>`.

## Vincoli

- conserva **Controllo prima del salvataggio** e il relativo test;
- non disattivare pipeline, controlli di salute o verifica remota;
- non indebolire test o condizioni di accettazione;
- mantieni Replay come provider;
- non aggiungere database gestiti, chiavi o dipendenze;
- limita la patch alla causa dimostrata dalle evidenze.

## Criteri di accettazione

Il laboratorio e' completo quando:

- il commit finale ha una pipeline verde;
- Render mostra il deploy finale come `Live`;
- `/health` espone il commit finale e `provider: replay`;
- **Controllo prima del salvataggio** e' visibile online;
- la feature di sintesi multi-ticket resta utilizzabile;
- `pnpm verify:remote -- <URL_STAGING> <COMMIT_FINALE>` termina in verde;
- sai indicare quale evidenza ha giustificato la modifica.

Non e' richiesto un report separato: repository, pipeline, stato Render e
verifica remota sono le evidenze del lavoro.

