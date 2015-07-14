import Cycle from '@cycle/core';
import {makeDOMDriver, h} from '@cycle/web';

var views = {
  '/1': function() {
    return h('h2', 'View 1');
  },
  '/2': function() {
    return h('h2', 'View 2');
  }
};

// router.route('/1', {
//   model: function() {},
//   view: function() {},
//   intent: function() {}
// });

function main(responses) {
  let route$ = Cycle.Rx.Observable.fromEvent(window, 'hashchange')
        .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
        .startWith(window.location.hash.replace('#', ''));

  let vtree$ = route$.map(route =>
    h('div#main',[
      h('ul', [
        h('li', h('a', {className: 'nav-link', href: '#/1'}, 'Nav 1')),
        h('li', h('a', {className: 'nav-link', href: '#/2'}, 'Nav 2')),
        h('li', h('a', {className: 'nav-link', href: '#/3'}, 'Nav 3'))
      ]),
      views[route] ? views[route]() : null
    ]));

  return {
    DOM: vtree$
  };
}

let drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
