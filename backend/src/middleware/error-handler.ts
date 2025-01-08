import { Context, Next } from "hono";
import { ZodError } from "zod";

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return c.json(
        {
          error: "Invalid input",
          details: error.errors,
        },
        400
      );
    }

    return c.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      500
    );
  }
};
