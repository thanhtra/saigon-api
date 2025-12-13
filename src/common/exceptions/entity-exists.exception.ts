export class EntityExistsException extends Error {
  constructor(message: string) {
    super(message);
  }
}
