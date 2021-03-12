---
layout: post
category: tech
title: Haskell Journey and Euterpea
image: /assets/images/2.jpg
summary: Dealing with Haskell ghc hell!
excerpt: Dealing with Haskell ghc hell!
date: 2021-02-19
author: Nathan Swindall
---


# **Haskell journey so far**

I had a bunch of haskell pdf files on my computer and after looking through them I noticed an oddball one called [The Haskell School of Music](https://www.amazon.com/dp/1108416756/ref=as_sl_pc_tf_til?tag=swindeasy-20&linkCode=w00&linkId=1f297539b90e1231447b434e24313aa0&creativeASIN=1108416756). The first edition was originally by a yale professor by the name of Paul Hudak who was on the design team for the haskell language. He has unfortunately since past away, but a new edition by one of his students has created a more updated version of the book. 

The book was very different from many of the other haskell books I was looking at during this time years ago. For one, it was written more for an audience of computer musicians and less so for the typical programmer who would normally pick up the book. Usually haskell books like the golden standard book to get started on, [Learn you a haskell for great good](https://www.amazon.com/dp/1593272839/ref=as_sl_pc_tf_til?tag=swindeasy-20&linkCode=w00&linkId=5b88e2027b67777d92f75811ddfbfa5c&creativeASIN=1593272839), start off with the most basic of basics when introducing this purely functional language, but Hudak's book starts off by throwing you more into the deep end with composing simple melodic lines using the Euterpea library. 

I will say that this is definitely not the only book you will need in your journey when learning haskell, as there are quite a few areas that are lacking in a good explanation for the newbie to Haskell. I think the best book I have encountered so far in learniing haskell is [Get Programming with Haskell](https://www.manning.com/books/get-programming-with-haskell?utm_source=Swindeasy&utm_medium=affiliate&utm_campaign=book_kurt_get_3_16_18&a_aid=Swindeasy&a_bid=766c7388) by [William Kurt](https://www.countbayesie.com/about). This book solidified any of the basic haskell questions I was confused about with other books such the dreaded monad and other concepts such as creating your own type classes and the pure function which always confused me for some reason. 


# **Restarting My Haskell Journey**

Recently, I have returned to haskell because it is an incredibly fun and interesting language to program in. As said by many other people who have used it, it definitely makes you think differently about your programs. For window users, installing haskell used to be incredibly easy because you had an executable that was a few clicks away from having haskell on your system. The new way involves setting up choclately which I initally was a little annoyed about, but it is actually a nice setup once you get past the installation. I can install multiple versions of haskell on my machine very easily and swich between the different ghc versions by changing my path variables. 

One area that I feel other languages have spoiled me in such a node.js is a good build tool. Stack is great, but if you are using the Euterpea library then you must use cabal (Actually, I found out you can setup stack with Euterpea too). This isn't really that bad until you get a fun error when running the command `cabal v1-install Euterpea` after just installing haskell. 

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

It took me a long time to figure out how to fix this code. It turns out that in order to run the Euterpea library you need `ghc-version`. Unfortunately, I installed the newest version of the ghc compiler on my machine, so at the time of writing this article I have version 8.10.4. 

# **My First Solution**

So, I have found the problem, but how do I install a different version of ghc on my computer. After searching through like a million stack overflow posts I found out you can actually do this pretty easily with chocolately. If you have chocolately, you can install different versions globablly using the command `choco install ghc --version=8.10.2`. But, then when I tried to install the Euterpea Library, I once again ran into the same error as above. This time it was an easy fix. I just need to set my path to the correct ghc version. I am not sure about Mac OS or Linux, but to change the path to a different compiler you just have to put that compiler ahead of you other compilers. If you go to you environment variables on windows, into your system variables, and click on the path variable, you can change the path to your compiler's bin folder. 

Armed with this knowledge, I everything was setup for me to finally install the Euterpea library. You can see the code version of my compiler when I run the below command in my command prompt on windows. 

```elm
C:\Users\Natha>ghc --version
The Glorious Glasgow Haskell Compilation System, version 8.6.5
```

BUT... unfortunately, I getting another error when installing Euterpea. This time it actually seemed to be cabal's falt. I needed a different version of cabal. The version I was greater than version 3, and it seemed that I need a version around 2.4.1. Unfortunately, I did not save the error code I got, but it seemd to signal this. Out of complete frustration, I ended up wiping my system of all the ghc compilers I had installed on my computer and restarted. 

I thought to myself, if I could just download the ghc-8.6.5 platform that used to be available on the Haskell website, then I could easily install the Euterpea library and start making unique algorithmic style computer music. As luck would have it, I found a website that has old Haskell platforms you can download for windows. The website can be found [here](https://www.haskell.org/platform/prior.html). With this I was finally able to install Euterpea succesfully, but it for some reason just did not feel right. I felt like I had to go through all this trouble to install something that should be super simple in my opinion. Coming from node.js, everything was almost too easy to install. 

# **My Second Solution**

After watching Richard Feldmen give a talk on functional program paradigms on youtube, I wanted to really focus and buckle down on learning Haskell and Elm. They are both hard to program algorithmic in, but they make refactoring the most enjoyable experience I have ever had. On a side note, Richard Feldman looks really good for being 72 years old. 

{% assign richardFeldman = "assets/images/richardFeldman.png" | relative_url %} 
<img src="{{richardFeldman}}">

Jokes aside, I decided to pick up *Getting Started with Haskell* just to work throught the examples to remind myself of how to do things. The first thing I jumped to was how to create a Stack project. For some reasons, when I was first learning Haskell, creating your own project and adding dependencies always confused me, but now it seems almost too easy. The Stack [docs](https://docs.haskellstack.org/en/stable/README/) are a little confusing at times, but actually improve and clarify what the Will Kurt says in the book. 

To start a new Stack project, you just run a few commands which are 

```haskell
stack update
stack new <projectName>
```
You will then get something like this. I started a project called `palindrome-checker` which is an example from the book. 


{% assign richardFeldman = "assets/images/haskell_stack.png" | relative_url %} 
<img src="{{richardFeldman}}">

The important file for adding dependencies is the  `package.yml` file. For example, if I want to add the `text` library to my project I would write the following code in my `package.yml`, and run the `stack build` command in order to get the dependences in my project.

```haskell
dependencies:
- base >= 4.7 && < 5
- text
```

The format is pretty strict, so make sure the everything looks like the above code or you will scratching your head for hours wondering why none of your packages get installed. It was at this point that I got the great idea to install the Euterpea library using this method. Thus I added it to the my dependency list. I was thinking it couldn't hurt, and I wasn't expecting much because I thought it could only work with cabal.

```haskell
dependencies:
- base >= 4.7 && < 5
- Euterpea
```

....and of course I quickly got this error after running `stack build`....


```haskell
Error: While constructing the build plan, the following exceptions were encountered:

In the dependencies for palidrome-checker-0.1.0.0:
    Euterpea needed, but the stack configuration has no specified version  (latest matching version is 2.0.7)
needed since palidrome-checker is a build target.

Some different approaches to resolving this:

  * Recommended action: try adding the following to your extra-deps
    in C:\Users\Natha\Desktop\BlogAndYoutube\Haskell\StackAndCabal2\Stack\palidrome-checker\stack.yaml:

- Euterpea-2.0.7@sha256:81d583a47d483bf83ac07df7b764138f1aa52a56db4e7c7f685d070dbac4b388,2661

Plan construction failed.
```

Though, initially disheartened by another failur in my life... man they just keep coming lately... I decided to read the error message to see what was wrong and it actually gave me a clue in order to solve it. On a side note, It is impossible for me to express how awesome the Elm and Haskell compiler are at telling what is wrong with your code. Elm will go so far as to tell you even how to fix it. No more stack traces here!!!. 

So my next step in figuring this out was to go to the extra-deps in the stack.yaml and try adding this Library and running `stack build`. You must put the version of the library in the extra-deps part of the stack.yaml file or it will not work

```haskell
extra-deps:
- Euterpea-2.0.7
```

This time no errors... so I guess it all worked. That was almost too easy, but little did I know I would struggle for another 2 hours trying to figure out was wrong. But when I ran the `stack ghci` to run my project in the interactive repl that is another amazing thing about haskell, I realized that the `stack build` didn't actually install Euterpea.

```haskell
*Main Lib Paths_palidrome_checker> import Euterpea

<no location info>: error:
    Could not find module `Euterpea'
    It is not a module in the current program, or in any known package.
```

Thus, I found out that you need to have the Euterpea library in your extra-deps part of the stack.yaml, and in your dependencies part of the package.yaml. 

```haskell
extra-deps:
- Euterpea-2.0.7
```

```haskell
dependencies:
- base >= 4.7 && < 5
- Euterpea
```

I carefully typed in the `stack build` command once more, praying to the almighty above that I only see colors that are not of the red variety, and woudn't you know it... no cigar. 

```haskell
$ stack build

Error: While constructing the build plan, the following exceptions were encountered:

In the dependencies for Euterpea-2.0.7:
    HCodecs-0.5.2 from stack configuration does not match ==0.5.1  (latest matching version is 0.5.1)
    PortMidi must match ==0.2.0.0, but the stack configuration has no specified version  (latest matching version is 0.2.0.0)        
    arrows must match >=0.4 && <0.5, but the stack configuration has no specified version  (latest matching version is 0.4.4.2)      
    bytestring-0.10.12.0 from stack configuration does not match >=0.10.4.0 && <=0.10.9  (latest matching version is 0.10.8.2)       
needed due to palidrome-checker-0.1.0.0 -> Euterpea-2.0.7

Some different approaches to resolving this:

  * Recommended action: try adding the following to your extra-deps
    in C:\Users\Natha\Desktop\BlogAndYoutube\Haskell\StackAndCabal2\Stack\palidrome-checker\stack.yaml:

- HCodecs-0.5.1@sha256:bf99063ca71d5fc6ed560be853457517ca7c670a06c21c89da6c33196b4d6a42,1654
- PortMidi-0.2.0.0@sha256:0671e36ec72e95138bf396234b205864a8a6d0ee353e09e01cbfd57004c56f40,2383
- arrows-0.4.4.2@sha256:a260222b766da922657e302aa7c0409451913e1e503798a47a213a61ba382460,1235
- bytestring-0.10.8.2@sha256:8d9d06eebc99c400487de22404fc20059d7889845c13d6a65cae9140174811bf,8938

Plan construction failed.
```

I still had hope. This error looked almost like another huge GOT style wall in my journey to just play a few notes on the computer, but I wasn't ready to give up. I was going to add these other extra-deps to my stack.yaml file. 

```haskell
extra-deps:
- Euterpea-2.0.7
- HCodecs-0.5.1@sha256:bf99063ca71d5fc6ed560be853457517ca7c670a06c21c89da6c33196b4d6a42,1654
- PortMidi-0.2.0.0@sha256:0671e36ec72e95138bf396234b205864a8a6d0ee353e09e01cbfd57004c56f40,2383
- arrows-0.4.4.2@sha256:a260222b766da922657e302aa7c0409451913e1e503798a47a213a61ba382460,1235
- bytestring-0.10.8.2@sha256:8d9d06eebc99c400487de22404fc20059d7889845c13d6a65cae9140174811bf,8938
```

I then ran it again.

```haskell
$ stack build

Error: While constructing the build plan, the following exceptions were encountered:

In the dependencies for arrows-0.4.4.2:
    Stream needed, but the stack configuration has no specified version  (latest matching version is 0.4.7.2)
needed due to palidrome-checker-0.1.0.0 -> arrows-0.4.4.2

In the dependencies for random-1.1:
    time needed, but this GHC boot package has been pruned (issue #4510); you need to add the package explicitly to extra-deps       
         (latest matching version is 1.11.1.1)
needed due to palidrome-checker-0.1.0.0 -> random-1.1

Some different approaches to resolving this:

  * Recommended action: try adding the following to your extra-deps
    in C:\Users\Natha\Desktop\BlogAndYoutube\Haskell\StackAndCabal2\Stack\palidrome-checker\stack.yaml:

- Stream-0.4.7.2@sha256:ed78165aa34c4e23dc53c9072f8715d414a585037f2145ea0eb2b38300354c53,1009
- time-1.11.1.1@sha256:bdd516b0c30b12426053186c4c38d76b05c274f3a427e654cdc1ddd23a4d6f85,6230

Plan construction failed.
```

Dammit, another error. Is ther even a light at the end of this tunnel or is it just one rabbit hole after another. 

```haskell
extra-deps:
- Euterpea-2.0.7
- HCodecs-0.5.1@sha256:bf99063ca71d5fc6ed560be853457517ca7c670a06c21c89da6c33196b4d6a42,1654
- PortMidi-0.2.0.0@sha256:0671e36ec72e95138bf396234b205864a8a6d0ee353e09e01cbfd57004c56f40,2383
- arrows-0.4.4.2@sha256:a260222b766da922657e302aa7c0409451913e1e503798a47a213a61ba382460,1235
- bytestring-0.10.8.2@sha256:8d9d06eebc99c400487de22404fc20059d7889845c13d6a65cae9140174811bf,8938
- Stream-0.4.7.2@sha256:ed78165aa34c4e23dc53c9072f8715d414a585037f2145ea0eb2b38300354c53,1009
- time-1.11.1.1@sha256:bdd516b0c30b12426053186c4c38d76b05c274f3a427e654cdc1ddd23a4d6f85,6230
```

There are two routes this path ultimately ends up on. You either end up finally having the stack build only to fail on 13/15 dependencies being installed, or you get another error which says it is impossible. At this point, even the stack build tool is giving up on me. I can hear it now "Nathan, your not even learning haskell at this point, your jsut cutitng your life short", but I was still not ready to give up on this beloved Euterpea library. 

See that one of the routes it failed on was because the base package was the wrong version was a huge tip. It meant that the ghc version was not the right version, but the wrong version. On the official docs for Euterpea 2, it says that it works with ghc-8.6.5, thus I need stack to have ghc-version 8.6.5. After much searching, I found out that when you are building a stack project, you can include the resovler number you want. Each resolver number stands for a different [version](https://www.stackage.org/) of the ghc compiler. In order to specify the resovler you jsut need to enter the `stack new` command with the resolver argument. Thus, for an Euterpea project you would enter the following. 14.27 is the resolver for ghc version 8.6.5

```haskell
stack new <projectName> --resolver lts-14.27
```
Thus we use this command, and then edit the stack.yaml and package.yaml

stack.yaml
```haskell
extra-deps:
- Euterpea-2.0.7
```
package.yaml
```haskell
dependencies:
- base >= 4.7 && < 5
- Euterpea
```

Unfortunately, it will actually fail again, and you will be presented with another set of never ending rabbit holes, but this time there is actually a light at the end of the tunnel. I will save you the time of reading more errors from me trying things and give you the stack.yaml code. 

```haskell
extra-deps:
- Euterpea-2.0.7
- PortMidi-0.2.0.0
- arrows-0.4.4.2
- Stream-0.4.7.2
- lazysmallcheck-0.6
```

Now when you use `stack build` it will finally work and now you have a stack project that has the beloved Euterpea library installed. You can now run `stack ghci` and then run

```haskell
import Euterpea
play $ c 4 qn
```
You will hear the most refreshing sound. It is sort of the sound of victory over something you though wasn't possible, but you did it. 

