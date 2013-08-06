define([
  // Application.
  "app",
  "modules/chart",
],

function(app, Chart) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({

    initialize: function() {
      
      var collections = {
        
        charts: new Chart.Collection()
      };

      // Ensure the router has references to the collections.
      _.extend(this, collections);

      app.useLayout("main-layout").setViews({
        ".charts": new Chart.Views.List(collections),
      }).render();

    },

    routes: {
      "": "index"
    },

    index: function() {
      this.charts.fetch({
        error: function() { 
          console.log(arguments); 
        }
      });
    }
  });

  return Router;

});
