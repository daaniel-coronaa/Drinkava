import { nanoid, customAlphabet } from 'nanoid/non-secure';

export const generateId = () => nanoid();

const inviteAlphabet = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);
export const generateInviteCode = () => inviteAlphabet();
