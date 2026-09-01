"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SashaStoneRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/bandstack/sasha-stone-band"); }, [router]);
  return null;
}
