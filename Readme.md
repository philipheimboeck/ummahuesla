# Umma Hüsla Idea Finder

This is a [#UH17](http://uh.diin.io/) hackathon project.

When asking alexa for new ideas the skill will contact the app (currently using AWS Lambda).
It fetches random words from a database and generates ideas for new hackathon projects.

Alexa will then present these generated ideas to the user.

Currently only german is supported. The text always has the following structure:

```
Mach $ARTICLE $ADJECTIVE $SUBJECT um $OBJECT $PROBLEM
```

Examples:

```
Mach (eine) (krumme) (Wasserpistole) um (Teppiche) (zu sparen)
Mach (eine) (mittelmäßige) (Hose) um (Melonenverkäufer) (zu verbessern)
Mach (ein) (freundliches) (Gehäuse) um (Busfahrer) (zu richten)
```

## Installation

### Install project

Install all dependencies with yarn.

```
yarn install
```

To build the distributable run the following command.

```
npm run build
```

To deploy this on lambda you'll have to copy the created file to the parent folder and create a zip that contains the
node_module folder and the creates bundle.js. Upload this zip to AWS lambda as described in one of the next sections.

### Setup Alexa

Go to developers.amazon.com and setup a new Alexa SDK Skill.

Use the following intent schema:

```json
{
  "intents": [
    {
      "name": "AMAZON.CancelIntent",
      "samples": []
    },
    {
      "name": "AMAZON.HelpIntent",
      "samples": []
    },
    {
      "name": "AMAZON.StopIntent",
      "samples": []
    },
    {
      "name": "IdeaIntent",
      "samples": [
        "Was kann ich machen",
        "Hast du eine Hackathon Idee",
        "Hast du eine Idee",
        "Inspiriere mich",
        "Ich brauche ein Projekt",
        "Ich brauche eine Idee"
      ],
      "slots": []
    }
  ]
}
```

As endpoint define the AWS Lambda endpoint of the app you create next.

### Setup Lambda

Go to Amazon AWS and create a new Lambda Function using Node 6.10.
As handler you have to choose `bundle.handler`.

Make sure you set up the following environment variables:

```
APP_ID=amzn1.ask.skill.<APP_ID>
DB_PASS=<Database Password>
DB_PORT=5432
DB_USER=<Database User>
DB_NAME=<Database Name>
DB_HOST=<Database Host>
```

Upload the created zip file to AWS Lambda. To test your function use the following scheme:

```json
{
  "session": {
    "sessionId": "SessionId.<SESSION_ID>",
    "application": {
      "applicationId": "amzn1.ask.skill.<APP_ID>"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.<USER_ID>"
    },
    "new": true
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.<REQUEST_ID>",
    "locale": "de-DE",
    "timestamp": "2017-06-09T17:58:31Z",
    "intent": {
      "name": "IdeaIntent",
      "slots": {}
    }
  },
  "version": "1.0"
}
```

