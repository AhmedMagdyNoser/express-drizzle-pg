import { pgTable, serial, text } from "drizzle-orm/pg-core";

export default pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});
