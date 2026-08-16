import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

import {
  sendPasswordResetEmail,
} from "../utils/mailer.js";

import { protect } from "../middleware/auth.js";

const router = Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


/* =====================================================
   JWT
===================================================== */

function sign(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing from server/.env"
    );
  }

  return jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}


/* =====================================================
   PUBLIC USER
===================================================== */

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    avatar: user.avatar || "",
    googleId: user.googleId || null,
    authProvider:
      user.authProvider || "local",
  };
}


/* =====================================================
   REGISTER
===================================================== */

router.post(
  "/register",
  async (req, res, next) => {
    try {
      console.log(
        "AUTH REGISTER REQUEST"
      );

      const {
        name,
        email,
        password,
        phone,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Name, email and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must contain at least 6 characters",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "Email already registered",
        });
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      const user =
        await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: passwordHash,
          phone: phone
            ? phone.trim()
            : "",
          authProvider: "local",
        });

      const token = sign(user);

      console.log(
        "REGISTER SUCCESS:",
        user.email
      );

      return res.status(201).json({
        token,
        user: publicUser(user),
      });

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      next(error);
    }
  }
);


/* =====================================================
   LOGIN
===================================================== */

router.post(
  "/login",
  async (req, res, next) => {
    try {
      console.log(
        "AUTH LOGIN REQUEST"
      );

      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          message:
            "This account uses Google Login. Continue with Google.",
        });
      }

      const passwordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordCorrect) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      const token = sign(user);

      console.log(
        "LOGIN SUCCESS:",
        user.email
      );

      return res.json({
        token,
        user: publicUser(user),
      });

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      next(error);
    }
  }
);


/* =====================================================
   GOOGLE LOGIN
===================================================== */

router.post(
  "/google",
  async (req, res, next) => {
    try {
      console.log(
        "GOOGLE LOGIN REQUEST"
      );

      const {
        credential,
      } = req.body;

      if (!credential) {
        return res.status(400).json({
          message:
            "Google credential is required",
        });
      }

      if (
        !process.env.GOOGLE_CLIENT_ID
      ) {
        return res.status(500).json({
          message:
            "GOOGLE_CLIENT_ID is missing on server",
        });
      }

      const ticket =
        await googleClient.verifyIdToken({
          idToken: credential,
          audience:
            process.env.GOOGLE_CLIENT_ID,
        });

      const payload =
        ticket.getPayload();

      if (!payload) {
        return res.status(401).json({
          message:
            "Invalid Google credential",
        });
      }

      const {
        sub: googleId,
        email,
        name,
        picture,
        email_verified,
      } = payload;

      if (
        !email ||
        !email_verified
      ) {
        return res.status(401).json({
          message:
            "Google email could not be verified",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      let user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (user) {
        let changed = false;

        if (!user.googleId) {
          user.googleId =
            googleId;
          changed = true;
        }

        if (
          !user.avatar &&
          picture
        ) {
          user.avatar =
            picture;
          changed = true;
        }

        if (changed) {
          await user.save();
        }

      } else {
        user =
          await User.create({
            name:
              name ||
              "Eco Rentels User",

            email:
              normalizedEmail,

            password: null,

            phone: "",

            googleId,

            avatar:
              picture || "",

            authProvider: "google",
          });
      }

      const token = sign(user);

      console.log(
        "GOOGLE LOGIN SUCCESS:",
        user.email
      );

      return res.json({
        token,
        user: publicUser(user),
      });

    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      return res.status(401).json({
        message:
          "Google authentication failed",
        error:
          error.message,
      });
    }
  }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

router.post(
  "/forgot-password",
  async (req, res, next) => {
    try {
      console.log(
        "FORGOT PASSWORD REQUEST"
      );

      const {
        email,
      } = req.body;

      if (!email) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      /*
       * Don't reveal whether an email
       * exists in the database.
       */

      if (!user) {
        return res.json({
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      }

      /*
       * Google-only account
       */

      if (!user.password) {
        return res.json({
          message:
            "This account uses Google Login. Please continue with Google.",
        });
      }

      /*
       * Remove previous reset tokens
       */

      await PasswordResetToken.deleteMany({
        user: user._id,
      });

      /*
       * Generate secure token
       */

      const rawToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      /*
       * Store only hash
       */

      const tokenHash =
        crypto
          .createHash("sha256")
          .update(rawToken)
          .digest("hex");

      /*
       * 15 minute expiration
       */

      const expiresAt =
        new Date(
          Date.now() +
          15 * 60 * 1000
        );

      await PasswordResetToken.create({
        user: user._id,
        tokenHash,
        expiresAt,
      });

      /*
       * Create frontend reset URL
       */

      const resetUrl =
        `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

      console.log(
        "RESET URL CREATED FOR:",
        user.email
      );

      /*
       * Send email
       */

      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });

      console.log(
        "PASSWORD RESET EMAIL SENT:",
        user.email
      );

      return res.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });

    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      next(error);
    }
  }
);


/* =====================================================
   RESET PASSWORD
===================================================== */

router.post(
  "/reset-password",
  async (req, res, next) => {
    try {
      console.log(
        "RESET PASSWORD REQUEST"
      );

      const {
        token,
        password,
      } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          message:
            "Token and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must contain at least 6 characters",
        });
      }

      /*
       * Hash token from URL
       */

      const tokenHash =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      /*
       * Find valid token
       */

      const resetToken =
        await PasswordResetToken.findOne({
          tokenHash,
          expiresAt: {
            $gt: new Date(),
          },
        });

      if (!resetToken) {
        return res.status(400).json({
          message:
            "Reset link is invalid or has expired.",
        });
      }

      /*
       * Find user
       */

      const user =
        await User.findById(
          resetToken.user
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      /*
       * Hash new password
       */

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      user.password =
        passwordHash;

      /*
       * User can now use both:
       * Google Login + password login
       */

      if (!user.authProvider) {
        user.authProvider =
          "local";
      }

      await user.save();

      /*
       * Delete all reset tokens
       */

      await PasswordResetToken.deleteMany({
        user: user._id,
      });

      console.log(
        "PASSWORD RESET SUCCESS:",
        user.email
      );

      return res.json({
        message:
          "Password reset successfully. You can now log in.",
      });

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      next(error);
    }
  }
);


/* =====================================================
   CURRENT USER
===================================================== */

router.get(
  "/me",
  protect,
  (req, res) => {
    res.json({
      user:
        publicUser(req.user),
    });
  }
);


export default router;