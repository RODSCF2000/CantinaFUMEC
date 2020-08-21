import { Category } from './../../models/category';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { CartItem } from 'src/app/models/cart-item';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  category: Category;
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService, private cd: ChangeDetectorRef) {
    this.setCategoryForm();
    this.getCategories();
  }

  ngOnInit() {

  }

  setCategoryForm() {
    this.categoryForm = this.fb.group(
      {
        cardTitle: ['', [Validators.required]],
        cardSubtitle: ['', [Validators.required]],
        imagem: [null, [Validators.required]],
        menu: [[]],
        fileName: ['']
      }
    );
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.categoryForm.get('fileName').setValue(file.name);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.categoryForm.get('imagem').setValue(reader.result.toString());
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    );
  }

  deleteCategory() {
    this.categoriesService.deleteCategory(this.category.id).subscribe(
      () => {
        const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems != null) {
          const cartItemsNew: CartItem[] = [];
          for (const cartItem of cartItems) {
            if (this.category.menu.map(x => x.id).indexOf(cartItem.menuItem.id) !== -1) {
              if (cartItems.indexOf(cartItem) === -1) {
                cartItemsNew.push(cartItem);
              }
            } else {
              cartItemsNew.push(cartItem);
            }
          }
          localStorage.setItem('cartItems', JSON.stringify(cartItemsNew));
        }
        this.getCategories();
      }
    );
  }

  openModalExcluir(category: Category) {
    this.category = category;
  }

  closeModalExcluir() {
    this.category = null;
  }

  openModalAlterar(category: Category) {
    this.categoryForm = this.fb.group(
      {
        cardTitle: [category.cardTitle, [Validators.required]],
        cardSubtitle: [category.cardSubtitle, [Validators.required]],
        imagem: [category.imagem, [Validators.required]],
        menu: [category.menu],
        fileName: ['Arquivo antigo'],
        id: [category.id, [Validators.required]],
      }
    );
  }

  putCategory() {
    const c = this.categoryForm.getRawValue();
    delete c.fileName;
    const category: Category = c;
    this.setCategoryForm();
    this.categoriesService.putCategory(category).subscribe(
      () => {
        this.getCategories();
      }
    );
  }

  closeModalAlterar() {
    this.setCategoryForm();
  }

  postCategory() {
    const c = this.categoryForm.getRawValue();
    delete c.fileName;
    const category: Category = c;
    this.setCategoryForm();
    this.categoriesService.postCategory(category).subscribe(
      () => {
        this.getCategories();
      }
    );
  }

  getCategoriesByCardTitle(adicionar: boolean) {
    this.categoriesService.getCategoriesByCardTitle(this.categoryForm.get('cardTitle').value,
    this.categoryForm.get('id') != null ? this.categoryForm.get('id').value : 0).subscribe(
      categories => {
        if (categories.length === 0) {
          if (adicionar) {
            document.getElementById('submitAdicionar').click();
          } else {
            document.getElementById('submitAlterar').click();
          }
        } else {
          alert('Já existe uma categoria com esse título.');
        }
      }
    );
  }

  closeModalAdicionar() {
    this.setCategoryForm();
  }
}
