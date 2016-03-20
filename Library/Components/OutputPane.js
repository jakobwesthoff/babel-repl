import React, {Component} from "react";

export default class OutputPane extends Component {
    render() {
        return (
            <div className="output" ref="output"/>
        );
    }

    componentDidMount() {
        const container = this.refs.output;
        window.overlay = window.output = document.output = document.overlay = container;
    }
}
