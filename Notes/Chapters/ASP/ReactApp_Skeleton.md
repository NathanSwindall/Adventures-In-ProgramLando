---
layout: post
category: notes
image: /Notes/assets/images/react.jpg
summary: A REACT Skeleton app
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
Now, the actual react code that connects to the html file is below. We can see that we create a react dom root by getting the element in the html file by the id. We then use the render function to render our app to the html file. You can see that in the index.tsx file below. ReactDom is used for creating web apps, while if you ever come across ReactNative it is for developing android apps. The one problem that we have right now is that we have `<React.StrictMode>` in our file. This normally wouldn't cause a problem but if we use third-party-packages then we might get some errors because these packages aren't type safe. Most of the major packages nowadays have already updated their code to not trip any errors, so we can leave this part of the code in for now, but if you run across any errors with your own packages or with the packages in this course, all you have to do is delete these lines. 


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

There are many advantages to using typescript. Some of these advantages are as follows: 

- Strong typing 
- Object orientated 
- Has Better intellisense 
- Access modifiers (private or public)
    - These will not be there when TypeScript is compiled to JavaScript
- It has the latest JS features 
- Help you catches silly mistakes in dev 
- 3rd Party libraries usually have typescript types 

unfortunately there are also some annoying parts: 

- More upfront code 
- Some 3rd party libraries don't have typescript definitions 
- Strict mode is <strong>STRICT</strong>

## Typescript Demo 

tsconfig isolated module; 

Let's create a new file in our src folder in our client-app for a quick demo for TypeScript. Let's start off by typing in a quick variable definition. 

```ts
Let myNum = 42;
```

You will get an error right away because we need to change a key value in our tsconfig file to allow us to write code with isolated modules. So go in your tsconfig file and change the key `isolatedModules` from false to true. 


```ts
export interface Duck {
    name: string; 
    numLegs: number;
    makeSound: (sound: string) => void;
}

const duck1: Duck = {
    name: "Huey",
    numLegs: 2,
    makeSound: (sound) => console.log(sound)
}

const duck2: Duck = {
    name: "Lewis",
    numLegs: 2,
    makeSound: (sound) => console.log(sound)
}

duck1.makeSound("quake");

export const ducks = [duck1, duck2]
```

## Using typescript with React

We are going to use our duck code demo that we made in the last section in order to understand typescripting better in React. Let's go to the `App.tsx` file in your src folder and add some code to it.  

We are going to add the following to it. 

```jsx 
{ducks.map(duck => (
    <div key={duck.name}>
        <span>{duck.name}</span>
        <button onClick={() => duck.makeSound(duck.name + ' quack')}>{duck.name}</button>
    </div>
))}
```

Originally I actually wrote this little bit of code wrongly and has the map return a function body. There is sa big different between '{}' and '()'. If you write it the following way: 

```jsx 
{ducks.map(duck = {..})}
```

You will get the following error:

```js
//This JSX tag's 'children' prop expects a single child of type 'ReactNode', but multiple children were provided.
```

You need to make sure that you always use '()' to return the html component part. Below is how all this will fit into your app code. Remember that this is just a demo, and that you are not going to have this in your real code. 

```jsx 
import { ducks } from './demo';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {ducks.map(duck => (
          <div key={duck.name}>
            <span>{duck.name}</span>
            <button onClick={() => duck.makeSound(duck.name + ' quack')}>{duck.name}</button>
          </div>
        ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
```

In order to run your code you will type the command `npm start` inside the client-app folder. I'm not sure where yours will run, but mine is running at `localhost:3000`. Also, remember that in visual studio code you can open up multiple terminals in order to run different servers on them. If you pull up the console you should be able to see the console log statements when you hit the buttons. If you don't put `key={duck.name}` in the div, you will get an error that looks something like this:

```js
// Warning: Each child in a list should have a unique "key" prop.

// Check the render method of `App`. See https://reactjs.org/link/warning-keys for more information.
//     at DuckItem (http://localhost:3000/static/js/bundle.js:201:5)
//     at App
```


