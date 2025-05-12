'use server'
import { scrapeTikTokVideos } from '@/lib/tiktok/tiktok-scraper';

export async function GET(req, { params }) {
  const { username } = await params;

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 });
  }

  const videos = await scrapeTikTokVideos(username);
  return Response.json({ videos });
}
