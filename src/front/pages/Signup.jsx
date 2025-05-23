import React, { useState } from "react";
import { signup } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlerRegister = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !confirmPassword) {
            alert("Por favor complete todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const resp = await signup(email, password, dispatch);
        if (resp) {
            alert("Registro exitoso. Ahora puede iniciar sesión");
            navigate('/login');
        } else {
            alert(store.messageError || "Ocurrió un problema al registrarse");
        }
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-4">
            <h1 className="mb-5">Registro</h1>
            <form onSubmit={handlerRegister}>
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
                
                <div className="mb-3">
                    <label className="me-1">Confirmar Contraseña</label>
                    <input 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        id="confirmPass" 
                        type="password"
                        required
                    />
                </div>

                <div className="d-flex mt-3">
                    <button type="submit" className="mx-auto">Registrarme</button>
                </div>
            </form>
        </div>
    );
};