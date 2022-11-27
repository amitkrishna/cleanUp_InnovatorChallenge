sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("cleanup.controller.home", {
            onInit: function () {

                let route = this.getOwnerComponent().getRouter().getRoute("home");
                route.attachPatternMatched(this.onRoutePatternMatched, this);

            },
            onRoutePatternMatched: function () {
                sessionStorage.setItem("recycleClean", "1");
            },
            _navTo: function (sRoute) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(sRoute);
            },
            navToAboutUs: function () {
                this._navTo("AboutUs");
            },
            navToHowToUse: function () {
                this._navTo("HowToUse");
            },
            LaunchRecycle: function () {
                this._navTo("Recycle");
            },
            LaunchReuse: function () {
                this._navTo("Reuse");
            },
            onHomePress: function () {
                MessageToast.show("You are in Home! feel comfortable");
            },
            onExit: function () {
                this.byId("app").setBackgroundImage(null)
            },
            navChangeLanguage: function (oEvent) {
               // var control = oEvent.getSource();
                //var state = control.getState();
                sap.ui.getCore().getConfiguration().setLanguage("hi_IN");
                var i18nModel = new sap.ui.model.resource.ResourceModel({

                    bundleUrl: "i18n/i18n.properties",

                    bundleLocale: "hi_IN"

                });
                //  var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleUrl: "i18n/i18n.properties", bundleLocale: "hi" });
                sap.ui.getCore().setModel(i18nModel, "i18n");
            }
        });
    });
