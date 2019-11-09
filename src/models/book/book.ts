export default interface Book {
  id?: string,
  title: string,
  description: string,
  tags: Array<string>,
  author: {
      name: string,
      contentOwnerID: number
  },
  uploadDate: number,
  language: string,
  cover: string,
  contents: Array<string>,
  content: Array<string>
}
