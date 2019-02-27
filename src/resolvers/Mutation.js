import crypto from 'crypto'

export const Mutation = {
	createUser: (parent, args, { db, pubsub }, info) => {
		const emailTaken = db.usersData.some(u => u.email === args.data.email)
		if (emailTaken) throw new Error('email taken!')

		const createdUser = {
			...args.data,
			id: crypto.randomBytes(10).toString('hex')
		}
		db.usersData.push(createdUser)

		return createdUser
	},

	deleteUser: (parent, args, { db }, info) => {
		const idExist = db.usersData.some(u => u.id === args.id)
		if (!idExist) throw new Error('User id does not exist!')

		const toDeleteUser = db.usersData.filter(u => u.id === args.id)[0]
		db.usersData = db.usersData.filter(u => u.id !== args.id)

		db.postsData = db.postsData.filter(p => p.userId !== args.id)
		db.commentsData = db.commentsData.filter(c => c.userId !== args.id)

		return toDeleteUser
	},

	updateUser: (parent, args, { db }, info) => {
		const user = db.usersData.some(u => u.id === args.id)
		if (!user) throw new Error('User id does not exist!')

		const [toUpdateUser] = db.usersData.filter(u => u.id === args.id)
		const updatedUser = {
			...toUpdateUser,
			name: args.data.name,
			username: args.data.username,
			email: args.data.email
		}

		db.usersData = db.usersData.filter(u => u.id !== args.id)
		db.usersData = [...db.usersData, updatedUser]
		return updatedUser
	},

	createPost: (parent, args, { db, pubsub }, info) => {
		const idExist = db.usersData.some(u => u.id === args.data.userId)
		if (!idExist) throw new Error('User id does not exist!')

		const createdPost = {
			...args.data,
			id: crypto.randomBytes(10).toString('hex')
		}
		db.postsData.push(createdPost)

		if (args.data.published) {
			pubsub.publish(`POST`, {
				post: { mutation: 'CREATED', data: createdPost }
			})
		}

		return createdPost
	},

	updatePost: (parent, args, { db, pubsub }, info) => {
		const toUpdatePost = db.postsData.find(p => p.id === args.id)
		if (!toUpdatePost) throw new Error('Post id does not exist!')

		toUpdatePost.title = args.data.title
		toUpdatePost.body = args.data.body
		toUpdatePost.published = args.data.published

		pubsub.publish(`POST`, {
			post: { mutation: 'UPDATED', data: toUpdatePost }
		})

		return toUpdatePost
	},

	deletePost: (parent, args, { db, pubsub }, info) => {
		// const idExist = db.postsData.some(p => p.id === args.id)
		// if (!idExist) throw new Error('Post id does not exist!')

		const [toDeletePost] = db.postsData.filter(p => p.id === args.id)
		pubsub.publish(`POST`, {
			post: { mutation: 'DELETED', data: toDeletePost }
		})

		db.postsData = db.postsData.filter(p => p.id !== args.id)
		db.commentsData = db.commentsData.filter(c => c.postId !== args.id)

		return toDeletePost
	},

	createComment: (parent, args, { db, pubsub }, info) => {
		if (
			!db.usersData.some(u => u.id === args.data.userId) ||
			!db.postsData.some(p => p.id === args.data.postId)
		)
			throw new Error('user or post not found!')

		const createdComment = {
			...args.data,
			id: crypto.randomBytes(10).toString('hex')
		}

		db.commentsData.push(createdComment)

		// pubsub.publish(`COMMENT ${args.data.postId}`, { comment: createdComment })
		pubsub.publish(`COMMENT ${args.data.postId}`, {
			comment: { mutation: 'CREATED', data: createdComment }
		})

		return createdComment
	},

	deleteComment: (parent, args, { db, pubsub }, info) => {
		const idExist = db.commentsData.some(c => c.id === args.id)
		if (!idExist) throw new Error('Comment id does not exist!')

		const [toDeleteComment] = db.commentsData.filter(c => c.id === args.id)
		console.log(toDeleteComment)

		pubsub.publish(`COMMENT ${toDeleteComment.postId}`, {
			comment: { mutation: 'DELETED', data: toDeleteComment }
		})

		db.commentsData = db.commentsData.filter(c => c.id !== args.id)

		return toDeleteComment
	},

	updateComment: (parent, args, { db, pubsub }, info) => {
		const toUpDateComment = db.commentsData.find(c => c.id === args.id)
		if (!toUpDateComment) throw new Error('Comment id does not exist!')

		toUpDateComment.text = args.data.text
		pubsub.publish(`COMMENT ${args.data.postId}`, {
			comment: { mutation: 'UPDATED', data: toUpDateComment }
		})

		return toUpDateComment
	}
}
