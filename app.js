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
        game => 
            `<div class="game-card">
            <p>
            ${game.title} selling for ${game.salePrice} at ${game.store}.
             ${getDiscountPercentage(game) > 0 ? `<span class="tag">ON SALE!</span>`: ""}
            </p>
            </div>`
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