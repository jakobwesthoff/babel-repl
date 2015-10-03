import React, {Component} from "react";

export default class OutputPane extends Component {
    render() {
        return (
            <div className="output" ref="container" />
        );
    }

    componentDidMount() {
        const container = this.refs.container.getDOMNode();
        window.overlay = window.output = document.output = document.overlay = container;
    }
}
