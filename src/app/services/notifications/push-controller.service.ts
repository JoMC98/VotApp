import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SwPush } from '@angular/service-worker'
import { ConfigurationService } from '../general/configuration.service';
import { SessionControllerService } from '../authentication/session-controller.service';

@Injectable({
  providedIn: 'root'
})
export class PushControllerService {

  constructor(private http: HttpClient, private swPush: SwPush, private config: ConfigurationService) {}

  subscribe(token) {
    console.log("SUBSCRIBE NUEVO")
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.config.VAPID_PUBLIC_KEY
      })
      .then(subscription => {
        console.log("ENVIAR SUBSCRIPCION")
        this.sendSubscriptionToTheServer(subscription, token).subscribe()
      })
      .catch(() => console.error);

    }
  }

  sendSubscriptionToTheServer(subscription, token) {
    var url = this.config.DB_API_SERVER + "/subscription"
    var options = this.getOptions(token);
    var body = {subscription: subscription}
    return this.http.post(url, body, options)
  }

  getOptions(token) {
    var options = {
      headers: new HttpHeaders({ 
        authorization: "Bearer " + token
      })
    }
    return options;
  }
}
