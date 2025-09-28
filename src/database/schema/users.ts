import { pgTable, serial, varchar, integer, boolean } from "drizzle-orm/pg-core";

export default pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

/*

Note the difference in naming conventions:

"isAdmin" (camelCase) → the TypeScript property name you use in your code.
"is_admin" (snake_case) → the actual database column name in Postgres.

Drizzle automatically maps between them, so you work with camelCase in TypeScript while keeping snake_case in the database.

Results in TypeScript will use camelCase: { "id": 1, "name": "Ahmed", "age": 30, "isAdmin": false }

*/
