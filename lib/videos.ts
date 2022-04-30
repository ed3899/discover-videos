//% data
import videoData from "../data/videos.json";

//% types
import type {VideoT} from "../types/youtube-api";

export const getVideos = (): VideoT[] => {
  const videoArray = videoData.items.map(item => ({
    title: item.snippet.title,
    imgUrl: item.snippet.thumbnails.high.url,
    id: item.id.videoId,
  }));

  return videoArray;
};
