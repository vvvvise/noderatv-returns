// @ts-expect-error - type-graphql is not typed
import { buildSchemaSync } from "type-graphql/build/esm/utils";
// @ts-expect-error - @prisma/client is not typed
import * as generatorBuild from "@prisma/client/generator-build";

export const schema = buildSchemaSync({
  "resolvers": [
    generatorBuild.FindManyUserResolver,
    generatorBuild.FindUniqueUserResolver,
    generatorBuild.UserRelationsResolver,
    generatorBuild.CreateUserResolver,
    generatorBuild.FindManyChannelResolver,
    generatorBuild.CreateChannelResolver,
    generatorBuild.ChannelRelationsResolver,
    generatorBuild.PostCrudResolver,
  ],
  "validate": false,
});
