import type { ObjectId } from "mongodb"

export interface Template {
  _id?: ObjectId | string
  id: string
  name: string
  content: string
  folderId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  _id?: ObjectId | string
  id: string
  name: string
  parentId: string | null
  userId: string
  createdAt: Date
}

export interface User {
  _id?: ObjectId | string
  id: string
  login: string
  password: string
  name: string
  createdAt: Date
}

export interface AppState {
  folders: Folder[]
  templates: Template[]
  selectedFolderId: string | null
  expandedFolders: Set<string>
}
