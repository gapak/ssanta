import React, { Component } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import Fullscreen from "react-full-screen";
import _ from 'lodash';

import './css/header.css';
import './css/footer.css';
import './css/event.css';
import './css/rewards.css';
import './css/App.css';


import {Gin, isEnough, drawCost, gainCost} from './bdcgin/Gin';
import GinGameMenu from './bdcgin/GinGameMenu';
import GinButton, {StorageGinButton, CollectGinButton, BuildingGinButton, AutoBuildingGinButton, HireGinButton, FireGinButton, UpGinButton } from "./bdcgin/GinButton";

import {rules} from './game/core/rules';
import {pick, calcReputation, reset} from './game/helpers';

import {game_name} from './game/core/app_config';
import {getDefaultState} from './game/core/default_state';

import {handleConsoleChange, handleConsoleSubmit} from './game/knowledge/console';
import {checkDisabled, confirmEvent, passEvent} from './game/knowledge/events';



class App extends Component {
    constructor(props) {
        super(props);

        this.gin = new Gin(game_name, getDefaultState);
        this.gin.init();
        //this.gin.addViewHandler(state => { console.log(state, this, this.setState); this.setState(state); });
        this.gin.connectReact(this);
        this.gin.registerRules(rules);
        this.state = getDefaultState();

    }

    componentDidMount() {
        this.gin.loadGame('FirstSave');
        this.gin.playGame();
    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch', error, info);
        if (!localStorage.getItem(game_name+"_retry_flag")) { // production one-try-reloader
            localStorage.setItem(game_name+"_retry_flag", true);
            localStorage.setItem(game_name+"_app_state", null);
            window.location.reload(true);
            return true;
        }
        localStorage.setItem(game_name+"_retry_flag", false);
    }

    changeTab(tab_name) {
        this.gin.setState({tab: tab_name});
    }


    render() {
        let state = this.state;
        
        
        const header_subcomponent =
            <div className="header flex-container-row col">
                <div className="col-xs  flex-element filament">
                    <div className="row-xs filament">{Math.floor(0)} Money</div>
                </div>
            </div>;
        
        
        const log_subcomponent =
            <div className="filament">
                <div className="flex-container-col panel">
                    {_.map(state.console_log, (item, key) => <div className="flex-element" key={key}><h4>{item}</h4></div>)}
                </div>
            </div>;
        
        const console_subcomponent =
            <div className="filament">
                <form onSubmit={(event) => this.gin.setState(handleConsoleSubmit(state, event))}>
                <div className="flex-container-row panel">
                    <div className="flex-element">
                            Введи пароль: <input type="text" value={this.state.value} onChange={(event) => this.gin.setState(handleConsoleChange(state, event))} />
                    </div>
                    <div className="flex-element">
                        <input className="btn snow_button" type="submit" value="Подтвердить" />
                    </div>
                    
                    
                </div>
                </form>
    
                <div className="flex-container-row panel">
                    <div className="flex-element">
                        {state.pass_error ? 'Ошибка при вводе пароля, Пес!' : ''}
                        {state.old_pass_error ? 'Эй, это СТАРЫЙ пароль!' : ''}
                    </div>
                </div>
            </div>;
        
        const intro_subcomponent =
            <div className="filament">
                <div className="panel">
                    <h3>Welcome, new Santa!</h3>
                    <h4>The party in honor of your inauguration went gloriously.</h4>
                    <h4>It's time to get down to duty.</h4>
                </div>
                <div className="panel">
                    <button className="btn btn-lg snow_button" onClick={() => {
                        //this.setState({isFull: true});
                        this.changeTab('santa');
                    }} title='Arena'>I AM READY</button>
                </div>
                <h4 className="panel">
                    Disclaimer: the game on the early stages of development, bugs are possible! Developers will be grateful if in case of any problem you write to the Support.
                </h4>
            </div>;
        
        const reward_pupup_subcomponent =
            <div className="reward_popup filament">
                <div className="panel">
                    <h2>Reward!</h2>
                    <h3>{drawCost(state.rewards[0])}</h3>
                    <h3><GinButton item={{
                        name: 'Collect!',
                        onClick: (store) => {
                            store = gainCost(store, store.rewards[0]);
                            store.rewards.splice(0, 1);
                            return store; }
                    }} state={state} gin={this.gin} /></h3>
                </div>
            </div>;
    
        const event_trigger_subcomponent =
            <div className="event_trigger filament" onClick={() => this.gin.onClick({onClick: (store) => { store.event.opened = true; return store; }})}>
                <h2>Event!</h2>
            </div>;
    
        const event_popup_subcomponent =
            <div className="event_popup filament">
                <div className="panel">
                    <h3>{state.event.name}</h3>
                    <h4>{state.event.text}</h4>
                    <GinButton item={{
                        name: 'Confirm',
                        isDisabled: checkDisabled,
                        onClick: confirmEvent,
                    }} state={state} gin={this.gin} />
                    <GinButton item={{
                        name: 'Decline',
                        onClick: passEvent,
                    }} state={state} gin={this.gin} />
                </div>
            </div>;
        
        
        
        return (
            <Fullscreen
                enabled={state.isFull}
                onChange={isFull => this.gin.setState({isFull})}
            >
                <div className="App" style={{backgroundImage: 'url(/bg.jpg)'}}>
                    <div className="filament content_container" role="main">
                        
                        {state.tab === 'intro' ?
                            intro_subcomponent
                            : ''}
    
                        {state.rewards.length > 0 ?
                            reward_pupup_subcomponent
                            : ''}
                            
                        {state.event !== false && state.event.opened === false ?
                            event_trigger_subcomponent
                            : ''}
                        {state.event !== false && state.event.opened === true ?
                            event_popup_subcomponent
                            : ''}
    
                        <div style={{width: '100%', height: '70px'}}></div>
    
                        {state.tab !== 'intro' && !state.logged ?
                            console_subcomponent
                            : ''}
    
                        {state.tab !== 'intro' ?
                            log_subcomponent
                            : ''}

                        <div style={{width: '100%', height: '40px'}}></div>
    
    
                    </div>
                </div>
            </Fullscreen>
        );
    }
}

export default App;
