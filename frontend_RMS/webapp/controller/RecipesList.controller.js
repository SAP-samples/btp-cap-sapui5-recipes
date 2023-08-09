sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', '../model/formatter', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator', 'sap/m/MessageToast', 'sap/m/SearchField'],
  function (Controller, JSONModel, formatter, Filter, FilterOperator, MessageToast, SearchField) {
    'use strict';

    return Controller.extend('sap.ui.ic2022.controller.RecipesList', {
      formatter: formatter,

      onInit: function () {
        var oViewModel = new JSONModel({
          currency: '£',
        });
        this.getView().setModel(oViewModel, 'view');

        this.oFilterBar = this.byId('filterBar');
      },

      onClear: function (oEvent) {
        var oItems = this.oFilterBar.getAllFilterItems(true);
        for (var i = 0; i < oItems.length; i++) {
          var oControl = this.oFilterBar.determineControlByFilterItem(oItems[i]);
          if (oControl) {
            oControl.setValue('');
          }
        }
      },

      onChange: function (oEvent) {
        this.oFilterBar.fireFilterChange(oEvent);
      },

      onClear: function (oEvent) {
        var oItems = this.oFilterBar.getAllFilterItems(true);
        for (var i = 0; i < oItems.length; i++) {
          var oControl = this.oFilterBar.determineControlByFilterItem(oItems[i]);
          if (oControl) {
            oControl.setValue('');
          }
        }
      },

      _showToast: function (sMessage) {
        MessageToast.show(sMessage);
      },

      onCancel: function (oEvent) {
        //this._showToast("cancel triggered");
      },

      onReset: function (oEvent) {
        //this._showToast("reset triggered");
      },

      onSearch: function (oEvent) {
        var oList = this.byId('recipesList');
        var oBinding = oList.getBinding('items');

        var i;
        var oControl;
        var filterGroupItems = this.oFilterBar.getFilterGroupItems();

        var aFilter = [];

        for (i = 0; i < filterGroupItems.length; i++) {
          oControl = this.oFilterBar.determineControlByFilterItem(filterGroupItems[i]);
          if (oControl && oControl.getValue && oControl.getValue() && oControl.getValue() !== this.getView().getModel('i18n').getResourceBundle().getText('all')) {
            var filter_value;
            if (oControl._sPickerType === 'Dropdown') {
              filter_value = oControl.getSelectedKey();
            } else {
              filter_value = oControl.getValue();
            }
            aFilter.push(
              new Filter({
                path: filterGroupItems[i].mProperties['name'],
                operator: FilterOperator.Contains,
                value1: filter_value,
                caseSensitive: false,
              })
            );
          }
        }
        oBinding.filter(aFilter);
      },

      onFiltersDialogClosed: function (oEvent) {
        //this._showToast("filtersDialogClosed triggered");
      },

      onFilterRecipes: function (oEvent) {
        // build filter array
        var aFilter = [];
        var sQuery = oEvent.getParameter('query');
        if (sQuery) {
          aFilter.push(
            new Filter({
              path: 'name',
              operator: FilterOperator.Contains,
              value1: sQuery,
              caseSensitive: false,
            })
          );
        }

        // filter binding
        var oList = this.byId('recipesList');
        var oBinding = oList.getBinding('items');
        oBinding.filter(aFilter);
      },
      onPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo('detail', {
          recipesPath: window.encodeURIComponent(oItem.getBindingContext('recipe-service').getPath().substr(1)),
        });
      },
      onRefresh: function () {
        var oList = this.byId('recipesList');
        var oBinding = oList.getBinding('items');
        oBinding.refresh();
      },
    });
  }
);
