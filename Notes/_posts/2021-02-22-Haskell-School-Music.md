---
layout: post
category: notes
title: Haskell School of Music Notes
image: /assets/images/HSoM.png
summary: Making music with functions
date: 2021-02-22
author: Nathan Swindall
---


## Chapter 2


Some basic types in and functions in Euterpea

```elm
type Octave = Int -- making an alias
type Pitch = (PitchClass, Octave) --another alias
type Dur = Rational --alias

--making our own type
data PitchClass = Cff | Cf | C | Dff | Cs | Df | Css | D | Eff | Ds 
                | Ef | Fff | Dss | E | Ff | Es | F | Gff | Ess | Fs 
                | Gf | Fss | G | Aff | Gs | Af | Gss | A | Bff | As 
                | Bf | Ass | B | Bs | Bss

data Primitive a = Note Dur a  --Note Rational (PitchClass, Octave) 
                | Rest Dur -- Rest Note
                    deriving (Show)

Note :: Dur -> a -> Primitive a signature for each constructor function
Rest :: Dur ->      Primitive a

data Music a = 
    Prim (Primitive a)
    | Music a :+: Music a --This is for constructing musical lines
    | Music a :=: Music a  --This is for constructing musical chords
    | Modify Control (Music a)
```


I can make my own data type with functonal data constructors that are actually infix operators just like the infix functional data constructors of the Music type; `:+:` and `:=:`. 

The Euterpea library has many different functions to change a musical line such as the following.

```elm
note :: Dur -> a -> Music a
note d p = Prim (Note d p) --remember that Prim takes a Primitive type which is a Note or Rest
rest :: Dur -> Music a 
rest d = Prim (Rest d)

-- Change the tempo
-- make the music slow or fast
tempo :: Dur -> Music a -> Music a 
tempo r m = Modify ( Tempo r) m

--Change the key
transpose :: AbsPitch -> Music a -> Music a
transpose i m = Modify (Transpose i) m 


--Change the instrument of a piece
instrument :: InstrumentName -> Music a -> Music a 
instrument i m = Modify ( instrument i) m 

--Change the phrase (not sure how to use this)
phrase :: [PhraseAttribute] -> Music a -> Music a 
phrase pa m = Modify (Phrase pa) m 

--Change the keysignature ie, from minor to major scale

keysig :: PitchClass -> Mode -> Music a -> Music a 
keysig pc mo m = Modify (KeySig pc mo ) m

--The different type of modes
data Mode = Major | Minor | Ionian | Dorian | Phrygian
            | Lydian | Mixolydian | Aeolia | Locrian 
            | CustomMode String 

--Notice the customMode type. You can change a piece to your own customer scaling maybe

```

We can construct basic music elements using the Euterpea library based off easy to build function

```elm
note :: Dur -> a ->  Music a
note :: Dur -> (PitchClass, Octave) -> Music (PitchClass, Octave)

Pitch :: (PitchClass, Octave)

--thus 

note :: Dur -> Pitch -> Music Pitch
```

Now let's create a simple ii-V-I chord progression and then make it so that we change the instrument for it. 

```elm
t251 :: Music Pitch
t251 = let dMinor = d 4 2n :=: f 4 wn :=: a 4 wn
           gMajor = g 4 wn :=: b 4 wn :=: d 5 wn 
           cMajor = c 4 bn :=: e 4 bn :=: g 4 bn
        in dMinor :+: gMajor :+:cMajor

--lets change the instrument
cello251 :: Music Pitch
cello251 = instrument Cello minor251

--Let's play this chord progression together with a piano
playCelloPiano :: IO ()
playCelloPIano = play $ t251 :=: cello251 --plays at the same time


--To make the tempo twice as long
sloweriiVI = tempo (1/2::Dur) t251
-- or write
sloweriiVI = tempo (1 % 2) t251
-- or write
sloweriiVI = tempo 0.5 t251

--To make the tempo twice as short
fasteriiVI = tempo (2::Dur) t251
```


I have an idea where I want to keep transposing the ii-V-I progression down a half step for 8 rounds. Thus it will play the progression and then it will play the progression gain but a half step lower and then so on and so forth. I would like to increase the tempo to by this time. How would I go about doing this. 

```haskell

--to transpose a piece I can use the transpose function
transposeDown = transpose (-1) t251
transposeUp = transpose (1) t251


```











