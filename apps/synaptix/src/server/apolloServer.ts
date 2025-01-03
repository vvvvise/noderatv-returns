// server/apolloServer.ts
export async function createApolloServer(prisma: PrismaClient) {
  const schema = await buildSchema({
    resolvers: [
      CustomUserResolver,
      UserRelationsResolver,
      UserCrudResolver,
      PostRelationsResolver,
      PostCrudResolver,
    ],
    emitSchemaFile: path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "./generated-schema.graphql"
    ),
    validate: false,
  });

  return new ApolloServer({
    schema,
    context: (): Context => ({ prisma }),
  });
}