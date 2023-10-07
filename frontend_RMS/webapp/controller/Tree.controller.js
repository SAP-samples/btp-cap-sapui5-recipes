sap.ui.define(['sap/ui/ic2022/controller/BaseController', 'sap/ui/model/json/JSONModel'], function (BaseController, JSONModel) {
  'use strict';
  return BaseController.extend('sap.ui.ic2022.controller.Tree', {
    onInit: function () {
      //nothing to do for us
      this.parent_name;
      this.child_name;
      this.parent_ID;
      this.child_ID;
      this.parent_path;
      const oRouter = this.getOwnerComponent().getRouter();

      oRouter.getRoute('Treetable').attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function (oEvent) {
      this.parent_ID = oEvent.getParameter('arguments').entityID1;
      var a = '/Recipes(' + this.parent_ID + ')';
      this.parent_path = '/Recipes(' + this.parent_ID + ')';
      var treeView = this.getView();
      var oItem = oEvent.getSource();
      var oRouter = this.getOwnerComponent().getRouter();

      var array_child_json = [];
      var recipeModel;
      this.recipeModel;

      this.getModel('recipe-service')
        .bindContext(a, undefined, { $expand: 'children' })
        .requestObject()
        .then(function (parent_childs) {
          array_child_json.push(parent_childs);

          var oModel = new JSONModel(array_child_json);
          treeView.setModel(oModel);
          var oTree = treeView.byId('Tree');
          oTree.expandToLevel(3);
        });
    },
    onToNextPage: function () {
      var oRouter = this.getOwnerComponent().getRouter();

      oRouter.navTo('Compare', {
        parent_ID: this.parent_ID,
      });
    },
  });
});
