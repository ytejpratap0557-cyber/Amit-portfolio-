"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sections, statuses } from "@/lib/admin-config";
const limits: Record<string, { max: number; types: string[] }> = {
  "profile-images": { max: 5e6, types: ["image/jpeg", "image/png", "image/webp"] },
  "video-thumbnails": { max: 5e6, types: ["image/jpeg", "image/png", "image/webp"] },
  "gallery-images": { max: 5e6, types: ["image/jpeg", "image/png", "image/webp"] },
  "media-kit": { max: 10e6, types: ["application/pdf"] },
};
async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) redirect("/admin/login?error=not-admin");
  return sb;
}
async function upload(sb: Awaited<ReturnType<typeof createClient>>, bucket: string, file: File) {
  const rule = limits[bucket];
  if (!rule || !rule.types.includes(file.type)) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > rule.max) throw new Error(`File too large (max ${rule.max / 1e6} MB)`);
  const path = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
const done = (section: string, err?: string): never => {
  revalidatePath("/"); revalidatePath("/admin/" + section);
  redirect(`/admin/${section}?${err ? "error=" + encodeURIComponent(err) : "saved=1"}`);
};
export async function saveRow(section: string, fd: FormData) {
  const sb = await requireAdmin(); const cfg = sections[section]; if (!cfg || cfg.readonly) return done("", "Unknown section");
  let err = "";
  try {
    const row: Record<string, unknown> = {};
    for (const f of cfg.fields) {
      const v = fd.get(f.name);
      if (f.type === "checkbox") row[f.name] = v === "on";
      else if (f.type === "file") { const file = fd.get("file__" + f.name) as File | null; row[f.name] = file && file.size > 0 ? await upload(sb, f.bucket!, file) : String(v || "") || null; }
      else if (f.type === "number") row[f.name] = v === "" || v == null ? (f.nullable ? null : 0) : Number(v);
      else if (f.type === "array") row[f.name] = String(v || "").split(",").map(s => s.trim()).filter(Boolean);
      else if (f.type === "json") row[f.name] = v ? JSON.parse(String(v)) : {};
      else row[f.name] = String(v ?? "").trim() || null;
    }
    const id = fd.get("id") as string | null;
    const { error } = id ? await sb.from(cfg.table).update(row).eq("id", id) : await sb.from(cfg.table).insert(row);
    if (error) err = error.message;
  } catch (e) { err = e instanceof Error ? e.message : "Save failed"; }
  done(section, err);
}
export async function deleteRow(section: string, id: string) {
  const sb = await requireAdmin(); const cfg = sections[section];
  if (!cfg || cfg.single) return done(section, "This record can't be deleted");
  const { error } = await sb.from(cfg.table).delete().eq("id", id);
  done(section, error?.message);
}
export async function setEnquiryStatus(id: string, fd: FormData) {
  const sb = await requireAdmin(); const status = String(fd.get("status"));
  if (!statuses.includes(status)) return done("enquiries", "Invalid status");
  const { error } = await sb.from("enquiries").update({ status }).eq("id", id);
  done("enquiries", error?.message);
}
export async function signOut() { const sb = await createClient(); await sb.auth.signOut(); redirect("/admin/login"); }
export async function uploadGallery(fd: FormData) {
  const sb = await requireAdmin(); let err = "";
  try {
    const files = (fd.getAll("files") as File[]).filter(f => f.size > 0);
    if (!files.length) throw new Error("Choose at least one image");
    if (files.length > 20) throw new Error("Max 20 images at a time");
    for (const f of files) { const { error } = await sb.from("gallery_images").insert({ image_url: await upload(sb, "gallery-images", f) }); if (error) throw new Error(error.message); }
  } catch (e) { err = e instanceof Error ? e.message : "Upload failed"; }
  done("gallery", err);
}
