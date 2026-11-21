export function getGamesOnSale(games){
    return games.filter(game => game.salePrice < game.normalPrice);
}

export function getDiscountPercentage(game){
    return Math.round((game.normalPrice - game.salePrice)/ game.normalPrice * 100);
}