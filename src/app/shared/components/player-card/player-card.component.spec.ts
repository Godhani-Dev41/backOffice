import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared.module';

import { PlayerCardComponent } from './player-card.component';
import { RCGenderEnum } from '@rcenter/core';

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ PlayerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return gender text string for female', () => {
    expect(component.getMemberGender(RCGenderEnum.FEMALE)).toBe('female');
  });

  it('should return gender text string for male', () => {
    expect(component.getMemberGender(RCGenderEnum.MALE)).toBe('male');
  });

  it('should return gender text string for other', () => {
    expect(component.getMemberGender(RCGenderEnum.OTHER)).toBe('other');
  });
});
