sap.ui.define(
  ['sap/ui/ic2022/controller/BaseController', 'sap/ui/core/Core', 'sap/m/library', 'sap/m/Dialog', 'sap/m/Button', 'sap/m/Label', 'sap/m/Input', 'sap/m/MessageToast', 'sap/ui/core/UIComponent'],
  function (BaseController, Core, mobileLibrary, Dialog, Button, Label, Input, MessageToast, UIComponent) {
    'use strict';
    return BaseController.extend('sap.ui.ic2022.controller.Overview', {
      onCreateRecipe: function () {
        this.getRouter().navTo('createRecipe');
      },
      aliasDIalog: function () {
        // shortcut for sap.m.DialogType
        const DialogType = mobileLibrary.DialogType;
        // shortcut for sap.m.ButtonType
        const ButtonType = mobileLibrary.ButtonType;
        if (!localStorage.getItem('alias')) {
          if (!this.aliasDialog) {
            this.aliasDialog = new Dialog({
              type: DialogType.Message,
              title: 'Login', //TODO: put in i18n
              content: [
                new Label({
                  text: 'Please provide your user alias', //TODO: put in i18n
                  labelFor: 'userAlias',
                }),
                new Input('userAlias', {
                  width: '100%',
                  placeholder: 'cktb2793',
                  liveChange: function (oEvent) {
                    let sText = oEvent.getParameter('value');
                    this.aliasDialog.getBeginButton().setEnabled(sText.length > 0);
                  }.bind(this),
                }),
              ],
              beginButton: new Button({
                type: ButtonType.Emphasized,
                text: 'Login',
                enabled: false,
                press: function () {
                  const sText = Core.byId('userAlias').getValue();
                  MessageToast.show('User alias set to: ' + sText); //TODO: put in i18n

                  localStorage.setItem('alias', sText);
                  this.getView().getModel('user-management').setProperty('/alias', sText);

                  this.aliasDialog.close();
                  const userAliasInput = Core.byId('userAlias');
                  userAliasInput.setValue('');
                  userAliasInput.fireLiveChange({ value: '' });
                }.bind(this),
              }),
            });
          }

          this.aliasDialog.open();
        }
      },
      onAfterRendering: function () {
        this.aliasDIalog();
      },
      onLogout: function () {
        this.getView().getModel('user-management').setProperty('/alias', null);
        localStorage.removeItem('alias');
        this.aliasDIalog();
      },
    });
  }
);
