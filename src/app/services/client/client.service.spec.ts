import { TestBed } from '@angular/core/testing';

import { ClientService } from './client.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClientInterceptor } from '../../modules/shared/interceptors/client.interceptor';
import { ClientsData } from '../../modules/shared/interceptors/client-data';

describe('ClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ClientInterceptor,
        multi: true
      }
    ]
  }));

  it('should return a list of clients', (done: DoneFn) => {
    const arrage = {
      expect: {
        size: 20,
        loadFlagInStart: true,
        loadFlagInEnd: false,
        clients: [ // similar of data mock got by random order
          ClientsData[2],
          ClientsData[4],
          ClientsData[16]
        ]
      }
    }
    const service: ClientService = TestBed.get(ClientService);
    service.loadClients().then(data => {
      expect(data.length).toBe(arrage.expect.size);

      // check if the return is the same of the mock
      arrage.expect.clients.forEach(client => {
        let filtered = data.filter(row => row.id == client.id);
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(client);
      });

      // verify isLoading flag
      expect(service.isLoading).toBe(arrage.expect.loadFlagInEnd);
      done();
    });
    // verify isLoading flag
    expect(service.isLoading).toBe(arrage.expect.loadFlagInStart);
  });
  it('should return a client by id', (done: DoneFn) => {
    const arrage = {
      input: 2,
      expect:  {
        loadFlagInStart: true,
        loadFlagInEnd: false,
        client: {
          "id": 2,
          "name": "Christian Mcguire",
          "cpf": "975.073.450-50",
          "phone": "(82) 98858-4743 ",
          "birth_date": "24/01/2000",
          "address": "Veronica Place, 663",
          "vehicle_brand": {
            "id": 2,
            "description": "Agrale"
          },
          "vehicle_model": {
            "description": "MARRUÁ AM 200 2.8  CD TDI Diesel",
            "id": 4567
          }
        }
      }
    }
    const service: ClientService = TestBed.get(ClientService);
    service
      .getById(arrage.input)
      .then((data) => {
        expect(data).toEqual(arrage.expect.client);
        // verify isLoading flag
        expect(service.isLoading).toBe(arrage.expect.loadFlagInEnd);
        done();
      });
      // verify isLoading flag
      expect(service.isLoading).toBe(arrage.expect.loadFlagInStart);
  });

  // it('should update a client', (done: DoneFn) => {
  // });
  // it('should delete a client', (done: DoneFn) => {
  // });
});