This is because React requires a unique key for looping over and rendering divs like this (Or what ever element is looped over). We can actually turn this into a small component to further abstract our little duck demo into its own duck component. We will create a component called `DuckItem.tsx` in the src folder for the client-app folder. Here is the finished code for that demo part. 

```jsx 
import React from 'react';
import { Duck } from './demo';

interface Props {
    duck: Duck;
}

export default function DuckItem({duck}: Props) {
    return (
        <div key={duck.name}> 
            <span>{duck.name}</span>
            <button onClick={() => duck.makeSound(duck.name + ' quack')}>Make Sound</button>
        </div>
    )
}
```

There are few things to note here. For one, we are going to pass data to this component and that data will be the duck data that we are importing into the `App.tsx` file. We will pass this duck file to this new `DuckItem` component. We will make an interface in our component files that will handle props. Notice also that we use object deconstruction in the argument for the DuckItem component to get the duck prop. Also, as mentioned above, make sure you are return '()' and not '{..}'. The code in the app file will now look like: 

```jsx 
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {ducks.map(duck => (
          <DuckItem duck={duck} key={duck.name}/>
        ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
```

Now everything should be perfect! Notice how we also are passing the duck properties down to our DuckItem component. 

## React Developer Tools

React developer tools used to be more useful, but since we are using hooks instead of class components they have become less useful. You can install the developer tools on your chrome browser as an extension. I think there is one for firefox too, so if you use firefox definitely look for it. 

## Fetching data from the API 

We are now going to connect our dotnet service side with the front-end here that we are creating. There is a build in fetch feature for the frontend that can make http requests, but we are going to use a very popular third-party package called axios which will help us achieve this in a better way. Axios returns promises which is exactly what we want to do. To install it, cd into your client-app and run the command `npm install axios`. This will install axios to your project as a dependency. Now let's go ahead and load it into our file. Just add the following to your file and then you can use axios in your App.tsx file. 

```js
import axios from 'axios'
```

Next, we are going to use one of our hooks for creating a state variable. The variable we are going to make is called `activities`, and this hook will also create a setter for this variable which we will call `setActivities`. Then, we are going to also use the hook useEffect to actually get our data from our server. So, when it all comes together it will look something like this in the App.tsx file. 

```js
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then((response) => {
      console.log(response) // just to see what our response is
      setActivities(response.data);
    })
  })

  return (
    <div className="App">
```

There are a few problems with our code. The major problem right now is that whenever you change the state the useEffect function will run which will change the state of our `activities` variable, which will in turn trigger, causing us to rerun the useEffect function. This is bad because it will cause an infinite loop which we do not want to happen. What we can do instead is just add a little piece to our useEffect function that will stop this infinite loop. 

```js 
useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then((response: any) => {
      console.log(response) // just to see what our response is
      setActivities(response.data);
    })
  }, [])
```


All we did was add the `[]` part and this will stop the infinite loop, but there is still one more problem. If you tried to run this code right now, you would run into a console error which is to do with CORS. Our code will not run unless we fix the backend to get CORS. Now we need to update our code in order to actually see the responses. We will do it just like the duck way that we came up with earlier. 

```js
<img src={logo} className="App-logo" alt="logo" />
        {activities.map((activity: any )=> (
          <li key={activity.id}>
            {activity.title}
          </li>
        ))}
```

Since we have a state variable which is activities, we can loop over it just like the demo example. Remember that we are using '(...)' to surround what we are returning. Also, if you didn't put the any part of the type, typescript would complain. We can quickly solve this by putting `any`, but this is not non-standard way of dealing with it. Whenever possible in code we want to make sure to have a strict type. We will come back later and solve this type issue. Also, remember that we need a key for looping. 

## CORS Policy 

In order to solve this problem we are going to have to go to our API project folder and open up our `Startup.cs` file and add a new cors policy service. The service is quite long so I will quickly put it now. It is added as a service to our ConfigureServices function. 

