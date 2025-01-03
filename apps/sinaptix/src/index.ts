import "reflect-metadata";
import {
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Ctx,
  Root,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import * as path from "node:path";
import { PrismaClient } from "@prisma/client";
import { User, Post, UserRelationsResolver, PostRelationsResolver, UserCrudResolver, PostCrudResolver } from "../prisma/generated/type-graphql/index";

interface Context {
  prisma: PrismaClient;
}

// custom resolver for custom business logic using Prisma Client
/**
 * CustomUserResolver is a GraphQL resolver for the User entity.
 * It provides queries and field resolvers related to the User entity.
 */
@Resolver(() => User)
class CustomUserResolver {
  /**
   * bestUser is a query that fetches the best user based on a predefined condition.
   *
   * @param {Context} context - The context object containing Prisma client.
   * @returns {Promise<User | null>} - Returns a User object if found, otherwise null.
   */
  @Query(() => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { /* your condition here */ },
      });
      return user;
    } catch (error) {
      console.error("Error fetching best user:", error);
      return null;
    }
  }

  /**
   * favoritePost is a field resolver that fetches the favorite post of a user.
   * The favorite post is determined by the most recently created post by the user.
   *
   * @param {User} user - The user object for which the favorite post is being fetched.
   * @param {Context} context - The context object containing Prisma client.
   * @returns {Promise<Post | undefined>} - Returns a Post object if found, otherwise undefined.
   */
  @FieldResolver(type => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context,
  ): Promise<Post | null> {
    try {
      const favoritePost = await prisma.post.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      return favoritePost;
    } catch (error) {
      console.error("Error fetching favorite post:", error);
      return null;
    }
}
}

async function main() {
  const prisma = new PrismaClient();

  try {
    const schema = await buildSchema({
      resolvers: [
        CustomUserResolver,
        UserRelationsResolver,
        UserCrudResolver,
        PostRelationsResolver,
        PostCrudResolver,
      ],
      emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
      validate: false,
    });

    const server = new ApolloServer({/* */
      schema,
      context: (): Context => ({ prisma }),
    });

    const { port } = await server.listen(4000);
    console.log(`GraphQL is listening on ${port}!`);
  } catch (error) {
    console.error("Error starting server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
