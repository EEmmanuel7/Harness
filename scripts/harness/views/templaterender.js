define(
[
   'underscore'
],
function (_) {

   function TemplateRender(template, data)
   {
      _.templateSettings = {
         evaluate:    /\{\{#([\s\S]+?)\}\}/g,            // {{# console.log("blah") }}
         escape:      /\{\{\{(\s*(\w|\.)+?\s*)\}\}\}/g,         // {{{ title }}}
         interpolate: /\{\{(\s*(\w|\.)+?\s*)\}\}(?!\})/g  // {{ title }}
         
      };
   }

   TemplateRender.prototype.Render = function(template, data)
   {
      return _.template(template, data);
   };

   return (TemplateRender);
});