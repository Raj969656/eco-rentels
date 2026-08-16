import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";


export default function AuthForm({
  mode = "login",
  onModeChange
}) {

  const {
    login,
    register,
    googleLogin
  } = useAuth();


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });


  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);


  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  useEffect(() => {

    let cancelled = false;

    function initializeGoogle() {

      if (cancelled) return;

      if (!window.google?.accounts?.id) {
        return;
      }

      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {

        console.error(
          "VITE_GOOGLE_CLIENT_ID is missing from client/.env"
        );

        return;
      }


      const button =
        document.getElementById(
          "google-login-button"
        );

      if (!button) {
        return;
      }


      /*
       * Prevent multiple initialize() calls.
       */

      if (!window.__ecoGoogleInitialized) {

        window.google.accounts.id.initialize({

          client_id: clientId,

          callback:
            handleGoogleResponse

        });

        window.__ecoGoogleInitialized =
          true;
      }


      /*
       * Clear previous button
       * before rendering.
       */

      button.innerHTML = "";


      window.google.accounts.id.renderButton(

        button,

        {
          theme: "outline",

          size: "large",

          width: 360,

          text: "continue_with",

          shape: "pill",

          logo_alignment: "left"
        }

      );

    }


    initializeGoogle();


    const timer =
      setInterval(
        initializeGoogle,
        300
      );


    return () => {

      cancelled = true;

      clearInterval(timer);

    };

  }, []);


  /* =====================================================
     GOOGLE RESPONSE
  ===================================================== */

  async function handleGoogleResponse(
    response
  ) {

    if (!response?.credential) {

      setError(
        "Google authentication failed."
      );

      return;
    }


    setError("");

    setGoogleLoading(true);


    try {

      await googleLogin(
        response.credential
      );

    } catch (error) {

      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );


      setError(

        error.response?.data?.message ||

        error.message ||

        "Google login failed. Please try again."

      );

    } finally {

      setGoogleLoading(false);

    }

  }


  /* =====================================================
     INPUT UPDATE
  ===================================================== */

  function updateField(e) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

    setError("");

  }


  /* =====================================================
     MODE CHANGE
  ===================================================== */

  function changeMode(
    newMode
  ) {

    setError("");

    if (onModeChange) {

      onModeChange(
        newMode
      );

    }

  }


  /* =====================================================
     EMAIL LOGIN / REGISTER
  ===================================================== */

  async function submit(e) {

    e.preventDefault();

    setError("");

    setBusy(true);


    try {

      if (mode === "login") {

        await login(

          form.email.trim(),

          form.password

        );

      } else {

        await register({

          name:
            form.name.trim(),

          email:
            form.email.trim(),

          password:
            form.password,

          phone:
            form.phone.trim()

        });

      }

    } catch (error) {

      console.error(
        "AUTH FORM ERROR:",
        error
      );


      setError(

        error.response?.data?.message ||

        error.message ||

        "Something went wrong. Please try again."

      );

    } finally {

      setBusy(false);

    }

  }


  return (

    <div className="auth-form-wrapper">


      {/* =================================================
          LOGIN / SIGNUP SWITCH
      ================================================= */}

      <div className="auth-switch">

        <button

          type="button"

          className={
            mode === "login"
              ? "active"
              : ""
          }

          onClick={() =>
            changeMode("login")
          }

        >
          Log in
        </button>


        <button

          type="button"

          className={
            mode === "register"
              ? "active"
              : ""
          }

          onClick={() =>
            changeMode("register")
          }

        >
          Sign up
        </button>

      </div>


      {/* =================================================
          GOOGLE LOGIN
      ================================================= */}

      <div className="google-login-section">

        {googleLoading && (

          <div className="google-loading">

            <span className="button-spinner"></span>

            Signing in with Google...

          </div>

        )}


        <div

          id="google-login-button"

          className={
            googleLoading
              ? "google-button hidden"
              : "google-button"
          }

        ></div>

      </div>


      {/* =================================================
          OR DIVIDER
      ================================================= */}

      <div className="auth-divider">

        <span></span>

        <p>OR</p>

        <span></span>

      </div>


      {/* =================================================
          EMAIL FORM
      ================================================= */}

      <form

        className="auth-form"

        onSubmit={submit}

      >


        {/* NAME */}

        {mode === "register" && (

          <div className="input-group">

            <label>
              Full name
            </label>

            <input

              type="text"

              name="name"

              placeholder="Enter your name"

              value={
                form.name
              }

              onChange={
                updateField
              }

              required

              autoComplete="name"

            />

          </div>

        )}


        {/* EMAIL */}

        <div className="input-group">

          <label>
            Email address
          </label>

          <input

            type="email"

            name="email"

            placeholder="you@example.com"

            value={
              form.email
            }

            onChange={
              updateField
            }

            required

            autoComplete="email"

          />

        </div>


        {/* PHONE */}

        {mode === "register" && (

          <div className="input-group">

            <label>
              Phone number
            </label>

            <input

              type="tel"

              name="phone"

              placeholder="+91 98765 43210"

              value={
                form.phone
              }

              onChange={
                updateField
              }

              autoComplete="tel"

            />

          </div>

        )}


        {/* PASSWORD */}

        <div className="input-group">

          <div className="password-label-row">

            <label>
              Password
            </label>


            {/* FORGOT PASSWORD */}

            {mode === "login" && (

              <Link

                to="/forgot-password"

                className="forgot-password-link"

              >
                Forgot password?
              </Link>

            )}

          </div>


          <input

            type="password"

            name="password"

            placeholder="Enter your password"

            value={
              form.password
            }

            onChange={
              updateField
            }

            minLength={6}

            required

            autoComplete={
              mode === "login"

                ? "current-password"

                : "new-password"
            }

          />

        </div>


        {/* ERROR */}

        {error && (

          <div className="auth-error">

            <span>
              !
            </span>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* SUBMIT */}

        <button

          type="submit"

          className="auth-submit"

          disabled={
            busy ||
            googleLoading
          }

        >

          {busy ? (

            <>

              <span className="button-spinner"></span>

              Please wait...

            </>

          ) : (

            mode === "login"

              ? "Log in"

              : "Create account"

          )}

        </button>


        {/* TERMS */}

        <p className="auth-terms">

          By continuing, you agree to
          Eco Rentels terms and
          privacy policy.

        </p>

      </form>

    </div>

  );

}