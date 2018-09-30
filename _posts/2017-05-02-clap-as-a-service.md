---
layout: post
title: "Clap (As A Service)"
author: Alex Lockhart
categories: project
tags: [Node.js, Bootstrap, Express.js, Heroku, Slack, Github Pages]
image: /img/clap-as-a-service.png
image_alt: clap as a service
code: https://github.com/salockhart/clap-as-a-service
demo: http://alexlockhart.ca/clap-as-a-service/
---

Clap (As A Service) was a project to create an API and front end that would allow the user to easily create [clap tweets](http://knowyourmeme.com/memes/clap-emoji-%F0%9F%91%8F).  This idea was then expanded on in a Slack app that accomplished the same thing.

### API

The initial work was done on creating a web service that would take in a string, and place 👏 emojis between every word.  For this, I used Node.js and Express to handle incoming requests and process them before responding with the result.

Once the initial web service was created, it was expanded to allow for any data to replace the 👏 emoji, such as a 👌.  It would also accept words or phrases, leading to some interesting results.

Postman was my tool of choice for testing at this point - with it, I was able to ensure that the web service worked as required, and that the edge cases were being handled correctly.

The web service was deployed onto a Heroku instance, where it could be queried by anyone wanting to create clap tweets.

### Front End

Once the web service was deployed, I wanted to create a means of demoing it. I settled on using Github Pages, as this website is already being hosted using it, and it would mean that I would be able to host it at the same domain easily.

The website itself was a single page application with a text input and a selector for the emoji that you want to use.  On entering something in the text input, it would automatically be processed and displayed on the page below it.

Bootstrap was used to add basic styling to the page, with jQuery as the main engine behind getting the page to make AJAX requests and display the data from the web service.

### Slack

The final addition to this project that I wanted to add was a Slack app that could take in a command, some text, and an emoji, and call the web service to turn it into a clap tweet.

Initially, I attempted to make a Slack bot that you could talk to, and it would take your messages and turn them into clap tweets.  Sadly, this wasn't something that would then be visible to the other members of a channel.

The solution was to make a full Slack application, and give that application slash commands that would take in an input and print the output to the channel the slash command is in.  The final result was a /clap command that would take in a text entry, and an emoji in slack form (like :clap:) and print the result to your channel.

Because I wanted this application to be on the Slack App Directory, I implemented their OAuth 2.0 exchange, and the app is now [in the directory for anyone to install and use](https://slack.com/apps/A4VJNNV3P-clap-as-a-service).
