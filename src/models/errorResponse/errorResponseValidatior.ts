import Validator from 'jsonschema';
import errorResponseSchema from './errorResponseSchema.json';

const schema = new Validator.Validator();
const validErrorResponse = (errorResponse: any): boolean => schema
  .validate(errorResponse, errorResponseSchema)
  .errors.length === 0;

export default validErrorResponse;
