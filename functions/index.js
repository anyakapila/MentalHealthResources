const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anya-mentalhealthresources-default-rtdb.firebaseio.com"
});

const database = admin.firestore();

app.use(cors({ origin: true }));
app.use(express.json());

// simple get endpoint
app.get('/helloWorld', (req, res) => {
  return res.status(200).send('Hello World!');
});

// post /api/create endpoint
app.post('/api/create', async (req, res) => {
    try {
      const { id, item } = req.body;

      if (!id || !item) {
        return res.status(400).send('Missing id or item in request body');
      }

      await database.collection('items').doc(id).set({ item });
      return res.status(200).send('Item created successfully');
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  });

// saveArticle api
app.post('/api/saveArticle', async (req, res) => {
    try {
      // get id token from auth header
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
      }
      const idToken = authHeader.split('Bearer ')[1];

      // verify id token, get user info
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // get article id from request body
      const { articleId } = req.body;
      if (!articleId) {
        return res.status(400).send('Missing articleId in request body');
      }

      const userDocRef = database.collection('users').doc(uid);
      
      await database.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists) {
        // create user doc with articles array with the article id
        transaction.set(userDocRef, { articles: [articleId] });
      } else {
        const data = userDoc.data();
        const articles = data.articles || [];

        // if article isnt already there add it to the articles array
        if (!articles.includes(articleId)) {
          articles.push(articleId);
          transaction.update(userDocRef, { articles });
        }
      }
    });
  
      return res.status(200).send('Article saved to user profile');
    } catch (error) {
      console.error('Error saving article:', error);
      return res.status(500).send(error.message);
    }
});

exports.app = functions.https.onRequest(app);