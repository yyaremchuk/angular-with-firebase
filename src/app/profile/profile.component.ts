import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UserProfile } from '../core/user-ptofile.model';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public item$: Observable<UserProfile>;
  public formGroup: FormGroup;
  public error: string;
  public downloadUrl$: Observable<string>;
  public uploadProgress$: Observable<number>;

  private itemDoc: AngularFirestoreDocument<UserProfile>;
  private uid: string;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _auth: AuthService,
    private readonly _afStorage: AngularFireStorage
  ) {
    this.uid = this._route.snapshot.paramMap.get('id');
    this.downloadUrl$ = this._afStorage
      .ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
  }

  public ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      name: '',
      email: { value: '', disabled: true },
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      specialty: '',
      ip: ''
    });

    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.item$ = this.itemDoc
      .valueChanges()
      .pipe(tap(data => this.formGroup.patchValue({ ...data })));
  }

  public async onSubmit() {
    const userProfile = {
      uid: this.uid,
      ...this.formGroup.value
    };

    this.error = null;

    let resp;
    try {
      await this._auth.updateUserDocument(userProfile);
    } catch (error) {
      console.log(error);
      this.error = error;
    }
  }

  public fileChange(event) {
    this.downloadUrl$ = null;
    this.error = null;

    const file = event.target.files[0];
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this._afStorage.ref(filePath);

    const task = this._afStorage.upload(filePath, file);
    task.catch(error => (this.error = error.message));

    this.uploadProgress$ = task.percentageChanges();

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadUrl$ = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }
}
