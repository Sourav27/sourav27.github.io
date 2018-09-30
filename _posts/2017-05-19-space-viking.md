---
layout: post
title: "Space Viking"
author: Alex Lockhart
categories: project
tags: [Node.js, React.js]
image: /img/space-viking.png
image_alt: space viking
code: https://github.com/salockhart/SpaceVikingJS
demo: http://alexlockhart.ca/SpaceVikingJS/
---

Space Viking is the rewrite in React of a project that I worked on my first year at Dalhousie University.  It is a text adventure game that takes you through the halls of a derelict vessel, searching for the reactor core in order to save the galaxy.

### Original

The [original Space Viking](https://github.com/mtrask/CSCI1101-group_project) was a Java project that took input and output directly from the command line.  ANSI color codes were used to color the text and give it some flavor, but it existed solely as a CLI, starting up when you ran the class files.

Eventually, I took it upon myself to try and make it standalone, and more accessible to a wider audience.  [I forked the original project](https://github.com/salockhart/space-viking) and began the process of moving it over into JFrames.  However, the migration languished and as of now the JFrame implementation is workable, though filled with graphical errors.

### React

Years later, I figured it was time to bring Space Viking out from the attic, dust it off, and make it a bit more presentable.  I decided to remake the original implementation for the web, using React.  This makes it much more portable than building a JAR, and means that an even wider audience will be able to enjoy our (arguably horrendous) game.

The design of the React implementation borrows heavily from [terminal-snazzy](https://github.com/sindresorhus/terminal-snazzy), my terminal color theme of choice, and [pure](https://github.com/sindresorhus/pure), my zsh theme of choice.  The prompt is bored from pure; the colors from terminal-snazzy.

The final implementation in React is very similar to the original - for instance, the Java classes that were used in the original were brought over nearly identically save for syntax.  

The biggest changes are to how the game was moved forward.  In the Java implementation, the input scanner simply waited for the next input in a big while() loop.  Since looping for input isn't really how the web works, the architecture was changed to allow turning on and off input, and how to react once an input was given.

The other big change was in how input was handled.  Before, the input would pass through far too many nested for-loops in order to reach the code that needed to be executed.  In the React implementation, a new class handles all of the input with different function handlers that can be called based on a configuration file.

### Future Work

Space Viking is not without bugs - for instance, when running the large introduction scripts, the page does not scroll with the typing.  These bugs will be ironed out in time, but as a one-off project that not many will play, it will be fine for the time being.

The biggest hope for the future is that Space Viking will be split off into a Muli-user Dungeon, or MUD.  Using some of the same tools to design Space Viking, the hope is to build a server and communicate using Websockets in order to converse with other people in the same room of the ship as you.