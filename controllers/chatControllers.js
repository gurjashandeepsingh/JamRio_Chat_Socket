import {
    request
} from "express";
import chatMemberModel from "../models/chatMember.js";
import chatMemberGroupModel from "../models/chatMemebersGroup.js";
import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import {
    Error
} from "sequelize";


/**
 * Access whole User to User chat. 
 * It checks if the chat exists and retrieves all the messages associated with the chat. 
 * If the chat exists, it sends the messages and chat details as a response. 
 * If the chat does not exist, it creates a new chat object.
 * @param {Object} request - The request object containing the chat ID in the request body.
 * @param {Object} response - The response object to send the messages and chat details
 * @returns {Array|Object} - If the chat exists, an array of messages and the chat details are sent as a response. 
 *                           If the chat does not exist, a new chat object is created.
 * @routes - Route = POST /api/chat/
 * @throws {Error} - If there is an error while fetching the chat.
 */
export const accessChat = async (request, response) => {
    try {
        const {
            chatid
        } = request.body;
        const chatExists = await chatModel.findOne({
            where: {
                id: chatid
            }
        });
        // if(chatExists){
        //     const userFetch = await chatMemberModel.findAll({where: {chatId: chatid}});
        //     if(userFetch){
        //         await chatModel.update({isGroupChat: false}, {where: {id: chatid}});
        //     };
        // };
        if (chatExists) {
            let messagesExists = await messageModel.findAll({
                where: {
                    chatId: chatExists.id
                }
            });
            var allMessages = await messagesExists.map((u) => {
                return {
                    sender: u.sender,
                    // receiver: u.receiver,
                    content: u.content,
                    contentType: u.contentType,
                    id: u.id,
                }
            });
            return response.status(200).send({
                
                chatExists
            });
        } if(!chatExists) {
            var newChatObject = await chatModel.create({
                chatName: "receiver",
                isGroupChat: false
            });
            return response.status(200).send({
                newChatObject
            });
        };
    } catch (error) {
        return response.status(400).send(`Error while fetching Chat`, error);
    };
};




/**
 * Fetch all Chats i.e Inbox.
 * @param {Object} request - The request object containing the user ID.
 * @param {Object} response - The response object to send the fetched chats.
 * @returns {Object} - The fetched individual and group chats.
 * @routes - //       GET /api/chat/
 * @throws {Error} - If there is an error while fetching chats.
 */
export const fetchChat = async (request, response) => {
    try {
        const {
            userid
        } = request.body;
        if (!userid) {
            response.status(400).send(`Please Log in`);
        };
        const user = await userModel.findOne({
            where: {
                id: userid
            }
        });
        if (!user) throw new Error('User does not exist');
        const individualChats = await chatMemberModel.findAll({
            where: {
                userId: userid
            }
        });
        const groupChats = await chatMemberGroupModel.findAll({
            where: {
                userId: userid
            }
        });
        return response.status(200).send({
            individualChats,
            groupChats
        });

        // const indivudualChatIds = await individualChats.map((u) => {
        //         return u.chatId;
        // });
        // const groupChatIds = await groupChats.map((i) => {
        //         return i.chatId;
        // });
        // const fetchIndividualChats = await chatModel.findAll({where: {id: indivudualChatIds}});
        // const fetchGroupChats = await chatModel.findAll({where: {id: groupChatIds}});
        // return response.status(200).send({fetchIndividualChats, fetchGroupChats});
    } catch (error) {
        console.log(error.message)
        return response.status(400).send(`Error while fetching Chats`);
    };
};

/**
 * 
 * 
 */

/**
 * Create a group chat.
 * @param {Object} request - The request object containing the request data.
 * @param {Object} response - The response object used to send the response back to the client.
 * @route - POST /api/chat/group
 * @returns {Object} The created chat entry with properties: chatName, isGroupChat, groupAdmin, displayPicture, id.
 */
