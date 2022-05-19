---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Creating a CRUD application using React
date: 2022-05-18
author: Nathan Swindall
---


<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Folder structure in React](#folder-structure-in-react)
- [Adding an Activity Interface](#adding-an-activity-interface)
- [Adding a Nav bar](#adding-a-nav-bar)



## <strong>Introduction</strong>
Take a look at our folder structure
    -Way to structure our code to give it organization
Look at TypeScript interfaces 
    -Look at using interfaces to give us all the necessary stuff for typescript
Semantic UI Components 
    -Add styling and laying stuff out
Basic forms in React 
    -How to use form in react with oneway binding 

## <strong>Folder structure in React</strong>

How do we organize our folder structure in React 
reactjs.org/docs/faq-structure.html
Don't overthink 
Avoid too much nesting 
We are doing features option 
create a folder structure as follows 
in the src folder for the client-app 
create an app folder and a feature folder 
in the app folder create a layout folder.
app folder for all crosscutting concerns 
features folder for all of our features we build 
Move the App.tsx file into the layouts folder. 
An option will pop up. You want to chose always update imports. 
Move index.css into the layouts folder, and change the name to styles.css 
This will be our global style sheet for all of our styles 
Remove App.css, App.tests.tsx and logo.svg
fix the imports in index.tsx for the style sheet. 
Remove the logo import from the App.txs file 
Remove the app.css from the app.tsx file. 
Check for errors and make sure the activities are still be displayed. 

## <strong>Adding an Activity interface</strong>
Go to localhost:5000/swagger/index.html to see your endpoints.
In the app folder create a new folder called models 
Now create a file called Activity.ts which will be an interface 
You can copy the json from the swagger and put it into jsontots.com and get back and interface. 

```ts 
export interface Activity {
    id: string; 
    title: string; 
    date: string; 
    descritpion: stirng; 
    category: string;
    city: string; 
    venue: string; 
}
```

You could call it IActivity.ts and go from the standards of c# if you want. 
Now go back to the code in your App.tx file and update some areas in your code to get typesafety 

```js
const [activities, setActivities] = useState<Activity>([]); 

useEffect(() => {
    axios.get<Activity>('http://localhost:500/api/activities').then( response => {
        setActivities(response.data)
    })
})
```

Now when adding Activity here, you will have type safety 

## <strong>Adding a Nav bar</strong>