﻿import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponentComponent } from './navigation.component';

describe('NavigationComponentComponent', () => {
  let component: NavigationComponentComponent;
  let fixture: ComponentFixture<NavigationComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



 