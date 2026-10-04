/**
 * Erreurs applicatives intentionnellement "opaques".
 *
 * Règle : un message destiné au client ne doit jamais révéler l'existence d'une
 * ressource qui appartient à quelqu'un d'autre. `notFoundOrForbidden` couvre les
 * deux cas pour empêcher l'énumération d'ID (oracle d'existence).
 */
export class AccessDeniedError extends Error {
  constructor(message = "Ressource introuvable.") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

/** Message unique pour « absent » et « interdit » : impossible à distinguer. */
export function accessDenied(): AccessDeniedError {
  return new AccessDeniedError("Ressource introuvable.");
}