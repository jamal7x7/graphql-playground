import crypto from 'crypto'

export const mutation = {
	Mutation: {
		createUser: (parent, args, { db }, info) => {
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

		createPost: (parent, args, { db }, info) => {
			const createdPost = {
				...args.data,
				id: crypto.randomBytes(10).toString('hex')
			}
			db.postsData.push(createdPost)
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

		createComment: (parent, args, { db }, info) => {
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
}
