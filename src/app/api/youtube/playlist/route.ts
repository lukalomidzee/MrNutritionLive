import { NextRequest, NextResponse } from "next/server";

type PlaylistItem = {
    videoId: string;
    title: string | null;
    url: string;
    publishedAt: string | null;
    thumbnailUrl: string | null;
};

type JsonObject = Record<string, unknown>;

const decodeXml = (value: string) =>
    value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

const pick = (input: string, regex: RegExp): string | null => {
    const match = input.match(regex);
    return match?.[1] ? decodeXml(match[1].trim()) : null;
};

const parsePlaylistFeed = (xml: string): PlaylistItem[] => {
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    return entries
        .map((match) => {
            const entry = match[0];
            const videoId = pick(entry, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
            const url = pick(entry, /<link[^>]*href="([^"]+)"/);

            if (!videoId || !url) {
                return null;
            }

            return {
                videoId,
                title: pick(entry, /<title>([\s\S]*?)<\/title>/),
                url,
                publishedAt: pick(entry, /<published>([\s\S]*?)<\/published>/),
                thumbnailUrl: pick(entry, /<media:thumbnail[^>]*url="([^"]+)"/),
            };
        })
        .filter((item): item is PlaylistItem => Boolean(item));
};

function isObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getText(value: unknown): string | null {
    if (!value) return null;
    if (typeof value === "string") return value;

    if (isObject(value)) {
        if (typeof value.simpleText === "string") {
            return value.simpleText;
        }

        if (Array.isArray(value.runs)) {
            const text = value.runs
                .map((run) => (isObject(run) && typeof run.text === "string" ? run.text : ""))
                .join("")
                .trim();

            return text || null;
        }
    }

    return null;
}

function collectPlaylistVideoRenderers(node: unknown, acc: JsonObject[] = []): JsonObject[] {
    if (Array.isArray(node)) {
        node.forEach((item) => collectPlaylistVideoRenderers(item, acc));
        return acc;
    }

    if (!isObject(node)) {
        return acc;
    }

    if (isObject(node.playlistVideoRenderer)) {
        acc.push(node.playlistVideoRenderer);
    }

    Object.values(node).forEach((value) => collectPlaylistVideoRenderers(value, acc));
    return acc;
}

function parsePlaylistPage(html: string): PlaylistItem[] {
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!match?.[1]) {
        return [];
    }

    let data: unknown;
    try {
        data = JSON.parse(match[1]);
    } catch {
        return [];
    }

    const renderers = collectPlaylistVideoRenderers(data);
    const seen = new Set<string>();

    return renderers
        .map((renderer) => {
            const videoId = typeof renderer.videoId === "string" ? renderer.videoId : null;
            if (!videoId || seen.has(videoId)) {
                return null;
            }

            seen.add(videoId);

            const nav = isObject(renderer.navigationEndpoint) ? renderer.navigationEndpoint : null;
            const commandMeta = nav && isObject(nav.commandMetadata) ? nav.commandMetadata : null;
            const webMeta = commandMeta && isObject(commandMeta.webCommandMetadata)
                ? commandMeta.webCommandMetadata
                : null;
            const webUrl = webMeta && typeof webMeta.url === "string" ? webMeta.url : null;

            const thumbnail = isObject(renderer.thumbnail) && Array.isArray(renderer.thumbnail.thumbnails)
                ? renderer.thumbnail.thumbnails
                    .map((item) => (isObject(item) && typeof item.url === "string" ? item.url : null))
                    .filter((item): item is string => Boolean(item))
                    .at(-1) ?? null
                : null;

            return {
                videoId,
                title: getText(renderer.title),
                url: webUrl ? `https://www.youtube.com${webUrl}` : `https://www.youtube.com/watch?v=${videoId}`,
                publishedAt: getText(renderer.videoInfo),
                thumbnailUrl: thumbnail,
            };
        })
        .filter((item): item is PlaylistItem => Boolean(item));
}

export async function GET(request: NextRequest) {
    const playlistId = request.nextUrl.searchParams.get("playlistId");

    if (!playlistId) {
        return NextResponse.json({ items: [] }, { status: 200 });
    }

    try {
        const pageRes = await fetch(
            `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`,
            { next: { revalidate: 1800 } }
        );

        if (pageRes.ok) {
            const html = await pageRes.text();
            const items = parsePlaylistPage(html);

            if (items.length > 0) {
                return NextResponse.json({ items });
            }
        }

        const feedRes = await fetch(
            `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`,
            { next: { revalidate: 1800 } }
        );

        if (!feedRes.ok) {
            return NextResponse.json({ items: [] }, { status: 200 });
        }

        const xml = await feedRes.text();
        const items = parsePlaylistFeed(xml);

        return NextResponse.json({ items });
    } catch {
        return NextResponse.json({ items: [] }, { status: 200 });
    }
}
