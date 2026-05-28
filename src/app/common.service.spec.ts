import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CommonService } from './common.service';


describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CommonService]
    });

    service = TestBed.inject(CommonService);
  });




  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
