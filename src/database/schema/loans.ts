import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import books from "./books";
import members from "./members";

export default pgTable("loans", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id),
  loanDate: timestamp("loan_date", { withTimezone: true }).notNull().defaultNow(),
  returnDate: timestamp("return_date", { withTimezone: true }),
});

/*

Note the difference in naming conventions:

"bookId" (camelCase) → the TypeScript property name you use in your code.
"book_id" (snake_case) → the actual database column name in Postgres.

Drizzle automatically maps between them, so you work with camelCase in TypeScript while keeping snake_case in the database.

Results in TypeScript will use camelCase: { "id": 1, "bookId": 1, "memberId": 1, "loanDate": "2025-01-01", "returnDate": "2025-01-05" }

*/
