---
layout: post
category: notes
image: /Notes/assets/images/ElmInAction.jpg
summary: A fast and functional front-end technology
date: 2021-03-09
author: Nathan Swindall
---

## **Random Numbers in Elm**

Random numbers are not really allowed in Elm... or well they are handled quite differently than they are in JavaScript. Elm can only produce a random generator because elm must have no randomness or side effects in order to keep referential transparency, or in other words, the ability for a function given the same arguments must return the same result every time. 

If Elm can't do random numbers, then how are we supposed to get random numbers into our frontend apps. Well, elm will produce a Random Generator which will be sent as a command to the Elm runtime in order to get random numbers. The Elm runtime is what handles all the "dirtiness" of side effects and other ghoulish code that does not abide by the aforementioned referential transparency law. 

There are ways in order to actually get pseudo random numbers in Elm code without using the Elm runtime. Using it this way as more a pedagogical method can really help understand the Random module in elm and all of its kinks. First off, in order to actually use the Random module in elm, you must add it as a dependency to your elm json file if you have already started a project. The command is `elm install elm/random`. 

In order to do pseudo randomness in code you will need to produce a seed. There is a function in the Random module for doing this which is `initialSeed`. 

Thus we could create a shorthand function

```elm
seedGen : Int -> Random.Seed
seedGen = Random.initialSeed
```

In order to produce a Random number we will not only need a seed, but also a Generator. We can use the function `Random.int` in order to get a generator that random picks a number between to supplied numbers. The function signature for `Random.int` is: 

```elm
Random.int : Int -> Int -> Random.Generator Int
```
Notice that it requires two numbers which will be our range and then gives us back a type `Random.Generator Int`. This `Random.Generator` is what gets sent back to the Elm runtime. 

But I bet you are wondering to yourself right now, "Can we get a Random.Generator without going through the elm runtime". Yes there is actually a function that can do this for us in the random module. 

```elm
Random.step : Generator a -> Seed -> (a, Seed )
```

This function above takes a Generator and a seed and gives us back a tuple which has our random number and the seed to produce it. In order to get rid of the tuple and to just have the random number, we will use the Tuple module in Elm because it has a function perfect for this. Or you can use pattern matching to make your own function. 

Pattern matching
```elm
myFirst : (a,b) -> a
myFirst (a,b) = a
```

With Tuple Module
```elm
import Tuple
myRandom : Int -> Int
myRandom seed = Random.step (Random.int 0 100) (seedGen seed) |> Tuple.first
```

Now, what if we don't like the hard coded range in our function, but wanted to change it at will. We can actually further generalize myRandom by making it accept any Random.Generator function. 

```elm
myRandom : Int -> Random.Generator b -> b
myRandom seed ranFunc = Random.step (ranFunc) (seedGen seed) |> Tuple.first
```

Thus, we could have a repl session like this

```elm
> myRandom 2 (Random.float 0 1000)
544.2968743432962 : Float
````

Usually for out programs we don't want to hard code anything in there, so we can make a type that returns a Random.Generator type like the following.

```elm
randomPhotoPicker : Random.Generator Int 
randomPhotoPicker = 
    Random.int 0 2
```

Then, once we have this function we are going to want to put it in a message that can be sent to the elm runtime using the update function. In order to do this, we need a new function in the Random module which is `Random.generate`. 

```elm
Random.generate : (a -> msg) -> Generator a -> Cmd msg
```

This function will take a function that returns a message and then a generator like from our `randomPhotoPicker` function. We will make an example type in order to make a `Cmd msg` type. 

```elm
type Msg = RandomMsg Int
```

Since we are getting a random Int type, we need the `RandomMsg` to have an Int with it which will be the random value that we get back from the elm runtime. Thus, to make the Cmd we can do the following. Remember that the type for `RandomMsg` is actually a function of type `Int -> Msg`

```elm
exampleCmd = Random.generate (RandomMsg) randomPhotoPicker
```

Another cool function that we can use is the `Random.weighted` function. This function will actually weight out different possiblities differently, so in effect you could make cool function that could model something as amazing as loaded dice. But before we write that tasty function, we should probably get back to the building blocks for programming which are the basics, and there is nothing more basic than a `Bool`. 

But first the type signature of `Random.weigthed`.

```elm
Random.weighted : ( Float, a ) -> List ( Float, a ) -> Generator a
```

```elm
myRandomBool : Random.Generator Bool
myRandomBool = 
    Random.weighted (80, True) [(20, False)]
```

*Quick Elm Repl*
```elm
> myRandom 2 myRandomBool                                                    
True : Bool
```

Let's actually make a random event for a loaded dice. The cool thing is that you can give all your numbers whatever weights you want, and they are floats too. I am just going to give all the sides completely 'random' weights as an example.

```elm
loadedDice = 
    Random.weighted (10, 1) [(2, 2), (3,3), (10, 4), (30, 5), (100, 6)]
```

The last function in this article is another very useful function which is the `Random.uniform` function. The signatures is as follows. 

```elm
Random.uniform : : a -> List a -> Random.Generator a
```

The random uniform takes a list of elements and makes a uniform distribution over these elements so that they all have equal probability of being chosen. The function takes the first element of the list and then tail of the list. Here is an example function using the `Maybe` type because the list might be empty. 

```elm
uniform : Int -> List a -> Maybe ( a, Random.Seed )
uniform seed hs = 
        case hs of 
        [] -> Nothing 
        (l::ls) -> Just (myRandom seed (Random.uniform l ls))
```










