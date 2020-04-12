import { Injectable } from '@angular/core';
import config from '../../../assets/files/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  public DB_API_SERVER: string = config.DB_API_SERVER;
  public VAPID_PUBLIC_KEY: string = config.VAPID_PUBLIC_KEY;
  public TOKEN_KEY: string = config.TOKEN_KEY;
  public DNI_KEY: string = config.DNI_KEY;
  public NAME_KEY: string = config.NAME_KEY;
  public SURNAME_KEY: string = config.SURNAME_KEY;
  public ADMIN_KEY: string = config.ADMIN_KEY;
  public SESSION_KEYS = [this.TOKEN_KEY, this.DNI_KEY, this.NAME_KEY, this.SURNAME_KEY, this.ADMIN_KEY]

  constructor() { }
}
