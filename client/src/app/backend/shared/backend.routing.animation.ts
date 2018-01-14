import { animate, style, transition, trigger, query } from '@angular/animations';

export const ROUTE_ANIMATION_HOST = { '[@fadeInAnimation]': 'true' };

export const ROUTE_ANIMATION =
  // trigger('routeAnimation', [
  //   transition(':enter', [
  //     style({
  //       opacity: 0,
  //       transform: 'translateX(6%)',
  //     }),
  //     animate('0.35s cubic-bezier(0.550, 0.055, 0.675, 0.190)'),
  //   ]),
  //   transition(':leave', [
  //     style({
  //       opacity: 0,
  //     }),
  //   ]),
  // ]);
  trigger('fadeInAnimation', [

           // route 'enter' transition
           transition(':enter', [

               // css styles at start of transition
               style({ opacity: 0 }),

               // animation and styles at end of transition
               // animate('0.35s cubic-bezier(0.550, 0.055, 0.675, 0.190)'),
               animate('.5s', style({ opacity: 1 }))
           ]),
       ]);
  // trigger('routerAnimation', [
  //   transition('* <=> *', [
  //     // Initial state of new route
  //     query(
  //       ':enter',
  //       style({
  //         position: 'fixed',
  //         width: '100%',
  //         transform: 'translateX(-100%)'
  //       }),
  //       { optional: true }
  //     ),
  //     // move page off screen right on leave
  //     query(
  //       ':leave',
  //       animate(
  //         '500ms ease',
  //         style({
  //           position: 'fixed',
  //           width: '100%',
  //           transform: 'translateX(100%)'
  //         })
  //       ),
  //       { optional: true }
  //     ),
  //     // move page in screen from left to right
  //     query(
  //       ':enter',
  //       animate(
  //         '500ms ease',
  //         style({
  //           opacity: 1,
  //           transform: 'translateX(0%)'
  //         })
  //       ),
  //       { optional: true }
  //     )
  //   ])
  // ]);
