# Ticketing staging - Lab L28

Repository autonoma per il laboratorio sul recupero di un rilascio rifiutato.
Lo scenario e' gia' presente sul branch `main`: non devi cambiare branch e non
devi importare file dalla repository L27.

Il provider AI predefinito e' Replay. Non servono chiavi API.

## Requisiti

- Node.js `>=24 <27`
- pnpm `11.5.1`
- Git e un repository GitHub personale
- account Render

## Controllo locale

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm test:e2e
```

## Avvio locale

```bash
pnpm dev:replay
```

Apri:

```txt
http://127.0.0.1:3001/incident.html
```

## Laboratorio

Segui [CONSEGNA.md](./CONSEGNA.md). Il comportamento del primo deploy fa parte
dello scenario: osservalo prima di modificare il progetto.

