# CRUD App - Node | Office UI | Azure SQL | React

This project uses the Create React App as the base. You can add/delete/edit your scheduled pickups. Serves as a starter for building Scheduling apps.

Check out the screenshots attached for the final output.

Item | Library Used
------------ | -------------
Components | Office UI Fabric React
Database | Azure SQL (with Tedious)
Auth | Okta
Server | Node + Express
Frontend | React

I am using Nodemon to help with the refresh of server.js file on every edit.

## Usage:
* Initiate a local Git on your box in a new folder
* Clone the repo to the folder
* Setup a free Azure Account and a SQL Database
* Make sure that your IP is allowed in the Firewall rules of the SQL db
* Create an empty table on the Db using the available query editor(I have named mine- **schedules**)
* Grab a free Okta Developer account, create an application and add your Callback URLs, check Okta Documentation
* You can create an Azure Application Insights app as well, you need to grab the Instrumentaiotn ID in that case and add it in server.js
* Once you setup everything, launch the app using :
```
npm run server
```
## Interactive Demo on Angular
* Here is a demo of the same app with Angular 1.x: http://granturismo.herokuapp.com/ which uses MongoDB
* Here is the same app implemented in Angular 6 : http://angular-fullstackapp.herokuapp.com with MongoDB
