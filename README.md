# alberta-african-hub
"A community-driven platform for Africans in Alberta to connect, share experiences, and access essential resources. Featuring discussions, a directory of churches and grocery stores, and a hub for African-owned businesses. Built with React, Node.js, and MongoDB."

## Changes 
Separate the AfricanCommunityPlatform.js into more components like Header.js, common.js,
DirectoryPage.js, HomePage.js, BusinessPage.js, etc.
The common.js file will contain the common functions and variables used in the project.
The Header.js file will contain the header component.
The DirectoryPage.js file will contain the directory page component.
The HomePage.js file will contain the home page component.
The BusinessPage.js file will contain the business page component.
The Navigation.js file will contain the navigation component.

This is to make the project more modular and reusable. 
However, the new challenge is tracking global state and passing data between components. For instance, the user's login status, the user's profile, the user's messages, the current active tab, etc.

In addition, new services were created to handle the data fetching and updating.
For instance, the useBusinesses() hook is used to fetch the businesses data from the database.
The usePosts() hook is used to fetch the posts data from the database. useEvents() is used to fetch the events data from the database. useResources() is used to fetch the resources data from the database etc. They were created to separate the data fetching logic from the components.

In the future, we'll add more functions like fetchBusinesses by id and more related queries. 

Major thing to do is:
User authentication and authorization. 
User profile management.


In order for us to see the environment variables, it is visibile for now. Once it is understood and the project is deployed, the environment variables will be removed in the .gitignore file.

## Database
The database is created by Benjamin on MongoDB Atlas Cloud, the application is currently connected to the URI in 
the backend env file
## Future Updates
"Modify Javascript to Typescript"
