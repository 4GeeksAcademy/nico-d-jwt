export const initialStore = () => {
  return {
    message: null,
    messageError: "",
    protectedMessage: "",
    token: "",
    todos: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "set_error":
      return {
        ...store,
        messageError: action.payload.error || "Ocurrió un error",
      };

    case "succes_login":
      return {
        ...store,
        token: action.payload.token,
        messageError: "",
      };

    case "close_session":
      return {
        ...store,
        token: "",
        protectedMessage: "",
      };

    case "protected_message":
      return {
        ...store,
        protectedMessage: action.payload.message,
        messageError: "",
      };

    default:
      throw Error("Unknown action.");
  }
}

export const signup = async (email, password, dispatch) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      dispatch({
        type: "set_error",
        payload: { error: data.msg || "Error en el registro" },
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Ocurrió un error al registrar usuario", error);
    dispatch({ type: "set_error", payload: { error: "Error de conexión" } });
    return false;
  }
};

export const login = async (email, password, dispatch) => {
  try {
    console.log(
      "Haciendo login con:",
      `${import.meta.env.VITE_BACKEND_URL}/api/login`
    );
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      dispatch({
        type: "set_error",
        payload: { error: data.msg || "Credenciales incorrectas" },
      });
      return false;
    }

    dispatch({ type: "succes_login", payload: { token: data.token } });
    return { token: data.token };
  } catch (error) {
    console.error("ERROR DE CONEXIÓN:", error.message);
    console.error("URL:", `${import.meta.env.VITE_BACKEND_URL}/api/login`);
    dispatch({ type: "set_error", payload: { error: "Error de conexión" } });
    return false;
  }
};

export const protectedRoute = async (token, dispatch) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      dispatch({
        type: "set_error",
        payload: {
          error: data.msg || "No has iniciado sesión, serás redirigido",
        },
      });
      return false;
    }

    dispatch({ type: "protected_message", payload: { message: data.msg } });
    return true;
  } catch (error) {
    console.error("Error en ruta protegida:", error);
    dispatch({ type: "set_error", payload: { error: "Error de conexión" } });
    return false;
  }
};