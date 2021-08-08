import React, { useState, useContext, createContext } from "react";

const msgContext = createContext();

function ProvideMessageContext({ children, defaultContext }) {
    const conx = useProvideMessageContext(defaultContext);
    return (
        <msgContext.Provider value={conx}>
            {children}
        </msgContext.Provider>
    );
}

function useMessageContext() {
    return useContext(msgContext);
}

function useProvideMessageContext(defaultContext) {
    const [stockContext, updateStockContext] = useState(defaultContext);

    const setStockContext = (newContext) => {
        updateStockContext(newContext);
    };

    return {
        stockContext,
        setStockContext
    };
}

export {
    ProvideMessageContext,
    useProvideMessageContext,
    useMessageContext
}