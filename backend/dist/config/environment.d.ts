declare const z: any;
declare const dotenv: any;
declare const envSchema: any;
declare const env: any;
declare const config: {
    readonly nodeEnv: any;
    readonly port: any;
    readonly postgresql: {
        readonly url: any;
    };
    readonly mongodb: {
        readonly url: any;
    };
    readonly jwt: {
        readonly secret: any;
        readonly expiresIn: any;
        readonly refreshExpiresIn: any;
    };
    readonly redis: {
        readonly url: any;
        readonly host: any;
        readonly port: any;
        readonly password: any;
    };
    readonly aws: {
        readonly accessKeyId: any;
        readonly secretAccessKey: any;
        readonly region: any;
        readonly s3Bucket: any;
    };
    readonly external: {
        readonly weatherApiKey: any;
        readonly smsApiKey: any;
        readonly emailApiKey: any;
    };
    readonly security: {
        readonly corsOrigin: any;
        readonly rateLimit: {
            readonly windowMs: any;
            readonly maxRequests: any;
        };
    };
    readonly logging: {
        readonly level: any;
    };
    readonly features: {
        readonly ai: any;
        readonly realTime: any;
        readonly paymentGateway: any;
    };
};
//# sourceMappingURL=environment.d.ts.map