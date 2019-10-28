import { Request, Response } from 'express';
import firebase from 'firebase-admin';
import Validator from 'jsonschema';
import FirestoreDB from '../firestoreDatabase/FirestoreDB';
import bookSchema from '../models/json/bookSchema.json';
import ServerLogger from '../loggers/ServerLogger';

const invalidID = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/;
const db = FirestoreDB.getInstance().getDatabase();
const schema = new Validator.Validator();
const logger = ServerLogger.getInstance().getLogger();

const validBook = (book: any) => schema.validate(book, bookSchema).errors.length === 0;

export const getBook = async (req: Request, res: Response) => {
  // Document id must be of type string
  const bookID: string = req.params.id.toString();

  if (bookID.search(invalidID)) {
    logger.error(`A request to get a book with an invalid book id of ${bookID} has been made.`);
    res.status(400).json({ message: 'Book ID is not valid' });
    return;
  }

  db.collection('books')
    .doc(bookID)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        logger.error(`A request to get a book with a non existing book id of ${bookID} has been made.`);
        res.status(404).json({ message: 'Book not found' });
      } else if (validBook(doc.data())) {
        const book = doc.data();
        book.id = bookID;
        logger.info(`got book: ${bookID} json: ${JSON.stringify(book)}`);
        res.status(200).json({ book });
      } else {
        logger.error(`The database returned an invalid book when getting book id ${bookID} json: ${JSON.stringify(doc.data())}.`);
        res.status(500).json({ message: 'Data returned from the database was not a valid book object' });
      }
    })
    .catch((err: Error) => {
      logger.warn(`A request to get a book with an invalid book id of ${bookID} has been made but the database returned the error: ${err}`);
      res.status(500).json({ message: 'Database error' });
    });
};

export const postBook = (req: Request, res: Response) => {
  const book = req.body;

  if (!validBook(book)) {
    logger.error(`A request to put an invalid book was made. json: ${JSON.stringify(book)}`);
    res.status(400).json({ status: 'bad request' });
    return;
  }

  db.collection('books')
    .add(book)
    .then((ref: firebase.firestore.DocumentReference) => {
      logger.info(`A request to put a book was made. The new id is ${ref.id} json: ${JSON.stringify(book)}`);
      return res.status(201).json({ status: 'success', bookID: ref.id });
    })
    .catch((err: Error) => {
      logger.error(`A request to put book: ${JSON.stringify(book)} was made but an error occured whilst trying to save to the database. Error: ${err}`);
      res.status(500).json({ message: 'Failed to save data to databse' });
    });
};
