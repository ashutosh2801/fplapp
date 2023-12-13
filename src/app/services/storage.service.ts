import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage, private router: Router) {
    this.init();
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    //const storage = await this.storage.create();
    //this._storage = storage;
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async get(key: string) {
    const value = await this._storage?.get(key);
    return value;
  }

  public async remove(key: string) {
    await this._storage?.remove(key);
  }

  public async clear() {
    await this._storage?.clear();
  }
}
