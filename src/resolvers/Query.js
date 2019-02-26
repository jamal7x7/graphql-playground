export const Query = {
	user: (p, { id }, { db }) => {
		return db.usersData.filter(d => d.id === id)
	},
	users: (p, { id }, { db }) => {
		return db.usersData
	},
	posts: (parent, args, { db }, info) => {
		return db.postsData
	},
	comments: (parent, args, { db }, info) => {
		return db.commentsData
	}
}
