const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// verify user and return decoded token
async function verifyAuth(req, res) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized: Missing or invalid Authorization header");
    return null;
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    res.status(401).send("Unauthorized: Invalid token");
    return null;
  }
}

// remove or save article for user
app.post("/api/saveArticle", async (req, res) => {
  try {
    const decoded = await verifyAuth(req, res);
    if (!decoded) return;

    const uid = decoded.uid;
    const { articleId } = req.body;

    if (!articleId || typeof articleId !== "string") {
      return res.status(400).send("Missing or invalid articleId");
    }

    const articleRef = db.collection("articles").doc(articleId);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return res.status(404).send("Article not found");
    }

    const userRef = db.collection("users").doc(uid);
    let action = "added";

    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);

      if (!userDoc.exists) {
        t.set(userRef, { articles: [articleId] });
      } else {
        const articles = userDoc.data().articles || [];
        let updated = [...articles];

        if (articles.includes(articleId)) {
          updated = articles.filter((id) => id !== articleId);
          action = "removed";
        } else {
          updated.push(articleId);
        }

        t.update(userRef, { articles: updated });
      }
    });

    return res.status(200).send(`Article ${action}`);
  } catch (err) {
    console.error("Error saving article:", err);
    return res.status(500).send(err.message);
  }
});

 // fetch saved articles for user
app.get("/api/getSavedArticles", async (req, res) => {
  try {
    const decoded = await verifyAuth(req, res);
    if (!decoded) return;

    const uid = decoded.uid;
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const articleIds = userDoc.exists ? userDoc.data().articles || [] : [];
    return res.status(200).json({ articleIds });
  } catch (err) {
    console.error("Error fetching saved articles:", err);
    return res.status(500).send(err.message);
  }
});

// seed articles + categories (admin only)
app.post("/api/seedArticles", async (req, res) => {
  try {
    const decoded = await verifyAuth(req, res);
    if (!decoded) return;

    if (!decoded.admin) {
      return res.status(403).send("Forbidden: Admins only");
    }

    const articlesData = require("./articles.json");
    if (!articlesData.articles || !Array.isArray(articlesData.articles)) {
      return res.status(400).send("Invalid articles.json structure");
    }

    const batch = db.batch();

    // seed categories
    if (Array.isArray(articlesData.categories)) {
      articlesData.categories.forEach((cat) => {
        const ref = db.collection("categories").doc(cat.id);
        batch.set(ref, { ...cat });
      });
    }

    // seed articles
    articlesData.articles.forEach((article) => {
      const ref = db.collection("articles").doc(article.id);
      batch.set(ref, { ...article });
    });

    await batch.commit();
    return res.status(200).send("Articles & categories seeded successfully!");
  } catch (err) {
    console.error("Error seeding:", err);
    return res.status(500).send(err.message);
  }
});


 // Manage (add, update, delete) articles (admin only)
app.post("/api/manageArticles", async (req, res) => {
  try {
    const decoded = await verifyAuth(req, res);
    if (!decoded) return;

    if (!decoded.admin) {
      return res.status(403).send("Forbidden: Admins only");
    }

    let { action, articleId, article } = req.body;

    if (!action) {
      return res.status(400).send("Missing action");
    }

    if (action === "add" && !articleId) {
      const ref = db.collection("articles").doc(); // auto id
      articleId = ref.id;
      article = { ...article, id: articleId };
      await ref.set(article);
      return res.status(200).send(`Article ${articleId} added successfully`);
    }

    if (!articleId) {
      return res.status(400).send("Missing articleId");
    }

    const ref = db.collection("articles").doc(articleId);

    switch (action) {
      case "add":
        if (!article?.info || !article?.url) {
          return res.status(400).send("Missing article fields");
        }
        await ref.set({ ...article, id: articleId }, { merge: true });
        return res.status(200).send(`Article ${articleId} added successfully`);

      case "update":
        if (!article) {
          return res.status(400).send("Missing article object for update");
        }
        await ref.set({ ...article, id: articleId }, { merge: true });
        return res.status(200).send(`Article ${articleId} updated successfully`);

      case "delete":
        await ref.delete();
        return res.status(200).send(`Article ${articleId} deleted successfully`);

      default:
        return res
          .status(400)
          .send("Invalid action. Must be add, update, or delete.");
    }
  } catch (err) {
    console.error("Error managing article:", err);
    return res.status(500).send(err.message);
  }
});

 // make a user an admin (admin only)
app.post("/api/addAdminRole", async (req, res) => {
  try {
    const decoded = await verifyAuth(req, res);
    if (!decoded) return;

    if (!decoded.admin) {
      return res.status(403).send("Forbidden: Only admins can add other admins");
    }

    const { uid } = req.body;
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return res.status(200).send(`Success! ${uid} is now an admin.`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

exports.app = functions.https.onRequest(app);