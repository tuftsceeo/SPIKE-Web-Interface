function _WebSerial() {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    let wsPort;
    let reader;
    let writer;
    let writableStreamClosed;
    let value;
    let done;

    // development flag
    let dev;

    // callback functions after key events
    let funcAfterError = (er) => {/* placeholder*/ }
    let funcAfterDisconnect = () => {}
    let funcAfterConnect = () => {}

    /** Initialize the WebSerial object
     *  (Prompt user to connect to the wsPort)
     * @param {boolean} isDev true if running for SD development/testing, false otherwise
     * @public
     */
    const init = async function (isDev) {
        try {
            dev = isDev;
            let connected = await connect(isDev);
            
            if (connected === true)
                funcAfterConnect();

            return connected
        }
        catch (e) {
            throw e;
        }
    }

    /** Prompt user to connect to the wsPort
     * Error Code: 1000X
     * @returns {boolean} success(true)/failure(false)
     * @private
     */
    const connect = async function (isDev) {
        try {
            let success = false;

            wsPort = await navigator.serial.getPorts();
            
            console.log("%cTuftsCEEO ", "color: #3ba336;", "wsPorts:", wsPort);
            
            // select device
            wsPort = await navigator.serial.requestPort({
                // filters:[filter]
            });
            
            // wait for the wsPort to open.
            try {
                await wsPort.open({ baudRate: 115200 });
            }
            catch (er) {

                if (er.message.indexOf("baudrate") > -1) {
                    // requires different baudRate syntax
                    //console.log("%cTuftsCEEO ", "color: #3ba336;", "baudRate needs to be baudrate");

                    await wsPort.open({ baudrate: 115200 });
                }
                else if (er.message.indexOf("close") > -1) {
                    // error is due to unsuccessful closing of previous wsPort
                    await wsPort.close();
                    
                    consoleError("Unsuccessful closing of previous wsPort");

                    throw {code: 10001, message: er.message};
                }
                else if (er.message.indexOf("open") > -1) {
                    // error in wsPort.open was because it was already open
                    /* "failed to open serial wsPort" */
                    try {
                        await wsPort.close();
                    }
                    catch (err) { 
                        consoleError("wsPort could not be opened was because it was already open");
                        throw { code: 10002, message: err.message }; 
                    }
                }
                else {
                    throw { code: 10003, message: er.message };
                }

                await wsPort.close();
            }

            if (wsPort.readable) {
                success = true;
            }
            else {
                success = false;
            }

            return success;

        } catch (e) {
            if (e.message.indexOf("close") > -1) {
                await wsPort.close();
                throw { code: 10004, message: e.message }
            }
            else {
                consoleError("Cannot read wsPort: ", e);
                throw { code: 10005, message: e.message }
            }
        }
    }

    /** Stream incoming data from hardware through web serial
     * Error Code: 101XX
     * @public
     */
    /** Stream incoming data from hardware through web serial
     *  and take parser interface and continuously feed it raw data
     * @param {function} parser parser function 
     */
    const streamData = async function (parser) {
        try {

            var firstReading = true;
            // read when port is set up
            while (wsPort.readable) {

                // initialize readers
                const decoder = new TextDecoderStream();
                const readableStreamClosed = wsPort.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();

                // continuously get
                while (true) {
                    try {
                        // read UJSON RPC stream ( actual data in {value} )
                        ({ value, done } = await reader.read());

                        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

                        //concatenate UJSONRPC packets into complete JSON objects
                        if (value) {
                            await parser(value);
                        }
                        if (done) {
                            serviceActive = false;
                            // reader has been canceled.
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", '[readLoop] ERROR', error);

                        serviceActive = false;

                        funcAfterDisconnect();

                        funcAfterError("SPIKE Prime hub has been disconnected");

                        writer.close();
                        //await writer.releaseLock();
                        await writableStreamClosed;

                        reader.cancel();
                        //await reader.releaseLock();
                        await readableStreamClosed.catch(reason => { });

                        await wsPort.close();

                        writer = undefined;
                        reader = undefined;
                        streamParser = undefined;

                        break; // stop trying to read
                    }
                } // end of: while (true) [reader loop]

                // release the lock
                reader.releaseLock();

            } // end of: while (wsPort.readable) [checking if readable loop]
            console.log("%cTuftsCEEO ", "color: #3ba336;", "- wsPort.readable is FALSE")
        } // end of: trying to open wsPort
        catch (e) {
            serviceActive = false;
            // Permission to access a device was denied implicitly or explicitly by the user.
            console.log("%cTuftsCEEO ", "color: #3ba336;", 'ERROR trying to open:', e);
        }
    }
    /**
     * 
     * @param {any} command 
     */
    const write = function (command) {
        setupWriter();
        writer.write(command);
    }

    const executeAfterConnect = (f) => { (typeof f === "function") ? funcAfterConnect = f : {}};
    const executeAfterDisconnect = (f) => { (typeof f === "function") ? funcAfterDisconnect = f : {}};
    const executeAfterError = (f) => { (typeof f === "function") ? funcAfterError = f : {}};

    /** Set up writer object for sending data
    * @private
    */
    const setupWriter = function () {
        // if writer not yet defined:
        if (typeof writer === 'undefined') {
            // set up writer for the first time
            const encoder = new TextEncoderStream();
            writableStreamClosed = encoder.readable.pipeTo(wsPort.writable);
            writer = encoder.writable.getWriter();
        }
    }

    /** console log
     * @private
     * @param {string} m 
     */
    const CONSOLELOG = function (m) {
        console.log("%cTuftsCEEO ", "color: #3ba336;", m);
    }

    /** console log only in development
    * @private
    * @param {string} m 
    */
    const devConsoleLog = function (m) {
        if (dev === true)
            console.log("%cTuftsCEEO ", "color: #3ba336;", m);  }

    /** console.error a message
    * @param {string} m 
    * @private
    */
    const consoleError = function (m) {
        console.error("%cTuftsCEEO ", "color: #3ba336;", m);
    }


    return {
        init: init,
        streamData: streamData,
        write: write,
        // key event callback receivers
        executeAfterDisconnect: executeAfterDisconnect,
        executeAfterConnect: executeAfterConnect,
        executeAfterError: executeAfterError
    }
}