# Frequently Asked Questions

## "You're insane""
Thanks. That's very nice of you to say.

## "What License does Primrose use?"
Primrose is free, open source software ([GPLv3](https://github.com/capnmidnight/Primrose/blob/master/LICENSE.md)) and may readily be
  used with other [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) projects.

## "How do I contribute to Primrose?"
To simplify licensing issues, contributions to Primrose require a copyright assignment
to me, Sean T. McBeth. Please include your name and email address in the 
[CONTRIBUTORS.md](https://github.com/capnmidnight/Primrose/blob/master/CONTRIBUTORS.md)
file with your pull request. This will serve as your copyright assignment.

## "But didn't Mozilla abandon Canvas for [Bespin/SkyWriter](https://mozillalabs.com/en-US/skywriter/)?"
Mozilla abandoned Bespin as a project, choosing to adopt Ace for convenience and
time-cost purposes. Also, their requirements had no need for the text to be an image.
I specifically need an image to use as a texture on 3D objects. Primrose fulfills
a different purpose than Bespin. Content-Editable DOM elements are not the correct solution.

## "Why not [Ace](http://ace.c9.io/#nav=about)/[CodeMirror](https://codemirror.net/)?"
There are a few browser-based source code editor projects that render to DOM elements,
with Ace and CodeMirror probably being the most popular. All solutions involving
overlaying of HTML elements on top of a base Canvas element do not composite well
in WebGL contexts. This may work fine in 2D, where elements are built in layers,
but in 3D the HTML Element is not a part the scene and does not participate in
depth buffering. The text will always be a 2D element masquerading in a 3D world,
never overlapping properly with other objects in the scene.

## "Why not [Carota](https://github.com/danielearwicker/carota)?"
Carota is a fine project, but it is intended for rich-text editing. I don't
want the user to be in control of the styling of a document, unless they are
specifically changing the styling of a theme to apply to the syntax-highlighted
text.

## "Why not [CodeChisel3D](http://kra.hn/projects/live-programming-with-three-and-webvr) or [Textor](http://www.lutzroeder.com/html5/textor/)?"
I didn't know about CodeChisel3D or Textor at the time that I started this project.
CodeChisel3D is based on an adapted version of Ace called [Three-CodeEditor](https://github.com/rksm/three-codeeditor).
Textor is another from-scratch text editor, written in TypeScript, that draws directly
to Canvas. They both look like a fine projects. Primrose is meant to be more than
just a text editor. It's a general-purpose application framework for building
productivity apps.

## "But the resolution on the Oculus Rift DK2 is awful!"
This is certainly a problem, but there isn't much I can do about it, and I believe
it will not be a problem in the near future. I'm developing Primrose to be able
to develop other products to be ready at that time.