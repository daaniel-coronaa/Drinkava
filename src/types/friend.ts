// One row per friendship; it's mutual, so either side may appear as userId.
export type Friendship = {
  userId: string;
  friendId: string;
  createdAt: string;
};
