
import _ from 'lodash';


import {getDefaultState} from '../game/core/default_state';






// В теории объекты в JS не имеют порядка, но на практике - имеют. Странно, но факт.
// Эта функция рендомизирует порядок элементов в объекте.
// Знайте, за такое попадают в ад.
export const shuffleObject = (object) => {
    let keys = Object.keys(object);
    keys.sort((a, b) =>  Math.random() - 0.5);
    
    let newObject = {};
    keys.forEach((key) => { newObject[key] = object[key]; });
    
    return newObject;
};