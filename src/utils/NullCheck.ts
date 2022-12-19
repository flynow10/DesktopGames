export default function ensure<T>(
  argument: T | undefined | null,
  message: string = "Value does not exist!"
): T {
  if (argument === undefined || argument === null) {
    throw new Error(message);
  }
  return argument;
}
