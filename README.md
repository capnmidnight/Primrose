# Primrose: A text editor that draws to Canvas

Primrose[0] is a lightweight[1] text editor control for Web browsers[2]. It can be used as a texture on a WebGL mesh. It includes basic syntax highlighting and keyboard shortcuts.

## A Problem

Say you are writing an HTML5 Single-Page Application, it is primarily based around the Canvas tag--e.g. a game, either 2D or 3D--and you would like to provide an editable text control *within* the Canvas context. You might also like that text control to provide the basic features you've come to expect from most modern text editors, e.g. keyboard shortcuts and syntax highlighting.

You might be tempted to implement your syntax highlighting with a Content-Editable Div or IFrame element, layered on top of the Canvas element. At face value it seems like a good idea: leverage the awesome text formatting power of the browser. Unfortunately, you quickly learn that Content-Editable is built with WYSIWYG editing of emails in mind, where the formatting is directly controlled by the user, not by heuristics defined by the programmer.

But it is possible, and a number of third party controls do it. However, I personally haven't yet found such a third party control that was the right mix of features and ease-of-use for my needs. They usually involve project configurations that don't mesh well with my own projects, or they are tightly integrated into a larger framework of a full WYSIWYG editor.

You might even consider giving up on your dreams and skipping the syntax highlighting altogether, going with a regular, ol' TextArea element instead. Or even if you acquire a working Content-Editable solution[3], you will still have a problem. All solutions that involve overlaying an HTML element do not composite well with your own graphics drawing operations.

In the Graphics2D context, the text will not be an actual part of your image. You won't be able to save the Canvas with the text to an image file. Though this is likely not that big of a concern, it's still a case that Primrose covers.

Much more importantly, in the WegGL context, the HTML Element will not be a part the scene and will not work with any depth buffering. Your text will always be a 2D element masquerading in a 3D world, never overlapping properly with other objects in the scene. You will have to duplicate all of your world and camera transformations from the WebGL context to CSS3 3D transforms[4]. And any form of stereo rendering will require you to keep a secondary HTML element in sync with the edits made in the primary element.

## A Solution

Primrose emulates common features found in text editor controls, drawing directly to a Canvas element. It can be configured to source events from other elements--useful when Canvas is being used as a texture and thus is not a part of the DOM to be able to receive input events. And it is fully programmable, allowing the implementer to customize its operation quickly and easily. It is designed to be a simple, syntax-highlighting source code editor, not an everything-to-everyone WYSIWYG editor.

## Examples

[TBD]

## Licensing

Primrose is free, open source software and may be readily used with other FOSS.

## Contributions

To simplify licensing issues, contributions to Primrose require a copyright assignment to me, Sean T. McBeth. Please include your name and email address in the CONTRIBUTORS.md file with your pull request. This will serve as your copyright assignment.

## Notes

[0] The name is arbitrary.

[1] Note that "lightweight" in the context of GUI controls means "rendered in software", as opposed to "using the native GUI controls provided by the operating system". In this context, we're considering the browser to be a part of the "operating system", as from the perspective of a SPA, it is.

[2] It requires only that your browser implement Canvas and the Graphics2D context in their most common, basic forms. I am not aware of any commonly-used browsers that have not had this feature for several years now.

[3] Or another, obscure solution involving rendering HTML elements in SVG that has a bevy of its own issues involving cross-browser compatibility and security issues.

[4] Violating the DRY principle, and fraught with cross-browser peril.
