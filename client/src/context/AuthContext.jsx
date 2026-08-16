import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      console.log(
        "AUTH: checking authentication..."
      );

      const token =
        localStorage.getItem("eco_token");

      console.log(
        "AUTH: token =",
        token ? "FOUND" : "NOT FOUND"
      );

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      console.log(
        "AUTH: requesting /auth/me..."
      );

      const response =
        await api.get("/auth/me");

      console.log(
        "AUTH: response =",
        response.data
      );

      setUser(response.data.user);

    } catch (error) {

      console.error(
        "AUTH PROVIDER ERROR:",
        error
      );

      if (error.response) {

        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );

      } else if (error.request) {

        console.error(
          "NO RESPONSE FROM SERVER:",
          error.request
        );

      } else {

        console.error(
          "REQUEST ERROR:",
          error.message
        );
      }

      localStorage.removeItem(
        "eco_token"
      );

      setUser(null);

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     EMAIL / PASSWORD LOGIN
  ===================================================== */

  async function login(
    email,
    password
  ) {

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(
        "eco_token",
        response.data.token
      );

      setUser(
        response.data.user
      );

      return response.data;

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      throw error;
    }
  }


  /* =====================================================
     REGISTER
  ===================================================== */

  async function register(
    payload
  ) {

    try {

      const response =
        await api.post(
          "/auth/register",
          payload
        );

      localStorage.setItem(
        "eco_token",
        response.data.token
      );

      setUser(
        response.data.user
      );

      return response.data;

    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      throw error;
    }
  }


  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  async function googleLogin(
    credential
  ) {

    try {

      console.log(
        "GOOGLE AUTH: sending credential to server..."
      );

      const response =
        await api.post(
          "/auth/google",
          {
            credential
          }
        );

      console.log(
        "GOOGLE AUTH: server response =",
        response.data
      );


      if (!response.data.token) {

        throw new Error(
          "Google login did not return a token."
        );
      }


      /*
       * Store our own Eco Rentels JWT.
       *
       * Google verifies the user's identity.
       * Our backend then creates the normal
       * Eco Rentels JWT.
       */

      localStorage.setItem(
        "eco_token",
        response.data.token
      );


      /*
       * Update application user
       */

      setUser(
        response.data.user
      );


      return response.data;

    } catch (error) {

      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      throw error;
    }
  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    localStorage.removeItem(
      "eco_token"
    );

    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        register,

        googleLogin,

        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}