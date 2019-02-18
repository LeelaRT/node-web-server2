const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();
//Setup Partial templates with hbs
hbs.registerPartials(__dirname + '/views/partials');
//Setup the handle bars with express
app.set('view engine','hbs');

//Express middleware is a great tool using which we can tweak the Express and instruct it to further process things in a fashin we would like
//Below code is useful in catching number of requests and logging information to logfile
app.use( (req, res, next) => {
  var currentDateTime = new Date().toString();
  var log = `${currentDateTime} . Method: ${req.method} . URL: ${req.url}`;
  console.log(log);

  fs.appendFile('server.log', `${log} \n`, (err) => {
          if(err) throw err;
          console.log('Information is logged to server log file');
        }
  );
  next();
}  );

//Below code is useful for displaying a MAINTENANCE information. Not calling next() did the trick....
// In case the site is not in maintenance comment the below code otherwise keep it commented
// app.use( (req, res, next)=> {
//   res.render('maintenance.hbs');
// } );

//Adding call to middleware. static method takes the absolute path. Hence for path resolutuins to help, bad pages used __dirname + '/public'
app.use(   express.static(__dirname + '/public')  );

//Register Helper
hbs.registerHelper('getCurrentYear',()=>{ return new Date().getFullYear() });
hbs.registerHelper('screamIt', (text)=>{ return text.toUpperCase(); });
//app.get takes 2 parameters 1-path 2.Callback function with request and response parameters
app.get( '/', (req, resp)=>{
  // resp.send('<h1>Hello Express and node!</h1>');
//   resp.send(
//     {
//       user:'Leela',
//       likes: ['Country side',
//             'watching channels on -bushcraft and tools, living big in tiny houses, national and international travel channel , ALL THINGS GREEN'
//             ]
//     }
// )
//*************** DYNAMICALLY INJECTING DATA **************************
// response.render method takes 2 arguments 1.hbs page 2. Dynamic data in the form of object with key value pairs
    resp.render('home.hbs', {
      pageTitle:'Home Page',
      // currentYear: new Date().getFullYear(),
      bodyMessage: 'Hello and welcome to NodeJS tutorial on <h3>Rendering Templates With Data</h3><br/><br/>Congratulations! for coming to this part of the tutorial and Good Luck on your journey ahead!!!!'
    });

} );

//Chaning the below route to render hbs page from below
//Adding a new route
// app.get('/about', (req,resp)=> {
//   resp.send('<h1>You are in About page</h1>');
// } );
//to
app.get('/about', (req,resp)=>{
  // resp.render('about.hbs');
  resp.render('about.hbs',{
    pageTitle:'About Page'
    // currentYear: new Date().getFullYear()
  })
} );

//Adding BAD page
app.get('/bad',(req,resp)=>{
  resp.send( {request: 'Bad Request', errorMessage: 'Sorry could not fulfill your request!'} );
});

//app.listen takes a parameter for port number
//Second parameter is a method that is used to provides information to user
app.listen(port , ()=>{ console.log(`Info:Server is up and running on port ${port}!`)
 }  );
