import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import resolvers from './resolvers'
console.log(db, resolvers)

const server = new GraphQLServer({
	typeDefs: './src/typeDefs/schema.graphql',
	resolvers,
	context: { db }
})
server.start(() => console.log(`Server is running on http://localhost:4000/ `))
