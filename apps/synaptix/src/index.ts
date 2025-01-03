import { PrismaClient } from "@prisma/client";
import { createApolloServer } from "./server/apolloServer";

async function startServer() {
  const prisma = new PrismaClient();

  try {
    const server = await createApolloServer(prisma);
    const { port } = await server.listen(4000);
    console.log(`GraphQL server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
  } finally {
    await prisma.$disconnect();
  }
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Caught error:", error);
  process.exit(1);
});