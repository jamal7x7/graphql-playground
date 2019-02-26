import crypto from 'crypto'

export const Mutation = {
	createUser: (parent, args, { db, pubsub }, info) => {
		const emailTaken = db.usersData.some(u => u.email === args.data.email)
		if (emailTaken) throw new Error('email taken!')

		const createdUser = {
			...args.data,
			// id: crypto.randomBytes(10).toString('hex')
			id: pubsub
				.asyncIterator('COUNT')
				.next()
				.then(d => d.value.count)
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
		const idExist = db.usersData.some(u => u.id === args.id)
		if (!idExist) throw new Error('User id does not exist!')

		const toUpdateUser = db.usersData.filter(u => u.id === args.id)[0]
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
			id: crypto.randomBytes(10).toString('hex'),
			published: args.data.published
		}
		db.postsData.push(createdPost)

		if (args.data.published) {
			pubsub.publish(`POST`, { post: createdPost })
		}

		return createdPost
	},

	deletePost: (parent, args, { db }, info) => {
		const idExist = db.postsData.some(p => p.id === args.id)
		if (!idExist) throw new Error('Post id does not exist!')

		const toDeletePost = db.postsData.filter(p => p.id === args.id)[0]

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

		pubsub.publish(`COMMENT ${args.data.postId}`, { comment: createdComment })
		pubsub.publish(`COMMENTS`, { comments: db.commentsData })

		return createdComment
	},

	deleteComment: (parent, args, { db }, info) => {
		const idExist = db.commentsData.some(c => c.id === args.id)
		if (!idExist) throw new Error('Comment id does not exist!')

		const toDeleteComment = db.commentsData.filter(c => c.id === args.id)[0]

		db.commentsData = db.commentsData.filter(c => c.id !== args.id)
		// const message = `Post id ${args.id} was deleted`
		return toDeleteComment
	}
}
