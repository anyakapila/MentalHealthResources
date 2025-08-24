const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors({ origin: true }));
app.use(express.json());

// load articles.json 
const articlesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));
const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anya-mentalhealthresources-default-rtdb.firebaseio.com"
});

const database = admin.firestore();

// saveArticle api
app.post('/api/saveArticle', async (req, res) => {
    try {

      // get id token from auth header
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
      }
      
      // verify id token, get user info
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // get article id from request body
      const { articleId } = req.body;
      if (!articleId || typeof articleId !== 'string' || articleId.trim() === '') {
        return res.status(400).send('Missing articleId in request body');
      }

      const articleRef = database.collection('articles').doc(articleId.toString());
      const articleDoc = await articleRef.get();

      if (!articleDoc.exists) {
        return res.status(404).send('Article not found');
      }

      const userDocRef = database.collection('users').doc(uid);

      let action = 'added';
      
      await database.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists) {
        // create user doc with articles array with the article id
        transaction.set(userDocRef, { articles: [articleId] });
      } else {
        const data = userDoc.data();
        const articles = data.articles || [];

        let updatedArticles = articles;

        // if article isnt already there add it to the articles array, otherwise remove it
        if (articles.includes(articleId)) {
          // remove articleId from articles array
          updatedArticles = articles.filter(id => id !== articleId);
          action = 'removed';
        } else {
          // add articleId to articles array
          updatedArticles = [...articles, articleId];
        }

        transaction.update(userDocRef, { articles: updatedArticles });
      }
    });

    console.log("Success");
    return res.status(200).send(`Article ${action}`);
    
    } catch (error) {
      console.error('Error saving article:', error);
      return res.status(500).send(error.message);
    }
});

app.get('/api/getSavedArticles', async (req, res) => {
    try {
      // get id token from auth header
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
      }

      // verify id token, get user info
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // reference to user doc
      const userDocRef = database.collection('users').doc(uid);
      const userDoc = await userDocRef.get();

      // if doc doesn't exist, return empty list
      if (!userDoc.exists) {
        return res.status(200).json({ articleIds: [] });
      }

      const userData = userDoc.data();
      const articleIds = userData.articles || [];

      console.log(`Fetched saved articles for user ${uid}`);

      return res.status(200).json({ articleIds });
    } catch (error) {
      console.error('Error fetching saved articles:', error);
      return res.status(500).send(error.message);
    }
});

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // only allow admin to grant roles
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can add other admins.'
    );
  }

  const uid = data.uid;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: `Success! ${uid} is now an admin.`};
  } catch (err) {
    throw new functions.https.HttpsError('unknown', err.message, err);
  }
});

exports.seedArticles = functions.https.onRequest(async (req, res) => {
  try {
    // require auth header
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
    }

    // verify token + claims
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).send('Forbidden: Admins only');
    }

    const batch = database.batch();

    if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
      return res.status(400).send('Invalid articles.json structure');
    }

    // seed categories
    if (articlesData.categories && Array.isArray(articlesData.categories)) {
      articlesData.categories.forEach(category => {
        const catRef = database.collection('categories').doc(category.id.toString());
        batch.set(catRef,{
          ...category,
        });
      });
    }

    // seed articles

    articlesData.articles.forEach(article => {
      const docRef = database.collection('articles').doc(article.id.toString());
      batch.set(docRef, {
        ...article
      });
    });

    await batch.commit();
    return res.status(200).send('Articles & categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding:', error);
    return res.status(500).send(error.message);
  }
});

exports.manageArticles = functions.https.onRequest(async (req, res) => {
  try {

    if (req.method !== 'POST') {
      return res.status(405).send('Only POST requests allowed');
    }

    // require auth header
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
    }

    // verify token + claims
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).send('Forbidden: Admins only');
    }

    //extract req body
    const { action, articleId, article } = req.body;

    if (!action)  {
      return res.status(400).send('Missing action field');
    }

    if (!articleId) {
      return res.status(400).send('Missing articleId field');
    }

    const articleRef = database.collection('articles').doc(articleId);

    if (action === 'add') {
      if (!article || !article.info || !article.url) {
        return res.status(400).send('Missing article fields in request body');
      }
      await articleRef.set(article, { merge: true });
      return res.status(200).send(`Article ${articleId} added successfully`);
    }

    if (action === 'update') {
      if (!article) {
        return res.status(400).send('Missing article object for update');
      }
      await articleRef.set(article, { merge: true });
      return res.status(200).send(`Article ${articleId} updated successfully`);
    }

    if (action === 'delete') {
      await articleRef.delete();
      return res.status(200).send(`Article ${articleId} deleted successfully`);
    }

    return res.status(400).send('Invalid action. Must be one of add, update, delete.');
  } catch (error) {
    console.error('Error managing article:', error);
    return res.status(500).send(error.message);
  }
})

exports.app = functions.https.onRequest(app);