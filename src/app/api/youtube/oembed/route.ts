import { NextRequest, NextResponse } from "next/server";

type OEmbedResponse = {
    title?: string;
    author_name?: string;
    author_url?: string;
    provider_name?: string;
    thumbnail_url?: string;
};

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ message: "Missing url parameter." }, { status: 400 });
    }

    try {
        const target = new URL(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
        );

        const response = await fetch(target, {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Unable to fetch video metadata." },
                { status: response.status }
            );
        }

        const data = (await response.json()) as OEmbedResponse;

        return NextResponse.json({
            title: data.title ?? null,
            authorName: data.author_name ?? null,
            authorUrl: data.author_url ?? null,
            providerName: data.provider_name ?? null,
            thumbnailUrl: data.thumbnail_url ?? null,
        });
    } catch {
        return NextResponse.json(
            { message: "Unable to fetch video metadata." },
            { status: 500 }
        );
    }
}
