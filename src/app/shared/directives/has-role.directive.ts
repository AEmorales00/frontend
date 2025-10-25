import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../models/auth.models';
import { Subscription } from 'rxjs';

@Directive({ selector: '[hasRole]', standalone: true })
export class HasRoleDirective implements OnDestroy {
  private roles: Role[] = [];
  private sub!: Subscription;

  @Input() set hasRole(value: Role[] | Role) {
    this.roles = Array.isArray(value) ? value : [value];
    this.render();
  }

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef, private auth: AuthService) {
    this.sub = this.auth.user$().subscribe(() => this.render());
  }

  private render() {
    this.vcr.clear();
    if (this.auth.hasRole(...this.roles)) this.vcr.createEmbeddedView(this.tpl);
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
