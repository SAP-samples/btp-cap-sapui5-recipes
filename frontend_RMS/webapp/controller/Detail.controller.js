sap.ui.define(['sap/ui/ic2022/controller/BaseController', 'sap/ui/model/json/JSONModel', 'sap/ui/core/UIComponent', 'sap/m/MessageBox', 'sap/m/MessageToast'], function (BaseController, JSONModel, UIComponent, MessageBox, MessageToast) {
  'use strict';
  return BaseController.extend('sap.ui.ic2022.controller.Detail', {
    getEmptyEntity: function (sModelName) {
      switch (sModelName) {
        case 'ingredientModel':
          return {
            name: '',
            quantity: null,
            unit: 'units',
          };
        case 'prepStepModel':
          return {
            description: '',
          };
      }
    },
    checkIngredientData: function (model) {
      let missingIngredientInformation = false;

      if (model.name === undefined || isNaN(model.quantity) || model.unit === undefined) {
        missingIngredientInformation = true;
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('missingIngre'), {
          title: 'Error', // default
          onClose: null, // default
          styleClass: '', // default
          actions: sap.m.MessageBox.Action.CLOSE, // default
          emphasizedAction: null, // default
          initialFocus: null, // default
          textDirection: sap.ui.core.TextDirection.Inherit, // default
        });
      }

      return missingIngredientInformation;
    },
    checkPrepData: function (model) {
      let missingPrepInformation = false;

      if (isNaN(model.order) || model.description === '' || model.description === undefined) {
        missingPrepInformation = true;
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('missingPrep'), {
          title: 'Error', // default
          onClose: null, // default
          styleClass: '', // default
          actions: sap.m.MessageBox.Action.CLOSE, // default
          emphasizedAction: null, // default
          initialFocus: null, // default
          textDirection: sap.ui.core.TextDirection.Inherit, // default
        });
      }

      return missingPrepInformation;
    },
    checkRecipeModel: function (model) {
      const REQUIRED_FIELDS = ['name', 'description', 'estimatedCost', 'difficultyLevel', 'prepTime', 'cookTime', 'totalTime', 'servings', 'dietaryType', 'cookingMethod', 'recipeCategory', 'recipeCuisine'];

      let missingFields = [];
      Object.keys(model).forEach((key) => {
        if (model[key] === null || model[key] === '' || model[key] == 0) {
          if (REQUIRED_FIELDS.indexOf(key) !== -1) {
            missingFields.push(key);
          }
        }
      });
      return missingFields;
    },

    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute('detail').attachPatternMatched(this._onObjectMatched, this);

      const viewModel = new JSONModel();
      viewModel.setProperty('/enabled', false);
      this.getView().setModel(viewModel, 'viewModel');

      const ingredientModel = new JSONModel(this.getEmptyEntity('ingredientModel'));
      this.setModel(ingredientModel, 'ingredientModel');

      const prepStepModel = new JSONModel(this.getEmptyEntity('prepStepModel'));
      this.setModel(prepStepModel, 'prepStepModel');
      this.delIngreID = '';
    },
    selIngre: function (oEvent) {
      this.ingreContext = oEvent.getParameters().listItem.oBindingContexts['recipe-service'];
    },
    selPrep: function (oEvent) {
      this.prepContext = oEvent.getParameters().listItem.oBindingContexts['recipe-service'];
    },
    onDeleteItem: function (oEvent, sModelName) {
      const recipeModelBindingContext = this.getView().getBindingContext('recipe-service');
      const recipeAuthor = recipeModelBindingContext.getProperty('Author/alias');
      const currentUser = this.getModel('user-management').getProperty('/alias');
      if (currentUser === recipeAuthor) {
        let bindingContext;
        let noItemSelectedErrorMessage;
        let itemSuccessfullyDeletedMessage;
        switch (sModelName) {
          case 'ingredientModel':
            bindingContext = this.ingreContext;
            noItemSelectedErrorMessage = 'selIngreFailed';
            itemSuccessfullyDeletedMessage = this.getModel('i18n').getResourceBundle().getText('ingreDeleted');
            break;

          case 'prepStepModel':
            bindingContext = this.prepContext;
            noItemSelectedErrorMessage = 'selPrepFailed';
            itemSuccessfullyDeletedMessage = this.getModel('i18n').getResourceBundle().getText('prepDeleted');
            break;
        }

        if (bindingContext === null || bindingContext === undefined) {
          MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText(noItemSelectedErrorMessage));
          return;
        }

        bindingContext.delete().then(
          function () {
            MessageToast.show(itemSuccessfullyDeletedMessage);
            this.ingreContext = {};
          },
          function (oError) {
            MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('prepDelFailed'));
            console.error(oError);
            bindingContext = {};
          }
        );
      } else {
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('authorError'));
      }
    },
    onAddItem: function (oEvent, sModelName) {
      const recipeModelBindingContext = this.getView().getBindingContext('recipe-service');
      const recipeAuthor = recipeModelBindingContext.getProperty('Author/alias');
      const currentUser = this.getModel('user-management').getProperty('/alias');
      if (currentUser === recipeAuthor) {
        const itemModel = this.getModel(sModelName);
        let newEntry;
        let missingFields;
        let bindingPath;
        let creationSuccessText;
        let creationFailedText;
        var unit_value;
        switch (sModelName) {
          case 'ingredientModel':
            unit_value = this.byId('ingUnitNew').getSelectedItem().mProperties.text;
            newEntry = {
              belongsTo_ID: recipeModelBindingContext.getProperty('ID'),
              name: itemModel['oData']['name'],
              quantity: parseInt(itemModel['oData']['quantity']),
              unit: itemModel['oData']['unit'],
            };
            missingFields = this.checkIngredientData(newEntry);
            bindingPath = '/Ingredients';
            creationSuccessText = this.getView().getModel('i18n').getResourceBundle().getText('ingreAdded');
            creationFailedText = this.getView().getModel('i18n').getResourceBundle().getText('ingreAddFailed');
            break;
          case 'prepStepModel':
            newEntry = {
              belongsTo_ID: recipeModelBindingContext.getProperty('ID'),
              order: parseInt(itemModel['oData']['order']),
              description: itemModel['oData']['description'],
            };
            missingFields = this.checkPrepData(newEntry);
            bindingPath = '/PreparationSteps';
            creationSuccessText = this.getView().getModel('i18n').getResourceBundle().getText('prepAdded');
            creationFailedText = this.getView().getModel('i18n').getResourceBundle().getText('prepAddFailed');
            break;
        }

        if (missingFields) {
          MessageBox.error('Please provide all mandatory fields');
          return;
        }

        const oListBindingRecipes = this.getView().getModel('recipe-service').bindList(bindingPath);
        const oContext = oListBindingRecipes.create(newEntry, true);

        oContext.created().then(
          function () {
            MessageToast.show(creationSuccessText);
            switch (sModelName) {
              case 'ingredientModel':
                itemModel.setProperty('/name', '');
                itemModel.setProperty('/quantity', '');
                itemModel.setProperty('/unit', '');
                break;
              case 'prepStepModel':
                itemModel.setProperty('/order', '');
                itemModel.setProperty('/description', '');
                break;
            }
            recipeModelBindingContext.requestRefresh();
          },
          function (oError) {
            MessageBox.error(creationFailedText);
            console.error(oError);
          }
        );
      } else {
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('authorError'));
      }
    },

    _onObjectMatched: function (oEvent) {
      this.getView().bindElement({
        path: '/' + window.decodeURIComponent(oEvent.getParameter('arguments').recipesPath),
        model: 'recipe-service',
      });
      const viewModel = this.getView().getModel('viewModel');
      viewModel.setProperty('/enabled', false);
    },

    imageChange: function (oEvent) {
      const obj = this.getView().getBindingContext('recipe-service').getObject();
      var oFileUpload = this.getView().byId('fileUploaderFS');
      var domRef = oFileUpload.getFocusDomRef();
      var file = domRef.files[0];

      if (file != undefined && file['type'].includes('image') === false) {
        //    if (!this.isValidURL(newRecipe.getProperty('/imageUrl'))) {
        oFileUpload.setValue('');
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
        oFileUpload.setValue(imageUrl);
      }
    },

    handleEditPress: function () {
      const obj = this.getView().getBindingContext('recipe-service').getObject();
      const recipe_author = obj['Author']['alias'];
      const current_user = this.getOwnerComponent().getModel('user-management').getProperty('/alias');
      // check author = current user if yes enable otherwise disable
      if (recipe_author === current_user) {
        const viewModel = this.getView().getModel('viewModel');
        viewModel.setProperty('/enabled', true);
      } else {
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('authorError'));
      }
    },
    handleSavePress: function (oEvent) {
      const obj = this.getView().getBindingContext('recipe-service').getObject();
      const recipe_author = obj['Author']['alias'];
      const current_user = this.getOwnerComponent().getModel('user-management').getProperty('/alias');
      if (recipe_author === current_user) {
        const missingFields = this.checkRecipeModel(obj);

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

        const totalTime = parseInt(obj['totalTime']);
        const prepTime = parseInt(obj['prepTime']);
        const cookTime = parseInt(obj['cookTime']);

        if (totalTime != prepTime + cookTime) {
          MessageBox.error('The sum of preparation time and cooking time must be equal to Total time');
          return;
        }

        var oFileUpload = this.getView().byId('fileUploaderFS');
        var domRef = oFileUpload.getFocusDomRef();
        var file = domRef.files[0];

        if (file != undefined && file['type'].includes('image') === false) {
          //    if (!this.isValidURL(newRecipe.getProperty('/imageUrl'))) {
          MessageBox.error(
            //TODO add and reference i18n string
            'Please provide a valid image ',
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

        if (obj['Ingredients'].length === 0) {
          MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('noIngredient'), {
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

        if (obj['PreparationSteps'].length === 0) {
          MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('noPrep'), {
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
        this.getView().getBindingContext('recipe-service').refresh(); //NOT working as hasPendingChanges is true; normally the batch request should have PATCH and GET (for the refresh)
        this.getView()
          .getModel('recipe-service')
          .submitBatch('fullRecipe')
          .then(
            () => {
              const viewModel = this.getView().getModel('viewModel');
              viewModel.setProperty('/enabled', false);
              MessageBox.show(this.getView().getModel('i18n').getResourceBundle().getText('recipeSaved'));
            },
            (oError) => {
              MessageBox.error(oError.message);
            }
          );
      } else {
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('authorError'));
      }
    },
    handleDelete: function () {
      const that = this;
      const bindingContext = this.getView().getBindingContext('recipe-service');
      const recipe_author = bindingContext.getObject()['Author']['alias'];
      const current_user = this.getOwnerComponent().getModel('user-management').getProperty('/alias');
      const recipedeltext = this.getView().getModel('i18n').getResourceBundle().getText('recipedeleted');
      if (recipe_author === current_user) {
        MessageBox.confirm(this.getModel('i18n').getResourceBundle().getText('deletionRecipeConfirmQuestion'), {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              bindingContext.delete().then(
                () => {
                  MessageBox.show(recipedeltext);
                  bindingContext.requestRefresh();
                },
                (oError) => {
                  MessageBox.error(oError.message);
                }
              );
              const oRouter = UIComponent.getRouterFor(that);
              oRouter.navTo('overview', {}, true);
            }
            if (sButton === MessageBox.Action.CANCEL) {
            }
          },
        });
      } else {
        MessageBox.error(this.getView().getModel('i18n').getResourceBundle().getText('recipeDeleteAborted'));
      }
    },
    handleCancel: function () {
      this.getModel('viewModel').setProperty('/enabled', false);
    },
    handleClonePress: function () {
      const that = this;
      const currentRecipe = this.getView().getBindingContext('recipe-service').getObject();
      const clonedRecipe = currentRecipe;
      delete clonedRecipe.ID;
      delete clonedRecipe.Author.ID;

      clonedRecipe.Author.alias = this.getModel('user-management').getProperty('/alias');
      clonedRecipe.Ingredients.forEach((element) => {
        delete element.ID;
      });
      clonedRecipe.PreparationSteps.forEach((element) => {
        delete element.ID;
      });
      clonedRecipe.parent_ID = this.getView().getBindingContext('recipe-service').getObject().ID;
      const oListBindingRecipes = this.getView().getModel('recipe-service').bindList('/Recipes');
      const oContext = oListBindingRecipes.create(clonedRecipe, true);
      oContext.created().then(
        function () {
          MessageBox.information(that.getModel('i18n').getResourceBundle().getText('successCloning'), {
            onClose: (action) => {
              if (action === MessageBox.Action.OK) {
                const oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo('detail', {
                  recipesPath: 'Recipes(' + oContext.getObject().ID + ')',
                });
                that.getModel('viewModel').setProperty('/enabled', true);
              }
            },
            styleClass: '', // default
            actions: [sap.m.MessageBox.Action.OK], // default
            emphasizedAction: sap.m.MessageBox.Action.OK, // default
            initialFocus: null, // default
            textDirection: sap.ui.core.TextDirection.Inherit, // default
          });
        },
        function (oError) {
          MessageBox.error(that.getModel('i18n').getResourceBundle().getText('errorDuringCloning'), {
            onClose: null, // default
            styleClass: '', // default
            actions: sap.m.MessageBox.Action.CLOSE, // default
            emphasizedAction: null, // default
            initialFocus: null, // default
            textDirection: sap.ui.core.TextDirection.Inherit, // default
          });
          console.error(oError);
        }
      );
    },
    handleVariants: function (oEvent) {
      const obj = this.getView().getBindingContext('recipe-service').getObject();
      var resourceModel = this.getView().getModel('i18n').getResourceBundle();
      var oItem = oEvent.getSource();
      var oRouter = this.getOwnerComponent().getRouter();
      var a = '/Recipes(' + obj['ID'] + ')';
      var parent_ID;
      var recipeModel = this.getModel('recipe-service');
      this.getModel('recipe-service')
        .bindContext(a)
        .requestObject()
        .then(function (current_object) {
          if (current_object.parent_ID != undefined) {
            var a = '/Recipes(' + current_object.parent_ID + ')';
            parent_ID = current_object.parent_ID;
          } else {
            var a = '/Recipes(' + current_object.ID + ')';
            parent_ID = current_object.ID;
          }

          recipeModel
            .bindContext(a, undefined, { $expand: 'children' })
            .requestObject()
            .then(function (parent_childs) {
              if (parent_childs.children.length > 0) {
                oRouter.navTo('Treetable', {
                  entityID1: parent_ID,
                });
              } else {
                MessageBox.error(resourceModel.getText('noVariants'), {
                  onClose: null, // default
                  styleClass: '', // default
                  actions: sap.m.MessageBox.Action.CLOSE, // default
                  emphasizedAction: null, // default
                  initialFocus: null, // default
                  textDirection: sap.ui.core.TextDirection.Inherit, // default
                });
              }
            });
        });
    },
  });
});
