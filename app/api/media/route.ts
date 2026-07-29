import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export const dynamic = "force-dynamic";

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    // Search for all resources with our app's specific tags
    const result = await cloudinary.search
      .expression("tags:oryx-slider OR tags:oryx-photo OR tags:oryx-film")
      .with_field("context")
      .with_field("tags")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    const resources = result.resources || [];

    const slider: any[] = [];
    const films: any[] = [];
    const albumsMap: Record<string, {
      id: string;
      title: string;
      cover: string;
      photos: string[];
      order?: number;
      createdAt: string;
    }> = {};

    resources.forEach((item: any) => {
      const context = item.context || {};
      const tags = item.tags || [];

      // 1. Process Hero Slider
      if (tags.includes("oryx-slider")) {
        slider.push({
          id: item.public_id,
          type: item.resource_type === "video" ? "video" : "image",
          image: item.resource_type === "image" ? item.secure_url : undefined,
          video: item.resource_type === "video" ? item.secure_url : undefined,
          tag: context.tag || "Oryx Studios",
          headline: context.headline || "",
          subline: context.subline || "",
          detail: context.detail || "",
          accent: context.accent || "#7dd3fc",
          order: context.order !== undefined ? Number(context.order) : undefined,
          createdAt: item.created_at,
        });
      }

      // 2. Process Films
      if (tags.includes("oryx-film")) {
        const sourceType = context.sourceType || (item.resource_type === "video" ? "video" : "youtube");
        const videoUrl = context.videoUrl || item.secure_url;
        
        let thumbnail = item.secure_url;
        if (sourceType === "youtube") {
          const ytId = getYouTubeId(videoUrl);
          thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        } else if (item.resource_type === "video") {
          // Replace video extension with .jpg to get a poster image from Cloudinary
          thumbnail = item.secure_url.replace(/\.[^/.]+$/, ".jpg");
        }

        films.push({
          id: item.public_id,
          title: context.title || "Sans titre",
          category: context.category || "Production",
          duration: context.duration || "",
          thumbnail,
          videoUrl,
          sourceType,
          description: context.description || "",
          client: context.client || "Client",
          year: context.year || new Date().getFullYear().toString(),
          order: context.order !== undefined ? Number(context.order) : undefined,
          createdAt: item.created_at,
        });
      }

      // 3. Process Album Photos
      if (tags.includes("oryx-photo")) {
        const albumId = context.albumId || "default-album";
        const albumTitle = context.albumTitle || "Album sans titre";
        const isCover = context.isCover === "true" || context.isCover === true;
        const photoUrl = item.secure_url;

        if (!albumsMap[albumId]) {
          albumsMap[albumId] = {
            id: albumId,
            title: albumTitle,
            cover: photoUrl,
            photos: [],
            order: context.order !== undefined ? Number(context.order) : undefined,
            createdAt: item.created_at,
          };
        }

        // Add to photo list if not already there
        if (!albumsMap[albumId].photos.includes(photoUrl)) {
          albumsMap[albumId].photos.push(photoUrl);
        }

        // If explicitly marked as cover, set it
        if (isCover) {
          albumsMap[albumId].cover = photoUrl;
        }
      }
    });

    // Sort by explicit 'order' field first (if set via admin reorder), then by created_at as fallback
    const sortByOrder = (a: any, b: any) => {
      const aOrder = a.order !== undefined ? Number(a.order) : Infinity;
      const bOrder = b.order !== undefined ? Number(b.order) : Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    };

    slider.sort(sortByOrder);
    films.sort(sortByOrder);
    const albums = Object.values(albumsMap).sort(sortByOrder);

    return NextResponse.json({
      success: true,
      slider,
      films,
      albums,
    });
  } catch (error: any) {
    console.error("Error fetching media from Cloudinary:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch media",
        slider: [],
        films: [],
        albums: [],
      },
      { status: 500 }
    );
  }
}
