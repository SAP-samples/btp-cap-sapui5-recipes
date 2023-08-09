sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
  'use strict';
  return Controller.extend('sap.ui.ic2022.controller.App', {
    onInit: function () {
      if (localStorage.getItem('alias')) {
        this.getView().getModel('user-management').setProperty('/alias', localStorage.getItem('alias'));
      } else {
        this.getView().getModel('user-management').setProperty('/alias', null);
      }
    },
  });
});
