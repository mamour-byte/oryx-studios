import { NextResponse } from "next/server";
import { getSessionHash } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le mot de passe administrateur n'est pas configuré sur le serveur (ADMIN_PASSWORD manquant).",
        },
        { status: 500 }
      );
    }

    if (password === expectedPassword) {
      const hash = getSessionHash(password);
      const response = NextResponse.json({
        success: true,
        message: "Connexion réussie",
      });

      // Set session cookie
      response.cookies.set("oryx_admin_session", hash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue lors de la tentative de connexion.",
      },
      { status: 500 }
    );
  }
}
