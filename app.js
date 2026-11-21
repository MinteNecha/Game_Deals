import { getDiscountPercentage, searchByTitle, getGamesOnSale } from "./deals.js";

const cheapSharkLink = "https://www.cheapshark.com/api/1.0/deals?pageSize=12";
const storeNameLink = "https://www.cheapshark.com/api/1.0/stores";
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
            const onSale = getDiscountPercentage(game) > 0;
            return `
            <div class="game-card">
                <div class="card-header">
                    <h2>${game.title}</h2>
                    ${onSale ? `<span class="tag">ON SALE</span>` : ""}
                </div>
                <p class="store">${game.store}</p>
                <p class="price">
                    ${onSale ? `<span class="original-price">R${game.normalPrice}</span>` : ""}
                    <span class="sale-price">R${game.salePrice}</span>
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

function mapCheapSharkDeal(deal, storeLookup){
    return {
        id: deal.dealID,
        title: deal.title,
        normalPrice: parseFloat(deal.normalPrice),
        salePrice: parseFloat(deal.salePrice),
        store: storeLookup[deal.storeID] || "Unknown Store"
        };   
}

async function loadCheapSharkDeals(){
    try {
        const [dealsResponse, storesResponse]  = await Promise.all([fetch(cheapSharkLink), fetch(storeNameLink)]);
        const rawDeals = await dealsResponse.json();
        const rawStores = await storesResponse.json();

        const lookup = storeLookup(rawStores);

        const mappedGames = rawDeals.map(deal => mapCheapSharkDeal(deal, lookup));        document.getElementById("cheapshark-list").innerHTML = renderGames(mappedGames);
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

document.addEventListener("DOMContentLoaded", init);    
document.addEventListener("DOMContentLoaded", loadCheapSharkDeals);
document.getElementById("search-input").addEventListener("input", updateDisplay);
document.getElementById("on-sale-only").addEventListener("change", updateDisplay);            