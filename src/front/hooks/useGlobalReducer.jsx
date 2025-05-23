// useGlobalReducer.jsx
import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";

// 1. Contexto para el estado global
const StoreContext = createContext();

// 2. Provider (exportación nombrada opcional, pero mejor mantenerla así)
export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

// 3. Hook personalizado (exportación por defecto)
const useGlobalReducer = () => {
    const { store, dispatch } = useContext(StoreContext);
    return { store, dispatch };
};

export default useGlobalReducer; // ✅ Exportación por defecto consistente