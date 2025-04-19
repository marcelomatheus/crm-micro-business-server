export const handleMessageZod = (message: string) => {
  const arrMessage = JSON.parse(message);
  return arrMessage[0].message;
};
