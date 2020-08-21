import { CartItem } from './../../models/cart-item';
import { Category } from './../../models/category';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  categories: Category[] = [];
  category: Category;
  product: Product;
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService, private cd: ChangeDetectorRef) {
    this.setProductForm();
    this.getCategories();
  }

  ngOnInit() {

  }

  setProductForm() {
    this.productForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        price: [0, [Validators.min(0.01), Validators.required]],
        imagePath: [null, [Validators.required]],
        fileName: ['']
      }
    );
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.productForm.get('fileName').setValue(file.name);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.productForm.get('imagePath').setValue(reader.result.toString());
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe(
      categories => {
        this.categories = categories;
        if (this.category != null) {
          this.category = this.categories.filter(x => x.id === this.category.id)[0];
        }
      }
    );
  }

  onSelect(category: string) {
    if (category.length === 0) {
      this.category = null;
    } else {
      this.category = JSON.parse(category);
    }
  }

  generateUID(lengthOfCode: number) {
    const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  deleteProduct() {
    this.category.menu = this.category.menu.filter(x => x.id !== this.product.id);
    // this.category.menu.filter(x => x.id === this.product.id)[0].id;
    this.categoriesService.putCategory(this.category).subscribe(
      () => {
        const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems != null) {
          for (const cartItem of cartItems) {
            if (cartItem.menuItem.id === this.product.id) {
              const index: number = cartItems.indexOf(cartItem);
              if (index !== -1) {
                cartItems.splice(index, 1);
              }
            }
          }
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
        this.getCategories();
      }
    );
  }

  openModalExcluir(product: Product) {
    this.product = product;
  }

  closeModalExcluir() {
    this.product = null;
  }

  adicionarCarrinho(product: Product) {
    let cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems'));
    let exists = false;
    if (cartItems == null) {
      cartItems = [];
    }
    for (const cartItem of cartItems) {
      if (cartItem.menuItem.id === product.id) {
        exists = true;
        cartItem.quantity = +cartItem.quantity + 1;
      }
    }
    if (!exists) {
      cartItems.push(new CartItem(product, 1));
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  openModalAlterar(product: Product) {
    this.productForm = this.fb.group(
      {
        name: [product.name, [Validators.required]],
        description: [product.description, [Validators.required]],
        imagePath: [product.imagePath, [Validators.required]],
        price: [product.price, [Validators.min(0.01), Validators.required]],
        fileName: ['Arquivo antigo'],
        id: [product.id, [Validators.required]],
      }
    );
  }

  putProduct() {
    const p = this.productForm.getRawValue();
    delete p.fileName;
    const product: Product = p;
    for (let index = 0; index < this.category.menu.length; index++) {
      if (this.category.menu[index].id === product.id) {
        this.category.menu[index] = product;
      }
    }
    this.setProductForm();
    this.categoriesService.putCategory(this.category).subscribe(
      () => {
        const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems != null) {
          for (const cartItem of cartItems) {
            if (cartItem.menuItem.id === product.id) {
              cartItem.menuItem = product;
            }
          }
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
        this.getCategories();
      }
    );
  }

  closeModalAlterar() {
    this.setProductForm();
  }

  postProduct() {
    const p = this.productForm.getRawValue();
    delete p.fileName;
    const product: Product = p;
    product.id = this.generateUID(20);
    this.category.menu.push(product);
    this.setProductForm();
    this.categoriesService.putCategory(this.category).subscribe(
      () => {
        this.getCategories();
      }
    );
  }

  getProductsByName(adicionar: boolean) {
    const products = this.category.menu.filter(x => x.name === this.productForm.get('name').value &&
    x.id !== (this.productForm.get('id') != null ? this.productForm.get('id').value : null));
    if (products.length === 0) {
      if (adicionar) {
        document.getElementById('submitAdicionar').click();
      } else {
        document.getElementById('submitAlterar').click();
      }
    } else {
      alert('Já existe um produto com esse nome nessa categoria.');
    }
  }

  closeModalAdicionar() {
    this.setProductForm();
  }
}
