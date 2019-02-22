import crypto from 'crypto'
import { GraphQLServer } from 'graphql-yoga'

let usersData = [
	{
		id: 'u1',
		name: 'Jamal',
		username: 'jamal123',
		email: 'jamal123@jamal.com'
	},
	{
		id: 'u2',
		name: 'Kamal',
		username: 'kamal123',
		email: 'kamal123@kamal.com'
	},
	{
		id: 'u3',
		name: 'Rayan',
		username: 'rayan123',
		email: 'rayan123@rayan.com'
	}
]
let postsData = [
	{
		id: 'p1',
		title: 'SVG are awesome!',
		body: 'qkolsok bcdc dcdcs',
		userId: 'u1'
	},
	{
		id: 'p2',
		title: 'graphQL are the future',
		body: 'qoirjnvh bd ',
		userId: 'u2'
	},
	{
		id: 'p3',
		title: 'Learn Apollo plus react',
		body: 'ploksnqj dhsjdb ',
		userId: 'u3'
	}
]

let commentsData = [
	{
		id: 'c1',
		text: 'Comment1',
		postId: 'p1',
		userId: 'u1'
	},
	{
		id: 'c2',
		text: 'Comment2',
		postId: 'p1',
		userId: 'u1'
	},
	{
		id: 'c2',
		text: 'Comment3',
		postId: 'p2',
		userId: 'u2'
	},
	{
		id: 'c2',
		text: 'Comment4',
		postId: 'p3',
		userId: 'u3'
	}
]

const typeDefs = `
  type Query {
    users: [User!]!
    user(id: ID!): [User!]!
    me: User!
    posts: [Post!]!
    post: Post!
    comments: [Comment!]!
	}

	
	
	type Mutation {
		createUser(data: CreateUserInput): User!
		createPost(data: CreatePostInput): Post!
		createComment(data: CreateCommentInput): Comment!
		
		deleteUser(id: ID): User!
		deletePost(id: ID): Post!
		deleteComment(id: ID): Comment!
		
	}

	input CreateUserInput {
		name: String!
		username: String!
		email: String!
	}
	input CreatePostInput {
		title: String!
		body: ID!
		userId: ID!
	}
	input CreateCommentInput {
		text: String!
		postId: ID!
		userId: ID!
	}

  type User {
    id: ID!
    name: String!
    username: String!
		email: String!
		posts: [Post]
		comments: [Comment]
	}

  type Post {
    id: ID!
    title: String!
    body: String!
		author: User!
		comments: [Comment]
	}

  type Comment {
    id: ID!
    text: String!
		post: Post!
		author: User!

  }
`

const resolvers = {
	Query: {
		user: (p, { id }) => {
			return usersData.filter(d => d.id === id)
		},
		users: () => {
			return usersData
		},
		posts: (parent, args, ctx, info) => {
			return postsData
		},
		comments: (parent, args, ctx, info) => {
			return commentsData
		}
	},
	Mutation: {
		createUser: (parent, args, ctx, info) => {
			const emailTaken = usersData.some(u => u.email === args.data.email)
			if (emailTaken) throw new Error('email taken!')

			const createdUser = {
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			}
			usersData.push(createdUser)
			return createdUser
		},

		deleteUser: (parent, args, ctx, info) => {
			const idExist = usersData.some(u => u.id === args.id)
			if (!idExist) throw new Error('User id does not exist!')

			const toDeleteUser = usersData.filter(u => u.id === args.id)[0]

			usersData = usersData.filter(u => u.id !== args.id)
			// const message = `user id ${args.id} was deleted`
			return toDeleteUser
		},

		createPost: (parent, args, ctx, info) => {
			const createdPost = {
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			}
			postsData.push(createdPost)
			return createdPost
		},

		deletePost: (parent, args, ctx, info) => {
			const idExist = postsData.some(p => p.id === args.id)
			if (!idExist) throw new Error('Post id does not exist!')

			const toDeletePost = postsData.filter(p => p.id === args.id)[0]

			postsData = postsData.filter(p => p.id !== args.id)
			// const message = `Post id ${args.id} was deleted`
			return toDeletePost
		},

		createComment: (parent, args, ctx, info) => {
			if (
				!usersData.some(u => u.id === args.data.userId) ||
				!postsData.some(p => p.id === args.data.postId)
			)
				throw new Error('user or post not found!')

			commentsData.push({
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			})
			return commentsData
		},

		deleteComment: (parent, args, ctx, info) => {
			const idExist = commentsData.some(c => c.id === args.id)
			if (!idExist) throw new Error('Comment id does not exist!')

			const toDeleteComment = commentsData.filter(c => c.id === args.id)[0]

			commentsData = commentsData.filter(c => c.id !== args.id)
			// const message = `Post id ${args.id} was deleted`
			return toDeleteComment
		}
	},

	Post: {
		author(parent, args, ctx, info) {
			return usersData.find(u => u.id === parent.userId)
		},
		comments(parent, args, ctx, info) {
			return commentsData.filter(c => c.postId == parent.id)
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return postsData.filter(p => p.userId === parent.id)
		},
		comments(parent, args, ctx, info) {
			return commentsData.filter(c => c.userId == parent.id)
		}
	},
	Comment: {
		post(parent, args, ctx, info) {
			// console.log(parent)
			return postsData.find(p => p.id === parent.postId)
		},
		author(parent, args, ctx, info) {
			return usersData.find(u => u.id === parent.userId)
		}
	}
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running on http://localhost:4000/ `))
