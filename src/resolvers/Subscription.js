const Subscription = {
	// count: {
	// 	subscribe(parent, args, { pubsub }, info) {
	// 		let count = 0

	// 		// setInterval(() => {
	// 		// 	count++
	// 		// pubsub.publish('COUNT', { count })
	// 		// }, 5000)

	// 		// pubsub
	// 		// 	.asyncIterator('COUNT')
	// 		// 	.next()
	// 		// 	.then(d => console.log(d.value))

	// 		return pubsub.asyncIterator('COUNT')
	// 	}
	// },

	comment: {
		subscribe(parent, { postId }, { db, pubsub }, info) {
			const idExist = db.postsData.some(p => p.id === postId)
			if (!idExist) throw new Error('Post id does not exist!')

			return pubsub.asyncIterator(`COMMENT ${postId}`)
		}
	},
	comments: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator(`COMMENTS`)
		}
	},
	post: {
		subscribe(parent, { userId }, { db, pubsub }, info) {
			const idExist = db.usersData.some(u => u.id === userId)
			if (!idExist) throw new Error('User id does not exist!')

			return pubsub.asyncIterator(`POST ${userId}`)
		}
	}
}

export default Subscription
