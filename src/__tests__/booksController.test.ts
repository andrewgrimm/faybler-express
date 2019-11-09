import supertest from 'supertest';
import app from '../app';
import Book from '../models/book/book';
import validBook from '../models/book/bookValidator';
import invalidID from '../models/firebaseID/firebaseIDRegex';

const request = supertest(app);

describe('GET /books', () => {
  afterEach((done) => {
    app.close(done);
  });

  it('Get my favorite book', async () => {
    const result:any = await request.get('/books/MMaTmwFPljQ0bV3TrLZM');
    const { book }: { book: Book } = JSON.parse(result.text);
    expect(result.statusCode).toEqual(200);
    expect(book.id.search(invalidID)).toEqual(0);
    expect(book.id).toEqual('MMaTmwFPljQ0bV3TrLZM');
    expect(validBook(JSON.parse(result.text).book)).toEqual(true);
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
    expect(id.search(invalidID)).toEqual(0);
    done();
  });
});