```cs 
services.AddCors(opt => 
{
    opt.AddPolicy("CorsPolicy", policy => 
    {
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
    });
})
```
This CORS is required when we are trying to access resource from a different domain. We have our API on the domain localhost:5000, and our frontend on the localhost:3000. The AllowAnyMethod part will allow us to use any request such as a GET request, or PUT request, or PULL request. Then, the allow any header allows all header types. Since we just want to allow the localhost:3000 we can be specific with this last part, but if we wanted we could also allow any origin. We still need to add this as middleware to add this onto our response back to our frontend. So let's go to the Configure function. The ordering is very important in our function, so we have to place our CorsPolicy in the right place. Make sure to use it after the `app.UseRouting();` middleware. We are going to use the "CorsPolicy", that we created in our service. 

```cs
app.UseRouting(); 

app.UseCors("CorsPolicy")
```

## Semantic UI React 

We are going to use semantic UI for this website. Semantic-ui is a development framework that helps create beautiful, responsive layouts, using human-friendly HTML. If you want to check out the website for this framework for react it is located [here](https://react.semantic-ui.com/usage/). In order to install this framework you will use the command 

`npm install semantic-ui-react semantic-ui-css`

Now we are going to import this into our code. We will go to our `index.tsx` file and use the import statement 

```jsx 
import `semantic-ui-css/semantic.min.css
```
We can actually delete the original code that we had for the ducks as that was just demo code. I will leave it in the skeleton branch so you can see it for how it works, but it will be a little messy with everything. The skeleton branch is located [here](https://github.com/NathanSwindall/dotnet-tutorial/tree/skeleton). Now let's go to our `App.tsx` file and add a Header file from Semantic-ui. When we start typing in Header we can auto-complete the one from Semantic-UI which will give us the auto import also in the App.tsx file. So go ahead and add this Header where the old header was. 


```jsx
<Header as='h2' icon='users' content='Reactivities'>
```

The as attribute is what it will render as. We will render it as an h2. We will give this header a users icon and the content will be Reactivities. You might unfortunately run into an error with this part. There is a problem if you used react version 18 or above. This will cause your code to not compile due to an error. The process for fixing it is a little long, but It will work in the long run for this course. I love how you can always use an older version of some code which will make working with old tutorials very doable unlike other languages I have used. 

Here are the steps: 

Switching React to version 17 after installing with 18 (all this work should be done in shell inside client-app folder)

-delete the packages-lock.json

-update packages.json to have

```json
     "react": "^17.0.2",
    "react-dom": "^17.0.2",
```
- then inside the client-app run

npm install

- then delete packages-lock.json

and run (only install semantic-ui-react, not the CSS, see below for more details, not sure if you need to delete packages-lock.json for each method or not)


```jsx
npm install @testing-library/react@11.2.2
npm install @types/react@17.0.1 @types/react-dom@17.0.1
npm install semantic-ui-react
```


update your index.tsx:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
 
ReactDOM.render(
    <App />,
  document.getElementById('root')
);
```


Update your index.html.

```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
```

Your imports from semantic UI should now work in the app.tsx. Now we can go ahead an at the last part of our code for this section. Just add this part below the header part. We are using the semantic-ui lists. 

```jsx 
<List>
    {activities.map((activity: any) => (
        <List.Item key={activity.id}>
            {activity.title}
        </List.Item>
    ))}
</List>
```

# Summary

There wer a lot of different concepts we covered in this section. We used create-react-app using the typscript template to create our react skeleton app. We then made sure to cover some of the most import react concepts such as hooks and the project files that come with the out-of-the-box react app. We found out how to implement some cool typescript features which will make developing our react app way easier and finding bugs will now be caught at compile time and not run time (well for a lot more bugs then without typescript). We saw how to use axios to make a simple http GET request to our API that we made. Then we finally got to see a html/css framework which will make styling our app and our html syntax a lot more consise and less over all work. 

# Database Error 

I noticed that I had too many elements being returned from my API. If you have this problem like I did, you can just delete the Reactivities.db in your API file. When you restart your backend, this db will be recreated with all you data. There is one error that is kind of interesting. My data is coming back out of order. This seems like it could be async issue. 