import { pgTable, serial, text } from "drizzle-orm/pg-core";

export default pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
});
