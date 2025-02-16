import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService implements HttpInterceptor {
  private logLevel: LogLevel = environment.production
    ? LogLevel.Warn
    : LogLevel.Debug;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.logHttpSuccess(req, event, startTime);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.logHttpError(req, error, startTime);
        },
      }),
    );
  }

  debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.Info) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.Warn) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, error?: any, ...args: any[]): void {
    if (this.logLevel <= LogLevel.Error) {
      console.error(this.formatMessage('ERROR', message), error, ...args);
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private logHttpSuccess(
    req: HttpRequest<any>,
    event: HttpResponse<any>,
    startTime: number,
  ): void {
    const elapsedTime = Date.now() - startTime;
    const message = `${req.method} ${req.urlWithParams} ${event.status} (${elapsedTime}ms)`;

    if (event.status >= 400) {
      this.warn(message, event.body);
    } else {
      this.debug(message);
    }

    if (environment.logHttpResponses) {
      this.debug('Response body:', event.body);
    }
  }

  private logHttpError(
    req: HttpRequest<any>,
    error: HttpErrorResponse,
    startTime: number,
  ): void {
    const elapsedTime = Date.now() - startTime;
    const message = `${req.method} ${req.urlWithParams} failed (${elapsedTime}ms)`;
    this.error(message, {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message,
    });
  }
}
