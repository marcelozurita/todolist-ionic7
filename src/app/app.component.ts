import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private swUpdate: SwUpdate,
    private alertController: AlertController
  ) { }

  async askForUpdate() {
    const alert = await this.alertController.create({
      header: "New version available!",
      subHeader: "There are a new app version available",
      message: "Do update this app now?",
      buttons: [
        {
          text: "Later",
          role: "cancel",
        },
        {
          text: "Now!",
          role: "confirm",
          handler: () => {
            this.swUpdate.activateUpdate().then(() => {
              console.log("Updated!");
            });
          }
        },
      ]
    });

    await alert.present();
  }

  ngOnInit(): void {
    this.swUpdate.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          this.askForUpdate();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });

    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }
}
