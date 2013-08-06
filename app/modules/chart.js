// Chart module
define([
  // Application.
  "app",
  'https://www.google.com/jsapi',
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Chart = app.module();

  // Default Model.
  Chart.Model = Backbone.Model.extend({
    defaults: { 
      type: 'barchart',
      title: "",
      options: {
        "width":600, 
        "height":400
      },
      data: []
    }
  });

  // Default Collection.
  Chart.Collection = Backbone.Collection.extend({
    url: function() {
      return "http://jribeiro.github.io/backbone-google-charts/app/data/chart.json";
    },

    cache: false,

    model: Chart.Model
  });

  Chart.Views.List = Backbone.View.extend({
    template: "chart",
    initialize: function() {
      google.load('visualization', '1', {
        'callback': _.bind(this.drawVisualization, this),
        'packages': ['corechart']
      });
    },

    serialize: function(){
      return { collection: this.options.charts };
    },

    drawVisualization: function() {
      _.each(this.options.charts.models, function(model){
          this.data = new google.visualization.arrayToDataTable(
          this.parseData(model.get('data'))
        );

        this.options = {
          title: model.get('title'),
        };

        $.extend(this.options, model.get('options'));

        //In draw visualization
        switch(model.get('type')){
          case "barchart":
            this.chart = new google.visualization.BarChart(this.$('#gviz-' + model.cid).get(0));
            break;
          case 'columnchart':
            this.chart = new google.visualization.ColumnChart(this.$('#gviz-' + model.cid).get(0));
            break;
          case 'areachart':
            this.chart = new google.visualization.AreaChart(this.$('#gviz-' + model.cid).get(0));
            break;
          case 'linechart':
            this.chart = new google.visualization.LineChart(this.$('#gviz-' + model.cid).get(0));
            break;
          default:
            this.chart = new google.visualization.BarChart(this.$('#gviz-' + model.cid).get(0));
            break;
        }
        
        this.chart.draw(this.data, this.options)
      }, this)
    }
  });

  // Return the module for AMD compliance.
  return Chart;

});
