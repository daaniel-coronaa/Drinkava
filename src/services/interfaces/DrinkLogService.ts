import type { Comment, CreateDrinkLogInput, DrinkLog } from '@/types';

// SEAM: photoUrl is a local file URI in the mock impl. Real impl uploads to Supabase
// Storage and stores the resulting signed URL. This is also where Phase 2 AI photo
// validation (Claude/GPT-4V) would hook in, before or after upload.
export interface DrinkLogService {
  listByParty(partyId: string): Promise<DrinkLog[]>;
  listByUser(userId: string): Promise<DrinkLog[]>;
  create(input: CreateDrinkLogInput): Promise<DrinkLog>;
  addKudos(drinkLogId: string, userId: string): Promise<void>;
  removeKudos(drinkLogId: string, userId: string): Promise<void>;
  listKudos(drinkLogId: string): Promise<string[]>;
  addComment(drinkLogId: string, userId: string, text: string): Promise<Comment>;
  listComments(drinkLogId: string): Promise<Comment[]>;
}
