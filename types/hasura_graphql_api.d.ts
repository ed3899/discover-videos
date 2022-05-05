export type VideoStatsT = {
  favourited: 0 | 1; //?
  id: number;
  userId: string;
  videoId: string;
  watched: boolean;
};

type HasuraDataT = {
  users: unknown[];
  stats: VideoStatsT[];
};

export type HasuraSuccessT = {
  data: Partial<HasuraDataT>;
};

export type HasuraErrorT = {
  errors: unknown[];
};
