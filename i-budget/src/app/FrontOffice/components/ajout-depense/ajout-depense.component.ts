import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepensesService } from '../../services/depenses/depenses.service';
import { HttpClientModule } from '@angular/common/http';
import { ExpenseCategory } from '../../../models/depenses/expense-category.model';  
import { ExpenseCategoryService } from '../../services/expense_category/expense-category.service';

@Component({
  selector: 'app-ajout-depense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './ajout-depense.component.html',
  styleUrls: ['./ajout-depense.component.css']
})
export class AjoutDepenseComponent implements OnInit {
  mode: 'manuel' | 'image' = 'manuel';
  depenseForm: FormGroup;
  categories: ExpenseCategory[] = [];
  selectedFile?: File;
  uploadResult: string = '';
  successMessage: string = ''; // Variable pour afficher un message de succès
  errorMessage: string = '';   // Variable pour afficher un message d'erreur

  constructor(
    private fb: FormBuilder, 
    private depenseService: DepensesService,
    private categoryService: ExpenseCategoryService // Injection du service pour récupérer les catégories
  ) {
    this.depenseForm = this.fb.group({
      montant: ['', Validators.required],
      date: ['', Validators.required],
      etat: ['REALISEE', Validators.required],
      category: ['', Validators.required] // Ajout du champ category
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Charger les catégories via le service
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories récupérées :', this.categories); // Vérifie les données des catégories
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories', err);
        this.errorMessage = "Erreur lors du chargement des catégories.";
      }
    });
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitManuel() {
    if (this.depenseForm.valid) {
      const depenseData = this.depenseForm.value;
  
      console.log('Données du formulaire avant modification:', depenseData); // Log des données du formulaire
  
      // Assurez-vous que l'ID de la catégorie est un nombre
      const selectedCategoryId = Number(depenseData.category); // Convertir en nombre si ce n'est pas déjà le cas
  
      // Vérifie que category est bien un ID et cherche l'objet correspondant
      const selectedCategory = this.categories.find(c => c.id === selectedCategoryId);
  
      console.log('Catégorie trouvée :', selectedCategory); // Affiche la catégorie trouvée
  
      if (!selectedCategory) {
        this.errorMessage = 'Catégorie non valide';
        console.error('Catégorie non trouvée dans la liste:', depenseData.category);
        return;
      }
  
      // Ajoute l'objet complet de la catégorie dans depenseData
      depenseData.category = {
        id: selectedCategory.id,
        nom: selectedCategory.nom
      };
  
      console.log('Objet depenseData envoyé:', depenseData); // Affiche les données avant l'envoi
  
      // Ensuite, envoie la requête pour ajouter la dépense
      this.depenseService.createDepense(depenseData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur :', response); // Affiche la réponse du serveur
          this.successMessage = 'Dépense ajoutée avec succès 🎉';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout';
          console.error("Erreur lors de l'ajout", err); // Affiche l'erreur reçue du serveur
        }
      });
    } else {
      this.errorMessage = 'Formulaire invalide';
      console.log('Le formulaire est invalide :', this.depenseForm.value);
    }
  }
  
  
  
  
  

  submitImage() {
    if (this.selectedFile) {
      this.depenseService.uploadDepenseImage(this.selectedFile).subscribe({
        next: (result) => {
          this.uploadResult = result;
          this.successMessage = 'Image envoyée ✅, texte extrait : ' + result;
          setTimeout(() => this.successMessage = '', 3000); // Effacer le message après 3 secondes
        },
        error: (err) => {
          console.error("Erreur lors de l'envoi de l'image", err);
          this.errorMessage = "Erreur lors de l'envoi de l'image. Veuillez réessayer.";
          setTimeout(() => this.errorMessage = '', 3000); // Effacer le message après 3 secondes
        }
      });
    }
  }
}
