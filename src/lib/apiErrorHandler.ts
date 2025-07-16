import { NextResponse } from 'next/server';

type ApiHandler = (...args: any[]) => Promise<NextResponse>;

export function apiErrorHandler(handler: ApiHandler): ApiHandler {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('API Handler Syntax Error:', error);
        return NextResponse.json({ error: 'Invalid request payload (JSON)', details: error.message }, { status: 400 });
      }
      console.error('API Handler Error:', error);
      return NextResponse.json({ error: 'An internal server error occurred', details: (error as Error).message }, { status: 500 });
    }
  };
}
