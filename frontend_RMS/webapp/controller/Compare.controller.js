sap.ui.define(['sap/ui/ic2022/controller/BaseController', 'sap/ui/model/json/JSONModel', 'sap/m/MessageBox', 'sap/ui/core/ResizeHandler'], function (BaseController, JSONModel, MessageBox, ResizeHandler) {
  'use strict';

  return BaseController.extend('sap.ui.ic2022.controller.Compare', {
    onInit: function () {
      //nothing to do for us
      this.parent_name;
      this.child_name;
      this.parent_ID;
      this.child_ID;
      this.parent_path;
      const oRouter = this.getOwnerComponent().getRouter();

      oRouter.getRoute('Compare').attachPatternMatched(this._onObjectMatched, this);
    },

    BackToTree: function () {
      this.getRouter().navTo('Treetable', { entityID1: this.parent_ID }, true);
    },

    _onObjectMatched: function (oEvent) {
      this.parent_ID = oEvent.getParameter('arguments').parent_ID;
      var a = '/Recipes(' + this.parent_ID + ')';
      this.parent_path = '/Recipes(' + this.parent_ID + ')';
      var compareView = this.getView();
      var oItem = oEvent.getSource();
      var oRouter = this.getOwnerComponent().getRouter();
      var array_child_json = [];
      var recipeModel = this.getModel('recipe-service');

      this.getModel('recipe-service')
        .bindContext(a, undefined, { $expand: 'Ingredients,PreparationSteps,children,Author' })
        .requestObject()
        .then(function (parent_childs) {
          var ingreString = '';
          var prepString = '';
          var ingreCount = 1;
          for (var j = 0; j < parent_childs.Ingredients.length; j++) {
            var ingreName = parent_childs.Ingredients[j].name;
            var ingreQuan = parent_childs.Ingredients[j].quantity;
            var ingreUnit = parent_childs.Ingredients[j].unit;
            ingreString = ingreString + (j + 1) + '. ' + ingreName + '  quantity: ' + ingreQuan + ' ( ' + ingreUnit + ' )' + '\n';
          }

          parent_childs['ingredientsList'] = ingreString;

          for (var j = 0; j < parent_childs.PreparationSteps.length; j++) {
            var order = parent_childs.PreparationSteps[j].order;
            var prepDesc = parent_childs.PreparationSteps[j].description;
            prepString = prepString + 'Order: ' + order + '  description: ' + prepDesc + '\n';
          }

          parent_childs['prepList'] = prepString;

          array_child_json.push(parent_childs);

          for (var i = 0; i < parent_childs.children.length; i++) {
            var a = '/Recipes(' + parent_childs.children[i].ID + ')';
            recipeModel
              .bindContext(a, undefined, { $expand: 'Ingredients,PreparationSteps,children,Author' })
              .requestObject()
              .then(function (childs) {
                ingreString = '';
                for (var j = 0; j < childs.Ingredients.length; j++) {
                  var ingreName = childs.Ingredients[j].name;
                  var ingreQuan = childs.Ingredients[j].quantity;
                  var ingreUnit = childs.Ingredients[j].unit;
                  ingreString = ingreString + (j + 1) + '. ' + ingreName + ' quantity: ' + ingreQuan + ' ( ' + ingreUnit + ' )' + '\n';
                }

                prepString = '';
                for (var j = 0; j < childs.PreparationSteps.length; j++) {
                  var order = childs.PreparationSteps[j].order;
                  var prepDesc = childs.PreparationSteps[j].description;
                  prepString = prepString + 'Order: ' + order + '  description: ' + prepDesc + '\n';
                }

                childs['prepList'] = prepString;
                childs['ingredientsList'] = ingreString;

                array_child_json.push(childs);
                var oModel = new JSONModel(array_child_json);
                compareView.setModel(oModel);
              });
          }
        });
    },
  });
});
