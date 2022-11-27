sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("cleanup.controller.solution.Solution", {
            onInit: function () {
                let route = this.getOwnerComponent().getRouter().getRoute("Solution");
                route.attachPatternMatched(this.onRoutePatternMatched, this);

            },
            onRoutePatternMatched: function () {
                this.s = "0";


                var oData1 = new JSONModel("model/masterData.json", false);
                oData1.attachRequestCompleted(
                    function () {
                        //console.log(this.getView())
                        this.getView().setModel(oData1, "masterData");
                        console.log(this.getView().getModel("masterData").getData());
                    }, this);
                //new JSONModel("model/masterData.json",false)
                //console.log("odata1   ", oData1);


                // console.log(this.getView().getModel("masterData").getData());




                //   this.dustBinModel = (this.getOwnerComponent().getModel("dustbinItems"));
                // console.log(this.dustBinModel);

                //to retain data in previous screen
                sessionStorage.setItem("recycleClean", "0");



                var y = this.getOwnerComponent().getAggregation("rootControl").getModel("dustbinItems");
                this.getView().setModel(y, "dustbinItems")
                //console.log(this.getView().getModel("dustbinItems"));
                // this.byId("solutionApp").setBackgroundImage("img/dancing.gif")

                //jQuery.sap.delayedCall(5000, this, this.changeBackground);
                //jQuery.sap.intervalCall(500, console.log("sdf"), this)


                //  oData1.attachRequestCompleted(function () {this.mainSolution()})
                oData1.attachRequestCompleted(
                    function () {
                        //console.log(this.getView())
                        this.mainSolution();
                    }, this);

            },
            inArray: function (a, b) {
                for (var i = 0; i < a.length; i++) {
                    //console.log(a[i], b);
                    if (a[i] === b) {
                        //console.log(true);
                        return true;
                    }
                }
                return false;
            }
            ,
            mainSolution: function () {
                var solution = []
                var solutionDS = {
                    "name": "",
                    "quantity": "",
                    "remark": "",
                    "options": {
                        "kabariwala": [],
                        "plants": [],
                        "govContact": []
                    },
                    "optionsList":[
                    ],
                    "solutionProvider": {
                        "broadArea": "",
                        "rating":"",
                        "name": "",
                        "phone": "",
                        "designation": "",
                        "accept": ""
                    }
                }

                var master = this.getView().getModel("masterData").getData();
                // console.log(master, master.getData());

                //let Assume this is user input
                var state = "Jharkhand"
                var district = "Gumla"

                //to be fetched via something

                var need = {

                }
                //console.log(master)
                var flag = 0, stateIndex = 0;
                for (var i = 0; i < master.states.length; i++) {
                    if (master.states[i].state == state) {
                        stateIndex = i;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    this._navTo("NotYetReached");
                }
                flag = 0;
                var districtIndex = 0;
                for (var i = 0; i < master.states[stateIndex].district.length; i++) {
                    if (master.states[stateIndex].district[i] == district) {
                        districtIndex = i;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    this._navTo("NotYetReached");
                }

                need = master.states[stateIndex].district[districtIndex];
                // console.log(need);
                // console.log(this.getView().getModel("dustbinItems"));
                var dustbinItems = this.getView().getModel("dustbinItems").oData.WastePile;

                for (var i = 0; i < dustbinItems.length; i++) {
                    let currWaste = dustbinItems[i];
                    //shallow copy
                    let n = Object.assign({}, solutionDS);
                    console.log(n);
                    n.name = currWaste.name;
                    n.quantity=currWaste.quantity;
                    n.remark=currWaste.remark;
                    // console.log(solutionDS.name);
                    // console.log(n.name);
                    // SOLVE FOR CURRENT WASTE START



                    let kabariwala = [];
                    //  console.log(need.kabariwalas[0])
                    for (var j = 0; j < need.kabariwalas.length; j++) {
                        if (this.inArray(need.kabariwalas[j].accept, currWaste.name.toLowerCase())) {
                            kabariwala.push(need.kabariwalas[j]);
                        }
                    }
                    let plant = [];
                    //console.log(need.plants.length);
                    for (var j = 0; j < need.plants.length; j++) {
                        //     console.log(need.plants[j].accept,currWaste.name.toLowerCase)
                        if (this.inArray(need.plants[j].accept, currWaste.name.toLowerCase())) {
                            plant.push(need.plants[j]);
                        }
                    }

                    let optionsList=[]
                    let govContact = need.govContact;
                    if(kabariwala.length){
                        optionsList.push({"name":"kabariwalas","key":"kabariwala"});
                    }
                    if(plant.length){
                        optionsList.push({"name":"plants","key":"plants"})
                    }
                    if(govContact.length){
                        optionsList.push({"name":"governing Bodies","key":"govContact"})
                    }
                    n.optionsList=Object.assign({},optionsList);
                    n.options.kabariwala =Object.assign({},  kabariwala);
                    n.options.plants = Object.assign({},plant);
                    n.options.govContact = Object.assign({}, govContact)
                    console.log(optionsList);
                    // SOLVE FOR CURRENT WASTE END
                    solution.push(n);
                    //n.optionsList=[];
                  //  n=Object.assign({}, solutionDS);
                }
                console.log(solution)
                var oModelMain = new JSONModel({"solution":solution});
                this.getView().setModel(oModelMain,"SolutionModel")
            },
            optionListChange:function(oEvent){
                console.log(oEvent.mParameters.selectedItem.mProperties.key)
                if(!this.selectKabariwala){
                    this.selectKabariwala= new sap.ui.xmlfragment("cleanup.view.fragments.selectKabariwala", this);
                }
                this.selectKabariwala.open();

            },
            //for fragment
            handleSolutionCancel:function(oEvent){
                oEvent;
            },
            changeBackground: function (y) {
                // this.byId("solutionApp").setBackgroundImage(null)
                //this.byId("solutionApp").setBackgroundColor("#ff8177")
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
                this._navTo("home");
            },
            onBeforeRendering() {
                // console.log(new Date)
            },
            onAfterRendering() {
                //     console.log(new Date)
            }



        });
    });
