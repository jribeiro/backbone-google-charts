define([
  // Libraries.
  "jquery",
  "underscore",
  "backbone",

  // Plugins.
  "plugins/backbone.layoutmanager"
],

function($, _, Backbone, Handlebars) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/"
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.Layout.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: "app/templates/",

    fetch: function(path) {
      // Check for a global JST object.  When you build your templates for
      // production, ensure they are all attached here.
      var JST = window.JST || {};

      path = path + ".html";

      // If the path exists in the object, use it instead of fetching remotely.
      if (JST[path]) {
        return JST[path];
      }

      // If it does not exist in the JST object, mark this function as
      // asynchronous.
      var done = this.async();
      
      // Fetch via jQuery's GET.  The third argument specifies the dataType.
      $.get(path, function(contents) {
        // Assuming you're using underscore templates, the compile step here is
        // `_.template`.
        done(_.template(contents));
      }, "text");
    }
  });

  // Let's extend the views
  _.extend(Backbone.View.prototype, {
      parseData: function(obj){
      var data    = [];

      _.map(obj, function(row){ 
        if(data.length == 0)
          data.push(_.keys(row));

        data.push(_.values(row));
      });
      //_.keys())
      return data;
    }
  });


  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(name, options) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
        return this.layout;
      }

      // If a layout already exists, remove it from the DOM.
      if (this.layout) {
        this.layout.remove();
      }

      // Create a new Layout with options.
      var layout = new Backbone.Layout(_.extend({
        template: name,
        className: "layout " + name,
        id: "layout"
      }, options));

      // Insert into the DOM.
      $("#main").empty().append(layout.el);

      // Render the layout.
      layout.render();

      // Cache the refererence.
      this.layout = layout;

      // Return the reference, for chainability.
      return layout;
    }
  }, Backbone.Events);

});
