import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  if (!process.env.TENANT_ID) {
    throw new Error("TENANT_ID is not defined");
  }
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
