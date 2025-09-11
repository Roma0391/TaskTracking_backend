import { IProject } from './project'
import { ITask } from './task'
import { Roles } from './user'

export enum ProfilePermissions {
	HIGH = 'high',
	MEDIUM = 'medium',
	LOW = 'low'
}

export interface IProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: Roles
  permisionStatus: ProfilePermissions
  createdById: string
  createdProjects: IProject[] | []
  projectId: string
  project: IProject
  tasks: ITask[] | []
  createdAt: Date
  updatedAt: Date
}