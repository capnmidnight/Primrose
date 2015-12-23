/* global Primrose */

Primrose.ButtonFactory = ( function () {

  var buttonCount = 0;

  function ButtonFactory ( templateFile, options ) {
    this.options = options;
    if(typeof templateFile === "string"){
      Primrose.ModelLoader.loadObject( templateFile, function ( obj ) {
        this.template = obj;
      }.bind( this ) );
    }
    else{
      this.template = templateFile;
    }
  }


  ButtonFactory.prototype.create = function ( toggle ) {
    var name = "button" + ( ++buttonCount );
    var obj = this.template.clone();
    var btn = new Primrose.Button( obj, name, this.options, toggle );
    return btn;
  };

  return ButtonFactory;
} )();
