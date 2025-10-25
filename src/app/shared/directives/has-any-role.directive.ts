import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Role } from '../models/auth.models';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Directive({ selector: '[hasAnyRole]', standalone: true })
export class HasAnyRoleDirective implements OnDestroy {
  @Input('hasAnyRole') roles: Role[] = [];
  private sub: Subscription;

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef, private auth: AuthService) {
    this.sub = this.auth.user$().subscribe(() => this.render());
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  private render() {
    const user = this.auth.getUserSafe();
    const ok = !!user && (this.roles.length === 0 || (user.roles ?? []).some(r => this.roles.includes(r)));
    this.vcr.clear();
    if (ok) this.vcr.createEmbeddedView(this.tpl);
  }
}
