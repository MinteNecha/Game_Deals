import { getDiscountPercentage, searchByTitle, getGamesOnSale } from "./deals.js";

const cheapSharkLink = "https://www.cheapshark.com/api/1.0/deals?pageSize=12";
const storeNameLink = "https://www.cheapshark.com/api/1.0/stores";
const currencyUSRate = "https://open.er-api.com/v6/latest/USD";
const FALLBACK_USD_TO_ZAR = 18;
let allGames = [];

async function loadGames(){
    const response = await fetch("data.json");
    const games = await response.json();

    return games;
}

async function init(){
    try{
        allGames = await loadGames();
        updateDisplay();
    }
    catch(error){
        console.error("Failed to load game deals:", error);
    }
}

function renderGames(games){
    return games.map(
        game => {
            const discount = getDiscountPercentage(game);
            const onSale = discount > 0;
            return `
            <div class="game-card">
                <div class="card-header">
                    <h2>${game.title}</h2>
                    ${onSale ? `<span class="tag">ON SALE</span>` : ""}
                </div>
                <p class="store">${game.store}</p>
                <p class="price">
                    ${onSale ? `<span class="original-price">R${game.normalPrice.toFixed(2)}</span>` : ""}
                    <span class="sale-price">R${game.salePrice.toFixed(2)}</span>
                    ${onSale ? `<span class="discount">(${discount}% off)</span>` : ""}
                </p>
            </div>`;
        }
        ).join("");
}

function updateDisplay(){
        let query = document.getElementById("search-input").value;
        let onlyOnSale = document.getElementById("on-sale-only").checked;

        let filteredGames = allGames;

        if(query !== ""){
            filteredGames = searchByTitle(allGames, query);
        }
        if(onlyOnSale){
            filteredGames = getGamesOnSale(filteredGames);
        }

        document.getElementById("games-list").innerHTML = renderGames(filteredGames);
}

function mapCheapSharkDeal(deal, storeLookup, exchangeRate){
    return {
        id: deal.dealID,
        title: deal.title,
        normalPrice: Math.round(parseFloat(deal.normalPrice) * exchangeRate * 100) / 100,
        salePrice: Math.round(parseFloat(deal.salePrice) * exchangeRate * 100) / 100,
        store: storeLookup[deal.storeID] || "Unknown Store"
    };
}

async function loadCheapSharkDeals(){
    try {
        const [dealsResponse, storesResponse, exchangeRate]  = await Promise.all([fetch(cheapSharkLink), fetch(storeNameLink), getExchangeRate()]);
        const rawDeals = await dealsResponse.json();
        const rawStores = await storesResponse.json();

        const lookup = storeLookup(rawStores);

        const mappedGames = rawDeals.map(deal => mapCheapSharkDeal(deal, lookup, exchangeRate));        document.getElementById("cheapshark-list").innerHTML = renderGames(mappedGames);
    } catch (error) {
        console.error("Failed to load CheapShark deals:", error);
    }
}

function storeLookup(stores){
    return stores.reduce(function (accumulator, store) {
        accumulator[store.storeID] = store.storeName;
        return accumulator;
    }, {});
}

async function getExchangeRate(){
    try {
        const response = await fetch(currencyUSRate);
        const data = await response.json();
        return data.rates.ZAR;
    } catch (error) {
        console.error("Failed to fetch exchange rate, using fallback:", error);
        return FALLBACK_USD_TO_ZAR;
    }
}

document.addEventListener("DOMContentLoaded", init);    
document.addEventListener("DOMContentLoaded", loadCheapSharkDeals);
document.getElementById("search-input").addEventListener("input", updateDisplay);
document.getElementById("on-sale-only").addEventListener("change", updateDisplay);            