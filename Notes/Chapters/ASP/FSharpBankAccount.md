---
layout: post
category: notes
image: /Notes/assets/images/FSharp.png
summary: FSharp and CSharp interoperability
date: 2022-05-02
author: Nathan Swindall
---


<link rel="stylesheet" href="/blog-tech/assets/markdown.css">


## <strong>Creating Our Bank Account App</strong>

<div class="tblurb">
Create a new solution file in a folder of your choosing <br/><br/>
<code class="code-style2"> dotnet new sln -o BankAccountApp</code> <br/><br/>
Create a new solution file in and connect it to that solution file <br/><br/>
<code class="code-style2"> dotnet new console -lang "F#" -o src/App</code> <br/><br/>
<code class="code-style2"> dotnet sln add src/App</code> <br/><br/>
Now we are going to create a library to use in our app. This will really teach us how to setup an F# project. <br/><br/>
<code class="code-style2"> dotnet new classlib -lang "F#" -o src/Library</code> <br/><br/>
Then we need to connect it with our solution. <br/><br/>
<code class="code-style2"> dotnet sln add src/Library</code> <br/><br/>
Now that we have added it to our sln, we need to make it so our app project can reference the library module. <br/><br/>
<code class="code-style2"> dotnet add src/App reference src/Library</code> <br/><br/>
</div>

