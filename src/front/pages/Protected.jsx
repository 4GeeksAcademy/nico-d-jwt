import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { protectedRoute } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Protected = () => {
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { store, dispatch } = useGlobalReducer();

useEffect(() => {
    const apiToken = sessionStorage.getItem('token');
    const checkAccess = async () => {
        if (!apiToken || apiToken === '') {
            navigate('/login');
            return;
        }

        try {
            const success = await protectedRoute(apiToken, dispatch);

            if (!success) {
                alert(store.messageError || "No autorizado");
                navigate('/login');
                return;
            }

            setMsg(store.protectedMessage);
        } catch (error) {
            console.error("Error en protectedRoute:", error);
            alert("Hubo un error en la autenticación.");
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    checkAccess();
}, [navigate, store.messageError, store.protectedMessage]);


    return (
        <div className="fluid-container">
            <Navbar />
            {loading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <h1>{msg}</h1>
            )}
        </div>
    );
};