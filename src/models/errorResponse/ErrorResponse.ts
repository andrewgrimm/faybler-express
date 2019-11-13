import httpContext from 'express-http-context';

export default class ErrorMessage {
  private status: string;

  private title: string;

  private description: string;

  private correlationID: string;

  public constructor(status: string, title: string, description: string) {
    this.status = status;
    this.title = title;
    this.description = description;
    this.correlationID = httpContext.get('correlationID') || 'correlationID-error';
  }

  public toJSON() {
    return {
      status: this.status,
      title: this.title,
      description: this.description,
      correlationID: this.correlationID,
    };
  }
}
