sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/core/routing/History', 'sap/ui/core/UIComponent'], function (Controller, History, UIComponent) {
  'use strict';

  return Controller.extend('sap.ui.ic2022.controller.BaseController', {
    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },

    onNavBack: function () {
      var oHistory, sPreviousHash;

      oHistory = History.getInstance();
      sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo('overview', {}, true);
      }
    },
    getModel: function (sModelName) {
      return this.getView().getModel(sModelName);
    },
    setModel: function (oModel, sModelName) {
      this.getView().setModel(oModel, sModelName);
    },
  });
});
