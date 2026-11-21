# Game Deals

A small web app that lists PC game deals, highlights which ones are on
sale, and lets you search and filter through them. Built with vanilla
JavaScript, HTML, and CSS, no frameworks, no build tools.

It also pulls in **live deals from the public [CheapShark API](https://apidocs.cheapshark.com/)**,
converted from USD to Rand using a live exchange rate, with real store
names resolved from CheapShark's stores list.

## Features

- Lists game deals with normal price, sale price, and store
- Automatically tags discounted games with an "ON SALE" badge and shows
  the discount percentage
- Live search by title (case-insensitive)
- "On Sale Only" filter toggle
- A separate section pulling real, live deals from the CheapShark API,
  with real store names and prices converted to Rand
- Responsive card grid layout

## Tech Stack

- Vanilla JavaScript (ES Modules, `async`/`await`, `fetch`)
- HTML5
- CSS3 (Flexbox and Grid)
- No frameworks, no build step, no dependencies to install

## Project Structure

```
game-deals/
├── index.html       # Page structure
├── style.css        # Styling
├── data.json        # The hardcoded source game data
├── deals.js         # Pure logic: filtering, discount calculation,
│                     # cheapest game, and title search
└── app.js           # Data fetching, CheapShark integration, and rendering
```

## Getting Started

This project loads data with `fetch()`, which browsers block when opening
the HTML file directly from disk (`file://`). Run it through a local
server instead:

**Option A: VS Code Live Server extension**
1. Install the "Live Server" extension.
2. Right-click `index.html` → "Open with Live Server".

**Option B: Python's built-in server**
```bash
cd game-deals
python -m http.server
```
Then open `http://localhost:8000` in your browser.

## How It Works

- `data.json` holds the base set of game deals, loaded via `fetch()` on
  page load.
- `deals.js` exports small, pure functions (`getGamesOnSale`,
  `getDiscountPercentage`, `findCheapestGame`, `searchByTitle`) that take
  data in and return data out, with no dependency on the DOM.
- `app.js` wires everything together: it loads the data, listens for
  search/filter input, and renders the results using the functions from
  `deals.js`.
- The CheapShark section fetches live deals and store data from the
  CheapShark API, maps the raw response into the same shape as the local
  data, converts prices to Rand using a live exchange rate (with a fixed
  fallback rate if that request fails), and renders it using the exact
  same rendering function as the main list.

## Credits

- Game deal data aggregated via the free [CheapShark API](https://www.cheapshark.com/api)
- Live exchange rates via [open.er-api.com](https://www.exchangerate-api.com/docs/free)