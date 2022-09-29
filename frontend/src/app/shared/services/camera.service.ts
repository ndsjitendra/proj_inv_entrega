import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';


@Injectable({ providedIn: 'root' })

export class CameraService {
  private _currentImage: any;

  public get currentImage(): string {
    return this._currentImage;
  }

  constructor(
    // private camera: Camera,
  ) { }

  async pickImage() {
    let photo;
    try {
      photo = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
    } catch (err) {
      console.log("NO PHOTO SELECTED");
      return null;
    }

    this._currentImage = 'data:image/jpeg;base64,' + photo.base64String;
    return this._currentImage;
  }


}
