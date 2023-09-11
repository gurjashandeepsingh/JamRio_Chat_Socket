import userModel from "../models/userModel.js";



/**
* Handles the registration of a new user.
* @param {Object} request - The request object containing the user registration details in the request body.
* @param {Object} response - The response object used to send the response back to the client.
* @returns {Object} - If successful, sends a 500 response with the user details (name, email, password, picture).
*                    If any required field is missing, sends a 400 response with an error message.
*                    If a user with the same email already exists, sends a 400 response with an error message.
*                    If there is an error during the process, sends a 400 response with the error message and logs the error.
*/
export const userRegistration = async(request, response) => {
    try {
        const {name, email, password} = request.body;
        console.log(name, email, password);
        if( !name || !email || !password){
            return response.status(400).send(`Please Fill all the Details`);
        };
        const userExists = await userModel.findOne({where: {email: email}});
        if(userExists){
            return response.status(400).send(`User already exists, Please choose different details!`);
        };
        const user = await userModel.create({
            name: name,
            email: email,
            password: password,
            // picture: picture
        });
        if(user){
            console.log(user);
            return response.status(200).json({
                name: user.name,
                email: user.email,
                password: user.password,
                id: user.id
                // picture: user.picture
            });
        }else{
            return response.status(400).send(`Error while creating a new User!`);
        };
    } catch (error) {
        return response.status(400).send(error);
        console.log(error);
    };
};



/**
 * Handles user login functionality.
 * @param {object} request - The request object containing the user's email and password in the request body.
 * @param {object} response - The response object used to send the response back to the client.
 * @returns {void}
 * @throws {Error} If there is an error during the login process.
 */
export const userLogin = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send('Please fill in all details');
    };
    const user = await userModel.findOne({ where: { email } });
    if (user && password === user.password) {
      const { name, email, password, picture } = user;
      return response.status(200).json({ name, email, password, picture });
    } else {
      return response.status(400).send('Invalid email or password');
    }
  } catch (error) {
    return response.status(400).send(error);
  }
};

