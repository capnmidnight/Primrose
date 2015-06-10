/* global Primrose */

Primrose.ButtonFactory = ( function () {

  var buttonCount = 0;

  function ButtonFactory ( templateFile, options ) {
    this.options = options;
    Primrose.ModelLoader.loadObject( templateFile, function ( obj ) {
      this.template = obj;
    }.bind( this ) );
  }


  ButtonFactory.prototype.create = function ( toggle ) {
    var name = "button" + ( ++buttonCount );
    var obj = this.template.clone();
    var btn = new Primrose.Button( obj, name, this.options );
    btn.toggle = toggle;
    return btn;
  };

  return ButtonFactory;
} )();
