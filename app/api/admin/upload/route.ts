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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const section = formData.get("section") as string; // 'slider' | 'photo' | 'film'

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    if (!section || !["slider", "photo", "film"].includes(section)) {
      return NextResponse.json(
        { success: false, error: "Section cible invalide." },
        { status: 400 }
      );
    }

    // Validate video format for films
    if (section === "film") {
      const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/x-m4v", "video/mov"];
      if (!allowedVideoTypes.includes(file.type) && !file.type.startsWith("video/")) {
        return NextResponse.json(
          { success: false, error: "Format vidéo non supporté. Utilisez MP4, MOV ou M4V." },
          { status: 400 }
        );
      }
    }

    // Set up metadata (context) and tags
    const tags = [`oryx-${section}`];
    const context: Record<string, string> = {};

    if (section === "slider") {
      context.tag = (formData.get("tag") as string) || "Oryx Studios";
      context.headline = (formData.get("headline") as string) || "";
      context.subline = (formData.get("subline") as string) || "";
      context.detail = (formData.get("detail") as string) || "";
      context.accent = (formData.get("accent") as string) || "#7dd3fc";
    } else if (section === "photo") {
      const albumTitle = (formData.get("albumTitle") as string) || "Album sans titre";
      const cleanId = albumTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      
      context.albumId = (formData.get("albumId") as string) || cleanId || "default-album";
      context.albumTitle = albumTitle;
      context.isCover = (formData.get("isCover") as string) === "true" ? "true" : "false";
    } else if (section === "film") {
      context.title = (formData.get("title") as string) || "Sans titre";
      context.category = (formData.get("category") as string) || "Production";
      context.duration = (formData.get("duration") as string) || "";
      context.description = (formData.get("description") as string) || "";
      context.client = (formData.get("client") as string) || "Client";
      context.year = (formData.get("year") as string) || new Date().getFullYear().toString();
      context.sourceType = "video";
    }

    // Convert file to arrayBuffer and node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `oryx-studios/${section}`,
          resource_type: "auto",
          tags: tags,
          context: context,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: "Média téléversé avec succès !",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'upload.",
      },
      { status: 500 }
    );
  }
}
