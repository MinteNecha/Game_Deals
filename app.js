async function loadGames(){
    const response = await fetch("data.json");
    const games = await response.json();
}