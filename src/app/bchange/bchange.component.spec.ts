import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BchangeComponent } from './bchange.component';

describe('BchangeComponent', () => {
  let component: BchangeComponent;
  let fixture: ComponentFixture<BchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BchangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
