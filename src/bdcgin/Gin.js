import _ from "lodash";

import Lamp from "./Lamp";
import { GinConsole } from "./GinConsole";

export class Gin {
    constructor(game_name, stateGenerator = () => {}) {
        this.game_name = game_name;

        this.store = {
            game_speed: 60000,
            frame_rate: 60,
            game_speed_multiplier: 1,
            frame: 0,
            tick: 0,
            game_paused: true,
            _id_counter: 0,
            _callbacks: [],
            debug: {
                performance: true
            },
        };

        this.stateGenerator = stateGenerator;

        this.params = { gin: this };

        this.views = [];
        this.rules = {};
        this.rules_performance_story = {};

        this.timerID = 0;
        this.publish_timerID = 0;
        this.recently_updated = false;

        this.console = new GinConsole(this);
    }

    init = () => {
        Lamp.register(this);
        //this.loadDefaultGame();
        this.store = _.assign(this.stateGenerator(), this.store);
        let pressed_keys = [];
        document.addEventListener("keydown", e => {
            let keys = ["ControlLeft", "ShiftLeft", "KeyO"];
            _.each(keys, item => {
                if (e.code === item) {
                    pressed_keys.push(item);
                }
            });

            if (_.isEqual(pressed_keys.sort(), keys.sort())) {
                this.pauseGame();
                localStorage.clear();
            }
        });
        setInterval(() => {
            pressed_keys = [];
        }, 2000);

        //this.store = _.assign(this.store, this.stateGenerator());
    };

    addDefaultStateGenerator = stateGenerator => {
        this.stateGenerator = stateGenerator;
    };

    addViewHandler = stateUpdater => {
        this.views.push({
            setState: new_state => {
                return stateUpdater(new_state);
            }
        });
    };

    addViewApp = ViewApp => {
        this.views.push(ViewApp);
    };

    connectReact = App => {
        this.addViewApp(App);
    };

    getCurrentSaveName = () => localStorage.getItem(this.game_name + "_current_save_name");
    setCurrentSaveName = name => localStorage.setItem(this.game_name + "_current_save_name", name);
    getCurrentSaveJSON = () => JSON.parse(localStorage.getItem(this.game_name + "_save_" + this.getCurrentSaveName()));
    setCurrentSaveJSON = state => localStorage.setItem(this.game_name + "_save_" + this.getCurrentSaveName(), JSON.stringify(state));

    newGame = () => {
        // if (!window.confirm('Are you ready to start a new game? Your progress will be lost.')) return false;
        let save_name = this.getCurrentSaveName();
        this.clearSave(save_name); // localStorage.setItem(this.game_name + "_save_" + (save_name ? save_name : 0), null);
        this.setState(this.stateGenerator());
        this.initLoop();
    };

    newGameAs = (save_name = 0) => {
        this.setCurrentSaveName(save_name);
        this.setState(this.stateGenerator());
    };

    loadGame = (save_name = 0) => {
        this.setCurrentSaveName(save_name);
        var app_state = JSON.parse(localStorage.getItem(this.game_name + "_save_" + save_name));
        this.setState(_.merge(this.stateGenerator(), app_state));
    };

    loadDefaultGame = () => {
        var app_state = this.getCurrentSaveJSON();
        this.setState(app_state ? _.merge(this.stateGenerator(), app_state) : _.merge(this.store, this.stateGenerator()));
    };

    saveGameAs = (save_name = 0, state) => {
        localStorage.setItem(this.game_name + "_save_" + save_name, JSON.stringify(state));
        this.setCurrentSaveName(save_name);
    };

    saveGame = state => this.setCurrentSaveJSON(state);

    clearSave = save_name => {
        localStorage.removeItem(this.game_name + "_save_" + save_name);
    };

    setState = (next_store, timeout = 0) => {
        //console.log('setState', next_store, timeout, this.recently_updated);

        this.setStore(next_store); // this.store = _.assign(this.store, next_store);

        if (timeout === 0 || !this.recently_updated) {
            clearInterval(this.publish_timerID);
            this.publish_timerID = setTimeout(() => {
                this.recently_updated = false;
            }, timeout);
            this.recently_updated = true;
            _.each(this.views, view => view.setState(_.cloneDeep(this.store)));
        }
    };

    setStore = next_store => {
        if (next_store.debug && next_store.debug.gin_ticks) console.log("set store " + this.store.tick);
        //console.log(next_store);
        this.store = _.assign(this.store, next_store);
    };

    exec = (helper, params = {}) => {
        this.perform(helper, _.assign(this.params, params));
    };

    perform = (helper, ...args) => {
        this.setState(helper(this.store, ...args));
    };

