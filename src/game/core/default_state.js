

import _ from 'lodash';

import {people} from '../knowledge/santa';


export const default_state = {
    isFull: false,
    
    tab: 'intro',
    
    logged: false,
    current_pass: '',
    pass_error: false,
    old_pass_error: false,
    
    
    event: false,
    last_event_tick: 0,
    
    rewards: [],
    
    people: _.cloneDeep(people),
    generated: false,
    
    console_log: [
        "It's time to get down to duty.",
    ],
    console_prelog: [],
    
    
    
    game_speed: 1000, // 1000
    frame_rate: 10,
    game_speed_multiplier: 1,
    frame: 0,
    tick: 0,
    game_paused: true,
    game_end: false,
    game_end_score: 0,
    
    debug: {
        performance: false
    },
};



export const getDefaultState = () => {
    
    let state = _.cloneDeep(default_state);
    return state;
};
