import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { UserProfile } from '../core/user-ptofile.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public users$: Observable<Array<UserProfile>>;
  public displayedColumns: string[] = ['uid', 'name', 'email', 'address'];

  private userCollection: AngularFirestoreCollection<UserProfile>;

  constructor(private readonly _afs: AngularFirestore) {}

  public ngOnInit(): void {
    this.userCollection = this._afs.collection<UserProfile>('users');
    this.users$ = this.userCollection.valueChanges();
  }
}
