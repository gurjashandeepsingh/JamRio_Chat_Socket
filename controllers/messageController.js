import { messageModel } from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";

//@description     Get all Messages
//@route           GET /api/messages/:chatId
//@access          Protected
export const allMessages = async (request, response) => {
    const {chatid} = request.params;
  try {
    const allMessages = await messageModel.findAll({ chatId: chatid });
    res.status(200).json(allMessages);
  } catch (error) {
    res.status(400).send(`Can't fetch all messages`, error);
  };
};


//@description     Create New Message
//@route           POST /api/messages/
//@access          Protected
export const sendMessage = async (request, response) => {
  const { content, chatid } = req.body;
  if (!content || !chatid) {
    console.log("Invalid data passed into request");
    return res.status(400).send(`Please fill all fields`);
    }
  var newMessage = {
    sender: request.userid,
    content: content,
    chat: chatid,
  };
  try {
    var message = await messageModel.create(newMessage);                                 
    await chatModel.update(
        { where: { id: chatid } },
        { latestMessage: message }
      );
    response.status(200).send(message);
  } catch (error) {
    res.status(400).send(`Can't create message`, error);
  };
};

