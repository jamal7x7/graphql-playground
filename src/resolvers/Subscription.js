const Subscription = {
	comment: {
		subscribe(parent, { postId }, { db, pubsub }, info) {
			const idExist = db.postsData.some(p => p.id === postId && p.published)
			console.log(idExist)
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
		subscribe(parent, args, { db, pubsub }, info) {
			return pubsub.asyncIterator(`POST`)
		}
	}
}

export default Subscription
