# Recipe Management system application
## Description
The (RMS)Recipe Management system application is used to create and manage the recipes. The user creates the recipe with the list of ingredients and method of preparation. User can edit and clone a recipe.
 Only the author of the recipe can be able to edit/delete the recipe. The other users can only be able to view the recipe or clone the recipe. Value addition of the developed Recipe App enables the user to create different variants of recipes. The recipe relationships can be visualized through table and Tree view.  The recipe variants can be compared to determine the key changes of the recipe. Through this web application, the user can be able to change the recipe instantly based on the taste buds of the customer.<br>
**Basic features of the Web App:**<br>
      1.  Light weight Login functionality
      2.  Create a Recipe
      3.  Display a list of Recipes
      4.  Filter functionality to filter the recipes
      5.  Detail page about the Recipe
      6.  Edit and Save Recipe to database
      7.  Inbuilt Authorization
      8.  Delete a Recipe
      9.  Clone/Copy a Recipe
      10. Display the relationship between Recipes
      11. Compare the Recipes with ingredients and its method of preparation<br>
## Requirements
**To host the CAP Service in Cloudfoundry**<br>
SAP BTP Landscape with CAP service and Cloud foundry, Microsoft Visual studio code, Google Chrome browser<br>
**To run a local CAP Service**<br>
Microsoft Visual Studio Code <br>
## Download and Installation
**Hosting the OData service in Cloud Foundry**
1. Download the folder backend_RMS and build mtar file ( Make.exe must be present in backend_rms folder ).
Move to the folder backend_RMS in your system and run the below command.
<br>**command: mbt build -t gen --mtar recipe-service_2.0.0**<br>
mtar file must be generated successfully
2. login to cloud foundry 
**command: cf login -a url_cloud_foundry**<br>
and then enter the below credentials<br>
Email:<br>
Password:<br>
and go to the target and space of cloud foundry<br>
**command: cf target -o org_name -s space_name**
3. Deploying the built mtar file in cloud foundry with below command <br>
move to the gen folder where the mtar file exists.<br>
**command: cf deploy recipe-service_2.0.0**<br>
4. how to find the url to access the odata service
- go to the Cloud foundry 
- select your subaccount and space
- click the application recipe-service-srv link
- now click the link in the application routes section<br>
https://org_name-space_name-recipe-service-srv.com <br>
the above url follows the order ==> org-space-odataService<br>
you will find the metadata and all the entities with respect to the odata service in the above link<br>

**Running the UI5 Application with hosted CAP OData service**

1. Dowload the folder frontend_RMS and open it in visual studio code. please do the followings changes to connect to backend<br>
inside ui5.yaml file, replace the url with your respective url of cloud foundry as shown below <br>
        backend:<br>
          - path: /odata<br>
            url: https://org_name-space_name-recipe-service-srv.com<br>
2. inside manifest.json file <br>
ensure the following key values are present.<br>
   "dataSources": {<br>
      "recipe-service": {<br>
        "uri": "/odata/v4/recipe/",<br>
        "type": "OData",<br>
        "settings": {<br>
          "annotations": [],<br>
          "localUri": "localService/metadata.xml",<br>
          "odataVersion": "4.0"<br>
        }<br>
      }<br>
    }<br>
 3. Now run the "npm start" command in the Terminal to start the Application<br> 
 
**Running the UI5 Application using the local CAP Service**
Use the Local_RMS folder to run the Recipe application locally in the computer instead of hosting it in Cloud Foundry. 
- Download the folder 'Local_RMS' and open it in microsoft visual studio. run the command "npm start" in the terminal
- click the link http://localhost:4004/ you will find the metadata and entities of the odata service
- click the index.html link in the Web applications to load the application<br>
## How to obtain support
[Create an issue](https://github.com/SAP-samples/btp-cap-sapui5-recipes/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
