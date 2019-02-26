import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import resolvers from './resolvers'
// console.log(db, resolvers)

const pubsub = new PubSub()

const server = new GraphQLServer({
	typeDefs: './src/typeDefs/schema.graphql',
	resolvers,
	context: { db, pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000/ `))
