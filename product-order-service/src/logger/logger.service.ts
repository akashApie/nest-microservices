import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    console.log(`[${this.context || context}] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    console.error(`[${this.context || context}] ${message}`, trace);
  }

  warn(message: any, context?: string) {
    console.warn(`[${this.context || context}] ${message}`);
  }

  debug?(message: any, context?: string) {
    console.debug(`[${this.context || context}] ${message}`);
  }

  verbose?(message: any, context?: string) {
    console.log(`[${this.context || context}] ${message}`);
  }
}
