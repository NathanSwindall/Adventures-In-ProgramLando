---
layout: post
category: notes
image: /Notes/assets/images/FSharp.png
summary: FSharp and CSharp interoperability
date: 2022-05-02
author: Nathan Swindall
---

## Creating simple project with F# 

The first thing that we are going to do is to familiarize ourselves with creating a F# project and also using the amazing scripting feature they have in F#. For the simple project, we are going to create something really simple which is just a bank account. We will be setting up a multiple level project in order to familiarize ourselves with using multiple projects. 

Firstly, we need to create a solution file which will bring all our projects together. Go ahead and pick somewhere you want to run your file and then do the following command. <br />

`dotnet new sln -o BankAccount`<br />
This will create a solution called BankAccount

Next, we will create a library file and then a console project. <br />

`dotnet new classlib -lang "F#" -o src/Library`

`dotnet new console -lang "F#" -o src/App`

Finally, we can't forget to add these projects to our solution. Like in the C# example, there are two commands we can use to accomplish the same thing. We can include the fsproj file. 

`dotnet sln add src/Library/Library.fsproj`<br />

or we could shorten the command which would be: <br />

`dotnet sln add src/Library`