export function sendInAppNotification(message: string) {
  return {
    delivered: true,
    message,
  };
}
