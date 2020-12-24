

import _ from 'lodash';

import {shuffleThem} from './santa';




export const prelog = (store, text) => {
    console.log(text);
    store.console_prelog.push(text);
    
    return store;
};

const hahahash = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

const public_key = '400846060';


export const handleConsoleSubmit = (store, event) => {
    if (hahahash(store.current_pass) == public_key) {
        console.log();
        store.logged = true;
        store.pass_error = false;
        
        
    } else {
        store.logged = false;
        store.pass_error = true;
    }
    
    event.preventDefault();
    
    return store;
};


export const handleConsoleChange = (store, event) => {
    store.current_pass = event.target.value;
    return store;
};







