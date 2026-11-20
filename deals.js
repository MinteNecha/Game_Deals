export function getGamesOnSale(games){
    return games.filter(game => game.salePrice < game.normalPrice);
}