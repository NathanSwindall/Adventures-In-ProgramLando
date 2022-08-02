---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Use MobX to store state globally
date: 2022-07-21
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [What is MobX](#what-is-mobx)
- [Setting Up MobX](#setting-up-mobx")
- [MobX Actions](#mobx-actions)
- [Posting Data to the Server](#posting-data-to-the-server)
- [Deleting Activity on the Server](#deleting-activity-on-the-server)

<div class="gradient">
	<h2 class="section__title" id="introduction"><strong>Introduction</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to be adding quite a few different functionalities. 

- <strong>Introduce State management</strong>
    - currently we are passing down props to all the children components which makes our application quite unwieldy.
- <strong>MobX</strong>
    - In order to solve this problem we are going to use a state management tool for React called MobX. This section will help you connect it and set up our stores. 
- <strong>MobX React Lite</strong>
    - This will allow our components to become observers of our global state. It will allow our components to connect directly to our store which is just the place where we store our gloabl state.  
- <strong>React Context</strong>
    - The React Context will be the place where we put our different stores for our global state. 

- Dang this looks like it will be quite a fun lesson!!! The code after this section will actually be a lot smaller if you believe it!

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="what-is-mobx"><strong>What is MobX</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to be adding quite a few different functionalities. 

- <strong>Observables</strong> 
    - They are the next stage of a promise and concerned with a state over time rather than a promise which is only concerned with a one time event. They are something you can observe, and as their state changes, you can react to their state changing. 
- <strong>Action</strong>
    - They change the state of observables 
- <strong>Computed properties</strong> 
    -  If we already have state in our new variables, and we want to derive from this state a variable, we can use computed properties. They are something we can observe, and thus we can observe them too. 
- <strong>Reactions</strong> 
    - Anything we are observing in MobX, we can actually react to. 
- <strong>AutoRun</strong> 
    - Similar to Reactions, but they always run, even when the store is being initialized, while the Reaction will only run when a state in an observable changes. 

- Let's go over some examples 

```js 
import { makeObservable, observable } from "mobx";
import { createContext } from "react";

class DemoStore { // The store we want to create. 
    firstName = "Nate"; // observable variable 
    lastName = "Dawg";  // observable variable 

    constructor (){
        makeObservable(this, { // making the variables observable. 
            firstName: observable, 
            lastName: observable,
            setFirstName: action, // setting property
            fullName: computed // computed property
        })
    }

    // This is a Reaction
    // It will update an observable 
    // Thus, anything observing this observable will now 
    // be updated
    setFirstName = (name: string ) => {
        this.firstName = name;
    }

    // This is a computed property 
    // Notice that they are getters 
    get fullName() {
        return this.firstName + ' ' + this.lastName; 
    }

}

export default createContext(new DemoStroe());
```

- We don't have to really add stuff to the constructor for our different properties, variables, and Reactions. We can just use 'MakeAutoObservable(this)' instead. 

```js 

constructor () {
    makeAutoObservable(this);
}
```

- One thing to note is that we are using arrow functions which will automatically bind to a class in Javascript, so the this statement will represent the class. Another thing to add is a reaction. 


```js 
import { makeObservable, observable } from "mobx";
import { createContext } from "react";

class DemoStore { // The store we want to create. 
    firstName = "Nate"; // observable variable 
    lastName = "Dawg";  // observable variable 

    constructor (){
        makeAutoObservable(this);

        reaction (  // our reaction when a observable changes. 
            () => this.firstName,
            (firstName) => console.log(firstName)
        )
    }

    setFirstName = (name: string ) => {
        this.firstName = name;
    }

    get fullName() {
        return this.firstName + ' ' + this.lastName; 
    }

}

export default createContext(new DemoStroe());

```

- One of the biggest problems that Mobx will solve for use is passing props down from one component to another and even have communication between different components. React Context will allow each component to access the store directly and we aren't going to need the props anymore. Though, we can combine both in an application. An example of using a React context is below with a component

```js 
import React, {useContext} from 'react'; // notice the unique import 
import DemoStore from '../app/demoStore';

export default function Demo(){
    const demoStore = useContext(DemoStore);
    const {fullName} = demoStore; 

    return (
        <div>
            <h1>Hello {fullName}</h1>
        </div>
    )
}
```

- In order to observe observables in our store, we are going to use MobX React Lite which gives us higher order functions in order to do this. A higher order function is just a function that takes a function as a parameter. 

```js 
import { observer } from 'mobx-react-lite'; // new import 
import React, {useContext} from 'react';
import DemoStore from '../app/demoStore';

export default observer (function Demo(){ // notice that this is different
    const demoStore = useContext(DemoStore);
    const {fullName} = demoStore; 

    return (
        <div>
            <h1>Hello {fullName}</h1>
        </div>
    )
}
```



</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="setting-up-mobx"><strong>Setting up MobX</strong></h2>
<div class="tblurb"  markdown=1>

### Installation

- The first thing we are going to do is cd into our client-app, and run the command `mobx mobx-react-lite`. The great thing about mobX is that it's written in typescript so we don't need a typescript file for it. 

- Now let's add a store folder in our app folder. The path should be client-app/src/app/store, and create a new class in this store folder called activityStore.ts. Then we will make a small store like we did in the intro. 

```ts 
import {makeObservable, observable } from 'mobx';

export default class ActivityStore {
    title = 'Hello from MobX';

    constructor(){
        makeObservable(this, { // This here is referring to the object. 
            title: observable
        })
    }
}
```

- Now that we have created this small store, we are going to create a store that stores all of our stores. In the stores folder we are going to create a new file called `store.ts`. Then we will add the following code. 

```ts 
import { createContext, useContext} from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore // created as class, but classes can be used as types
}

// as we create more stores, this is the object that we will be adding our stores to. 
export const store: Store = {
    activityStore: new activityStore() 
}

// The context will make the stores available.
export const StoreContext = createContext(store);


// This is a simple react hook, that will allow us to use our stores 
// inside our react components 
export function useStore(){
    return useContext(StoreContext)
}
```

- Right now, our context is not available in our app. In order to use it, we need to make sure to make it available. To do this, we need to add it as a parent to our App component. Let's go to the index.tsx file and add the following. 

```jsx
import { store, StoreContext} from './app/stores/store';

ReactDom.render(
    <StoreContext.Provider value={store}> // now we providing our context to our app. 
        <App />
    </StoreContext.Provider>,
  document.getElementById('roo')
)
```

### Small Example 

- In the App.tsx file we will add the following code. 

```jsx 
// From App.tsx 
import { useStore } from '../stores/store'

function App() {
    const {activityStore} = useStore()
    ... // elided code 
}
```

- If we look at this code, our useStore function in the store.ts, contains the useContext which is our StoreContext function that contains our store object which we can destructure. It seems a little strange that we have so many functions to go through. 

- Now in the same file, App.tsx, go and add this code in the container section. This is just a small example to show you how to sue the store and get observable variables form it. 

{% raw %}
```jsx 
<Container style={{marginTop: '7em'}}>
    <h2>{activityStore.title}</h2>
```
{% endraw %}

- If we go to our app, we should see the title in our store at the top. 

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="mobx-actions"><strong>MobX actions</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to be adding functionality to our observable. Having a title isn't really anything special, so lets continue with the example and add a button for functionality. 

### Problems 

- using makeObservable
- using the makeAutoObservable
- Make our components observable 
- Using bound and using arrow functions

### Instruction

- There are two ways of creating actions in our app. We can use a regular function and then bind this to observable variable, or we can use an arrow function. 

{ % raw %}
```ts 
import { action, makeObservable, observable} from "mobx";

export default class ActivityStore {
    title = 'Hello from MobX';

    constructor(){
        makeObservable(this, { // This here is referring to the object. 
            title: observable
            setTitle: action.bound // notice we bind it because if we don't, the setTitle 'this' keyword is bound to the wrong thing... the function
        })
    }

    setTitle(){
        this.title = this.title + '!';
    }
}
```
{ % endraw %}


- Now to test ou this new set title function, we will add a button with it in the App.txs file in the Container component 

{% raw %}

```jsx 
// from App.tsx 
<Container style = {{marginTop: '7em'}}> 
    <h2>{activityStore.title}</h2> 
    <Button content='Add exclamation!' positive onClick={activityStore.setTitle}

```

{% endraw %}

- Now, you are probably thinking to yourself that the code should work, but if you go to test it out, you will quickly realize that there is something wrong. We just need to add one more thing for it to work. To make the statement observable, we need to add a small change to the default statement. 

```jsx 
// from App.tsx 

export default observable(App);
```

- Now when we test out everything it should work. The next step is to make our code a little more condensed. In order to do this we will add the `makeAutoObservable(this)` to our code. This time we will use the arrow function in order to bind to the class. 

```jsx
import { action, makeObservable, observable} from "mobx";

export default class ActivityStore {
    title = 'Hello from MobX';

    constructor(){
            makeAutoObservable(this)
    }

    setTitle = () => { // arrow function gives use the this binding to the class
        this.title = this.title + '!';
    }
}
```


</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="template"><strong>Template</strong></h2>
<div class="tblurb"  markdown=1>


### Problems 



### Instruction

</div>
</div><br/>
