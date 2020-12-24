
import _ from 'lodash';

import {isEnough, chargeCost, gainCost} from '../../bdcgin/Gin';

export const genEvent = (store) => {
    let event = _.sample(events);
    
    event.start_tick = store.tick;
    event.opened = false;
    
    return event;
};

export const checkDisabled = (store) => {
    return events[store.event.key].isDisabled(store);
};

export const confirmEvent = (store) => {
    store = events[store.event.key].onConfirm(store);
    store = passEvent(store);
    
    return store;
};

export const passEvent = (store) => {
    store.event = false;
    store.last_event_tick = store.tick;
    
    return store;
};


export var events = {
  //  first_event: {key: 'first_event', name: 'First Event', text: 'First Text',                                           isDisabled: (store) => { return false; },                         onConfirm: (store) => { console.log('First Event'); return store; }},
    sell_rocket: {key: 'sell_rocket', name: 'Sell Rocket', text: 'Do you want to sell a rocket for a million?',          isDisabled: (store) => { return store.special.rockets < 1; },     onConfirm: (store) => { store = chargeCost(store, {'special.rockets': 1}); store = gainCost(store, {'balances.money': 1000000}); console.log('Second Event'); return store; }},
    buy_rocket:  {key: 'buy_rocket',  name: 'Buy Rocket',  text: 'Do you want to buy a rocket for a hundred thousand?',  isDisabled: (store) => { return store.balances.money < 100000; }, onConfirm: (store) => { store = chargeCost(store, {'balances.money': 100000}); store = gainCost(store, {'special.rockets': 1}); console.log('Third Event'); return store; }},
};