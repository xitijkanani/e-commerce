import db from "@/db";
import { userTable } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function checkEmailAvailability(email: string) {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return res.length === 0;
}
