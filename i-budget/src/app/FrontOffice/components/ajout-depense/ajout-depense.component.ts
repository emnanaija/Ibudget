import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepensesService } from '../../services/depenses/depenses.service'; // ✔️ vérifie le chemin
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ajout-depense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './ajout-depense.component.html',
  styleUrls: ['./ajout-depense.component.css']
})
export class AjoutDepenseComponent {
  mode: 'manuel' | 'image' = 'manuel';
  depenseForm: FormGroup;
  selectedFile?: File;
  uploadResult: string = '';

  constructor(private fb: FormBuilder, private depenseService: DepensesService) {
    this.depenseForm = this.fb.group({
      montant: ['', Validators.required],
      date: ['', Validators.required],
      etat: ['REALISEE', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitManuel() {
    if (this.depenseForm.valid) {
      this.depenseService.createDepense(this.depenseForm.value).subscribe({
        next: () => alert('Dépense ajoutée avec succès 🎉'),
        error: () => alert("Erreur lors de l'ajout")
      });
    }
  }

  submitImage() {
    if (this.selectedFile) {
      this.depenseService.uploadDepenseImage(this.selectedFile).subscribe({
        next: (result) => {
          this.uploadResult = result;
          alert('Image envoyée ✅, texte extrait : ' + result);
        },
        error: () => alert("Erreur lors de l'envoi de l'image")
      });
    }
  }
}
