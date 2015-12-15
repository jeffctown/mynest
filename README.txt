This is a project to integrate Amazon's Echo ASK SDK with Nest.

It was setup using:

Amazon DynamoDB (storage)
Amazon Lambda (to run the javascript when needed)
Amazon Alexa Skills Kit (ASK)
Nest API

To get this running you will need to:

Register as a Nest Developer
Create a Nest App
Add your Nest Developer credentials to nest.js

Register as an Amazon Developer
Create an Amazon Alexa Skill using the Alexa Skills Kit (ASK)
Create a Lambda Function to run your Alexa code.
Zip up the /src folder and upload this to your Lambda function.
Copy your Lambda function endpoint into your Alexa Skill Information.

Create a DynamoDB instance
Create a table for devices (nest thermostat device ids).
Create a table for tokens (represents nest api tokens after authentication).

The sample intents in the /sampleIntents folder have their APP_ID removed.  You will need to replace APP_ID with your Alexa Skill ID if you want to use these for testing.

The speed assets are in the /speechAssets folder.  I used the intentgenerator.py python script to generate the Utterances.txt.  The contents of the files in this folder (other than the python script) will need to be added to your Alexa Skill.

Let me know if you have any questions.  This project is not actively maintained or supported, but I don't mind helping you out if you want to get this working.  
