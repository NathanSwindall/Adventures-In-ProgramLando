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
Then change the directory to your app file. Create a new solution file in and connect it to that solution file <br/><br/>
<code class="code-style2"> dotnet new console -lang "F#" -o src/App</code> <br/><br/>
<code class="code-style2"> dotnet sln add src/App</code> <br/><br/>
Now we are going to create a library to use in our app. This will really teach us how to setup an F# project. <br/><br/>
<code class="code-style2"> dotnet new classlib -lang "F#" -o src/Library</code> <br/><br/>
Then we need to connect it with our solution. <br/><br/>
<code class="code-style2"> dotnet sln add src/Library</code> <br/><br/>
Now that we have added it to our sln, we need to make it so our app project can reference the library module. <br/><br/>
<code class="code-style2"> dotnet add src/App reference src/Library</code> <br/><br/>
Then finally, you are going to create a <code class="code-style2">Library.fsx</code> in our Library folder in order to have an interactive script to test out our library functions. 
</div>

### <strong>Working with fsx</strong> 

Filesystem auditor 
    -path C:/temp/learnfs/capstone2/{customerfName}/{accountId}.txt
    - Probably want to use the sprintf as well as methods within the System.IO.file
    - Make sure the directory exists (maybe use the Some and None Option)
Console System auditor 
    - "Account accountId message":

Notice that the behaviors for deposit and withdraw have a lot in common
Your audit functions have a lot in common too. 

Program 
    - Do a withdraw or deposit 
    - Audit the details of the transaction 
    - If balance modified then, print something 
    - If same balance, then tell user it was rejected 
    - return update account 

```cs 
let auditAs (operationName: string ) 
            (audit: Account -> string -> unit)
            (operation: decimal -> Account -> Account)
            (amount: decimal)
            (account: Account)
            : Account = 
```
<div class="textBlurb">
<ul>
<li>operationName -- The name of the operation as a string</li>
<li>audit -- the audit function you want to call</li>
<li>operation -- The operation function you wnat to call</li>
<li>amnount -- The amount to use on the operation </li>
<li>account -- The account to act upon</li>
</ul>
</div><br/>

write function based off console for the deposit 
write functions based off console for the withdraw 
Then test 


### <strong>Creating our console Application</strong>

We are going to create quite a few files in our Library module 
They are going to be as follows

- Domain.fs
    - Contains the domain which is our Account and Customer 
- Operation.fs 
    - contains our deposit, withdraw, and auditAs functions
- Auditing.fs 
    - conainst the console and filesystem functions 
- Program.fs 
    - Our main program. This will be in our App folder. 

The Domain, Operation, and Auditing will go in our Library folder and need to be added to the Library.fsproj file like so:

```csharp 
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="Domain.fs" />
    <Compile Include="Auditing.fs" />
    <Compile Include="Operations.fs" />
    <Compile Include="Library.fs" />
  </ItemGroup>

</Project>

```

<div class="tblurb">

</div>