export const createGroup = async (request, response) => {
    try {
        const {
            users,
            name
        } = request.body;
        if (!users) {
            throw new Error(`Please add Users to the Group`);
        };
        if (!name) {
            throw new Error(`Please mention the name of the group`);
        };
        if (users.length < 2) {
            throw new Error(`Please add more users to the group`);
        };
        // users.push(request.user.id);
        const chat = {
            chatName: name,
            isGroupChat: true,
            groupAdmin: users[0],
            displayPicture: null
        }
        console.log(chat)
        const groupChat = await chatModel.create(chat);
        const chatMemberGroupArr = []
        for (const user of users) {
            chatMemberGroupArr.push({
                chatId: groupChat.id,
                userId: user
            })
        }
        console.log(chatMemberGroupArr)
        await chatMemberGroupModel.bulkCreate(chatMemberGroupArr);
        const fetchChat = await chatModel.findOne({
            where: {
                id: groupChat.id
            }
        });
        response.status(200).send(fetchChat);
    } catch (error) {
        console.log(error)
        response.status(400).send(`Error while creating Group Chat`, error);
    }
};

/**
 * Deletes a group chat.
 * @param {object} request - The request object containing the chat ID to be deleted.
 * @param {object} response - The response object used to send the result of the deletion.
 * @returns {object} - If the deletion is successful, the function sends a response with status code 200 and the message "GroupChat Deleted".
 *                    If the deletion fails, the function throws an error with the message "Unable to delete Group".
 *                    If the group chat doesn't exist, the function throws an error with the message "Group doesn't exist".
 */
export const deleteGroup = async (request, response) => {
    try {
        const {
            chatid
        } = request.body;
        const groupExists = await chatModel.findOne({
            id: chatid
        });
        if (groupExists) {
            const deleteGroupChat = await chatMemberGroupModel.destroy({
                where: {
                    chatId: chatid
                }
            });
            if (deleteGroupChat) {
                response.status(200).send(`GroupChat Deleted`);
            } else {
                throw new Error(`Unable to delete Group `);
            }
        } else {
            throw new Error(`Group doesn't exist`);
        }
    } catch (error) {
        return response.status(400).send(error);
    };
};


/**
 * Rename a group chat.
 * @param {Object} request - The request object containing the group name to be updated.
 * @param {Object} response - The response object used to send the updated group information or error message.
 * @route - PUT /api/chat/rename
 * @returns {Object} - The updated group information or a "Bad Request" error message.
 */
export const renameGroup = async (request, response) => {
    try {
        const {
            chatid,
            groupName
        } = request.body;
        const groupChatFetch = await chatModel.findOne({
            id: chatid
        });
        const updatedGroup = await groupChatFetch.update({
            chatName: groupName
        });
        if (!updatedGroup) {
            throw new Error(`Bad Request`);
        } else {
            return response.status(200).send(groupChatFetch);
        }
    } catch (error) {
        return response.status(400);
        response.send(`Something went wrong`);
    };
};


/**
 * Adds a user to a group chat.
 * @param {object} request - The request object containing the chat ID and user ID in the `body` property.
 * @param {object} response - The response object used to send the HTTP response.
 * @returns {object} - Returns a 200 status code with the added entry as the response if successful. Returns a 400 status code with an error message if the chat or user is not found or if something goes wrong during the operation.
 * @route - PUT /api/chat/groupadd
 */
export const addToGroup = async (request, response) => {
    try {
        const {
            chatid,
            userid
        } = request.body;
        const groupChatFetch = await chatModel.findOne({
            where: {
                id: chatid
            }
        });
        const updatedGroup = await chatMemberGroupModel.create({
            chatId: chatid,
            userId: userid
        });
        if (!updatedGroup) {
            throw new Error(`Chat not Found`);
        } else {
            return response.status(200).json({
                updatedGroup,
                groupChatFetch
            });
        };
    } catch (error) {
        return response.status(400).send(`Something went wrong, can't add the User`);
    };
};


