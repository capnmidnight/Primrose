# Primrose

Primrose is a WebVR framework that lets web developers create virtual reality experiences for standard web browsers on desktop and mobile devices alike.

WebVR is an [experimental Javascript API](https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API) that provides access to Virtual Reality devices and peripherals in the browser. See [WebVR.info](https://webvr.info/) for more information and resources.


# Getting started with Primrose

## Contributing

If you're interested in contributing to the framework, we'd love to have you involved. Primrose is open to contributors of all skill levels and we are ready and willing to help beginners work through issues. Please [read the guidelines](https://github.com/NotionTheory/Primrose/blob/master/CONTRIBUTING.md) for contributing before doing so.

If you don't want to write code or you don't have a lot of spare time, you still can help! Testing the various demos to make sure we haven't broken any features and filing issues when we do is very important.

Our GitHub contributors so far:

https://github.com/NotionTheory/Primrose/contributors
You can add your name to it! :)

The easiest way to get started is to check the issues list for issues with the `first-timers-only` label.

## Issues

Our [Issues List](https://github.com/NotionTheory/Primrose/issues) is here on GitHub. If you're a brand new developer, please take a look at our Issues List and find an issue labeled `first-timers-only`. These are introductory tasks that we have reserved that will gently guide you into getting the project setup on your machine and get used to working on the code base.

<a href="http://www.firsttimersonly.com/"><img src="http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square" alt="first-timers-only"></a>

## Project Setup

You first want to setup a new project using `npm init`, and then follow the prompts.

Once you have created your new project, install Primrose using the following command: `npm install --save primrose`

Next create a basic `index.html` file in your project directory and include the `node_modules/primrose/Primrose.min.js` script and the `app.js` script , like so:

````html
// index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript" src="node_modules/primrose/Primrose.min.js"></script>
	<script type="text/javascript" src="app.js"></script>
    <title>My Primrose VR Application</title>
  <body>
    <h2>hello world</h2>
  </body>
</html>
````

Then create an `app.js` script page that creates a new `Primrose.BrowserEnvironment`, like so:

````javascript
// app.js
var time = 0,

  boxes = [],

  env = new Primrose.BrowserEnvironment({
    useGaze: isMobile,
    useFog: true,
    enableShadows: true,
    groundTexture: 0x606060,
    backgroundColor: 0xd0d0d0,
    fullScreenButtonContainer: "body"
  }).on("ready", function() {

    // Perform any post-initialization setup. Once this event fires, the
    // Primrose framework is ready and will start animation as soon as this
    // function returns.
    for(var i = 0; i < 100; ++i) {
      boxes.push(box(0.125)
        .colored(Primrose.Random.color(), {
          shadow: true
        })
        .named("box" + i)
        .addTo(env.scene)
        .on("select", function() {
          this.visible = false;
        }));
    }

  })
  .on("update", function() {

    // Perform per-frame updates here, like moving objects around according to
    // your own rules. The field env.deltaTime tells you how much time passed
    // since the last update, in seconds.
    time += env.deltaTime;
    if(time > 1) {
      time -= 1;
      boxes[Primrose.Random.int(boxes.length)].at(
          Primrose.Random.number(-1, 1),
          Primrose.Random.number(0, 2),
          Primrose.Random.number(-1, -3));
    }

  });

````


Finally, to get our project up and running live in the browser, we need to set up a server. For the purposes of this basic demo, we're going to be using a [static HTML server](https://github.com/NotionTheory/notion-node) which can be included by running the command `npm install --save-dev notion-node` (you can replace with Express or equivalent). Then add a line to the `scripts` section of your `package.json` file, where `<your-project-directory>` is the name of the directory in which you are building your project:

    "scripts": {
      "start": "node node_modules/notion-node/default --path=.. --url=<your-project-directory>/ --port=9001"
    }


Run `npm start` in your terminal to see your application live. If your browser doesn't automatically open, just navigate to `http://localhost:9001/<your-project-directory>` and you should see your page.

# Licensing

Primrose is free, open source software (GPLv3) and may readily be used with other FOSS projects.
