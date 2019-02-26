export const Comment = {
	post(parent, args, { db }, info) {
		// console.log(parent)
		return db.postsData.find(p => p.id === parent.postId)
	},
	author(parent, args, { db }, info) {
		return db.usersData.find(u => u.id === parent.userId)
	}
}
