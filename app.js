import { getDiscountPercentage, searchByTitle, getGamesOnSale } from "./deals.js";

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


document.addEventListener("DOMContentLoaded", init);    
document.getElementById("search-input").addEventListener("input", updateDisplay);
document.getElementById("on-sale-only").addEventListener("change", updateDisplay);            