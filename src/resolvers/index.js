import { comment } from './comment'
import { mutation } from './mutation'
import { post } from './post'
import { query } from './query'
import { user } from './user'

const resolvers = { ...query, ...mutation, ...post, ...user, ...comment }

export default resolvers
