import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VehicleModelInterface } from 'src/app/interfaces/vehicle-model.interface';
import { VehicleBrandInterface } from 'src/app/interfaces/vehicle-brand.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry, map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private endpoint: string = environment.vehicle_api + "carros/marcas";
  public isLoadingModelData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoadingVehicleData: boolean = false;
  public brands: BehaviorSubject<Array<VehicleBrandInterface>> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {
    this.loadBrands();
  }
  private loadBrands(): void {
    this.isLoadingModelData.next(true);
    this.http.get(this.endpoint)
      .pipe(
        retry(3),
        map(brands => brands['map'](brand => ({
          id: brand.codigo,
          description: brand.nome
        })))
      )
      .subscribe(data => {
        this.brands.next(data);
        this.isLoadingModelData.next(false);
      });
  };

  public loadAndGetModels(brand_id: number): Promise<Array<VehicleModelInterface>> {
    this.isLoadingVehicleData = true;
    return this.http.get(`${this.endpoint}/${brand_id}/modelos`)
      .pipe(
        retry(3),
        map(models => {
          return models['modelos']
            .map(model => ({
              id: model.codigo,
              description: model.nome
            }));
        }),
        finalize(()=> this.isLoadingVehicleData = false)
      ).toPromise();
  };

}
