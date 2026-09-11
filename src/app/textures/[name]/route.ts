import { DIRT_TEXTURES, renderDirtSvg, type DirtTextureName } from "@/lib/textures/dirt";

/** Static SVG textures, generated at build time and served as images. */
export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(DIRT_TEXTURES).map((name) => ({ name }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const options = DIRT_TEXTURES[name as DirtTextureName];
  if (!options) return new Response("Not found", { status: 404 });
  const svg = renderDirtSvg({ ...options, idPrefix: name.replace(/\W/g, "") });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
