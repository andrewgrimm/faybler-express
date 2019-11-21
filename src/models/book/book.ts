export default interface Book {
  id?: string,
  title: string,
  description: string,
  tags: Array<string>,
  authorUsername: string,
  uploadDate: number,
  language: string,
  difficulty: number,
  cover: string,
  contents: Array<string>,
  content: Array<string>
}
