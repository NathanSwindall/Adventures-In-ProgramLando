---
layout: post
category: notes
image: /Notes/assets/images/HaskellInDepth.png
summary: Haskell in Depth
date: 2022-03-09
author: Nathan Swindall
---


The $ is more like a replacement for parentheses
:t to see the type

readFile <FilePath> = gives you text back
group [1,2,3,4] -> [[1],[2],[3],[4]]
words "I am going to the park" -> ["I","am","going","to","the","park"] 
sort "Nathan" -> "Naahnt"


-types
(.) :: (b -> c) -> (a -> b) -> a -> c
(.) (\x -> x + 2) :: Num c => (a -> c) -> a -> c 
(.) (\x -> x + 2) (\x -> x * 2)  :: Num c => c -> c
let add2 x = x + 2
double x = x * 2
let answer = add2 .double $ 3 
           = (add2 . double ) 3


building a specific stack project
stack build :myExamples


-USING STACK 
stack new my-project
stack build :<name of file you want to build>  -- This will be the name of the executable
stack exec hello 
stack exec stockquotes -- data/quotes.csv -s 
stack repl :stockquotes
stack test 
stack bench
--running a particular test 
stack test :radar-test

stack ide targets -- to see all the executables

--TO RUN 
stack exec myExamples -- data/texts/hamlet.txt


Flip function 
mySubtract x y = x - y 
mySubtract 3 5 = -2 
(flip mySubtract) 3 5 = 2


--Scanl function
mySubtract x y = x - y
scanl mySubtract 100 [1,2,3,4,5]
[100,99,97,94,90,85]

--zipWith 
zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
zipWith mySubtract [1,2,3,4,5] [1,2,3,4,4]
[0,0,0,0,1]
It goes on the shorter list
-- 
ds@(_:_:_) = zipWith orient ds (tail ds)
This means that it has to have at least two items in it 
2:3:[]
