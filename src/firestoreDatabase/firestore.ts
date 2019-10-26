import * as firebase from 'firebase-admin';

/* eslint-disable import/no-dynamic-require */
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

export default class FirestoreDB {
  public database: firebase.firestore.Firestore;

  private static instance: FirestoreDB;

  private constructor() {
    const firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: 'https://buoyant-arena-248106.firebaseio.com',
    });
    this.database = firebaseApp.firestore();
  }

  public static getInstance(): FirestoreDB {
    if (!FirestoreDB.instance) {
      FirestoreDB.instance = new FirestoreDB();
    }
    return FirestoreDB.instance;
  }
}
