@Resolver(() => User)
export class CustomUserResolver {
  @Query(() => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    return this.findBestUser(prisma);
  }

  @FieldResolver(() => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context
  ): Promise<Post | null> {
    return this.findFavoritePost(user, prisma);
  }

  private async findBestUser(prisma: PrismaClient): Promise<User | null> {
    try {
      return await prisma.user.findFirst({
        where: { email: "bob@prisma.io" }
      });
    } catch (error) {
      console.error("Error fetching best user:", error);
      return null;
    }
  }

  private async findFavoritePost(user: User, prisma: PrismaClient): Promise<Post | null> {
    try {
      const [favoritePost] = await prisma.user
        .findUnique({ where: { id: user.id } })
        .posts({ take: 1 });
      return favoritePost || null;
    } catch (error) {
      console.error(`Error fetching favorite post for user ${user.id}:`, error);
      return null;
    }
  }
}