/**
 * Removes a user from a group chat.
 * @param {Object} request - The HTTP request object containing the user ID to be removed from the group.
 * @param {Object} response - The HTTP response object used to send the result of the removal operation.
 * @route - PUT /api/chat/groupremove 
 * @returns {Object} - If the removal is successful, a status code of 200 and the removed data are returned. 
 *                     If the removal is not successful, a status code of 400 is returned along with an error message.
 */
export const removeFromGroup = async (request, response) => {
    try {
        const {
            userid,
            chatid
        } = request.body;
        console.log(userid, chatid);
        const remove = await chatMemberGroupModel.destroy({
            where: {
                userId: userid,
                chatId: chatid
            }
        });
        console.log(remove);
        const groupChatFetch = await chatModel.findOne({
            where: {
                id: chatid
            }
        });
        if (!remove) {
            throw new Error(`Chat not Found`);
        } else {
            return response.status(200).send(`removed`);
        };
    } catch (error) {
        return response.status(400).send(error.message);
    };
};


/**
 * Join a group chat.
 * @param {Object} request - The request object containing the chatid and userid in the body property.
 * @param {Object} response - The response object with status, send, and json methods.
 * @routes - PUT /api/chat/joingroup
 * @returns {Object} - If the creation is successful, returns a 200 status code with the created entry as the response. If the creation fails, returns a 400 status code with an error message.
 */
export const joinGroup = async (request, response) => {
    try {
        const {
            chatid,
            userid
        } = request.body;
        const updatedGroup = await chatMemberGroupModel.create({
            chatId: chatid,
            userId: userid
        });
        const groupChatFetch = await chatModel.findOne({
            id: chatid
        });
        if (!updatedGroup) {
            throw new Error(`Chat not Found`);
        } else {
            return response.status(200).json({
                updatedGroup,
                groupChatFetch
            });
        };
    } catch (error) {
        return response.status(400).send(`Something went wrong, can't add the User`);
    };
};


/**
 * Leave a group chat.
 * @param {Object} request - The request object containing the user ID to be removed from the chat group.
 * @param {Object} response - The response object used to send the result of the operation back to the client.
 * @route - PUT /api/chat/joingroup
 * @returns {Object} - If the deletion is successful, the function returns a response with status code 200 and the deleted entry. If the deletion fails, the function returns a response with status code 400 and an error message indicating that the chat was not found.
 */
export const leaveGroup = async (request, response) => {
    try {
        const {
            userid,
            chatid
        } = request.body;
        console.log(userid, chatid);
        const remove = await chatMemberGroupModel.destroy({
            where: {
                userId: userid,
                chatId: chatid
            }
        });
        console.log(remove);
        const groupChatFetch = await chatModel.findOne({
            where: {
                id: chatid
            }
        });
        if (!remove) {
            throw new Error(`Chat not Found`);
        } else {
            return response.status(200).send(`removed`);
        };
    } catch (error) {
        return response.status(400).send(error.message);
    };
};

/**
 * Retrieves the number of users in a chat.
 * 
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @returns {Promise} - A promise that resolves with the count of users in the chat or rejects with an error message.
 * @route - GET /api/chat/countUser
 */
export const numberOfUsers = async (request, response) => {
    try {
        const {
            chatid
        } = request.body;
        console.log(chatid);
        const chatExists = await chatModel.findOne({
            where: {
                id: chatid
            }
        });
        console.log(chatExists);
        if (chatExists) {
            if (chatExists.isGroupChat) {
                var count = await chatMemberGroupModel.findAndCountAll({
                    where: {
                        chatId: chatid
                    }
                });
                return response.status(200).send(count);
            } else {
                throw new Error(`Is not a Group Chat`);
            }
        } else {
            throw new Error(`Unable to find Group Chat`);
        }
    } catch (error) {
        return response.status(400).send(error.message);
    }
}