import { z } from "zod";

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

const optionalDate = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.date().optional()
);

const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional()
  );

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Titre requis").max(200),
  description: optionalText(2000),
  dueDate: optionalDate,
  priority: taskPrioritySchema.default("MEDIUM"),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Titre requis").max(200),
  description: optionalText(2000),
  dueDate: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.coerce.date().nullable().optional()
  ),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
});

export const taskIdSchema = z.object({
  id: z.string().min(1, "Identifiant requis"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
