import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { io } from 'socket.io-client';

const socketContext = createContext();

function ProvideSocket({ uri, children }) {
    const sock = useSocket(uri);
    return (
        <socketContext.Provider value={sock}>
            {children}
        </socketContext.Provider>
    );
}

function useContextSocket() {
    return useContext(socketContext);
}

function useSocket(uri) {
    const [init, setInit] = useState(false);
    const [keys, updateKeys] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(uri, {
            auth: {
                token: localStorage.getItem("authToken")
            }
        });

        // client-side
        socketRef.current.on("success", (arg) => {
            if (!init) {
                setInit(true);
            }
            console.log(arg);
        });
        socketRef.current.on("fail", (arg) => {
            console.error(arg);
        });
        socketRef.current.on("connect_error", (err) => {
            console.log(err.message);
        });

        // the return value from useeffect is a function that will be executed 
        // when component is unmounted, so we disconnect the socket
        return () => socketRef.current.disconnect();
    }, []);

    const addHandler = (newKey, cb) => {
        // we dont add handlers for keys that already have one handler
        if (keys.includes(newKey)) {
            return
        } else {
            updateKeys(keys => [...keys, newKey]);
            socketRef.current.on(newKey, cb);
        }
    }

    const emitMessage = (key, value) => {
        socketRef.current.emit(key, value);
    }

    const initialized = () => init;

    return {
        initialized,
        addHandler,
        emitMessage
    };
}

export {
    ProvideSocket,
    useSocket,
    useContextSocket
}