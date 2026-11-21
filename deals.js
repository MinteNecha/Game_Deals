export function getGamesOnSale(games){
    return games.filter(game => game.salePrice < game.normalPrice);
}

export function getDiscountPercentage(game){
    return Math.round((game.normalPrice - game.salePrice)/ game.normalPrice * 100);
}

export function findCheapestGame(games){
    return games.reduce(
        function(cheapest, game){
            if(cheapest.salePrice < game.salePrice){
                return cheapest;
            } 
            return game;
        }, games[0]
    )
}

export function searchByTitle(games, query){
    query = query.toLowerCase();
    return games.filter(
            function(game){
                let gameTitle = (game.title).toLowerCase();

                return gameTitle.includes(query);
            }
        )
}