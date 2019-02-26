export const User = {
	posts(parent, args, { db }, info) {
		return db.postsData.filter(p => p.userId === parent.id)
	},
	comments(parent, args, { db }, info) {
		return db.commentsData.filter(c => c.userId == parent.id)
	}
}
