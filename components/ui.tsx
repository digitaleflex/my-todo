import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Concatène des classes Tailwind en ignorant les valeurs vides. */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Assemble un attribut aria-describedby à partir d'ids optionnels. */
function joinIds(...ids: Array<string | undefined>): string | undefined {
  const value = ids.filter((id): id is string => Boolean(id)).join(" ");
  return value.length > 0 ? value : undefined;
}

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-zinc-200 focus-visible:ring-zinc-400",
  secondary:
    "border border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 focus-visible:ring-white/70",
  ghost:
    "border border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white focus-visible:ring-white/70",
  danger:
    "border border-zinc-800 bg-zinc-900 text-red-400 hover:bg-zinc-800 focus-visible:ring-red-400",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Bouton d'action : `variant` (primary/secondary/ghost/danger), `size` (sm/md), `type` par défaut "button". */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Champs de formulaire : label visible + aide + erreur reliés en aria          */
/* -------------------------------------------------------------------------- */

export type ControlSize = "md" | "lg";

const controlSizes: Record<ControlSize, string> = {
  md: "p-3 text-sm",
  lg: "p-3.5 text-base",
};

/** Classes communes aux contrôles : surface sombre, anneau focus-visible, état désactivé. */
function controlClass(size: ControlSize, invalid: boolean): string {
  return cx(
    "block min-w-0 rounded-xl border bg-zinc-950 text-zinc-100 placeholder:text-zinc-500",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:cursor-not-allowed disabled:opacity-60",
    invalid ? "border-red-400" : "border-zinc-800",
    controlSizes[size],
  );
}

/** Dérive les ids du contrôle (label, aide, erreur) à partir de `id` ou `name`. */
function controlIds(
  id: string | undefined,
  name: string | undefined,
): { controlId: string | undefined; hintId: string | undefined; errorId: string | undefined } {
  const controlId = id ?? name;
  return {
    controlId,
    hintId: controlId ? `${controlId}-hint` : undefined,
    errorId: controlId ? `${controlId}-error` : undefined,
  };
}

interface FieldShellProps {
  label: ReactNode;
  required: boolean | undefined;
  hint: string | undefined;
  error: string | undefined;
  controlId: string | undefined;
  hintId: string | undefined;
  errorId: string | undefined;
}

/** Enveloppe interne : label visible pointant sur le contrôle, aide et erreur.` */
function FieldShell({
  label,
  required,
  hint,
  error,
  controlId,
  hintId,
  errorId,
  children,
}: FieldShellProps & { children: ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      <label htmlFor={controlId} className="text-sm font-medium text-zinc-300">
        {label}
        {required ? (
          <span className="text-red-400" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label: ReactNode;
  hint?: string;
  error?: string;
  size?: ControlSize;
  fullWidth?: boolean;
}

/** Champ texte avec label visible : `label`, `hint`, `error`, `size` (md/lg), pleine largeur par défaut. */
export function Input({
  label,
  hint,
  error,
  size = "md",
  fullWidth = true,
  className,
  id,
  name,
  required,
  ...props
}: InputProps) {
  const { controlId, hintId, errorId } = controlIds(id, name);
  return (
    <FieldShell
      label={label}
      required={required}
      hint={hint}
      error={error}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <input
        id={controlId}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={joinIds(hint ? hintId : undefined, error ? errorId : undefined)}
        className={cx(controlClass(size, Boolean(error)), fullWidth ? "w-full" : "w-auto", className)}
        {...props}
      />
    </FieldShell>
  );
}

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label: ReactNode;
  hint?: string;
  error?: string;
  size?: ControlSize;
  fullWidth?: boolean;
  rows?: number;
}

/** Zone de texte multi-lignes, mêmes conventions que `Input`, avec `rows`. */
export function Textarea({
  label,
  hint,
  error,
  size = "md",
  fullWidth = true,
  rows = 3,
  className,
  id,
  name,
  required,
  ...props
}: TextareaProps) {
  const { controlId, hintId, errorId } = controlIds(id, name);
  return (
    <FieldShell
      label={label}
      required={required}
      hint={hint}
      error={error}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <textarea
        id={controlId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={joinIds(hint ? hintId : undefined, error ? errorId : undefined)}
        className={cx(
          controlClass(size, Boolean(error)),
          "resize-y",
          fullWidth ? "w-full" : "w-auto",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  label: ReactNode;
  options: SelectOption[];
  hint?: string;
  error?: string;
  size?: ControlSize;
  fullWidth?: boolean;
}

/** Liste déroulante étiquetée : mêmes conventions que `Input`, alimentée par `options`. */
export function Select({
  label,
  options,
  hint,
  error,
  size = "md",
  fullWidth = true,
  className,
  id,
  name,
  required,
  ...props
}: SelectProps) {
  const { controlId, hintId, errorId } = controlIds(id, name);
  return (
    <FieldShell
      label={label}
      required={required}
      hint={hint}
      error={error}
      controlId={controlId}
      hintId={hintId}
      errorId={errorId}
    >
      <select
        id={controlId}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={joinIds(hint ? hintId : undefined, error ? errorId : undefined)}
        className={cx(controlClass(size, Boolean(error)), fullWidth ? "w-full" : "w-auto", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  as?: "div" | "section";
  padded?: boolean;
}

/** Surface bordée `bg-zinc-950`, rendue en `div` (ou `section` via `as`). */
export function Card({ as: Tag = "div", padded = true, className, ...props }: CardProps) {
  return (
    <Tag
      className={cx("rounded-2xl border border-zinc-800 bg-zinc-950", padded && "p-5", className)}
      {...props}
    />
  );
}

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "border-zinc-800 bg-zinc-900 text-zinc-400",
  success: "border-emerald-900 bg-emerald-950 text-emerald-300",
  warning: "border-amber-900 bg-amber-950 text-amber-300",
  danger: "border-red-900 bg-red-950 text-red-300",
};

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
}

/** Petite étiquette de statut colorée par `tone`. */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}
