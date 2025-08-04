import { NgModule, ErrorHandler } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppErrorHandler } from './error-handler.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, MatSnackBarModule, HeaderComponent],
  exports: [HeaderComponent],
})
export class CoreModule {}
