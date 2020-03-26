const appInsights = require("applicationinsights");
appInsights.setup("0cecbb11-6f7e-4149-86be-86de783dad85");
appInsights.start();
const express = require("express")
const app = express()
const port = 5000;
const bodyParser = require('body-parser')
//const AuthService = require('./auth-service')
const sqltest = require('./sqltest')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./client/src/'));

sqltest.connect();

const OktaJwtVerifier = require('@okta/jwt-verifier');
var cors = require('cors');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-674282.okta.com/oauth2/default',
  clientId: '0oa4fx7b4d788BltL4x6',
  assertClaims: {
    aud: 'api://default',
  },
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);


  if (!match) {
   
    return res.status(401).end();
  }

  const accessToken = match[1];
  const expectedAudience = 'api://default';

  return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}


/**
 * For local testing only!  Enables CORS for all domains
 */

app.use(cors());
/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */

 
app.get('/', (req, res) => {
  
   res.send('index.html',  { root: __dirname + '/client/src/'});
 });



app.post('/api/messages', (req,res, next) => {
   console.log(req.body)
   sqltest.queryrows(req.body)
      .then( rs => res.send(rs))
     
})

app.post('/api/postdata', (req,res) =>{
   console.log(req.body)
   sqltest.postdata(req.body)
      .then(() => console.log('Updated!!'))
})

app.post('/api/editdata', (req,res) =>{
  console.log(req.body)
  sqltest.editdata(req.body)
     .then(() => console.log('Updated!!'))
})



app.post('/api/deldata', (req,res) => {
   console.log(req.body);
   sqltest.removeitem(req.body)
   .then((res) => console.log(res))
   
})

app.listen(port, () => console.log(`Server listening on port ${port}`))