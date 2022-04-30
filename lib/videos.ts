//% libs
import {v4 as uuid} from "uuid";
//% types
import type {VideoT, YouTubeAPIResponse} from "../types/youtube-api";

export const getVideos = async (searchQuery_: string): Promise<VideoT[]> => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
  const encodedQuery = encodeURIComponent(searchQuery_);

  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodedQuery}&key=${YOUTUBE_API_KEY}`
  );

  const data = (await response.json()) as YouTubeAPIResponse;

  const videoArray = data.items.map(item => ({
    title: item.snippet.title,
    imgUrl: item.snippet.thumbnails.high.url,
    id: item.id.videoId || uuid(),
  }));

  return videoArray;
};
