export type FileInfo = {
  id: string
  metadata: {
    srcUrl: string
    size: number
  }
}

export enum FileAssignment {
  UserAvatar = 'UserAvatar',
  BookCover = 'BookCover',
  BookPdf = 'BookPdf',
  BookMetadata = 'BookMetadata',
}
