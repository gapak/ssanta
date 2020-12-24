

import _ from 'lodash';

import {prelog} from './console';


export const shuffleThem = (store) => {
    let people = _.cloneDeep(store.people);
    let errored = false;
    
    store = prelog(store, 'Генерация новой вселенной');
    store = prelog(store, 'Генерация новой вселенной.');
    store = prelog(store, 'Генерация новой вселенной..');
    store = prelog(store, 'Генерация новой вселенной...');
    
    for (let person_key = 0; person_key < people.length; person_key++) {
        let person = people[person_key];
        store = prelog(store, 'Поиск партнера для ' + person.name);
        
        let options = _.filter(people, (elem) => { return (elem.target === false && elem.family !== person.family) });
        
        if (options.length < 1) {
    
            // we need recursion now
            errored = true;
            store = prelog(store, 'В ходе генерации была обнаружена ошибка. Попытка выбрать другую вселенную.');
            break;
        }
        
        let partner = _.sample(options);
        let partner_key = people.findIndex(item => item.name === partner.name);
        
        people[partner_key].target = person.name;
    
        store = prelog(store, person.name + ' будет дарить подарок ' + partner.name);
    }
    
    if (errored) {
        store = prelog(store, 'Вход в рекурсию...');
        return store;
    }
    
    store.people = people;
    store.generated = true;
    
    store = prelog(store, 'Алгоритм поиска завершен успешно');
    
    return store;
};




export var people_inf = [
    {name: 'Name1', family: 1, target: false},
    {name: 'Name2', family: 1, target: false},
    {name: 'Name3', family: 2, target: false}
];

export var people_test = [
    {name: 'Name1', family: 1, target: false},
    {name: 'Name2', family: 1, target: false},
    {name: 'Name3', family: 2, target: false},
    {name: 'Name4', family: 2, target: false},
    {name: 'Name5', family: 3, target: false},
    {name: 'Name6', family: 4, target: false},
    {name: 'Name7', family: 5, target: false},
];

// по словам Ульяны:
// Я, Юра, Олег, Ира, Гресс, АГ, Марина,

export var people = [
    {name: '@gromova',              family: 1, target: false},
    {name: '@yuradanilov',          family: 1, target: false},
    {name: '@Aldekein',             family: 2, target: false},
    {name: '@ezhova',               family: 2, target: false},
    {name: '@gresss',               family: 3, target: false},
    {name: '@alexxspike',           family: 4, target: false},
    {name: '@marmeladnoe_yabloko',  family: 5, target: false},
];