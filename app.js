import { getDiscountPercentage } from "./deals.js";

async function loadGames(){
    const response = await fetch("data.json");
    const games = await response.json();

    return games;
}

async function init(){
    try{
        const games = await loadGames();
        document.getElementById("games-list").innerHTML = renderGames(games);
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


document.addEventListener("DOMContentLoaded", init);                