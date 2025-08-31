declare const logger: any;
declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
interface ErrorResponse {
    error: {
        message: string;
        statusCode: number;
        timestamp: string;
        path: string;
        method: string;
        [key: string]: any;
    };
}
declare const errorHandler: (error: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
declare const notFoundHandler: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map