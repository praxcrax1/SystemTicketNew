import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BprocedureComponent } from './bprocedure.component';

describe('BprocedureComponent', () => {
  let component: BprocedureComponent;
  let fixture: ComponentFixture<BprocedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BprocedureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BprocedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
