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
    model: function(input$) {
      return input$.map(val => val.toUpperCase()).startWith('');
    },
    view: function(model$) {
      return model$.map(name =>
                        h('div', [
                          h('input#name'),
                          h('h2', name)]));
    },
    intent: function(DOM) {
      return DOM.get('input#name', 'input').map(ev => ev.target.value);
    }
  },
  '/3': {
    view: function() {
      return Cycle.Rx.Observable.just(h('h2', 'View 3'));
    }
  }
};

function getView(route, DOM) {
  let view = views[route] || { view: () => Cycle.Rx.Observable.just(h('h2', 'not found')) };
  let intent$ = view.intent ? view.intent(DOM) : null;
  let model$ = view.model ? view.model(intent$) : null;
  let view$ = view.view(model$);

  return view$;
}

function main({DOM}) {
  let route$ = Cycle.Rx.Observable.fromEvent(window, 'hashchange')
        .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
        .startWith(window.location.hash.replace('#', ''));

  let vtree$ = route$.flatMapLatest(route => getView(route, DOM));

  return {
    DOM: vtree$
  };
}

let drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
