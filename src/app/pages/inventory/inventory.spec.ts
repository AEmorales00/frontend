import { ComponentFixture, TestBed } from '@angular/core/testing';

import { product } from './product';

describe('product', () => {
  let component: product;
  let fixture: ComponentFixture<product>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [product]
    })
    .compileComponents();

    fixture = TestBed.createComponent(product);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
