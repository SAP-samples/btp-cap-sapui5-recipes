namespace t3046.recipe;

using t3046.users as users from './Users';


entity Recipes {
    key ID               : UUID;
        name             : String;
        description      : String;
        estimatedCost    : String;
        difficultyLevel  : String;
        prepTime         : String;
        cookTime         : String;
        totalTime        : String;
        servings         : String;
        dietaryType      : String;
        Author           : Composition of one users.Users;
        source           : String;
        cookingMethod    : String;
        recipeCategory   : String;
        recipeCuisine    : String;
        image            : String;
        imageUrl         : String;
        rating           : String;
        cookNote         : String;        
        parent           : Association to Recipes;
        children         : Composition of many Recipes on children.parent = $self;
        Ingredients      : Composition of many Ingredients
                               on Ingredients.belongsTo = $self;
        PreparationSteps : Composition of many PreparationSteps
                               on PreparationSteps.belongsTo = $self;
}

entity Ingredients @cds.autoexpose{
    key ID        : UUID;
        belongsTo : Association to Recipes;
        name      : String;
        quantity  : Decimal;
        unit      : String; //Refactor: ENUM
}

entity PreparationSteps @cds.autoexpose{
    key ID          : UUID;
        belongsTo   : Association to Recipes;
        order       : Integer;
        description : String;
}
