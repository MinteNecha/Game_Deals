async function loadGames(){
    const response = await fetch("data.json");
    const games = await response.json();

    return games;
}

async function init(){
    try{
        const games = await loadGames();
        console.log(games);
    }
    catch(error){
        console.error("Failed to load game deals:", error);
    }
}

document.addEventListener("DOMContentLoaded", init);                