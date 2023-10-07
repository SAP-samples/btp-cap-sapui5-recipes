using RecipeService as service from '../../srv/recipe-service';

annotate service.Recipes with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'description',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : 'estimatedCost',
            Value : estimatedCost,
        },
        {
            $Type : 'UI.DataField',
            Label : 'difficultyLevel',
            Value : difficultyLevel,
        },
        {
            $Type : 'UI.DataField',
            Label : 'prepTime',
            Value : prepTime,
        },
    ]
);
annotate service.Recipes with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'estimatedCost',
                Value : estimatedCost,
            },
            {
                $Type : 'UI.DataField',
                Label : 'difficultyLevel',
                Value : difficultyLevel,
            },
            {
                $Type : 'UI.DataField',
                Label : 'prepTime',
                Value : prepTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'cookTime',
                Value : cookTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'totalTime',
                Value : totalTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'servings',
                Value : servings,
            },
            {
                $Type : 'UI.DataField',
                Label : 'dietaryType',
                Value : dietaryType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'source',
                Value : source,
            },
            {
                $Type : 'UI.DataField',
                Label : 'cookingMethod',
                Value : cookingMethod,
            },
            {
                $Type : 'UI.DataField',
                Label : 'recipeCategory',
                Value : recipeCategory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'recipeCuisine',
                Value : recipeCuisine,
            },
            {
                $Type : 'UI.DataField',
                Label : 'image',
                Value : image,
            },
            {
                $Type : 'UI.DataField',
                Label : 'imageUrl',
                Value : imageUrl,
            },
            {
                $Type : 'UI.DataField',
                Label : 'rating',
                Value : rating,
            },
            {
                $Type : 'UI.DataField',
                Label : 'cookNote',
                Value : cookNote,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
