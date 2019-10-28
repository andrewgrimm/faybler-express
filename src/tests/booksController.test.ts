import supertest from 'supertest';
import app from '../app';

const request: any = supertest(app);

describe('GET /books', () => {
  it('Get my favorite book', async () => {
    const result:any = await request.get('/books/MMaTmwFPljQ0bV3TrLZM');
    expect(result.text).toContain('author');
    expect(result.statusCode).toEqual(200);
  });
});
