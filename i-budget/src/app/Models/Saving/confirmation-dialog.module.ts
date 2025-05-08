import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from 'app/FrontOffice/components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [ConfirmationDialogComponent],
})
export class ConfirmationDialogModule {}