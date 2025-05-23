import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { login } from "../store";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlerLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert("Por favor complete todos los campos");
            return;
        }

        const resp = await login(email, password, dispatch);
        if (resp && resp.token) {
            sessionStorage.setItem('token', resp.token);
            navigate('/protected');
        } else {
            alert(store.messageError || "Ocurrió un error al iniciar sesión");
        }
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-4">
            <h1 className="mb-5">Iniciar sesión</h1>
            <form onSubmit={handlerLogin}>
                <div className="mb-3">
                    <label className="me-1">Correo electrónico</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email" 
                        type="email"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="me-1">Contraseña</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        id="pass" 
                        type="password" 
                        required
                    />
                </div>

                <div className="d-flex mt-4">
                    <button type="submit" className="mx-3">Login</button>
                    <button type="button" onClick={() => navigate('/signup')}>
                        Registrarse
                    </button>
                </div>
            </form>
        </div>
    );
};