//% libs
import {v4 as uuid} from "uuid";
import {getWatchedVideos} from "./db/hasura";

//% types
import type {
  VideoT,
  YouTubeAPIResponse,
  YouTubeError,
  YouTubeVideosByID,
} from "../types/youtube-api";

//% data
import hardcodedData from "../data/videos.json";

/**
 * @abstract Gets videos from the YouTube API
 * @requires YOUTUBE_API_KEY on the .env.local(environment variables) file at the root of the project
 * @param searchQuery_ The keyword to use for searching YouTube videos
 * @returns YouTube videos or Mock videos if the request limit has been reached
 */
export const getVideos = async (
  searchQuery_: string
): Promise<
  Omit<VideoT, "description" | "publishedAt" | "channelTitle" | "statistics">[]
> => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
  const encodedQuery = encodeURIComponent(searchQuery_);
  const BASE_URL = "youtube.googleapis.com/youtube/v3";
  const PARAMS = `search?part=snippet&maxResults=25&q=${encodedQuery}`;
  const url = `https://${BASE_URL}/${PARAMS}&key=${YOUTUBE_API_KEY}`;

  const mockData = hardcodedData.items.map(item => ({
    title: item.snippet.title,
    imgUrl: item.snippet.thumbnails.high.url,
    id: item.id.videoId || uuid(),
  }));

  try {
    const response = await fetch(url);

    const data = (await response.json()) as YouTubeAPIResponse | YouTubeError;

    if ((data as YouTubeError).error) {
      console.error(
        `There was an error in the request ${url}`,
        JSON.stringify((data as YouTubeError).error, null, "\t")
      );

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
    return mockData;
  }
};

/**
 * @abstract Gets videos from the YouTube API by id
 * @requires YOUTUBE_API_KEY on the .env.local(environment variables) file at the root of the project
 * @param videoId_
 * @returns Videos from YouTube or Mock data in case request limit has been reached
 */
export const getYouTubeVideosById = async (
  videoId_: string
): Promise<VideoT[]> => {
  const URL = `GET https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId_}&key=${process.env.YOUTUBE_API_KEY}`;

  const mockData = hardcodedData.items.map(item => ({
    title: item.snippet.title,
    imgUrl: item.snippet.thumbnails.high.url,
    id: item.id.videoId || uuid(),
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle,
    statistics: {viewCount: 0},
  }));

  try {
    const response = await fetch(URL);

    const data = (await response.json()) as YouTubeVideosByID | YouTubeError;

    if ((data as YouTubeError).error) {
      console.error(
        `There was an error in the request ${URL}`,
        JSON.stringify((data as YouTubeError).error, null, "\t")
      );

      return mockData;
    } else {
      const videoArray = (data as YouTubeVideosByID).items.map(item => ({
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: item.id.videoId || uuid(),
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: item.statistics
          ? item.statistics.viewCount
          : {viewCount: 0},
      }));

      return videoArray;
    }
  } catch (error) {
    console.error(
      `Something went wrong while fetching ${URL}`,
      JSON.stringify(error, null, "\t")
    );
    return mockData;
  }
};

/**
 * @abstract Wrapper for getting watched videos
 * @augments getWatchedVideos
 * @param token_ The raw JWT Token
 * @param userId_ The issuer from the decoded JWT Token
 * @returns
 */
export const getWatchedItAgainVideos = async (
  token_?: string,
  userId_?: string
) => {
  if (typeof userId_ === "undefined" || userId_ === "") return [];
  if (typeof token_ === "undefined") return [];

  const videos = await getWatchedVideos(token_, userId_);

  if (typeof videos === "undefined") return [];

  const mappedResults = videos.map(v => {
    return {
      id: v.videoId,
      imgUrl: `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`,
    };
  });

  console.log(mappedResults);

  return mappedResults;
};