    onClick = item => {
        //console.log(item);
        let store = this.store;
        if (item.isDisabled && item.isDisabled(store)) {
            return false;
        }
        if (item.cost) {
            if (isEnough(store, item.cost)) {
                if (item.onClick) this.setState(item.onClick(chargeCost(store, item.cost), this.params), 25);
            } else {
                return false;
            }
        } else {
            if (item.onClick) this.setState(item.onClick(store, this.params), 25);
        }
    };

    initLoop = () => {
        if (!this.store.game_paused) {
            clearInterval(this.timerID);
            this.timerID = setInterval(
                () => this.onInterval(),
                Math.floor(this.store.game_speed / this.store.frame_rate / this.store.game_speed_multiplier)
            );
        }
    };

    playGame = () => {
        this.setState({ game_paused: false });
        this.initLoop();
    };

    pauseGame = () => {
        clearInterval(this.timerID);
        this.setState({ game_paused: true });
    };

    setGameSpeed = speed => {
        this.setState({ game_speed_multiplier: speed });
        if (!this.store.game_paused) this.playGame();
    };

    registerRule = (key, rule) => {
        this.rules[key] = rule;
    };

    registerRules = rules => {
        _.each(rules, (rule, key) => this.registerRule(key, rule));
    };

    onInterval = () => {
        let store = this.store;
        // console.log('onInterval 1', store);

        if (store.frame % store.frame_rate === 0) {
            store = this.onTick(store);
            store.tick++;
        }

        // console.log('onInterval 2', store);

        store = this.onFrame(store);
        store.frame++;
        //    localStorage.setItem(game_name+"_app_state", JSON.stringify(store));
        this.setState(store, 100);
        // console.log("save_game");
        this.saveGame(this.store);
    };

    onFrame = store => {
        // console.log('onFrame', store);
        _.each(this.rules, (item, key) => {
            if (item.onFrame) {
                let next_store = item.onFrame(store, this.params);
                // console.log('tick', key, next_store);
                if (next_store) {
                    store = next_store;
                } else {
                    console.log("!!!BROKEN RULE!!!", key, next_store);
                }
            }
        });

        return store;
    };

    onTick = store => {
        const debug = store.debug.performance;
        let sum_diff = 0;
        // console.log('onTick', store, this.rules);
        _.each(this.rules, (item, key) => {
            if (item.onTick) {
                let p1, p2;
                if (debug) {
                    p1 = performance.now();
                }
                let next_store = item.onTick(store, this.params);
                // console.log('tick', key, next_store);
                if (next_store) {
                    store = next_store;
                    if (debug) {
                        p2 = performance.now();
                        let diff = p2 - p1;
                        if (!this.rules_performance_story[key]) this.rules_performance_story[key] = 0;
                        sum_diff += diff;
                        this.rules_performance_story[key] += diff;
                        console.log(
                            `performance report: ${diff.toFixed(4)}ms (${this.rules_performance_story[key].toFixed(
                                4
                            )}ms total) for rule ${key}`
                        );
                    }
                } else {
                    console.log("!!!BROKEN RULE!!!", key, next_store);
                }
            }
        });

        if (debug) {
            console.log(
                `performance total: ${sum_diff.toFixed(4)}ms (${_.sum(_.values(this.rules_performance_story)).toFixed(4)}ms total)`
            );
        }
        return store;
    };

    genId = (prefix = "") => {
        let i = this.store._id_counter;
        this.setStore({ _id_counter: this.store._id_counter + 1 });
        return prefix + i;
    };

    score = (store, score_generator) => {
        let item_count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (_.includes(key, this.game_name + "_scores_")) {
                item_count++;
            }
        }

        this.clearSave(this.getCurrentSaveName());
        this.setCurrentSaveName("temp");
        const key = this.game_name + "_scores_" + item_count;
        localStorage.setItem(key, score_generator(store, key));
    };
}

export function isEnough(store, cost) {
    let enough = true;
    _.each(cost, (value, resource_key) => {
        if (_.get(store, resource_key) < value) enough = false;
        // console.log(_.get(store, resource_key), resource_key);
    });

    //console.log(store, cost, enough);

    return enough;
}

export function chargeCost(store, cost) {
    if (!isEnough(store, cost)) return false;
    _.each(cost, (value, resource_key) => {
        let result = _.get(store, resource_key) - value;
        _.set(store, resource_key, result);
    });
    return store;
}

export function gainCost(store, cost) {
    _.each(cost, (value, resource_key) => {
        let result = _.get(store, resource_key) + value;
        _.set(store, resource_key, result);
    });
    return store;
}

export function drawCost(cost, raw = false) {
    let text = '';
    _.each(cost, (value, resource) => {
        if (value > 0) {
            text += (raw ? resource : _.last(resource.split('.'))) + ': ' + value + ' ';
        }
    });
    return text;
}


export function obtain(store, key) {
    console.log(store, key, store.tech[key]);
    store.tech[key] = true;
    console.log(store, key, store.tech[key]);
    return store;
}
