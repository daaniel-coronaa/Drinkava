// Spanish schema reference: kudos(id, drink_log_id, user_id)
export type Kudos = {
  id: string;
  drinkLogId: string; // drink_log_id
  userId: string; // user_id
  createdAt: string;
};

export type Comment = {
  id: string;
  drinkLogId: string;
  userId: string;
  text: string;
  createdAt: string;
};
