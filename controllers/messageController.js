import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";
import chatMemberModel from "../models/chatMember.js";

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


//@description     Create New Messageu
//@route           POST /api/messages/
//@access          Protected
// export const sendMessage = async (request, response) => {
//   const { content, chatid } = request.body;
//   if (!content || !chatid) {
//     console.log("Invalid data passed into request");
//     return response.status(400).send(`Please fill all fields`);
//     }
//   var newMessage = {
//     sender: request.userid,
    
//     content: content,
//     chat: chatid,
//   };
//   try {
//     var message = await messageModel.create(newMessage);                                 
//     await chatModel.update(
//         { where: { id: chatid } },
//         { latestMessage: message }
//       );
//     response.status(200).send(message);
//   } catch (error) {
//     response.status(400).send(error.message);
//   };
// };


// sender, receiver, content, contentType, chatid

//@description     Create New Message
//@route           POST /api/messages/
//@access          Protected
export const sendMessage = async(request, response) => {
  try {
    const {chatid, content, contentType, sender} = request.body;
    if(!chatid){
      throw new Error(`Please select a chat`);
    };
    if(!content){
      throw new Error(`Please enter some content`);
    };
    // const userFetch = await chatMemberModel.findAll({where: {userId: sender AND userId:receiver}})
    // const chatExists = await chatModel.findOne({where: })
    const newMessage = {
      sender: sender,
      content: content,
      contentType: contentType,
      chatId: chatid
    }
    console.log(newMessage)
    var message = await messageModel.create(newMessage);
    await chatModel.update({latestMessage: message.content},{where: {id: chatid}});
    return response.status(200).send(message);
  } catch (error) {
    console.log(error)
    return response.status(400).send(error.message);
  };
};