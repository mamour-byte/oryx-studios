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
    const { photoUrl, albumId } = await request.json();

    if (!photoUrl || !albumId) {
      return NextResponse.json(
        { success: false, error: "L'URL de la photo et l'identifiant de l'album sont requis." },
        { status: 400 }
      );
    }

    // 2. Fetch all resources in the album
    const searchResult = await cloudinary.search
      .expression(`tags:oryx-photo`)
      .with_field("context")
      .max_results(200)
      .execute();

    const resources = searchResult.resources || [];
    const albumResources = resources.filter(
      (item: any) => item.context?.albumId === albumId
    );

    if (albumResources.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucune photo trouvée pour cet album." },
        { status: 404 }
      );
    }

    // 3. Update context for each resource in the album
    for (const item of albumResources) {
      const isTarget = item.secure_url === photoUrl;
      
      // Update metadata on Cloudinary
      await cloudinary.uploader.add_context(
        `isCover=${isTarget ? "true" : "false"}`,
        [item.public_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image de couverture mise à jour avec succès !",
    });
  } catch (error: any) {
    console.error("Set cover error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de la mise à jour de la couverture.",
      },
      { status: 500 }
    );
  }
}
