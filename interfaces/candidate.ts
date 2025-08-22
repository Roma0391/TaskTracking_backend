
import { IProject } from './project'

export interface ICandidate {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  createdById: string
  projectId: string
  project?: IProject
  createdAt: Date
  updatedAt: Date
}