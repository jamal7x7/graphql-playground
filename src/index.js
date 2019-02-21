import crypto from 'crypto'
import { GraphQLServer } from 'graphql-yoga'

const usersData = [
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
const postsData = [
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

const commentsData = [
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
    comments: [Comment]
	}

	
	
	type Mutation {
		createUser(data: CreateUserInput): User!
		createPost(data: CreatePostInput): Post!
		createComment(data: CreateCommentInput): Comment!
		
		deleteUser(data: CreateUserInput): User!
		deletePost(data: CreatePostInput): Post!
		deleteComment(data: CreateCommentInput): Comment!
		
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

		createPost: (parent, args, ctx, info) => {
			if (!usersData.some(u => u.id === args.data.userId))
				throw new Error('user not found!')
			const createdPost = {
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			}
			postsData.push(createdPost)
			return createdPost
		},

		deletePost: (parent, args, ctx, info) => {
			if (!usersData.some(u => u.id === args.data.userId))
				throw new Error('user not found!')
			const createdPost = {
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			}
			postsData.push(createdPost)
			return createdPost
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
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return usersData.find(u => u.id === parent.userId)
		},
		comments(parent, args, ctx, info) {
			return commentsData.filter(c => c.id == parent.commentId)
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
