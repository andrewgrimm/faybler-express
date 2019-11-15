import supertest from 'supertest';
import app from '../app';
import Book from '../models/book/book';
import validBook from '../models/book/bookValidator';
import validErrorResponse from '../models/errorResponse/errorResponseValidatior';
import { validID } from '../models/firebaseID/firebaseIDValidator';

const request = supertest(app);

describe('GET /books/:id', () => {
  afterAll((done) => {
    app.close(done);
  });

  it('Get my favorite book', async () => {
    const result:any = await request.get('/books/MMaTmwFPljQ0bV3TrLZM');
    const book: Book = JSON.parse(result.text);
    expect(result.statusCode).toEqual(200);
    expect(validID(book.id)).toEqual(true);
    expect(book.id).toEqual('MMaTmwFPljQ0bV3TrLZM');
    expect(validBook(book)).toEqual(true);
  });

  it('Throw error on invalid book id', async () => {
    const result:any = await request.get('/books/__.__');
    expect(result.statusCode).toEqual(400);
    expect(validErrorResponse(JSON.parse(result.text))).toEqual(true);
  });

  it('Throw error on non existant book id', async () => {
    const result:any = await request.get('/books/0000');
    expect(result.statusCode).toEqual(404);
    expect(validErrorResponse(JSON.parse(result.text))).toEqual(true);
  });
});

describe('POST /books', () => {
  afterAll((done) => {
    app.close(done);
  });

  it('Post a book', async (done) => {
    const result:any = await request.post('/books')
      .send({
        title: 'The Three Little Bears',
        description: 'This is the description',
        tags: ['someHashTagWithoutHash'],
        author: {
          name: 'Unknown',
          contentOwnerID: 0,
        },
        uploadDate: 0,
        language: 'eng',
        cover: 'someBase64String',
        contents: ['chapter 1 Title', 'chapter 2 Title'],
        content: [
          'string containing chaper 1',
          'string containing chaper 2',
        ],
      });
    const { id } = JSON.parse(result.text);
    expect(result.text).toContain('success');
    expect(result.statusCode).toEqual(201);
    expect(validID(id)).toEqual(true);
    done();
  });

  it('Throw error when posting invalid book', async (done) => {
    const result:any = await request.post('/books')
      .send({
        foo: 'foo',
        bar: 'bar',
      });
    expect(result.statusCode).toEqual(400);
    expect(validErrorResponse(JSON.parse(result.text))).toEqual(true);
    done();
  });
});
