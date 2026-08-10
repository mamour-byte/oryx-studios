import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export const dynamic = "force-dynamic";

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    return parsed.searchParams.get("v") || "";
  } catch { return ""; }
}

// Inject Cloudinary transformations into a secure_url
function optimizeUrl(url: string, width: number, quality = 75): string {
  // Insert transformation before /upload/
  return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto,c_fill/`);
}

function blurUrl(url: string): string {
  return url.replace("/upload/", "/upload/w_20,q_30,f_auto,e_blur:200/");
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
      blur: string;
      photos: string[];
      order?: number;
      createdAt: string;
    }> = {};

    resources.forEach((item: any) => {
      const context = item.context || {};
      const tags = item.tags || [];

      // 1. Process Hero Slider
      if (tags.includes("oryx-slider")) {
        const imgUrl = item.resource_type === "image" ? item.secure_url : undefined;
        slider.push({
          id: item.public_id,
          type: item.resource_type === "video" ? "video" : "image",
          image: imgUrl ? optimizeUrl(imgUrl, 1920, 80) : undefined,
          blur: imgUrl ? blurUrl(imgUrl) : undefined,
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
        
        const thumbUrl = (() => {
          if (context.thumbnailUrl) {
            return context.thumbnailUrl;
          }

          if (sourceType === "youtube") {
            if (item.resource_type === "image") {
              return item.secure_url;
            }
            const ytId = getYouTubeId(videoUrl);
            return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          }

          if (item.resource_type === "image") {
            return item.secure_url;
          }

          if (item.resource_type === "video") {
            return item.secure_url.replace(/\.[^/.]+$/, ".jpg");
          }

          return item.secure_url;
        })();

        films.push({
          id: item.public_id,
          title: context.title || "Sans titre",
          category: context.category || "Production",
          duration: context.duration || "",
          thumbnail: optimizeUrl(thumbUrl, 600),
          blur: blurUrl(thumbUrl),
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
        const optimizedPhoto = optimizeUrl(photoUrl, 800);
        const coverUrl = optimizeUrl(photoUrl, 600);

        if (!albumsMap[albumId]) {
          albumsMap[albumId] = {
            id: albumId,
            title: albumTitle,
            cover: coverUrl,
            blur: blurUrl(photoUrl),
            photos: [],
            order: context.order !== undefined ? Number(context.order) : undefined,
            createdAt: item.created_at,
          };
        }

        if (!albumsMap[albumId].photos.includes(optimizedPhoto)) {
          albumsMap[albumId].photos.push(optimizedPhoto);
        }

        if (isCover) {
          albumsMap[albumId].cover = coverUrl;
          albumsMap[albumId].blur = blurUrl(photoUrl);
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
