// npm install express
// npm install body-parser -> It is going to allow us to pass the information that we get sent from the post request. 
// npm install request

const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https');

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",(req,res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName,lastName,email);
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }  
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/56489032bb";
    const options = {
        method: "POST",
        auth: "Sapan:7254d38baaa8fab280486175044df173-us8"
    };

    const request = https.request(url, options, function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname+'/success.html');
        }
        else{
            res.sendFile(__dirname+'/failure.html');
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure',(req,res)=>{
    res.redirect('/');
});

app.listen(process.env.PORT || port,() => {
    console.log('Server is running on port '+port);
});

// API key
// 7254d38baaa8fab280486175044df173-us8

// Audience ID
// 56489032bb
// {"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}