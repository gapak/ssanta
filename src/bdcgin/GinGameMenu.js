import React, { Component } from "react";
import classNames from "classnames";

export default class GinGameMenu extends Component {
    render() {
        let state = this.props.state;
        let gin = this.props.gin;
        let speeds = this.props.speeds;

        return (
            <div className="flex-element">
                <span
                    onClick={() => {
                        if (state.game_paused) {
                            gin.playGame();
                        } else {
                            gin.pauseGame();
                        }
                    }}
                >
                    <span
                        className={classNames("glyphicon", state.game_paused ? "glyphicon-play" : "glyphicon-pause")}
                        style={{ width: 28, height: 28 }}
                    />
                </span>
                <span>
                    {speeds.map((speed, index) => {
                        return (
                            <span key={index}>
                                {state.game_speed_multiplier === speed ? (
                                    <button className="" style={{ width: 42, height: 28 }}>
                                        <u>x{speeds[index]}</u>
                                    </button>
                                ) : (
                                    <button
                                        className=""
                                        style={{ width: 42, height: 28 }}
                                        onClick={() => {
                                            gin.setGameSpeed(speed);
                                        }}
                                    >
                                        x{speeds[index]}
                                    </button>
                                )}
                            </span>
                        );
                    })}
                </span>
            </div>
        );
    }
}
