import { NextResponse } from "next/server";

type ChannelConfig = {
    key: "mrNutrition" | "nutritionAcademy";
    href: string;
    channelId: string;
};

const CHANNELS: ChannelConfig[] = [
    {
        key: "mrNutrition",
        href: "https://www.youtube.com/@MrNutrition1",
        channelId: "UC1WcJPJzhVntopStLkgivQw",
    },
    {
        key: "nutritionAcademy",
        href: "https://www.youtube.com/@NutritionAcademyofGeorgia",
        channelId: "UCk6tcNCrUJfmv7Et1SkNEgA",
    },
];

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

const parseChannelPage = (html: string) => {
    const avatar =
        pick(html, /<meta property="og:image" content="([^"]+)"/) ??
        pick(html, /"avatar":\{"thumbnails":\[\{"url":"([^"]+)"/);

    const channelName =
        pick(html, /<meta property="og:title" content="([^"]+)"/) ??
        pick(html, /<meta name="title" content="([^"]+)"/);

    return {
        channelAvatar: avatar,
        channelNameFromPage: channelName,
    };
};

const parseFeed = (xml: string) => {
    const channelTitle = pick(xml, /<feed[\s\S]*?<title>([\s\S]*?)<\/title>/);
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[0] ?? "";

    return {
        channelTitle,
        latestVideoTitle: pick(entry, /<title>([\s\S]*?)<\/title>/),
        latestVideoUrl: pick(entry, /<link[^>]*href="([^"]+)"/),
        latestVideoPublished: pick(entry, /<published>([\s\S]*?)<\/published>/),
        latestVideoThumbnail: pick(entry, /<media:thumbnail[^>]*url="([^"]+)"/),
    };
};

export async function GET() {
    try {
        const channels = await Promise.all(
            CHANNELS.map(async (channel) => {
                const res = await fetch(
                    `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`,
                    { next: { revalidate: 1800 } }
                );

                const channelPageRes = await fetch(channel.href, { next: { revalidate: 1800 } });

                if (!res.ok) {
                    return {
                        key: channel.key,
                        href: channel.href,
                        channelTitle: null,
                        channelAvatar: null,
                        latestVideoTitle: null,
                        latestVideoUrl: null,
                        latestVideoPublished: null,
                        latestVideoThumbnail: null,
                    };
                }

                const xml = await res.text();
                const channelPageHtml = channelPageRes.ok ? await channelPageRes.text() : "";
                const pageData = channelPageHtml ? parseChannelPage(channelPageHtml) : { channelAvatar: null, channelNameFromPage: null };
                const feedData = parseFeed(xml);

                return {
                    key: channel.key,
                    href: channel.href,
                    channelAvatar: pageData.channelAvatar,
                    channelTitle: pageData.channelNameFromPage ?? feedData.channelTitle,
                    latestVideoTitle: feedData.latestVideoTitle,
                    latestVideoUrl: feedData.latestVideoUrl,
                    latestVideoPublished: feedData.latestVideoPublished,
                    latestVideoThumbnail: feedData.latestVideoThumbnail,
                };
            })
        );

        return NextResponse.json({ channels });
    } catch {
        return NextResponse.json({ channels: [] }, { status: 200 });
    }
}
