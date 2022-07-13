---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Hooking up our client app with the Server using Axios
date: 2022-07-11
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Setting Up Axios](#setting-up-axios)
- [Axios Types](#axios-types)
- [Adding Loading Indicators](#adding-loading-indicators)
- [Posting Data to the Server](#posting-data-to-the-server)
- [Deleting Activity on the Server](#deleting-activity-on-the-server)


<div class="gradient">
	<h2 class="section__title" id="introduction"><strong>Introduction</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to be adding quite a few different functionalities. 

- <strong>Configure Axios</strong>
    - We are going to make it so that we have some default settings when working with our api enpoints. Instead of having to type out all the endpoints, we will use certain defaults. 
- <strong>Using Generic Types</strong>
    - Generic types will help us to not have to go so deep in every return object. It will make our request easier to deal with 
- <strong>Using Axios Interceptors </strong>
    - The application is too fast, thus in order to look at interceptors, we will add delays that will help us add functionality when a request is made and received. This will help us setting up loading features. 
- <strong>Hooking up all our requests to the API </strong>
    - Using all the endpoints that we made earlier in order to have the data persist. 

</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="setting-up-axios"><strong>Setting Up Axios</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- We don't want to make all the different requests in many different components. We want to decouple our requests and abstract them away into a centralized location. 
- In order to do this, we will make a file where we can export these different requests. 

### Instruction

- In our client-app folder in the src/app folder we will make a new folder called 'api'
- In this folder, make a new file called agent.ts 
- We are going to first import axios and then add a default base url to the axios object. We will hard code it now, but later we will change this, so that we can actually use the app on the actual web. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'
```

- If you noticed in our original code below, we are actually getting the 'response.data' from the axios request. 

```jsx 
useEffect(() => {
    axios.get<Activity>('http://localhost:5000/api/activities').then((response: any) => {
      setActivities(response.data);
    })
  }, [])
```

- Let's add code to get this to make it less cumbersome getting the data. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = (response: AxiosResponse) => response.data

```

- Now let's add all of our requests to an object called requests, that we can use to fire off a request and then make can Activities object to make a get request to activities. After this will be the agent object with the Activities request we just made which we will export. I know this seems like a lot, but it will be more understandable with code. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = (response: AxiosResponse) => response.data

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody), // remember that for a post we are sending out data
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
	del: (url: string) => axios.delete(url).then(responseBody),
}


const Activities = {
	list: () => requests.get('/activities') // notice we don't need the whole url because we set the base url on the axios object
}

const agent = {
	Activities
}

export default agent; // we are exporting just the agent object

```

- Now let's hook this new centralized requests location up to our App.tsx component to make sure everything works properly. We can delete the axios import in this App.tsx file now that we have abstracted it away. 

```jsx 
// from App.tsx 
import agent from '../api/agent';

	... // elided code 


	useEffect(() => {
    	agent.Activities.list().then( response => {
      setActivities(response);
    })
  }, [])


```
- Make sure that we still get our Activities in our app after changing the above. 



</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="axios-types"><strong>Axios Types</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- When we are using the agent in our App.tsx file, we don't have any type safety unfortunately. We need to add type safety. 
- The current date we are getting back from out response is a string with some unnecessary information. We want to clip off this unnecessary information. 

### Instruction

- The first thing we are going to do is make our requests generic. In order to make something be able to use generics `<T>`, we need to add this generic marker to the beginning of our functions, and to the part that we want to be generic. See the code as follows. 

{% raw %}

```jsx
// from agent.ts
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = <T> (response: AxiosResponse<T>) => response.data; // notice it is at the beginning

const requests = {
	get: <T> (url: string) => axios.get(url).then(responseBody), // new code
	post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody), // new code
	put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody), // new code
	del: <T> (url: string) => axios.delete<T>(url).then(responseBody), // new code
}

const Activities = {
	list: () => requests.get<Activity[]>('/activities') // new code
}
```
{% endraw %}

- Now we have the type safety in place and if we go an hover over our App.tsx file, we can see that we have the type safety now. 
- The next problem we have is with the date. First, go to the ActivityForm.tsx and change the date form input to have type date on it. 

```jsx 
// from ActivityForm.tsx 

<Form.Input type='date' placeholder='Date' value ={activity.date} name='date' onChange ... // code elided
```

- Currently the date format that we are using looks like a string like '2020-09-30T13:44:08.311074'. If we go and look at the network tab in the developers tools and pull up the activities requests, we can see that this is the case. 
- We want to eliminate this information after the main yyyy/mm/dd date. In order to do this we will edit the response after receiving it. 

```jsx 
// from App.tsx 
import agent from '../api/agent';

	... // elided code 


	useEffect(() => {
    	agent.Activities.list().then( response => {
			let activities: Activity [] = []; // create an empty activities list to store the activities with the updated date
			response.forEach(activity => {
				activity.date = activity.date.split('T')[0]; // take the first object of the split by 'T' which will be the date we want. 
				activities.push(activity);
			})
      setActivities(activities);
    })
  }, [])


```

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="adding-loading-indicators"><strong>Adding Loading Indicators</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- The page loads too fast which is unrealistic. We are going to simulate loading data from a server by using a sleep function, and then using semanitc-UI's dimmer and loading components. 
- This will require using promises and the update async/await syntax and axios interceptors

### Instruction

- The first thing are going to do is create an interceptor for our response object. The interceptor will be a function we run before getting the response back. We will first create a sleep function and then run this sleep function before getting our response. All this will be done in our agent file

```jsx 
// agent.ts 

import { Activity } from '../models/activity';

const sleep = (delay: number) => {
	return new Promise
}
```

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="posting-data-to-the-server"><strong>Posting Data to the Server</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

### Instruction

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="deleting-activity-on-the-server"><strong>Deleting Activity on the Serve</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

### Instruction

</div>
</div><br/>
