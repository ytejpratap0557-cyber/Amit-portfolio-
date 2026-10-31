export type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "checkbox" | "select" | "file" | "array" | "json"; options?: string[]; bucket?: string; nullable?: boolean };
export type Section = { title: string; table: string; single?: boolean; readonly?: boolean; fields: Field[]; label?: string };
export const sections: Record<string, Section> = {
  profile: { title: "Manage Profile", table: "profiles", single: true, fields: [
    { name: "full_name", label: "Full name" }, { name: "profession", label: "Profession" }, { name: "bio", label: "Bio (blank line = new paragraph)", type: "textarea" },
    { name: "profile_image", label: "Profile photo (JPG/PNG/WebP, max 5 MB)", type: "file", bucket: "profile-images" }, { name: "location", label: "Location" },
    { name: "email", label: "Public email" }, { name: "phone", label: "Phone" }, { name: "youtube_url", label: "YouTube URL" }, { name: "instagram_url", label: "Instagram URL" }] },
  videos: { title: "Manage Videos", table: "videos", label: "title", fields: [
    { name: "title", label: "Title" }, { name: "description", label: "Description", type: "textarea" },
    { name: "platform", label: "Platform", type: "select", options: ["youtube", "instagram"] }, { name: "video_url", label: "Video URL (https://…)" },
    { name: "video_id", label: "Video ID (YouTube: after v=, Instagram: code after /reel/)" },
    { name: "thumbnail_url", label: "Thumbnail (optional for YouTube)", type: "file", bucket: "video-thumbnails" }, { name: "category", label: "Category" },
    { name: "is_featured", label: "Featured", type: "checkbox" }, { name: "is_published", label: "Published", type: "checkbox" }, { name: "display_order", label: "Display order (low = first)", type: "number" }] },
  stats: { title: "Social Statistics", table: "social_statistics", single: true, fields: [
    { name: "youtube_subscribers", label: "YouTube subscribers", type: "number", nullable: true }, { name: "instagram_followers", label: "Instagram followers", type: "number", nullable: true },
    { name: "total_views", label: "Total views", type: "number", nullable: true }, { name: "total_videos", label: "Total content published", type: "number", nullable: true }] },
  collaborations: { title: "Collaborations", table: "collaborations", label: "service_name", fields: [
    { name: "service_name", label: "Service name" }, { name: "description", label: "Description", type: "textarea" }, { name: "icon", label: "Icon (Lucide name, e.g. Rocket)" },
    { name: "is_active", label: "Active", type: "checkbox" }, { name: "display_order", label: "Display order", type: "number" }] },
  "media-kit": { title: "Media Kit", table: "media_kit", single: true, fields: [
    { name: "introduction", label: "Introduction", type: "textarea" }, { name: "content_categories", label: "Content categories (comma separated)", type: "array" },
    { name: "audience_demographics", label: "Audience demographics (JSON, only verified data)", type: "json" }, { name: "previous_collaborations", label: "Previous collaborations (comma separated, verified only)", type: "array" },
    { name: "pdf_url", label: "Media kit PDF (max 10 MB)", type: "file", bucket: "media-kit" }] },
  gallery: { title: "Gallery", table: "gallery_images", label: "description", fields: [
    { name: "image_url", label: "Image (JPG/PNG/WebP, max 5 MB)", type: "file", bucket: "gallery-images" }, { name: "description", label: "Description" }, { name: "display_order", label: "Display order", type: "number" }] },
  settings: { title: "Settings", table: "site_settings", single: true, fields: [
    { name: "site_title", label: "Website title" }, { name: "meta_description", label: "Meta description", type: "textarea" }, { name: "contact_email", label: "Contact email" },
    { name: "whatsapp", label: "WhatsApp number (digits, with country code e.g. 919876543210)" }, { name: "profile_visible", label: "Show About section on website", type: "checkbox" }] },
  enquiries: { title: "Enquiries", table: "enquiries", readonly: true, fields: [] },
};
export const statuses = ["new", "contacted", "in_progress", "completed", "rejected"];
export const nav = [["dashboard", "Overview"], ["profile", "Profile"], ["videos", "Videos"], ["stats", "Statistics"], ["collaborations", "Collaborations"], ["media-kit", "Media Kit"], ["gallery", "Gallery"], ["enquiries", "Enquiries"], ["settings", "Settings"]];
