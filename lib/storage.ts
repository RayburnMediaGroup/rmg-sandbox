import { supabase } from "./supabase";

export async function uploadBandImage(
  slug: string,
  file: File,
  folder: "cover" | "profile" | "photos" | "posters" = "photos"
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}/${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("band-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("band-images").getPublicUrl(path);
  return data.publicUrl;
}
