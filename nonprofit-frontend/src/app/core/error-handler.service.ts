import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
// import { NotificationService } from '../shared/notification.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  // private readonly notifier = inject(NotificationService);

  handleError(error: unknown): void {
    try {
      if (error instanceof HttpErrorResponse) {
        this.handleServerError(error);
      } else if (error instanceof Error) {
        this.handleClientError(error);
      } else {
        this.handleUnknownError(error);
      }
    } catch (handlerError) {
      console.error('Error handler failed:', handlerError);
    }
  }

  private handleServerError(error: HttpErrorResponse): void {
    // Customize messages based on status codes
    let message = `Server error (${error.status}): `;

    if (error.status === 0) {
      message += 'Network error - please check your connection';
    } else if (error.status >= 500) {
      message += 'Internal server error';
    } else {
      message += error.message || 'Unknown server error';
    }

    //this.notifier.showError(message);
    console.error('Server error:', error);
  }

  private handleClientError(error: Error): void {
    // this.notifier.showError(`Application error: ${error.message}`);
    console.error('Client error:', error);
  }

  private handleUnknownError(error: unknown): void {
    const message =
      typeof error === 'object' ? JSON.stringify(error) : String(error);
    //this.notifier.showError(`Unknown error: ${message}`);
    console.error('Unknown error:', error);
  }
}
