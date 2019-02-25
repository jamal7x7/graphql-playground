export const post = {
	Post: {
		author(parent, args, { db }, info) {
			return db.usersData.find(u => u.id === parent.userId)
		},
		comments(parent, args, { db }, info) {
			return db.commentsData.filter(c => c.postId == parent.id)
		}
	}
}
