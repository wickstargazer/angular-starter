// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import * as cryptoRandomString from 'crypto-random-string';
import * as request from 'request';
import { config } from './server-config/config';
import { Issuer } from 'openid-client';
import * as cache from 'memory-cache';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4200;
const HOST = '0.0.0.0';
const DIST_FOLDER = join(process.cwd(), 'dist');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser('fd34s@!@dfa453f3DF#$D&W'));


const stateGenerated = () => {
  if (!cache.get('state')) {
    cache.put('state', cryptoRandomString(15));
  }
  return cache.get('state');
};

/* FOR LOAD-BALANCING THE UI AND PERSISTING THE STATES */
// const rngBasicAuth = "Basic " + new Buffer(config.rng_basicauth).toString("base64");
// let stateGenerated = () => {
//   return new Promise((resolve, reject) => {
//       request({
//               url : config.rng_url,
//               headers : {
//                   "Authorization" : rngBasicAuth
//               }
//           }, (err, res, body) => {
//               if (err) {
//                   console.log(err);
//                   return resolve(cryptoRandomString(15));
//               }
//               resolve(body);
//       });
//   });
// }
/* FOR LOAD-BALANCING THE UI AND PERSISTING THE STATES */

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { ServerAppModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.use(compression());
app.engine('html', ngExpressEngine({
  bootstrap: ServerAppModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});



const _issuer = new Issuer({
  issuer: config.issuer,
  authorization_endpoint: config.authorization_endpoint,
  token_endpoint: config.token_endpoint,
  userinfo_endpoint: config.userinfo_endpoint,
  jwks_uri: config.jwks_uri,
});


// Issuer.useRequest();
Issuer.defaultHttpOptions = { timeout: 50000, retries: 3 };

const client = new _issuer.Client({
  client_id: config.client_id
});
client.CLOCK_TOLERANCE = config.CLOCK_TOLERANCE;

const router = express.Router();
// Middle-ware to check for logged in cookies otherwise redirect for the code-flow.
const requireLogin = async (req, res, next) => {
  if (req.cookies.your_token_name && req.cookies.your_refresh_token_name) {
      next(); // allow the next route to run
  } else {

      // require the user to log in
      const state = await stateGenerated();
      const postForm = client.authorizationPost({
          redirect_uri: config.redirect_uri,
          scope: config.scope,
          response_mode: config.response_mode,
          response_type: config.response_type,
          state: state
      });
      res.send(postForm);
  }
}

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// For callback with the code from the ID Server.
app.post('/callback', async (req, res) => {
   let state = await stateGenerated();
   client.authorizationCallback(config.redirect_uri, req.body, { state }).then(function (tokenSet) {
       res.cookie('your_token_name', tokenSet.access_token, { httpOnly: false, domain: config.cookiesDomain });
       res.cookie('your_refresh_token_name', tokenSet.refresh_token, { httpOnly: true, domain: config.cookiesDomain });
       res.redirect('/');
   }, function (err) {
       console.log(err);
       res.cookie('your_token_name', '', { expires: new Date(0) , httpOnly: false, domain: config.cookiesDomain });
       res.cookie('your_refresh_token_name', '', { expires: new Date(0), httpOnly: true, domain: config.cookiesDomain });
       res.redirect(config.redirect_uri);
       console.log('retry.');
   })
});

// For refreshing token with the ID Server
app.post('/refresh', function (req, res) {
   client.refresh(req.cookies.your_refresh_token_name) // => Promise
   .then(function (tokenSet) {
       res.cookie('your_token_name',  tokenSet.access_token, { httpOnly: false, domain: config.cookiesDomain });
       res.cookie('your_refresh_token_name',  tokenSet.refresh_token , { httpOnly: false, domain: config.cookiesDomain });
       res.status(200).send('ok');
   }, function(err){
       console.log(err);
       res.cookie('your_token_name', '', { expires: new Date(0), httpOnly: true, domain: config.cookiesDomain });
       res.cookie('your_refresh_token_name', '', { expires: new Date(0), httpOnly: true, domain: config.cookiesDomain });
       res.status(401).send('refresh token lifetime ended');
   });
});

// Loging in path. it will redirect to the ID Server. The path is used as the gate for javascript (Angular in this case)
app.get('/login', async (req, res) => {
   const state = await stateGenerated();
   const postForm = client.authorizationPost({
       redirect_uri: config.redirect_uri,
       scope: config.scope,
       response_mode: config.response_mode,
       response_type: config.response_type,
       state: state
   });
   res.send(postForm);
});

// Registration path, in case the javascript wants to redirect to the registration page.
app.get('/register', function (req, res) {
   if (req.cookies.your_token_name) {
       res.redirect('/');
   } else {
       res.redirect(config.issuer + '/register'); // your registration path
   }
});

// As clear as logging out! Same, act as a gateway for javascripts.
app.get('/logout', function (req, res) {
   res.cookie('your_token_name', '', { expires: new Date(0), httpOnly: true, domain: config.cookiesDomain  });
   res.cookie('your_refresh_token_name', '', { expires: new Date(0), httpOnly: true, domain: config.cookiesDomain  });
   res.redirect(config.endsession_endpoint + '?post_logout_redirect_uri=' + config.post_logout_redirect_uri);
});

// Simple healthcheck for your load-balancers
app.get('/healthcheck', function (req, res) {
  res.send('Hello world test\n');
});

// All regular routes use the Universal engine
router.get('*', requireLogin,  function (req, res) {
   // res.sendFile(path.join(__dirname + '/index.html')); // non universal render
   res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req, res });
});

app.use(router);

// Start up the Node server
app.listen(PORT,HOST, () => {
  console.log(`Node server listening on http://${HOST}:${PORT}`);
});
