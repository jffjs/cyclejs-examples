import Cycle from '@cycle/core';
import {makeDOMDriver, h} from '@cycle/web';

var views = {
  '/1': {
    model: function() {
      return Cycle.Rx.Observable.interval(1000).startWith('');
    },
    view: function(state$) {
      return state$.map(i => h('h2', '' + i));
    }
  },
  '/2':{
    view: function() {
      return Cycle.Rx.Observable.just(h('h2', 'View 2'));
    }
  },
  '/3': {
    view: function() {
      return Cycle.Rx.Observable.just(h('h2', 'View 3'));
    }
  }
};

function getView(route) {
  let view = views[route] || { view: () => Cycle.Rx.Observable.just(h('h2', 'not found')) };
  // let intent = view.intent ? view.intent() : null;
  let model$ = view.model ? view.model() : null;
  let view$ = view.view(model$);

  return view$;
}

function main(responses) {
  let route$ = Cycle.Rx.Observable.fromEvent(window, 'hashchange')
        .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
        .startWith(window.location.hash.replace('#', ''));

  let vtree$ = route$.flatMapLatest(route => getView(route));

  return {
    DOM: vtree$
  };
}

let drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
