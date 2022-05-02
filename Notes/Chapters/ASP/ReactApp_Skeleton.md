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

For this app, we are going to use a lot of the features of react that come out of the box. The easiest way to get us started is to use the `creat-react-app` command. You can check out more information about this through the website [here](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app). There are few things we are going to need. Firstly, we need to install node. You can install node from this [website](https://nodejs.org/en/). To make sure you have it installed and to see what version you have you can use the command `node --version`. It comes with npm which is the package manager for node. The command to see the npm version is `npm --version`. <br />

In order to actually create our app make sure you are in the Reactivities folder. Then we are going to run the following commands: 
`npx create-react-app client-app --use-npm --template typescript`<br />
This command is making a react app called client-app that uses npm as the package manager and making sure to setup the environment for using typescript. We are going to use typescript because it will help us find bugs easier because our app will now mostly be type safe. A lot of tutorials use yarn for the package manager, but I find that after using npm for so long, it is just easier to use npm. 

If you have trouble with this you can also try to run the following command: <br />
`npm install create-react-app -g client-app --use-npm --template typescript`<br />

## Reviewing the React project files

We will now have a bunch of files in the new client-app folder we just created. If we look at the tsconfig.json file we will see that there are a lot of properties for our typescript setup. For example, the `target` key shows us that we are compiling our typescript to "es5" which is compatible with most browsers. We could change this to a higher version of JavaScript if we wanted to. We also have strict set to true which will help us catch many errors and gives our jsx type-safety. <br />

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

Now going to our index file in the new src folder we will notice quite a few things. Our html file that will be the frontend file is located in the public folder. This folder contains an `index.html` which will have an element where we will connect our React app to. The place where we connect it has the id root, so it looks like the below part. <br />

```html
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
```
Now, the actual react code that connects to the html file is below. We can see that we create a react dom root by getting the element in the html file by the id. We then use the render function to render our app to the html file. You can see that in the index.tsx file below. ReactDom is used for creating web apps, while if you ever come across ReactNative it is for developing android apps. The one problem that we have right now is that we have `<React.StrictMode>` in our file. This normally wouldn't cause a problem but if we use third-party-packages then we might get some errors because these packages aren't type safe. Most of the major packages nowadays have already updated their code to not trip any errors, so we can leave this part of the code in for now, but if you run across any erros with your own packages or with the packages in this course, all you have to do is delete these lines. 


```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```
The above code example is jsx using typescript. Jsx can look a lot like html, but there are some key differences to know about. For example, a common attribute one uses in html is the `class` attribute, but we can't use that in jsx because class is a reserved word in JavaScript, thus jsx use className instead of class for the attribute name. Also, there is the use of curly braces. We need to use curly braces in a lot of places where we wouldn't in html. So, jsx uses: <p style=\{\{color: 'red'\}\}><br />


html 
```html
<p style='color: red'>
```
## Why React?

The reason one would probably want to learn react is because many of the major companies such as Netflix and Facebook are using it for their frontend. It is also used by many start-up companies. I remember looking for a job and seeing that many people out there were looking for developers with experience in using React. When you go to github you can see many posts about, so the community is huge and developers have consistently rated it highly for development. It is very fast compared to many other front-end technologies too. What makes it so fast is that it uses something called a virtual dom. When you update a state in the virtual dom, it will only update that part of the real dom that was update. The virtual dom keeps all the updates and state changes. If you know JavaScript, the fortunate thing is that React will be pretty easy to pick up. 

## React Components 

The traditional front-end experience was splitting up the front end into three layers. The three layers for building were Html, Js, CSS. But React uses something called components which are reusable pieces that all use Js, Html, and CSS. Each component will have a state, and this state can be passed down to other components within this component by using `props`. React is also one-way-binding which means that only changes in the virtual Dom will go to the real DOM and changes in the DOM will not go the other way around. Angular is a front-end technology where you can have two-way-binding. <br />


If you want to see what jsx looks like in pure JavaScript, see the example below. 
```jsx
function App(){
    return (
        <div className="App">
            <h1>Reactivities</h1>
        </div>
    );
}
```

This would look like the below in pure JavaScript

```jsx 
function App(){
    return (
        React.createElement('div', {className: 'app'}),
        React.createElement('h1', null, 'Reactivities')
    );
}
```
Previously in React we would use classes to handle states and life cycle of different components such as when a component mounts or unmounts, but now we have all this functionality with something called React Hooks. Some functions we are going to become familiar are `useState()` and `useEffect()`. UseState will help use keep track of states changes within a component and useEffect will help use with the life cycle of a component. The useEffect function will cause a side effect when our component mounts or does some other life cycle function. Another cool feature is that we can make our own React Hooks too. This could be used when reusing state between different components, but we will get into more detail later. 

## Typescript concepts 

