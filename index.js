import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";

// resolvers will help Apollo to know where to fetch data
// fetching specific properties will be handled by apollo
const resolvers = {
	Query: {
		games() {
			return db.games;
		},
		authors() {
			return db.authors;
		},
		reviews() {
			return db.reviews;
		},
		review(_, args) {
			return db.reviews.find((review) => review.id === args.id);
		},
		game(_, args) {
			return db.games.find((game) => game.id === args.id);
		},
		author(_, args) {
			return db.authors.find((author) => author.id === args.id);
		},
	},
	Game: {
		reviews(parent) {
			return db.reviews.filter((item) => item.game_id === parent.id);
		},
	},
	Author: {
		reviews(parent) {
			return db.reviews.filter((item) => item.author_id === parent.id);
		},
	},
	Review: {
		author(parent) {
			return db.authors.find((item) => item.id === parent.author_id);
		},
		game(parent) {
			return db.games.find((item) => item.id === parent.game_id);
		},
	},
	Mutation: {
		deleteGame(_, args) {
			db.games = db.games.filter((i) => i.id !== args.id);
			return db.games;
		},
		addGame(_, args) {
			let game = {
				...args.game,
				id: Math.floor(Math.random() * 10000).toString(),
			};
			db.games.push(game);
			return game;
		},
		updateGame(_, args) {
			let game;
			db.games = db.games.map((g) => {
				if (g.id === args.id) {
					game = g;
					return { ...g, ...args.edit };
				}
			});
			return game;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log("Server ready at port ", 4000);
