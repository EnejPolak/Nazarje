# Nazarje Dogodki — spletna stran

Single-page spletna stran dogodkov v Nazarjah (React + Vite). Podatki prihajajo iz PHP API na **https://api.nazarje.si**.

> **Backend ni v tem repozitoriju.** PHP API ročno urejaš na cPanelu (`/home/nazarj50/api.nazarje.si/`).

## Zagon

```bash
npm install
cp .env.example .env
npm run dev
```

## Okolje

| Spremenljivka | Dev (`npm run dev`) | Produkcija (Vercel) |
|---------------|---------------------|---------------------|
| `VITE_API_URL` | `/api` (Vite proxy) | `https://api.nazarje.si` |
| `VITE_SITE_URL` | — | `https://dogodki.nazarje.si` |
| `VITE_OBCINA_URL` | — | `https://www.nazarje.si` |
| `VITE_FACEBOOK_URL` | — | URL FB strani (opcijsko) |
| `VITE_INSTAGRAM_URL` | — | URL IG profila (opcijsko) |

Lokalno uporablja `.env.development` z `VITE_API_URL=/api` — klici gredo prek Vite proxyja na `api.nazarje.si` brez CORS napak.

`VITE_USE_MOCK=true` je samo za javni dev brez API-ja. **Admin CRM vedno uporablja realen API.**

## Javni API (api.nazarje.si)

- `GET /events.php` — objavljeni dogodki
- `GET /event.php?id=` ali `?slug=`
- `GET /categories.php`
- `POST /newsletter-subscribe.php` — `{ "email", "source", "gdpr_consent": true }`

## CRM / Admin

Pot: `/admin` → prijava → `/admin/dashboard`

- **Prijava:** `POST /admin-login.php` → Bearer token v `localStorage` (`admin_token`, `admin_user`)
- **Admin klici:** `Authorization: Bearer {token}` na `/admin/*` endpointih
- **CRUD:** `POST/PUT/DELETE /admin/event.php`
- **Upload:** `POST /admin/upload-image.php`, `POST /admin/upload-document.php` (multipart, brez ročnega URL vnosa)

## Build

```bash
npm run build
```

Pred buildom se generira `public/sitemap.xml` z URL-ji dogodkov iz API-ja.

## CORS (cPanel)

V `api_private/config.php` na strežniku dodaj origin `https://dogodki.nazarje.si` in obravnavaj OPTIONS preflight z glavo `Authorization`.
