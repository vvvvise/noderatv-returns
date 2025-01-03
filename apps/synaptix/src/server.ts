// @ts-expect-error - ApolloServer is not typed
import { ApolloServer } from "apollo-server";
// @ts-expect-error - gql is not typed
import gql from "gql";


const typeDefs = gql`
  type Query {
    message: String
  }
`;

const resolvers = {
  Query: {
    message: () => "Hello World!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
