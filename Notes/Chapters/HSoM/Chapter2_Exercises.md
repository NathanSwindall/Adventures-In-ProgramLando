---
layout: post
category: notes
image: /assets/images/HSoM.png
date: 2021-02-23
author: Nathan Swindall
---


## **Chapter 2 Exercises**

### Exercise 2.1 

Create a function with the function signature `twoFiveOne :: Pitch -> Dur -> Music Pitch` that constructs the ii -V -I chord progression. You should be able to supply the function a pitch where the I chord will start. For example, if the function is supplied the (C,4) (C at the fourth octave) then the I chord will start with (C,4) and all the other chords will be the right chords in the chord scale. The ii and V chord will have a duration of d supplied to the function, but the I chord will have a duration of d*2. 

I could not figure out how to solve this problem without using the `absPitch` and `pitch` functions. I decided to also use the tranpose pose function which will take an absolute pitch and move the music up and down accordingly. 

```elm 
cmajor du = c (-1) du :=: e (-1) du :=: g (-1) du --chords to transpose
cminor du = c (-1) du :=: ef (-1) du :=: g (-1) du --chord to transpose
cMajor = c 4 qn :=: e 4 qn :=: g 4 qn --test chord

twoFiveOne p du = let tr = transpose --make code shorter
                      abs = absPitch --make code shorter
                      ii = tr (abs p + 2) (cminor du)
                      v = tr (abs p + 7) (cminor du)
                      i = tr (abs p) (cmajor (du*2))
                   in ii :+: v :+: i

```