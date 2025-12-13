export function generatePassword(length: number): string {
  var generator = require('generate-password');

  return generator.generate({
    length,
    numbers: true,
  });
}
