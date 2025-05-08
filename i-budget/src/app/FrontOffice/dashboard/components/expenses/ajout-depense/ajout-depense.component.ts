import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepensesService } from '../../../../../services/depenses/depenses.service';
import { HttpClientModule } from '@angular/common/http';
import { ExpenseCategory } from '../../../../../Models/depenses/expense-category.model';  
import { ExpenseCategoryService } from '../../../../../services/expense_category/expense-category.service';
import { Depense, Category } from '../../../../../Models/depenses/depense.model';

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
  
  // Propriétés pour la liste des dépenses
  recentExpenses: Depense[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private depenseService: DepensesService,
    private categoryService: ExpenseCategoryService // Injection du service pour récupérer les catégories
  ) {
    this.depenseForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(10)]],
      date: ['', Validators.required],
      etat: ['REALISEE', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRecentExpenses();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories', err);
        this.errorMessage = "Erreur lors du chargement des catégories.";
      }
    });
  }

  // Charger les dépenses récentes
  loadRecentExpenses(): void {
    this.isLoading = true;
    this.depenseService.getDepenses().subscribe({
      next: (depenses) => {
        // Trier les dépenses par date (les plus récentes d'abord)
        this.recentExpenses = depenses
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5); // Limiter à 5 dépenses
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dépenses récentes', err);
        this.isLoading = false;
      }
    });
  }

  // Obtenir le nom de la catégorie (pour gérer à la fois les objets et les IDs)
  getCategoryName(category: any): string {
    if (!category) return 'Non catégorisé';
    
    if (typeof category === 'object' && category.nom) {
      return category.nom;
    }
    
    if (typeof category === 'number' || typeof category === 'string') {
      const foundCategory = this.categories.find(c => c.id === Number(category));
      return foundCategory ? foundCategory.nom : `Catégorie #${category}`;
    }
    
    return 'Non catégorisé';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitManuel() {
    if (this.depenseForm.valid) {
      const depenseData = this.depenseForm.value;
  
      console.log('Données du formulaire avant modification:', depenseData); // Log des données du formulaire
  
      // Assurez-vous que l'ID de la catégorie est un nombre
      const selectedCategoryId = Number(depenseData.category);
const selectedCategory = this.categories.find(c => c.id === selectedCategoryId);

  
     // console.log('Catégorie trouvée :', selectedCategory); // Affiche la catégorie trouvée
  
      if (!selectedCategory) {
        this.errorMessage = 'Catégorie non valide';
      //  console.error('Catégorie non trouvée dans la liste:', depenseData.category);
        return;
      }
  
      // Ajoute l'objet complet de la catégorie dans depenseData
      depenseData.category = selectedCategory; // On envoie l'objet complet tel qu’il a été chargé
      depenseData.wallet = { id: 1 }; // Remplace 1 par l’ID du wallet courant de l’utilisateur

      console.log('Objet depenseData envoyé:', depenseData); // Affiche les données avant l'envoi
  
      // Ensuite, envoie la requête pour ajouter la dépense
      this.depenseService.createDepense(depenseData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur :', response); // Affiche la réponse du serveur
          this.successMessage = 'Dépense ajoutée avec succès 🎉';
          this.depenseForm.reset({
            etat: 'REALISEE'  // Réinitialiser le formulaire avec la valeur par défaut pour etat
          });
          // Recharger les dépenses récentes après un ajout réussi
          this.loadRecentExpenses();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout';
          console.error("Erreur lors de l'ajout", err); // Affiche l'erreur reçue du serveur
        }
      });
    } else {
      // Vérifier si l'erreur vient du montant
      if (this.depenseForm.get('montant')?.hasError('min')) {
        this.errorMessage = 'Le montant doit être d\'au moins 10';
      } else {
        this.errorMessage = 'Formulaire invalide';
      }
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
          
          // Recharger les dépenses récentes après un ajout réussi via image
          this.loadRecentExpenses();
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