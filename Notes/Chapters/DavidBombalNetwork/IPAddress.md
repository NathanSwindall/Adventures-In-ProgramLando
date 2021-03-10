---
layout: post
category: notes
image: /Notes/assets/images/DavidBombal.jpg
summary: A beginner's guide to Networking
date: 2021-02-23
author: Nathan Swindall
---

### **IP Addresses**


```elm
--This function finds the biggest power of 2 that that when subtracted from 
--the number yields a number greater than 0
findBig2Power : Int -> Int -> Int
findBig2Power num power = 
    if num < 0 
    then -1 
    else if (num - 2^power) > 0
    then findBig2Power num (power+1)
    else if (num - 2^power) == 0 
    then power
    else  power-1
```


```elm
--this function will get a binary
--List for a number
sP num start = 
    if D.log "start" start == 0 && num == 0
    then [0]
    else if start == 0 && num /= 0
    then [1]
    else if (num - 2^start) >= 0 
    then 1 :: sP (D.log "difference" (num - 2^start)) (start - 1) 
    else 0 :: sP (num) (start - 1)
```


```elm
--final function to get binary list
getBinary dec = 
    let 
        biggestTwo = findBig2Power dec 0
    in
    (sP dec (biggestTwo))
```


### **IP Subnetting**

Network/Subnet Address
    - Fill the host portion of an address with binary 0's
Broadcast Address
    - Fill the host portion of an address with binary 1'
First Host
    - Fill the host portion of an address with binary 0's for the last bit which is set to binary 1 
Last Host
    - Fill the host portion of an address with binary 1's except for the last bit which is set to binary 0