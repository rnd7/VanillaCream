# VanillaCream
This is an early version of a WebComponent micro framework for lazy browser-based user interface development. Even though the current version of this framework is somehow feature complete, I do not recommend using it in production context. Nothing is stable.

## What?
Forget React, Vue, Angular. NPM remove webpack, babel, typescript. VanillaCream is all you need. It's simple, fast and tiny. Speak the language of your runtime.

* Dead simple and probably fast.
* The complete source code is less than 20kb.
* Write beautifully valid ES6 code with almost no boilerplate.

That's all not meant to be taken too seriously. I just had fun trying out a different approach.

## Look, it's mutable!
Mutability and references are cool stuff. Keep your hierarchy, no need to normalize your data.

## Try it now.
Check out the pirate favorite stew recipe App.

🚀 [Basic example](https://rnd7.github.io/VanillaCream/src/index.html)

## Concept

The dogma: Pure ES6. No transpiling. No dependencies. 

The objectives: All you need to efficiently update your UI. Self explanatory API that just works. Browser and Node.js support. Easy serialization and deserialization. Straight forward use of web components. Lazy stylesheet and template loading. Dynamic and efficent user interface updates. Atomic failsafe dom rendering. Memory leak avoidance. 

At its core there is the `WebComponent` Class you can derive your own Components from. Then there are two wrapper functions to use with your object oriented data model, one called `wrapInstance` to bind properties of class instances and another named `wrapList` that binds all relevant Array methods to simple event system.

## Motivation

This project was inspired from the experience gained during various experiments, such as UI & data model of the AwesomeWaveSplineMachine for example. Slowly it all comes together and I am even planning to update some of my previous projects to use this library.