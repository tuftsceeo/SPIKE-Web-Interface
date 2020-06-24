import CanvasJSReact from './canvasjs.react';
import React from 'react';
import ReactDOM from 'react-dom';
//var React = require('react');
var Component = React.Component;

class Telemetry extends Component {
    render() {
        return(
            <div id = "jsonrpcbox">
                    <center>
                        <p>
                            JSON RPC
                        </p>
                        <input type=button id="connect" name="Connect" value="Connect">
                        <span style="background-color: red" id="connection_status">Status: Disconnected</span>
                        <input type=button id="reboot" name="Send Hub Reboot" value="Send Hub Reboot">
                        <em>Live Feed refresh every <input type="text" value="1" size="4" id="delay_amount" onchange = change_retrieval_interval() /> seconds</em>
                        <button id = "autoget" onclick = >autoGET</button>
                    </center>
                    <textarea cols=120 rows=5 id="REPL" name="REPL" value="" style="font-family: Courier" /></textarea>
                    <textarea cols=120 rows=5 id="data" name="data" value="" style="font-family: Courier" />
                    </textarea>
                    <input type=button id="send" name="Send" value="Send">
            </div>
        );
    }
}