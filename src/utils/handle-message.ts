import { Response } from "express";

type itemMessageTypes = {
  message: string;
  path: [string];
};
export const handleMessageResponse = (message: string, res: Response) => {
  let arrMessage = JSON.parse(message);
  arrMessage = arrMessage.map((item: itemMessageTypes) => {
    return { message: item.message, path: item.path[0] };
  });
  return res.status(400).json(arrMessage);
};
