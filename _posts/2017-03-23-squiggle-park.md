---
layout: post
title: "Squiggle Park"
author: Alex Lockhart
categories: experience
tags: [MongoDB, Express.js, React.js, Node.js, Unity3D, Google Cloud Platform]
image: /img/squigglepark.jpg
image_alt: Squiggle Park
---

Squiggle Park is an ed-tech company with the purpose of helping children learn how to read.
At Squiggle Park, I was a Full Stack Developer, working on both the app for children and the online dashboards for teachers and parents.

### App

Written in the Unity3D engine, the app was a set of games to help children learn to read.  Children would progress through a series of stages and worlds that would test their reading ability, requiring more knowledge to progress as they moved through the games.

Whenever a child completed a stage, their data from that stage was sent to our servers, where it was aggregated and displayed to their teacher on the dashboard.

### API

Written in Express.js, using Mongoose to connect to our MongoDB instances.  The RESTful API was the intermediary between the App and the Dashboard - as children complete a game, their progress is sent to the API which saves it to the document store.  When a teacher requests information for their class, the API fetches it from MongoDB and returns it to the Dashboard to be displayed.

### Dashboard

The dashboards were a React.js app, hosted on Google Cloud Platform in a Docker container along with the API.  The dashboards would communicate with the API using a JWT token to authorize and authenticate.

The dashboards were meant to assist a teacher with a data driven approach to their curriculum.  The dashboard would show aggregations for their class to see where the struggle points are, as well as allow drilling down into the data for a single student to cater to their specific needs.
