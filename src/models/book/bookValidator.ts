import Validator from 'jsonschema';
import bookSchema from './bookSchema.json';

const schema = new Validator.Validator();
const validBook = (book: any) => schema.validate(book, bookSchema).errors.length === 0;

export default validBook;
