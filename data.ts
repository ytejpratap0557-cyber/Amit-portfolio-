import { createClient } from "@supabase/supabase-js";
import type { Video } from "@/data/videos";
const handle = (u?: string | null) => (u ? "@" + u.replace(/\/$/, "").split("@").pop() : "");
const fmt = (n: number | null | undefined) => (n == null ? "" : Number(n).toLocaleString("en-IN"));
export async function getSiteData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return emptyData("Supabase environment variables are missing");
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const [p, v, s, c, m, g, ss] = await Promise.all([
    sb.from("profiles").select("*").limit(1).maybeSingle(),
    sb.from("videos").select("*").order("display_order").order("created_at", { ascending: false }),
    sb.from("social_statistics").select("*").limit(1).maybeSingle(),
    sb.from("collaborations").select("*").order("display_order"),
    sb.from("media_kit").select("*").limit(1).maybeSingle(),
    sb.from("gallery_images").select("*").order("display_order").order("created_at", { ascending: false }),
    sb.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);
  const error = [p, v, s, c, m, g, ss].find(r => r.error)?.error?.message;
  if (error) console.error("Supabase fetch failed:", error);
  const pr: any = p.data ?? {}, st: any = s.data ?? {}, mk: any = m.data ?? {};
  const yt = pr.youtube_url ?? "https://www.youtube.com/@amit_nagvanshi23", ig = pr.instagram_url ?? "https://www.instagram.com/nagvanshiamit23/";
  const site = {
    name: pr.full_name ?? "Amit Nagvanshi", title: pr.profession ?? "Content Creator", location: pr.location ?? "", email: pr.email ?? "",
    portrait: pr.profile_image || "/images/amit.svg", about: String(pr.bio ?? "").split(/\n\s*\n/).filter(Boolean),
    youtube: { url: yt, handle: handle(yt) }, instagram: { url: ig, handle: handle(ig.replace(/\/$/, "").replace(/^(.*\/)/, "https://x/@")) },
    categories: (mk.content_categories ?? []) as string[], pastBrands: (mk.previous_collaborations ?? []) as string[],
    whatsapp: ((ss.data as any)?.whatsapp ?? "") as string, profileVisible: ((ss.data as any)?.profile_visible ?? true) as boolean,
    mediaIntro: (mk.introduction ?? "") as string, pdfUrl: (mk.pdf_url ?? "") as string,
    stats: { youtubeSubscribers: fmt(st.youtube_subscribers), instagramFollowers: fmt(st.instagram_followers), totalViews: fmt(st.total_views), contentPublished: fmt(st.total_videos) },
  };
  const videos: Video[] = (v.data ?? []).map((r: any) => ({ id: r.id, title: r.title, platform: r.platform, url: r.video_url, videoId: r.video_id, thumbnail: r.thumbnail_url ?? undefined, featured: r.is_featured }));
  const services = (c.data ?? []).filter((r: any) => r.is_active).map((r: any) => [r.service_name, r.description ?? "", r.icon ?? "Sparkles"] as const);
  const gallery = (g.data ?? []).map((r: any) => ({ id: r.id as string, url: r.image_url as string, description: (r.description ?? "") as string }));
  return { site, videos, services, gallery, error };
}

function emptyData(error: string) {
  console.error(error);
  const site = { name: "Amit Nagvanshi", title: "Content Creator", location: "Kolkata, West Bengal, India", email: "", portrait: "/images/amit.svg", about: [] as string[],
    youtube: { url: "https://www.youtube.com/@amit_nagvanshi23", handle: "@amit_nagvanshi23" }, instagram: { url: "https://www.instagram.com/nagvanshiamit23/", handle: "@nagvanshiamit23" },
    categories: [] as string[], pastBrands: [] as string[], whatsapp: "", profileVisible: true, mediaIntro: "", pdfUrl: "",
    stats: { youtubeSubscribers: "", instagramFollowers: "", totalViews: "", contentPublished: "" } };
  return { site, videos: [] as Video[], services: [] as (readonly [string, string, string])[], gallery: [] as { id: string; url: string; description: string }[], error };
}
