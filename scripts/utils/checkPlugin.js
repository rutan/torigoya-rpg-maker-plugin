export function checkPlugin(obj, errorMessage) {
  if (typeof obj !== 'undefined') return;
  alert(errorMessage);
  throw errorMessage;
}
