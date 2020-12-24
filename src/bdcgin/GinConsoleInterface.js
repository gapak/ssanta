import React, { Component } from "react";

class GinConsoleInterface extends Component {
    constructor(props) {
        super(props);

        this.state = {
            command: "",
            command_cache: [],
            command_cache_counter: 0,
            isInterfaceOpen: this.props.gin.console.isInterfaceOpen
        };

        this.handleChange = this.handleChange.bind(this);
        this.addEnterEvent = this.addEnterEvent.bind(this);
        this.removeEnterEvent = this.removeEnterEvent.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.openConsole = this.openConsole.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.openConsole);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.openConsole);
    }

    openConsole(e) {
        if (e.code === "KeyC" && e.shiftKey) {
            this.props.gin.console.isInterfaceOpen = !this.props.gin.console.isInterfaceOpen;
            this.setState({ isInterfaceOpen: this.props.gin.console.isInterfaceOpen });
        }
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.parseCommand(this.state.command);
            this.state.command_cache.push(this.state.command);
            this.setState({ command: "", command_cache_counter: 0 });
        } else if (event.key === "ArrowUp") {
            if (this.state.command_cache[Math.max(this.state.command_cache.length - this.state.command_cache_counter - 1, 0)]) {
                this.setState({
                    command: this.state.command_cache[Math.max(this.state.command_cache.length - this.state.command_cache_counter - 1, 0)],
                    command_cache_counter: this.state.command_cache_counter + 1
                });
                const devConsole = document.getElementById("devConsole");
                setTimeout(() => {
                    devConsole.setSelectionRange(this.state.command.length, this.state.command.length);
                }, 1);
            }
        }
    }

    parseCommand(command) {
        let methods = {};
        if (this.props.methods) methods = this.props.methods;
        let command_list = {};
        if (this.props.commands) command_list = this.props.commands;
        this.props.gin.console.parseConsoleCommand(command, command_list, methods);
    }

    handleChange(event) {
        this.setState({ command: event.target.value, command_cache_counter: 0 });
    }

    addEnterEvent() {
        window.addEventListener("keydown", this.handleKeyPress);
    }

    removeEnterEvent() {
        window.removeEventListener("keydown", this.handleKeyPress);
        this.setState({ command_cache_counter: 0 });
    }

    render() {
        return this.state.isInterfaceOpen ? (
            <input
                type="text"
                id="devConsole"
                value={this.state.command || ""}
                onChange={this.handleChange}
                onFocus={this.addEnterEvent}
                onBlur={this.removeEnterEvent}
                autoComplete="off"
            />
        ) : (
            ""
        );
    }
}

export default GinConsoleInterface;
