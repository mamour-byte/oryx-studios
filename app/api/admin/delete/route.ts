import { NextResponse } from "next/server";
import { verifyAuth } from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";

export async function POST(request: Request) {
  // 1. Verify Authentication
  const isAuth = await verifyAuth();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const { publicId, resourceType } = await request.json();
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "L'identifiant public (publicId) est requis." },
        { status: 400 }
      );
    }

    // Default to 'image' if not specified, but for videos/films it must be 'video'
    const type = resourceType || "image";
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });

    if (result.result === "ok" || result.result === "not_found") {
      return NextResponse.json({
        success: true,
        message: "Média supprimé avec succès !",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Impossible de supprimer le média : ${result.result}`,
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de la suppression.",
      },
      { status: 500 }
    );
  }
}
