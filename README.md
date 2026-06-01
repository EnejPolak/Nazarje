# Nazarje Dogodki — spletna stran

Single-page spletna stran dogodkov v Nazarjah (React + Vite). Podatki prihajajo iz PHP API na `api.nazarje.si`.

## Zagon

```bash
npm install
cp .env.example .env
npm run dev
```

## Okolje

| Spremenljivka | Opis |
|---------------|------|
| `VITE_API_URL` | Osnovni URL API-ja, npr. `https://api.nazarje.si` |
| `VITE_USE_MOCK=true` | Lokalni seed podatki brez API (opcijsko) |

Na **Vercel** nastavi `VITE_API_URL=https://api.nazarje.si` za produkcijo (`https://dogodki.nazarje.si`).

## Javni API (že na strežniku)

- `GET /events.php` — objavljeni dogodki
- `GET /event.php?id=` ali `?slug=`
- `GET /categories.php`
- `POST /newsletter-subscribe.php` — body `{ "email", "source": "home"|"footer"|"website" }`

## CRM / Admin

Pot: `/admin` → prijava → `/admin/dashboard`

- **Prijava:** `POST /admin-login.php` z `{ email, password }` — token in uporabnik v `localStorage` (`admin_token`, `admin_user`). Prijava vedno kliče realen API (ne mock).
- **Dashboard (read-only):** javni endpointi `GET /events.php`, `GET /event.php?id=…`, `GET /categories.php`. Admin CRUD na strežniku še ni vključen v UI.

Na Vercel in lokalno nastavi `VITE_API_URL=https://api.nazarje.si` (brez končne poševnice).

## CORS

**Lokalno (`npm run dev`):** uporabi `.env.development` (`VITE_API_URL=/api`) — Vite posreduje klice na `api.nazarje.si` brez CORS v brskalniku. Po spremembi `.env` ponovno zaženi dev strežnik.

**Produkcija** (`https://dogodki.nazarje.si`) in **admin poti** (`/admin/events.php`, …): na cPanelu v `api_private/config.php` dodaj origin in obravnavaj `OPTIONS` (preflight), vključno z glavo `Authorization`:

- `http://localhost:5173` (če ne uporabljaš proxyja)
- `https://dogodki.nazarje.si`

Javni endpointi (`events.php`) pogosto že delujejo; admin endpointi pogosto še ne — zato vidiš CORS šele po vrnitvi gumba „Nov dogodek“.

## Build

```bash
npm run build
```
