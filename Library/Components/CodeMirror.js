import React, {Component, PropTypes} from "react";
import cn from "classnames";
import cm from "codemirror";

// Never used. Just to load it into codemirror
import "codemirror/mode/javascript/javascript"

export default class CodeMirror extends Component {
    static propTypes = {
        options: PropTypes.object,
        value: PropTypes.string,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    }

    static defaultProps = {
        display: "inherit"
    }

    ignoreNextUpdate = false

    render() {
        const {height, width, display} = this.props;

        return (
            <div ref="container" style={{height: `${height}px`, width: `${width}px`}}></div>
        );
    }

    componentDidMount() {
        const options = Object.assign({}, {value: this.props.value}, this.props.options);
        const container = this.refs.container;
        this.codeMirror = cm(container, options);
        this.codeMirror.refresh();
        this.codeMirror.on("changes", this.onChange);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (!!this.codeMirror) && (
            nextProps.value !== this.codeMirror.getValue() ||
            nextProps.height !== this.props.height ||
            nextProps.width !== this.props.width
        );
    }

    componentDidUpdate() {
        const {value, width, height, options} = this.props;

        this.ignoreNextUpdate = true;
        this.codeMirror.setValue(value);
        this.codeMirror.setSize(width, height);
        for(let key in options) {
            if (options.hasOwnProperty(key)) {
                this.codeMirror.setOption(key, options[key]);
            }
        }
        this.codeMirror.refresh();
    }

    onChange = (cm, changes) => {
        if (this.ignoreNextUpdate) {
            this.ignoreNextUpdate = false;
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(cm.getValue());
        }
    }
}
