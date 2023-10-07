sap.ui.define(['sap/ui/ic2022/controller/BaseController', 'sap/ui/model/json/JSONModel', 'sap/ui/core/UIComponent', 'sap/m/MessageBox', 'sap/m/MessageToast'], function (BaseController, JSONModel, UIComponent, MessageBox, MessageToast) {
  'use strict';
  return BaseController.extend('sap.ui.ic2022.controller.Detail', {
    getIndex: function (isInit = false, sModelName) {
      if (isInit) {
        return 0;
      }
      const model = this.getView().getModel(sModelName).getProperty('/');
      if (model.length === 0) {
        return 0;
      }
      return model[model.length - 1].id + 1;
    },
    getEmptyEntity: function (isInit, sModelName) {
      const index = this.getIndex(isInit, sModelName);
      switch (sModelName) {
        case 'ingredientModel':
          return {
            id: index,
            name: '',
            quantity: null,
            unit: 'units',
          };
        case 'prepStepModel':
          return {
            id: index,
            order: index,
            description: '',
          };
      }
    },
    getEmptyPrepStepModel: function (isInit) {},
    onInit: function () {
      const INITIAL_RECIPE_DATA = {
        name: '',
        description: '',
        estimatedCost: 0,
        difficultyLevel: 0,
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: null,
        dietaryType: 0,
        source: '',
        cookingMethod: 0,
        recipeCategory: 0,
        recipeCuisine: 0,
        image: '',
        imageUrl: '',
        rating: '',
        cookNote: '',
        Author: {
          alias: this.getOwnerComponent().getModel('user-management').getProperty('/alias'),
        },
        Ingredients: null,
        PreparationSteps: [],
      };

      const ingredientsModel = new JSONModel([this.getEmptyEntity(true, 'ingredientModel')]);
      const prepStepModel = new JSONModel([this.getEmptyEntity(true, 'prepStepModel')]);
      const newRecipeModel = new JSONModel(INITIAL_RECIPE_DATA);

      this.setModel(newRecipeModel, 'newRecipeModel');
      this.getView().setModel(newRecipeModel, 'newRecipeModel');
      this.setModel(ingredientsModel, 'ingredientModel');
      this.setModel(prepStepModel, 'prepStepModel');
    },
    onAdd: function (oEvent, sModelName) {
      this.getModel(sModelName).getProperty('/').push(this.getEmptyEntity(false, sModelName));
      this.getModel(sModelName).updateBindings();
    },
    onDelete: function (evt, idToDelete, sModelName) {
      const currentValues = this.getModel(sModelName).getProperty('/');
      const arrayAfterDeletion = currentValues.filter(function (element, index, arr) {
        return element.id != idToDelete;
      });
      this.getView().getModel(sModelName).setProperty('/', arrayAfterDeletion);
    },
    hasMissingFields: function () {
      const REQUIRED_FIELDS = ['name', 'description', 'estimatedCost', 'difficultyLevel', 'prepTime', 'cookTime', 'servings', 'dietaryType', 'cookingMethod', 'recipeCategory', 'recipeCuisine'];
      const newRecipe = this.getView().getModel('newRecipeModel');
      const recipeValues = newRecipe.getProperty('/');
      let missingFields = [];
      Object.keys(recipeValues).forEach((key) => {
        if (recipeValues[key] === null || recipeValues[key] === '' || recipeValues[key] == 0) {
          if (REQUIRED_FIELDS.indexOf(key) !== -1) {
            missingFields.push(key);
          }
        }
      });
      return missingFields;
    },
    isValidURL: function (str) {
      var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      return !!pattern.test(str);
    },
    changeUrl: function (oEvent) {
      newRecipe.setProperty('/imageUrl', this.getView().byId('imageUrlID').getValue());
    },
    imageChange: function (oEvent) {
      var oFileUpload = this.getView().byId('fileUploaderFS');
      const newRecipe = this.getView().getModel('newRecipeModel');
      var domRef = oFileUpload.getFocusDomRef();
      var file = domRef.files[0];

      if (file != undefined && file['type'].includes('image') === false) {
        //    if (!this.isValidURL(newRecipe.getProperty('/imageUrl'))) {
        MessageBox.error(
          //TODO add and reference i18n string
          'Please provide a valid image url.',
          {
            title: 'Error', // default
            onClose: null, // default
            styleClass: '', // default
            actions: sap.m.MessageBox.Action.CLOSE, // default
            emphasizedAction: null, // default
            initialFocus: null, // default
            textDirection: sap.ui.core.TextDirection.Inherit, // default
          }
        );
        return;
        //    }
      }
      if (file != undefined) {
        var imageUrl = URL.createObjectURL(file);
        newRecipe.setProperty('/imageUrl', imageUrl);
      }
    },
    onCreate: function () {
      const that = this;
      const newRecipe = this.getView().getModel('newRecipeModel');
      const missingFields = this.hasMissingFields();
      if (missingFields.length > 0) {
        MessageBox.error(this.getModel('i18n').getResourceBundle().getText('fillMissingFields') + ' \n' + missingFields.join(', '), {
          title: 'Error', // default
          onClose: null, // default
          styleClass: '', // default
          actions: sap.m.MessageBox.Action.CLOSE, // default
          emphasizedAction: null, // default
          initialFocus: null, // default
          textDirection: sap.ui.core.TextDirection.Inherit, // default
        });
        return;
      }

      const totalTime = parseInt(newRecipe.oData['totalTime']);
      const prepTime = parseInt(newRecipe.oData['prepTime']);
      const cookTime = parseInt(newRecipe.oData['cookTime']);

      if (prepTime <= 0) {
        MessageBox.error('The Preparation time must be positive');
        return;
      }
      if (cookTime <= 0) {
        MessageBox.error('The Cooking time must be positive');
        return;
      }
      if (totalTime <= 0) {
        MessageBox.error('The Total time must be positive');
        return;
      }

      if (totalTime != prepTime + cookTime) {
        MessageBox.error('The sum of preparation time and cooking time must be equal to Total time');
        return;
      }

      const ingredients = JSON.parse(this.getView().getModel('ingredientModel').getJSON());

      if (ingredients.length === 0) {
        MessageBox.error(
          //TODO add and reference i18n string
          'Please add at least one ingredient',
          {
            title: 'Error', // default
            onClose: null, // default
            styleClass: '', // default
            actions: sap.m.MessageBox.Action.CLOSE, // default
            emphasizedAction: null, // default
            initialFocus: null, // default
            textDirection: sap.ui.core.TextDirection.Inherit, // default
          }
        );
        return;
      }

      let missingIngredientInformation = false;
      ingredients.forEach((ingredient) => {
        if (ingredient.name === '' || ingredient.quantity === null) {
          missingIngredientInformation = true;
          MessageBox.error(
            //TODO add and reference i18n string
            'Please maintain for all ingredients a name and a quantity',
            {
              title: 'Error', // default
              onClose: null, // default
              styleClass: '', // default
              actions: sap.m.MessageBox.Action.CLOSE, // default
              emphasizedAction: null, // default
              initialFocus: null, // default
              textDirection: sap.ui.core.TextDirection.Inherit, // default
            }
          );
        }
      });
      if (missingIngredientInformation) {
        return;
      }
      const prepSteps = JSON.parse(this.getView().getModel('prepStepModel').getJSON());

      if (prepSteps.length === 0) {
        MessageBox.error(
          //TODO add and reference i18n string
          'Please add at least one preparation step',
          {
            title: 'Error', // default
            onClose: null, // default
            styleClass: '', // default
            actions: sap.m.MessageBox.Action.CLOSE, // default
            emphasizedAction: null, // default
            initialFocus: null, // default
            textDirection: sap.ui.core.TextDirection.Inherit, // default
          }
        );
        return;
      }

      let missingPreparationStepInformation = false;
      prepSteps.forEach((prepStep) => {
        if (prepStep.description === '') {
          missingPreparationStepInformation = true;
          MessageBox.error(
            //TODO add and reference i18n string
            'Please maintain for all preparation steps a description',
            {
              title: 'Error', // default
              onClose: null, // default
              styleClass: '', // default
              actions: sap.m.MessageBox.Action.CLOSE, // default
              emphasizedAction: null, // default
              initialFocus: null, // default
              textDirection: sap.ui.core.TextDirection.Inherit, // default
            }
          );
        }
      });
      if (missingPreparationStepInformation) {
        return;
      }

      for (let index = 0; index < ingredients.length; index++) {
        delete ingredients[index].id;
        ingredients[index].quantity = parseInt(ingredients[index].quantity);
      }
      for (let index = 0; index < prepSteps.length; index++) {
        delete prepSteps[index].id;
        prepSteps[index].order = parseInt(prepSteps[index].order);
      }
      newRecipe.setProperty('/Ingredients', ingredients);
      newRecipe.setProperty('/PreparationSteps', prepSteps);

      // TODO: Validate ingredients and prepstep are added

      const oListBindingRecipes = this.getView().getModel('recipe-service').bindList('/Recipes');

      const oContext = oListBindingRecipes.create(JSON.parse(newRecipe.getJSON().toString()), true);
      oContext.created().then(
        function () {
          //TODO: add and reference i18n text
          MessageToast.show('The recipe was created', {
            duration: 3000, // default
            collision: 'fit fit', // default
            onClose: null, // default
            autoClose: true, // default
            animationTimingFunction: 'ease', // default
            animationDuration: 1000, // default
            closeOnBrowserNavigation: true, // default
          });
          const oRouter = UIComponent.getRouterFor(that);
          oRouter.navTo('overview', {}, true);
        },
        function (oError) {
          MessageBox.error(
            //TODO add and reference i18n string
            'A error occured during the creation of the recipe. See more in the console logs.',
            {
              title: 'Error', // default
              onClose: null, // default
              styleClass: '', // default
              actions: sap.m.MessageBox.Action.CLOSE, // default
              emphasizedAction: null, // default
              initialFocus: null, // default
              textDirection: sap.ui.core.TextDirection.Inherit, // default
            }
          );
          console.error(oError);
        }
      );
    },
  });
});
