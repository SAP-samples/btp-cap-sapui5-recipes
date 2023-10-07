using t3046.recipe as r from '../db/Recipe';
using t3046.users as u from '../db/Users';

service RecipeService {
    @cds.redirection.target: true
    entity Recipes as projection on r.Recipes;
    entity Users            as projection on u.Users;
    entity Ingredients      as projection on r.Ingredients;
    entity PreparationSteps as projection on r.PreparationSteps;
}
