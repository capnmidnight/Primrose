function template(locals) {
    var pug_html = "", pug_mixins = {}, pug_interp;
    var locals_for_with = locals || {};
    (function(ajax) {
        if (ajax) {} else {
            pug_html = pug_html + "<!DOCTYPE html><html><head></head><body><div>Hello World</div></body></html>";
        }
    }).call(this, "ajax" in locals_for_with ? locals_for_with.ajax : typeof ajax !== "undefined" ? ajax : undefined);
    return pug_html;
}