import React, {Component} from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import CodeMirror from "../Components/CodeMirror";
import OutputPane from "../Components/OutputPane";
import _ from "lodash";
import "script-loader!babel-standalone/babel.min.js";

export default class PlaygroundApp extends Component {
    state = {
        es6value: "",
        jsvalue: "",
        viewportHeight: 0,
        viewportWidth: 0,
        jserror: false,
        es6options: {
            lineNumbers: true,
            mode: "javascript",
            theme: "solarized light"
        },
        jsoptions: {
            lineNumbers: true,
            readOnly: true,
            mode: "javascript",
            theme: "monokai"
        },
        jsvisible: true
    }

    constructor() {
        super();
        if ("localStorage" in window && window["localStorage"] !== null) {
            let savedState = window.localStorage.getItem("savedES6Code");
            if (savedState !== null && savedState !== undefined) {
                this.state.es6value = savedState;
            }
        }
    }

    render() {
        const {es6value, jsvalue, viewportHeight, viewportWidth,
               es6options, jsoptions, jsvisible} = this.state;

        return (
            <div>
                <table className="comparisonView">
                    <tbody>
                        <tr>
                            <td className="editor">
                                <CodeMirror value={es6value}
                                            options={es6options}
                                            onChange={this.onES6Change}
                                            height={viewportHeight}
                                            width={jsvisible ? Math.ceil(viewportWidth/2) : viewportWidth} />
                            </td>
                            <td className="editor" style={{display: jsvisible ? "inherit" : "none"}}>
                                <CodeMirror value={jsvalue}
                                            options={jsoptions}
                                            onChange={this.onJSChange}
                                            height={viewportHeight}
                                            width={Math.floor(viewportWidth/2)} />
                            </td>
                        </tr>
                        <tr>
                        <td colSpan={2}>
                            <OutputPane />
                        </td>
                        </tr>
                    </tbody>
                </table>
                <div className="controls">
                    <div onClick={this.onJSHideClick}>
                        <i className="fa fa-code fa-lg" />
                    </div>
                    <div onClick={this.onJSRunClick}>
                        <i className="fa fa-play-circle-o fa-lg" />
                    </div>
                </div>
            </div>
        );
    }

    onES6Change = (newValue) => {
        this.setState({
            es6value: newValue
        });

        this.transpile(newValue);
        this.saveState(newValue);
    }

    onJSChange = (newValue) => {
        this.setState({
            jsvalue: newValue
        });
    }

    onResizeViewport = () => {
        this.setState({
            viewportHeight: document.documentElement.clientHeight,
            viewportWidth: document.documentElement.clientWidth
        });
    }

    onJSRunClick = () => {
        const {jserror, jsvalue} = this.state;
        if(jserror) {
            console.error("Can't execute invalid ES6 code!");
            return;
        }
        const oldWindowReact = window.React;
        const oldWindowReactDOM = window.ReactDOM;
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        eval(jsvalue);
        window['React'] = oldWindowReact;
        window['ReactDOM'] = oldWindowReactDOM;
    }

    onJSHideClick = () => {
        this.setState({
            jsvisible: !this.state.jsvisible
        });
    }

    componentDidMount() {
        this.onResizeViewport();
        window.addEventListener('resize', this.onResizeViewport);
        this.onES6Change(this.state.es6value);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeViewport);
    }

    transpile = _.debounce((value) => {
        const {jsoptions} = this.state;

        try {
            const transformation = Babel.transform(
              value,
              {
                presets: ['latest'],
                "plugins": [
                  "transform-react-jsx",
                  "transform-object-rest-spread",
                  "transform-class-properties",
                ]
              }
            );
            this.setState({
                jsvalue: transformation.code,
                jsoptions: {...jsoptions, lineNumbers: true},
                jserror: false
            })
        }
        catch(error) {
            this.setState({
                jsvalue: error.message,
                jsoptions: {...jsoptions, lineNumbers: false},
                jserror: true
            });
        }
    }, 250);

    saveState = _.debounce((value) => {
        if ("localStorage" in window && window["localStorage"] !== null) {
            window.localStorage.setItem("savedES6Code", value);
        }
    }, 500);
}
