import { Comment } from './Comment'
import { Mutation } from './Mutation'
import { Post } from './Post'
import { Query } from './Query'
import Subscription from './Subscription'
import { User } from './User'

const resolvers = {
	Query,
	Mutation,
	Post,
	User,
	Comment,
	Subscription
}

export default resolvers
