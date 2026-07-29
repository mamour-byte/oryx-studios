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
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Une liste d'éléments avec publicId et order est requise." },
        { status: 400 }
      );
    }

    // Update the context order on Cloudinary for each item in parallel
    await Promise.all(
      items.map(async (item: { publicId: string; order: number }) => {
        if (!item.publicId) return;
        return cloudinary.uploader.add_context(`order=${item.order}`, [
          item.publicId,
        ]);
      })
    );

    return NextResponse.json({
      success: true,
      message: "L'ordre a été mis à jour avec succès !",
    });
  } catch (error: any) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de la mise à jour de l'ordre.",
      },
      { status: 500 }
    );
  }
}
