const JSON_RPC_ERROR_CODES = { INTERNAL_ERROR: -32603, INVALID_PARAMS: -32602, METHOD_NOT_FOUND: -32601 };

const createErrorWithMessageAndStatus = (message: string, status: number) => Object.assign(new Error(message), { status });

export const renderMethodNotFoundError = (method: string) =>
    createErrorWithMessageAndStatus(`The requested method called "${method}" is not supported.`, JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND);

export const renderMissingResponseError = (method: string) =>
    createErrorWithMessageAndStatus(
        `The handler of the method called "${method}" returned no required result.`,
        JSON_RPC_ERROR_CODES.INTERNAL_ERROR
    );

export const renderUnexpectedResultError = (method: string) =>
    createErrorWithMessageAndStatus(
        `The handler of the method called "${method}" returned an unexpected result.`,
        JSON_RPC_ERROR_CODES.INTERNAL_ERROR
    );

export const renderUnknownPortIdError = (portId: number) =>
    createErrorWithMessageAndStatus(
        `The specified parameter called "portId" with the given value "${portId}" does not identify a port connected to this worker.`,
        JSON_RPC_ERROR_CODES.INVALID_PARAMS
    );
