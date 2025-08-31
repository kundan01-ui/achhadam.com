declare const PrismaClient: any;
declare const mongoose: any;
declare const config: any;
declare const logger: any;
declare const prisma: any;
declare const connectMongoDB: () => Promise<void>;
declare const connectPostgreSQL: () => Promise<void>;
declare const disconnectDatabases: () => Promise<void>;
declare const checkDatabaseHealth: () => Promise<{
    postgresql: boolean;
    mongodb: boolean;
}>;
//# sourceMappingURL=database.d.ts.map