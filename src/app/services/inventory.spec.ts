import { TestBed } from '@angular/core/testing';

import { product } from './product';

describe('product', () => {
  let service: product;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(product);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
