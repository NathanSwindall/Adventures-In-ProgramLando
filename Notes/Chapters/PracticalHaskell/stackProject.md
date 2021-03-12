---
layout: post
category: notes
image: /Notes/assets/images/PracticalHaskell.jpg
summary: Haskell - A purely functional language
date: 2021-03-12
author: Nathan Swindall
---

### **Stack Project**

Creating a stack project is fairly easy. All you have to do is the following commands and you can start you own stack project, assuming of course you already have Haskell installed. The first command you are going to want to run is `stack update`. This will download the most recent set of packages from your package indices. Then after running this command, you will want to actually create a new project. 

```haskell
stack new <project>
```

This above command will create a new stack project which include everything you need to start creating apps in haskell. The below is what it creates in the place you were directed on your computer

{% assign richardFeldman = "assets/images/haskell_stack.png" | relative_url %} 
<img src="{{richardFeldman}}">

To run the elm repl on your project you will use the following command. 

```hasekll
stack ghci
```

At the time of writing (03/12/2021), there seems to be a warning you get when you run this command which looks like the following. 

```elm
* * * * * * * *

Warning: Multiple files use the same module name:
         * Paths_PH found at the following paths
           * C:\Users\Natha\Haskell\PracticalHaskell\PH\.stack-work\dist\274b403a\build\PH-exe\autogen\Paths_PH.hs (PH:exe:PH-exe)
           * C:\Users\Natha\Haskell\PracticalHaskell\PH\.stack-work\dist\274b403a\build\autogen\Paths_PH.hs (PH:lib)
* * * * * * * *
```

There seems to be a problem with hstack and how everything is compiled according to all the stack overflow posts I read and the github tickets. In order to get this warning to stop you can add the following to your `package.yaml` code. 

```haskell
when:
- condition: false
    other-modules: Paths_PH
```
Thus, you package.yaml will now look like the following.

```haskell
executables:
  PH-exe:
    main:                Main.hs
    source-dirs:         app
    ghc-options:
    - -threaded
    - -rtsopts
    - -with-rtsopts=-N
    dependencies:
    - PH
    when:
    - condition: false
      other-modules: Paths_PH

tests:
  PH-test:
    main:                Spec.hs
    source-dirs:         test
    ghc-options:
    - -threaded
    - -rtsopts
    - -with-rtsopts=-N
    dependencies:
    - PH
    when:
    - condition: false
      other-modules: Paths_PH
```

### **Compiler Warnings**

I am not sure why, but for some reason the compiler for my version of ghc (8.10.4), doesn't display warnings by default. I am not sure how to display warnings with the command `stack ghci`, but if you use the old regular `ghci` command you can get warnings by adding `-Wall` as an argument. For example, I have two haskell modules inside a folder inside the src directory in my stack project. It looks somthing like this


{% assign stack_src = "assets/images/stack_src.png" | relative_url %} 
<img src="{{stack_src}}">

These two files contain the following code.


*Datatypes*
```haskell
module Chapter2.DataTypes where

data Client = GovOrg String
            | Company String Integer Person String 
            | Individual Person Bool 
            deriving Show 

data Gender = Male | Female | Unknown 
            deriving Show

data Person = Person String String Gender
            deriving Show

```


*PatternMatching*
```haskell
module Chapter2.PatternMatching where

import Chapter2.DataTypes

--ghci Chapter2.PatternMatching -Wall

clientName :: Client -> String 
clientName client = case client of 
                      GovOrg name                  -> name 
                      Company name id person respt -> name
                      Individual person ads         -> 
                         case person of 
                            Person fNm lNm gender -> fNm ++ " " ++ lNm
```

In order to run ghci on these files you must `cd` into the source directory and then you can run the following command. for my computer the directory is `C:\Users\Natha\Haskell\PracticalHaskell\PH\src\Chapter2\PatternMatching.hs`.

```haskell
ghci Chapter2.PatternMathcing
```

You don't need to include the `.hs` file extension. Also, you can't `cd` in the `Chapter2` folder because it is part of the module definition and then ghci won't be able to find the other module `Datatype` which `PatternMatching` relies on. When you run this command it will compile, but unfortunately you don't see the warnings. For example, we assign names to certain variables we never use in the above code. The compiler will usually tell you about these when I have used Haskell in the past, but unfortunately, it won't do it unless we modify the command we write. 

```haskell
ghci Chapter2.PatternMathcing -Wall
```

This little edition to our command will thus give us the compiler warnings, and will hopefully make our experience with haskell that much more enjoyable. 