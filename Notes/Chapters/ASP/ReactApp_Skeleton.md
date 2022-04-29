---
layout: post
category: notes
image: /Notes/assets/images/react.jpg
summary: API Skeleton DotNet
date: 2022-04-28
author: Nathan Swindall
---

## <strong>Creating an Front-end Skeleton with React<strong>

For the frontend we are going to create a React.js frontend app for the api we created. We are going to use reacts `Create-react-app` for creating our app. There will be sections on theory and react components. We are going to go over react dev goals to help with debugging and then use typescript to further eliminate bugs that we might come across. Finally, we will use Axios to make http requests and semantic-ui to style our app. 

## Creating the React project 

react.js/docs/create-a-new-react-app.html#create-react-app 
In our Reactivities folder 
node --version
npm --version 
npx create-react-app client-app --use-npm --template typescript
if you have trouble 
npm install create-react-app -g client-app --use-npm --template typescript 
client-app (the name of the app)
--use-npm (If we have yarn installed this will make npm the default)
--template (typescript)


## Reviewing the React project files

tsconfig.json 
target is what our typescript is compiled into. This is the most compatible form 
strict will stop us from making stupid mistakes 
jsx give use type safety in jsx. 
index.html 
<div id="root"></div>

src/index.tsx 
using ReactDom because we are developing on the web, not ReactNative because we aren't developing on mobile. 
<React.StrictMode> this will enforce any code that is deprecated and or out of date. It will throw errors if there is code that doesn't pass strict mode. You will most likely run into problems from third-party packages with strict mode. 

<App />
create a javascript function and return jsx. 
we have some difference between jsx and html. some of the attribute names like class are now className because class is a reserved word in JavaScript. We have curly braces where you can put in javascript code directly. 
<p style={{color: 'red'}}> instead of <p style='color: red'>
node_modules 



