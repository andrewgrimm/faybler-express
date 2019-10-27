import firebase from 'firebase-admin';

export default class FirestoreDB {
  private static instance: FirestoreDB;

  private database: firebase.firestore.Firestore;

  private constructor() {
    const firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      databaseURL: 'process.env.DATABASE_URL',
    });
    this.database = firebaseApp.firestore();
  }

  public static getInstance(): FirestoreDB {
    if (!FirestoreDB.instance) {
      FirestoreDB.instance = new FirestoreDB();
    }
    return FirestoreDB.instance;
  }

  public getDatabase(): firebase.firestore.Firestore {
    return this.database;
  }
}
