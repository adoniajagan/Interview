/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var request;
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var sql = require('mssql');
var config = {
  user: 'gmi', // update me
  password: 'sa@12345', // update me
  server: 'gmiinterview.database.windows.net',
  database: 'gmiinterview',
  options: {
	  encrypt : true
       //update me
  }
}
sql.connect(config, function (err) {
	if (err != null) {session.send(" err " + err)} ;
    request = new sql.Request();				
});
// var fetch = require('node-fetch');
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var fetch = require('node-fetch');
// var getSentiment = require('./lib/sentiment/getSentiment');

// var documents = 
// {
//   "documents": [
//     {
//       "language": "en",
//       "id": "1",
//       "text": "I am a Data Scientist."
//     }
//   ]
// }

// var postData = JSON.stringify(documents);

// fetch('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key': '4842cd1e369c4507a585189a6ad88413',
//         'Content-Length': Buffer.byteLength(postData)
//     },
//     body: postData
// })
    
var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
//bot.localePath(path.join(__dirname, './locale'));
var candscore = 30;
// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('aboutcomp', (session, args) => {
    session.send('The company is Global Mantra Innovations (GMI), located in Siruseri SIPCOT IT Park, Chennai. Our mantra is "Free Thinking".  GMI is a full life cycle Research and Innovation company focused on providing repeatable, reusable and scalable widgets.');
})
.matches('address', (session, args) => {
    session.send('Global Mantra Innovations, the company, is located in Siruseri SIPCOT IT Park, Chennai.');
})
.matches('affir', (session, args) => {
    session.send('Are there anything else you wish to know about the company? If yes, please continue. If not, type "menu"');
})
.matches('compcult', (session, args) => {
    session.send('Fun at work! Mantraians, our employees, are high-spirited people, who thirst for innovation and love to work as a team. Sky is the limit and we are driven by the phrase "Why not?".This is our culture.');
})
.matches('compdom', (session, args) => {
    session.send('Our primary domain is Healthcare. We also do a number of US federal defense projects.');
})
.matches('compgoal', (session, args) => {
    session.send('We are a products company! We aspire to develop a handful of globally competing tech products in cutting edge domains such as artificial intelligence, augmented reality, and block-chain technologies, by 2020.');
})
.matches('compsize', (session, args) => {
    session.send('At present, we employ about 50 professionals. We are looking to expand to about 150 techies by the end of 2017.');
})
.matches('compvalue', (session, args) => {
    session.send('Free thinking and Innovation are our core values. Our Dream is “Super BIG” Innovations and be “the industry standard”.');
})
.matches('compweb', (session, args) => {
    session.send('The company website is http://globalmantrai.com/index.html.');
})
.matches('currtech', (session, args) => {
    session.send('Some of the products developed in our very own "Widget Factory" serve in fast-tracking the code, as security wrapper, and for transformation of data into various formats.');
})
.matches('dresscode', (session, args) => {
    session.send('We do not have any strict dress codes. Casual office dressing is encouraged.');
})
.matches('founder', (session, args) => {
    session.send('Ravi Kunduru is the founder and CEO of Global Mantra Innovations.');
})
.matches('headop', (session, args) => {
    session.send('Naresh Nagarajan is the SVP and head of operations of Global Mantra Innovations.');
})
.matches('idealemp', (session, args) => {
    session.send('An ideal employee is one who is brave to think "Super BIG" and open to face challenges.');
})
.matches('pubpriv', (session, args) => {
    session.send('Global Mantra Innovations is a privately-owned company!');
})
.matches('scope', (session, args) => {
    session.send('We have a vibrant atmosphere and we provide a great landscape for you to be creative and explore cutting-edge technologies.');
})
.matches('whenfound', (session, args) => {
    session.send('The company was founded in 1996 in Chennai.');
    candscore += 5;
})
.matches('worktime', (session, args) => {
    session.send('We do not have solid work timing policy. However, we encourage Mantraians to be present between 10 am to 7 pm, when majority of team discussions and meetings take place.');
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

//bot.dialog('/', intents);    

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Global Mantra Innovations")
            .text("Free Thinking for Global Innovations")
            .images([
                 builder.CardImage.create(session, "http://globalmantrai.com/assets/img/images/logo_new.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I am the GMI_Bot. Thanks for installing me. ");
        session.beginDialog('/menu');
    },
    // function (session, results) {
    //     // Display menu
    //     session.beginDialog('/menu');
    // },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        var style = builder.ListStyle["button"];
        builder.Prompts.choice(session, "When you are ready to play, choose one of the options below:", "About_GMI|About_You|Clickn_Play|(quit)", { listStyle: style });
    },
    function (session, results) {
	    saveuserinput(session,results.response,results.response.entity);
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            // session.send("The results '%s'", JSON.stringify(results.response.entity));
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });
 
function saveuserinput(session,result,resultentity){
	
	switch(resultentity) {
    case "About_GMI":
           insertuserdata(session,'1',resultentity);
        break;
    case "About_You":
           insertuserdata(session,'2',resultentity);
        break;
	case "Clickn_Play":
        insertuserdata(session,'3',resultentity);
        break;

         }
	}
	function insertuserdata(session,InputID,Input){
	  
	   var date = new Date();
	   request = new sql.Request();
	   request.query("Insert into [SalesLT].[Log] (InputID,Input) values ('"+ parseInt(InputID) +"','"+Input+"')")
	  .then(function () {
	   }).catch(function (err) {
			session.send("Insert err " + err);
	   });
	}
bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a play session and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);

