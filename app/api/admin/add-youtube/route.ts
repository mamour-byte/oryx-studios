import { NextResponse } from "next/server";
import { verifyAuth } from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
    }
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

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
    const videoUrl = (formData.get("videoUrl") as string) || "";
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as string) || "";
    const duration = (formData.get("duration") as string) || "";
    const description = (formData.get("description") as string) || "";
    const client = (formData.get("client") as string) || "";
    const year = (formData.get("year") as string) || new Date().getFullYear().toString();
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: "L'URL de la vidéo YouTube est requise." },
        { status: 400 }
      );
    }

    const ytId = getYouTubeId(videoUrl);
    if (!ytId) {
      return NextResponse.json(
        { success: false, error: "URL YouTube invalide. Impossible d'extraire l'identifiant de la vidéo." },
        { status: 400 }
      );
    }

    let uploadSource = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    let uploadOptions: Record<string, any> = {
      folder: "oryx-studios/films",
      public_id: `yt_${ytId}`,
      overwrite: true,
      tags: ["oryx-film"],
      context: {
        title: title || "Sans titre",
        category: category || "Clip musical",
        duration: duration || "",
        description: description || "",
        client: client || "Client",
        year: year || new Date().getFullYear().toString(),
        sourceType: "youtube",
        videoUrl: videoUrl,
      },
    };

    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const thumbResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "oryx-studios/film-thumbnails",
            resource_type: "image",
            tags: ["oryx-film", "oryx-film-thumbnail"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      uploadSource = thumbResult.secure_url;
      uploadOptions.public_id = `yt_${ytId}`;
      uploadOptions.context.thumbnailUrl = thumbResult.secure_url;
    }

    const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);

    return NextResponse.json({
      success: true,
      message: "Vidéo YouTube ajoutée avec succès !",
      publicId: result.public_id,
      url: result.secure_url,
    });
  } catch (error: any) {
    console.error("Add YouTube video error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'ajout de la vidéo YouTube.",
      },
      { status: 500 }
    );
  }
}
