import { accounts } from "./accounts";
import { chapters, novels } from "./novel";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

export * from "./accounts";
export * from "./novel";
export * from "./sessions";
export * from "./users";
export * from "./verifications";

export const schema = {
  users,
  accounts,
  sessions,
  verifications,
  novels,
  chapters,
};
