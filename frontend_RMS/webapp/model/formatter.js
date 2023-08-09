sap.ui.define([], function () {
  'use strict';

  return {
    statusText: function (sdifficultyLevel) {
      var oResourceBundle = this.getView().getModel('i18n').getResourceBundle();

      switch (sdifficultyLevel) {
        case '1':
          return oResourceBundle.getText('difficultyLevel1');
        case '2':
          return oResourceBundle.getText('difficultyLevel2');
        case '3':
          return oResourceBundle.getText('difficultyLevel3');
        default:
          return sdifficultyLevel;
      }
    },
    costLevelText: function (sCostLevel) {
      var oResourceBundle = this.getView().getModel('i18n').getResourceBundle();

      switch (sCostLevel) {
        case '1':
          return oResourceBundle.getText('costLevel1');
        case '2':
          return oResourceBundle.getText('costLevel2');
        case '3':
          return oResourceBundle.getText('costLevel3');
        default:
          return sCostLevel;
      }
    },
  };
});