bot.dialog('/About_GMI', [
    function (session) {
        session.send("Feel free to ask questions about the company! When you are done with questions, type 'menu' to go to the main menu.");
        session.beginDialog('/intt');
    }
    // function (session, results) {
    //      // Display menu
    //     session.send("You entered '%s'", results.response);
    // }
]);

bot.dialog('/intt', intents);
// bot.dialog('/About_GMI/intt', intents, [
//     function (session, results) {
//         .matches('compsize', (session, args) => {
//         session.send('At present, the company size is about 50 employees. We are looking to expand to about 150 techies by the end of 2017.');
//         })
//         .onDefault((session) => {
//         session.send('Sorry, I did not understand \'%s\'.', session.message.text);
//         });
//     }
// ]);

bot.dialog('/About_You', [
    function (session) {
        session.send("Okay, let's chat!");
        builder.Prompts.text(session, "Could you please tell me about yourself in two sentences?");
    },
    function (session, results) {
        session.send("You said '%s'", results.response);
        builder.Prompts.text(session, "Thanks! Could you define success?");
    },
    function (session, results) {
        var style = builder.ListStyle["button"];
    	builder.Prompts.choice(session, "Who is the most inspirational personality to you among these 4?", "Narayana Murthi|Steve Jobs|Bill Gates|Elon Musk", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Elon Musk') {
            candscore += 20;
        } else if (results.response.entity === 'Narayana Murthi') {
            candscore += 15;
        } else {
            candscore += 10;
        }
        builder.Prompts.text(session, "What is the single quality in " + results.response.entity + " that inspires you the most?");
    },
    function (session, results) {
        var style = builder.ListStyle["button"];
        session.send("Ok! noted! '%s'", results.response);
        builder.Prompts.choice(session, "How comfortable would you be to work in an R&I environment?", "Very comfortable|Okay|Not comfortable", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Very comfortable') {
            candscore += 20;
        } else if (results.response.entity === 'Okay') {
            candscore += 5;
        } else {
            candscore -= 10
        }
        var style = builder.ListStyle["button"];
    //    session.send("Ok! noted! '%s'", results.response);
        builder.Prompts.choice(session, "If the job is offered, will you be willing to relocate closer to Siruseri?", "Yes|No", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Yes') {
            candscore += 20;
        } else {
            candscore -= 20;
        }
        session.send("Thanks for your responses.");
        if (candscore > 50) {
            session.send("Based on our conversation, we assess a fit. Our HR representative will contact you to schedule for the next round of interview.", candscore);
        } else {
            session.send("Our HR team will review and let you know of their decision.")
        }
    },
    function (session, results) {
    //    session.send("You said:", JSON.stringify(LuiModelUrl + results.response));
        session.send("Thanks for the resonses! Type 'menu' to go to the main menu.");
    }
]);

bot.dialog('/Clickn_Play', [
    function (session) {
        var style = builder.ListStyle["button"];
        session.send("Let's Play!");
    	builder.Prompts.choice(session, "Who is the most inspirational personality to you among these 4?", "Narayana Murthi|Steve Jobs|Bill Gates|Elon Musk", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Elon Musk') {
            candscore += 20;
        } else if (results.response.entity === 'Narayana Murthi') {
            candscore += 15;
        } else {
            candscore += 10;
        }
        builder.Prompts.text(session, "What is the single quality in " + results.response.entity + " that inspires you the most?");
    },
    function (session, results) {
        var style = builder.ListStyle["button"];
        session.send("Ok! noted! '%s'", results.response);
        builder.Prompts.choice(session, "How comfortable would you be to work in an R&I environment?", "Very comfortable|Okay|Not comfortable", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Very comfortable') {
            candscore += 20;
        } else if (results.response.entity === 'Okay') {
            candscore += 5;
        } else {
            candscore -= 10
        }
        var style = builder.ListStyle["button"];
    //    session.send("Ok! noted! '%s'", results.response);
        builder.Prompts.choice(session, "If the job is offered, will you be willing to relocate closer to Siruseri?", "Yes|No", { listStyle: style });
    },
    function (session, results) {
        if (results.response.entity === 'Yes') {
            candscore += 20;
        } else {
            candscore -= 20;
        }
        session.send("Thanks for your responses.");
        if (candscore > 50) {
            session.send("Based on our conversation, we assess a fit (%s/100). Our HR representative will contact you to schedule for the next round of interview.", candscore);
        } else {
            session.send("We do not see a fit here. Our HR team will review and let you know of their decision.")
        }
    }
	
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

