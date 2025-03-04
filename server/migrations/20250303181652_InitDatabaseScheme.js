// Migration file for task management system
exports.up = function (knex) {
  return (
    knex.schema

      // Create users table

      .createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("username").notNullable();
        table.string("email").notNullable().unique();
        table.string("password_hash").notNullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })

      // Create organizations table
      .createTable("organizations", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.uuid("created_by").references("id").inTable("users");
        table.boolean("is_active").defaultTo(true);
      })

      // Create user_roles table
      .createTable("user_roles", (table) => {
        table.string("code").primary().unique();
        table.string("name").notNullable();
      })

      // Create organization_members table
      .createTable("organization_members", (table) => {
        table.uuid("user_id").references("id").inTable("users").notNullable();
        table
          .uuid("organization_id")
          .references("id")
          .inTable("organizations")
          .notNullable();
        table
          .string("role_code")
          .references("code")
          .inTable("user_roles")
          .notNullable();
        table.boolean("is_active").defaultTo(true);
        table.primary(["user_id", "organization_id"]);
      })

      // Create boards table
      .createTable("boards", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table
          .uuid("organization_id")
          .references("id")
          .inTable("organizations")
          .notNullable();
        table.string("title").notNullable();
        table.text("description");
        table.boolean("is_private").defaultTo(false);
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table
          .uuid("created_by")
          .references("id")
          .inTable("users")
          .notNullable();
      })

      // Create board_stages table
      .createTable("board_stages", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.uuid("board_id").references("id").inTable("boards").notNullable();
        table.integer("position").defaultTo(0);
      })

      // Create tags table
      .createTable("tags", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.uuid("board_id").references("id").inTable("boards").notNullable();
      })

      // Create tasks table
      .createTable("tasks", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("title").notNullable();
        table.text("content");
        table.integer("y_position").defaultTo(0);
        table
          .uuid("stage_id")
          .references("id")
          .inTable("board_stages")
          .notNullable();
        table
          .enum("priority_code", ["low", "medium", "high", "urgent"])
          .defaultTo("medium");
        table.uuid("board_id").references("id").inTable("boards").notNullable();
        table.uuid("assigned_to").references("id").inTable("users");
        table
          .uuid("created_by")
          .references("id")
          .inTable("users")
          .notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })

      // Create task_tags junction table
      .createTable("task_tags", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table
          .uuid("task_id")
          .references("id")
          .inTable("tasks")
          .notNullable()
          .onDelete("CASCADE");
        table
          .uuid("tag_id")
          .references("id")
          .inTable("tags")
          .notNullable()
          .onDelete("CASCADE");
        table.unique(["task_id", "tag_id"]);
      })

      // Create task_history table
      .createTable("task_history", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table
          .uuid("task_id")
          .references("id")
          .inTable("tasks")
          .notNullable()
          .onDelete("CASCADE");
        table.uuid("user_id").references("id").inTable("users").notNullable();
        table.timestamp("action_time").defaultTo(knex.fn.now());
        table.text("action").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })

      // Create comments table
      .createTable("comments", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.text("comment").notNullable();
        table
          .uuid("reply_to_comment_id")
          .references("id")
          .inTable("comments")
          .onDelete("SET NULL");
        table
          .uuid("created_by")
          .references("id")
          .inTable("users")
          .notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        // Add an index for performance on comment threads
        table.index("reply_to_comment_id");
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("comments")
    .dropTableIfExists("task_history")
    .dropTableIfExists("task_tags")
    .dropTableIfExists("tasks")
    .dropTableIfExists("tags")
    .dropTableIfExists("board_stages")
    .dropTableIfExists("boards")
    .dropTableIfExists("organization_members")
    .dropTableIfExists("user_roles")
    .dropTableIfExists("organizations")
    .dropTableIfExists("users");
};
