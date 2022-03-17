# The Adventures of Captain Callisto

A short 3D action game for the 2021 js13kGames Competition.

Our hero, Captain Callisto, blasts through space, seeking adventure. What will he find?

Play here: <https://js13kgames.com/entries/the-adventures-of-captain-callisto>

Controls:
* Arrow keys or WASD to move
* Z or spacebar to jump
* X or shift to jetpack
* R to restart level
* M to toggle music
* Escape to show main menu

Demo video:

https://user-images.githubusercontent.com/749094/133300747-98fbe8bd-565e-45a5-8b70-4fd4c5529d7e.mp4

## Branches

`submission` branch was submitted for the competition

`main` branch includes post competition bug fixes

## Develop

Install: `npm install`

Fast build: `npm run dev`

Release build: `npm run build`

## Retrospective

The compo is over. To my delight, The Adventures of Captain Callisto won [3rd place overall](https://2021.js13kgames.com/#winners)! It was also voted #2 for Theme and #4 for Graphics.

[FreeCodeCamp](https://www.freecodecamp.org/) made a [video about the top 20 entries](https://www.freecodecamp.org/news/20-award-winning-javascript-games-js13kgames-2021-winners/). Here is the section on Calliso, where I discuss goals and some technical details:

https://cody.ebberson.com/js13k-callisto/codyebberson-callisto-2021-10-25.mp4

This was my third time participating. In 2018, I submitted [JS13K Battlegrounds](https://github.com/codyebberson/js13k-battlegrounds), a multiplayer battle royale. In 2020, I entered [Minipunk](https://github.com/codyebberson/js13k-minipunk), a cyberpunk 3rd person action game.

In those entries, my goal was to create an impressive technical demos. They did well graphically, but they weren't considered "fun". I also noticed that a significant portion of the js13k audience does not particularly enjoy 1st person or 3rd person games.

My goal this year was to make something "fun", relatively easy (at least for the first few levels), and something with a more global appeal. I took a lot of inspiration from 3d Mario and Zelda games.

### Graphics

The rendering engine uses WebGL2. There were 3 new features added to the previous version:

First, [instanced rendering](https://webgl2fundamentals.org/webgl/lessons/webgl-instanced-drawing.html). This is built into WebGL2 without requiring extensions. The net impact is that it makes it faster and easier to

Second, spheres. Lots of spheres. The combination of instanced rendering and sphere geometry provided the building blocks for most of the characters, enemies, and items in the game. It felt good to throw spheres into the scene, and maintain 120 fps without breaking a sweat.

Third, [shadow maps](https://webgl2fundamentals.org/webgl/lessons/webgl-shadows.html). I don't know how much this actually contributed to the overall experience, but I had a lot of fun learning about projected textures, shadow maps, shadow acne, etc.

In the next version, I hope to add a few more advanced rendering techniques such as [SSAO](https://en.wikipedia.org/wiki/Screen_space_ambient_occlusion) and [Depth of Field](https://en.wikipedia.org/wiki/Depth_of_field) filtering.

### Audio

For audio, I used [ZzFXM](https://keithclark.github.io/ZzFXM/) by [Keith Clark](https://twitter.com/keithclarkcouk) and [Frank Force](https://twitter.com/KilledByAPixel). The music is a transcribed version of [Milky Way by Ben Prunty](https://benprunty.bandcamp.com/track/milkyway-explore). The sound effects were the result of spending way too much time playing with [ZzFX Sound Designer](https://killedbyapixel.github.io/ZzFX/).

Next year I hope to use some form of FM Synthesis or Modular Synthesis. I am completely addicted to [Andrew Huang](https://www.youtube.com/channel/UCdcemy56JtVTrsFIOoqvV8g)'s videos such as [Modular synthesis EXPLAINED](https://www.youtube.com/watch?v=cWslSTTkiFU) or [5 Techniques for Generative & Ambient Music](https://www.youtube.com/watch?v=uNz1XfVfJak). I think these will translate well to the JavaScript audio API.

### Tools

For tools, I continued with [Google Closure Compiler](https://github.com/google/closure-compiler), but the major breakthrough tool was [Roadroller](https://lifthrasiir.github.io/roadroller/) by [Kang Seonghoon](https://mearie.org/). In the past, I had looked at [RegPack](https://siorki.github.io/regPack.html), but it couldn't handle 20kb input. Kang Seonghoon created the industrial strength version of RegPack, which is perfect for js13k. The tool was released in the middle of the competition, and it was essentially a gift of roughly 5kb additional space. In the end, this project was not size constrained at all.

Next year, I intend to use [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/) in the toolchain from day one. TypeScript is fantastic for providing structure and discipline to the code, and frequently catches hidden bugs. Vite is lightning fast, and provides a delightful dev experience. I have become spoiled in my day job. I can't be bothered to manually restart dev servers or manually hit the refresh button anymore.

### What went right

* Core prototype was done in the first week. This step gets easier every year, as my js13k engine stabilizes, and I continue to tweak it throughout the offseason.
* New rendering techniques all look nice. The game received a fair amount of praise for graphics.
* The non-gameplay features such as the opening scene, after-level cutscene, and end-of-game cutscene were all praised.
* The game was fun! People actually liked it!

### What could be better

* I still have a tendency to add features rather than exploring fun or novel gameplay. The level design was simplistic, primarily because I didn't spend enough time on it.
* I didn't have a clear vision of what I was trying to build. I wanted something slower and more thoughtful, such as [Captain Toad Treasure Tracker](https://www.nintendo.com/store/products/captain-toad-treasure-tracker-switch/), but that wasn't natural, and I defaulted to more action and jumping.
* The jetpack mechanic was fun, but landing was difficult due to depth issues. This was not game breaking, but it added cognitive load.
* The audio was not cohesive. For example, the sound effects are out of key with the music, which sounds off.

### Closing Thoughts

The js13k competition is one of the highlights of my year. I have a blast every time.

Kudos to:
* [Ryan Malm](https://twitter.com/ryanmalm) for the excellent [Space Garden](https://js13kgames.com/entries/space-garden), which deservedly won the competition
* [Matthew Diamant](https://twitter.com/lawofdemeter) for [Welcome to Space](https://js13kgames.com/entries/welcome-to-space), which I thought was the most "fun" entry this year
* [Dominic Szablewski](https://phoboslab.org/) for the insanely impressive [Q1K3](https://js13kgames.com/entries/q1k3), a proper Quake clone
* [XEM](https://xem.github.io/) for [LOSST](https://js13kgames.com/entries/lossst-a-snake-in-space) and producing so much content on code golfing
* [jaburns](https://jaburns.net/) for [Galaxy Rider](https://js13kgames.com/entries/galaxy-rider) and always being available in Slack for play testing

Can't wait for next year.

## Acknowledgements

[Keith Clark](https://twitter.com/keithclarkcouk) and [Frank Force](https://twitter.com/KilledByAPixel) for [ZzFXM](https://keithclark.github.io/ZzFXM/)

[Nicholas Carlini](https://nicholas.carlini.com/) for the starfield shader in [Yet Another Space Shooter](https://github.com/carlini/js13k2020-yet-another-space-shooter)

[Kang Seonghoon](https://mearie.org/) for [Roadroller](https://lifthrasiir.github.io/roadroller/)

Music: [Milky Way by Ben Prunty](https://benprunty.bandcamp.com/track/milkyway-explore)

## License

MIT
