import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import * as Validator from 'jsonschema';
import FirestoreDB from '../firestoreDatabase/firestore';

const bookSchema = require('../models/json/bookSchema.json');

const invalidID = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;
const db = FirestoreDB.getInstance().database;
const schema = new Validator.Validator();

// not sure - any - can't use JSON type because doc.data() may be undefined (which is handled prior)
const validBook = (book: any) => schema.validate(book, bookSchema).errors.length === 0;

export const getBook = async (req:Request, res:Response) => {
  const bookID = req.params.id;

  if (bookID.search(invalidID)) {
    // TODO log ERROR level 0 front end should prevent this from hapening
    res.status(400).json({ message: 'Book ID is not valid' });
    return;
  }

  db.collection('books')
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        // TODO log ERROR level 0 front end should prevent this from hapening
        res.status(404).json({ message: 'Book not found' });
      } else if (validBook(doc.data())) {
        const book = doc.data();
        book.id = bookID;
        // TODO log book id returned in info level
        res.status(201).json({ book });
      } else {
        // TODO log ERROR level 0 here as this should never happen.
        res.status(500).json({ message: 'Data returned from the database was not a valid book object' });
      }
    })
    .catch((err:Error) => {
      // TODO log error WARN as this could be a problem if it is persistant
      res.status(500).json({ message: 'Data returned from the database was not a valid book object' });
    });
};

export const postBook = (req:Request, res:Response) => {
  const book = req.body;

  if (!validBook(book)) {
    res.status(400).json({ status: 'bad request' });
    return;
  }

  db.collection('books')
    .add(book)
    .then((ref:firebase.firestore.DocumentReference) => res.status(201).json({ status: 'success', bookID: ref.id }))
    .catch((err:Error) => {
      // TODO log error WARN as this could be a problem if it is persistant
      res.status(500).json({ message: 'Failed to save data to databse' });
    });
};
