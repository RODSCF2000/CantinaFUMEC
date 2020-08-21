import { UsersService } from './../../services/users.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as shajs from 'sha.js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  user: User;
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService, private cd: ChangeDetectorRef) {
    this.setUserForm();
    this.getUsers();
  }

  ngOnInit() {

  }

  setUserForm() {
    this.userForm = this.fb.group(
      {
        uid: [this.generateUID(28), [Validators.required]],
        name: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.minLength(6), Validators.required]],
        phoneNumber: ['', [Validators.required]],
        photoUrl: [null, [Validators.required]],
        location: ['', [Validators.required]],
        points: [0, [Validators.required]],
        settingsUser: [{
          language: 'pt-br',
          type: 'client'
        }, [Validators.required]],
        fileName: [''],
      }
    );
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.userForm.get('fileName').setValue(file.name);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userForm.get('photoUrl').setValue(reader.result.toString());
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      users => {
        this.users = users;
      }
    );
  }

  deleteUser() {
    this.usersService.deleteUser(this.user.id).subscribe(
      () => {
        this.getUsers();
      }
    );
  }

  generateUID(lengthOfCode: number) {
    const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  openModalExcluir(user: User) {
    this.user = user;
  }

  closeModalExcluir() {
    this.user = null;
  }

  openModalAlterar(user: User) {
    this.userForm = this.fb.group(
      {
        id: [user.id, [Validators.required]],
        uid: [user.uid, [Validators.required]],
        name: [user.name, [Validators.required]],
        email: [user.email, [Validators.email, Validators.required]],
        password: ['', [Validators.minLength(6), Validators.required]],
        phoneNumber: [user.phoneNumber, [Validators.required]],
        photoUrl: [user.photoUrl, [Validators.required]],
        location: [user.location, [Validators.required]],
        points: [user.points, [Validators.required]],
        settingsUser: [user.settingsUser, [Validators.required]],
        fileName: ['Arquivo antigo'],
      }
    );
  }

  putUser() {
    const u = this.userForm.getRawValue();
    delete u.fileName;
    const user: User = u;
    user.password = shajs('sha256').update(user.password).digest('hex');
    this.setUserForm();
    this.usersService.putUser(user).subscribe(
      () => {
        const userLS: User = JSON.parse(localStorage.getItem('user'));
        if (userLS != null) {
          if (userLS.id === user.id) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
        this.getUsers();
      }
    );
  }

  closeModalAlterar() {
    this.setUserForm();
  }

  postUser() {
    const u = this.userForm.getRawValue();
    delete u.fileName;
    const user: User = u;
    user.password = shajs('sha256').update(user.password).digest('hex');
    this.setUserForm();
    this.usersService.postUser(user).subscribe(
      () => {
        this.getUsers();
      }
    );
  }

  getUsersByEmail(adicionar: boolean) {
    this.usersService.getUsersByEmail(this.userForm.get('email').value,
    this.userForm.get('id') != null ? this.userForm.get('id').value : 0).subscribe(
      users => {
        if (users.length === 0) {
          if (adicionar) {
            document.getElementById('submitAdicionar').click();
          } else {
            document.getElementById('submitAlterar').click();
          }
        } else {
          alert('Já existe um usuário com esse email.');
        }
      }
    );
  }

  closeModalAdicionar() {
    this.setUserForm();
  }
}
