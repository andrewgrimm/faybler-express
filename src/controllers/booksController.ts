import { Request, Response } from 'express';
import firebase, { firestore } from 'firebase-admin';
import ErrorResponse from '../models/errorResponse/ErrorResponse';
import FirestoreDB from '../firestoreDatabase/FirestoreDB';
import ServerLogger from '../loggers/ServerLogger';
import validBook from '../models/book/bookValidator';
import Book from '../models/book/book';
import { validID } from '../models/firebaseID/firebaseIDValidator';

const db = FirestoreDB.getInstance().getDatabase();
const logger = ServerLogger.getInstance();

export const getBooks = async (req: Request, res: Response) => {
  let query: any = db.collection('books');

  if (req.query.featured) {
    query = query.where('tags', 'array-contains', 'featured');
  }

  if (req.query.language) {
    query = query.where('language', '==', req.query.language);
  }

  if (req.query.author) {
    query = query.where('authorUsername', '==', req.query.author);
  }

  query.get()
    .then((querySnapshot: firestore.QuerySnapshot) => {
      const books: Array<Book> = [];
      querySnapshot.forEach((doc) => {
        const book: Book = doc.data() as Book;
        book.id = doc.id;

        if (validBook(book)) {
          books.push(book);
        } else {
          // log that there is a bad book in the library';
          logger.error(`One of the books returned from the database was invalid. BookID: ${doc.id} json: ${JSON.stringify(doc.data())}.`);
        }
      });
      res.status(200).json(books);
    })
    .catch((err: Error) => {
      logger.warn(`A request to get books has been made but the database returned the error: ${err}`);
      const error = new ErrorResponse(
        '500',
        'Database Error',
        'The database returned an error whilst fetching books',
      );
      res.status(500).json(error.toJSON());
    });
};

export const getBook = async (req: Request, res: Response) => {
  // Firebase document id must be of type string
  const bookID: string = req.params.id.toString();

  if (!validID(bookID)) {
    logger.error(`A request to get a book with an invalid book id of ${bookID} has been made.`);
    const error = new ErrorResponse(
      '400',
      'Bad Request',
      'Book ID is not valid',
    );
    res.status(400).json(error.toJSON());
    return;
  }

  db.collection('books')
    .doc(bookID)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        logger.error(`A request to get a book with a non existing book id of ${bookID} has been made.`);
        const error = new ErrorResponse(
          '404',
          'Not Found',
          'Could not find a book matching the book ID',
        );
        res.status(404).json(error.toJSON());
      } else if (validBook(doc.data())) {
        const book: Book = doc.data() as Book;
        book.id = bookID;
        logger.info(`got book: ${bookID} json: ${JSON.stringify(book)}`);
        res.status(200).json(book);
      } else {
        logger.error(`The database returned an invalid book when getting book id ${bookID} json: ${JSON.stringify(doc.data())}.`);
        const error = new ErrorResponse(
          '500',
          'Database Error',
          'Data returned from the database was not a valid book object',
        );
        res.status(500).json(error.toJSON());
      }
    })
    .catch((err: Error) => {
      logger.warn(`A request to get a book with the book id of ${bookID} has been made but the database returned the error: ${err}`);
      const error = new ErrorResponse(
        '500',
        'Database Error',
        'The database returned an error whilst fetching book',
      );
      res.status(500).json(error.toJSON());
    });
};

export const postBook = (req: Request, res: Response) => {
  const book: Book = req.body;

  if (!validBook(book)) {
    logger.error(`A request to post an invalid book was made. json: ${JSON.stringify(book)}`);
    const error = new ErrorResponse(
      '400',
      'Bad Request',
      'A request to post an invalid book was made',
    );
    res.status(400).json(error.toJSON());
    return;
  }

  db.collection('books')
    .add(book)
    .then((ref: firebase.firestore.DocumentReference) => {
      logger.info(`A request to post a book was made. The new id is ${ref.id} json: ${JSON.stringify(book)}`);
      return res.status(201).json({ status: 'success', id: ref.id });
    })
    .catch((err: Error) => {
      logger.error(`A request to post book: ${JSON.stringify(book)} was made but an error occured whilst trying to save to the database. Error: ${err}`);
      const error = new ErrorResponse(
        '500',
        'Database error',
        'Book failed to save to the database',
      );
      res.status(500).json(error.toJSON());
    });
};
