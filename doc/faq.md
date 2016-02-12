# Frequently Asked Questions

## "What is Primrose?"
* Primrose is a web development framework for building virtual reality experiences 
  in the web browser.
* Primrose is a rapid application development tool for prototyping VR user interfaces.
* Primrose is a 3D chatroom.
* Primrose is a live-programming environment.
* Primrose is a collection of best-practices for building VR applications.
* Primrose is a collaborative editing tool.
* Primrose is a tool for building collaborative tools.
* Primrose is a system for networking real-world devices together and presenting
  them in one virtual environment.
* Primrose is love.

Primrose is all of these things.

## "What is not Primrose?"
Primrose is not a fully-featured game development framework. The purpose of Primrose
is to explore productivity applications. VR is very taxing on graphics resources,
which can leave the business-need of the application starved. Thus, graphics fidellity
in Primrose is kept simple so as to ensure compatability with older devices.

## "But what do you do with it?"
The tools that Primrose provides are meant to enable experimentation with the VR
form, to try out new ideas in user interface design and figure out what works best
in VR. As different types of interactions become common and accepted as best-practice
in the VR community, they will be added to Primrose as part of the basic building
blocks of development.

To that end, Primrose focuses on a small subset of what could be possible with VR.
It provides a physical world--think of it like a desert wasteland, to be used as
a blank canvas--in which the user stands and freely moves about to interact with
objects directly. While we recognize that VR can potentially present far more diverse
experiences than strictly literal interpretations of time and space, we feel that
this limitation helps focus the user towards productive goals.

## "What License does Primrose use?"
Primrose is free, open source software ([GPLv3](https://github.com/capnmidnight/Primrose/blob/master/LICENSE.md))
and may readily be used with other [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software)
projects.

## "But the resolution on the Oculus Rift DK2 is awful!"
This is certainly a problem, but there isn't much to do about it, and we believe
it will not be a problem in the near future. We are developing Primrose to be able
to develop other products to be ready at that time.

## "How do I contribute to Primrose?"
To simplify licensing issues, contributions to Primrose require a copyright assignment
to me, Sean T. McBeth. Please include your name and email address in the 
[CONTRIBUTORS.md](https://github.com/capnmidnight/Primrose/blob/master/CONTRIBUTORS.md)
file with your pull request. This will serve as your copyright assignment.

## "Why not use Unity/Unreal Engine?"
Unity and Unreal Engine are game development engines that are focused on game development
concerns. As such, they are primarily centered on the 3D content pipeline and native,
desktop applications performance. These concerns do not mesh well with the fast-paced
environment of web development.

The tooling and data formats that Unity and Unreal Engine use are
largely proprietary, or resistant to integration with other, open-source tools.
We feel that web development works best when it is freely available to everyone. 
Free as in beer. Free as in freedom.

Finally, we believe that the web browser makes for an excellent deployment platform.
Everyone has a web browser on their laptops and phones. Targeting the web browser
allows us to skip large concerns for how to build cross-platform applications.

## "But didn't Mozilla abandon Canvas for [Bespin/SkyWriter](https://mozillalabs.com/en-US/skywriter/)?"
Mozilla abandoned Bespin as a project *entirely*, choosing to adopt Ace for convenience
and time-cost purposes instead. Also, their requirements had no need for the text
to be an image. We specifically need an image to use as a texture on 3D objects.
Primrose fulfills a different purpose than Bespin.

## "Why not [Ace](http://ace.c9.io/#nav=about)/[CodeMirror](https://codemirror.net/)?"
There are a few browser-based source code editor projects that render to DOM elements,
with Ace and CodeMirror probably being the most popular. All solutions involving
overlaying of HTML elements on top of a base Canvas element do not composite well
in WebGL contexts. This may work fine in 2D, where elements are built in layers,
but in 3D the HTML Element is not a part the scene and does not participate in
depth buffering. The text will always be a 2D element masquerading in a 3D world,
never overlapping properly with other objects in the scene.

## "Why not [Carota](https://github.com/danielearwicker/carota)?"
Carota is a fine project, but it is intended for rich-text editing. We don't
want the user to be in control of the styling of a document, unless they are
specifically changing the styling of a theme to apply to the syntax-highlighted
text.

## "Why not [CodeChisel3D](http://kra.hn/projects/live-programming-with-three-and-webvr) or [Textor](http://www.lutzroeder.com/html5/textor/)?"
We didn't know about CodeChisel3D or Textor at the time that we started this project.
CodeChisel3D is based on an adapted version of Ace called [Three-CodeEditor](https://github.com/rksm/three-codeeditor).
Textor is another from-scratch text editor, written in TypeScript, that draws directly
to Canvas. They both look like a fine projects. Primrose is meant to be more than
just a text editor. It's a general-purpose application framework for building
productivity apps.