import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared-module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from '../shared/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule],
})
export class AuthModule {}
