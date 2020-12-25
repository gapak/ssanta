
import _ from 'lodash';


import {isEnough, gainCost} from '../../bdcgin/Gin';



import {shuffleThem} from '../knowledge/santa';

import {shuffleObject} from '../helpers';


export const rules = {
    matrix_show: { onFrame: (store, params = {}) => { store.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return store; }},
    
    
    log: {
        onFrame: (store, params = {}) => {
            return store;
        },
        
        onTick: (store, params = {}) => {
            
            if (store.console_prelog.length)
            {
                store.console_log.push(store.console_prelog.shift());
            }
            
            if (store.console_log.length > 18) {
                store.console_log.shift();
            }
            
            if (!store.logged) {
                store.console_prelog.push(store.matrix_show);
            }
            
            return store;
        }
    },
    
    
    recursion: {
        onFrame: (store, params = {}) => {
            return store;
        },
        
        onTick: (store, params = {}) => {
            if (store.generated === false && store.logged === true) {
                store = shuffleThem(store);
            }
            
            return store;
        }
    },
    
    
    rule: {
        onFrame: (store, params = {}) => {
            return store;
        },
        
        onTick: (store, params = {}) => {
            return store;
        }
    },
    
    
    
};