---
layout: post
category: tech
title: Installing Euterpea
image: /assets/images/2.jpg
summary: Dealing with Haskell ghc hell!
date: 2021-02-19
author: Nathan Swindall
---

## Haskell journey so far

I had a bunch of haskell pdf files on my computer and after looking through them I noticed an oddball one called [The Haskell School of Music](https://www.amazon.com/dp/1108416756/ref=as_sl_pc_tf_til?tag=swindeasy-20&linkCode=w00&linkId=1f297539b90e1231447b434e24313aa0&creativeASIN=1108416756). The first edition was originally by a yale professor by the name of Paul Hudak who was on the design team for the haskell language. He has unfortunately since past away, but a new edition by one of his students has created a more updated version of the book. 

The book was very different from many of the other haskell books I was looking at during this time years ago. For one, it was written more for an audience of computer musicians and less so for the typical programmer who would normally pick up the book. Usually haskell books like the golden standard book to get started on, [Learn you a haskell for great good](https://www.amazon.com/dp/1593272839/ref=as_sl_pc_tf_til?tag=swindeasy-20&linkCode=w00&linkId=5b88e2027b67777d92f75811ddfbfa5c&creativeASIN=1593272839), start off with the most basic of basics when introducing this purely functional language, but Hudak's book starts off by throwing you more into the deep end with composing simple melodic lines using the Euterpea library. 

I will say that this is definitely not the only book you will need in your journey when learning haskell, as there are quite a few areas that are lacking in a good explanation for the newbie to Haskell. I think the best book I have encountered so far in learniing haskell is [Get Programming with Haskell](https://www.manning.com/books/get-programming-with-haskell?utm_source=Swindeasy&utm_medium=affiliate&utm_campaign=book_kurt_get_3_16_18&a_aid=Swindeasy&a_bid=766c7388) by [William Kurt](https://www.countbayesie.com/about). This book solidified any of the basic haskell questions I was confused about with other books such the dreaded monad and other concepts such as creating your own type classes and the pure function which always confused me for some reason. 


## Restarting My Haskell Journey

Recently, I have returned to haskell because it is an incredibly fun and interesting language to program in. As said by many other people who have used it, it definitely makes you think differently about your programs. For window users, installing haskell used to be incredibly easy because you had an executable that was a few clicks away from having haskell on your system. The new way involves setting up choclately which I initally was a little annoyed about, but it is actually a nice setup once you get past the installation. I can install multiple versions of haskell on my machine very easily and swich between the different ghc versions by changing my path variables. 

One area that I feel other languages have spoiled me in such a node.js is a good build tool. Stack is great, but if you are using the Euterpea library then you must use cabal. This isn't really that bad until you get a fun error when running the command `cabal v1-install Euterpea` after just installing haskell. 

```haskell
Resolving dependencies...
Starting     HCodecs-0.5.1
Building     HCodecs-0.5.1
Failed to install HCodecs-0.5.1
Build log ( C:\Users\Natha\AppData\Roaming\cabal\logs\ghc-8.10.2\HCodecs-0.5.1-HoGPFxXOivy8ZMyEXBkVIu.log ):
Preprocessing library for HCodecs-0.5.1..
Building library for HCodecs-0.5.1..
[1 of 7] Compiling Codec.ByteString.Builder ( src\Codec\ByteString\Builder.hs, dist\build\Codec\ByteString\Builder.o )

src\Codec\ByteString\Builder.hs:79:1: warning: [-Wunused-imports]
    The import of `Data.Semigroup' is redundant
      except perhaps to import instances from `Data.Semigroup'
    To import instances alone, use: import Data.Semigroup()
   |
79 | import Data.Semigroup
   | ^^^^^^^^^^^^^^^^^^^^^
[2 of 7] Compiling Codec.ByteString.Parser ( src\Codec\ByteString\Parser.hs, dist\build\Codec\ByteString\Parser.o )

src\Codec\ByteString\Parser.hs:143:5: error:
    `fail' is not a (visible) method of class `Monad'
    |
143 |     fail  err  = Parser $ \(S _ _ bytes) ->
    |     ^^^^
cabal: Leaving directory 'C:\Users\Natha\AppData\Local\Temp\cabal-tmp-18588\HCodecs-0.5.1'
cabal.exe: Error: some packages failed to install:
Euterpea-2.0.7-CSbXmaYznpjA8xmJlnkreb depends on Euterpea-2.0.7 which failed
to install.
HCodecs-0.5.1-HoGPFxXOivy8ZMyEXBkVIu failed during the building phase. The
exception was:
ExitFailure 1
```