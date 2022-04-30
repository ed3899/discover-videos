//% libs
import {v4 as uuid} from "uuid";

//% types
import type {
  VideoT,
  YouTubeAPIResponse,
  YouTubeError,
} from "../types/youtube-api";

//% data
import hardcodedData from "../data/videos.json";

export const getVideos = async (
  searchQuery_: string
): Promise<VideoT[] | []> => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
  const encodedQuery = encodeURIComponent(searchQuery_);
  const BASE_URL = "youtube.googleapis.com/youtube/v3";
  const PARAMS = `search?part=snippet&maxResults=25&q=${encodedQuery}`;
  const url = `https://${BASE_URL}/${PARAMS}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);

    const data = (await response.json()) as YouTubeAPIResponse | YouTubeError;

    if ((data as YouTubeError).error) {
      console.error(
        `There was an error in the request ${url}`,
        JSON.stringify((data as YouTubeError).error, null, "\t")
      );

      const mockData = hardcodedData.items.map(item => ({
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: item.id.videoId || uuid(),
      }));

      return mockData;
    }

    const videoArray = (data as YouTubeAPIResponse).items.map(item => ({
      title: item.snippet.title,
      imgUrl: item.snippet.thumbnails.high.url,
      id: item.id.videoId || uuid(),
    }));

    return videoArray;
  } catch (error) {
    console.error(
      `Something went wrong while fetching ${url}`,
      JSON.stringify(error, null, "\t")
    );
    return [];
  }
};
