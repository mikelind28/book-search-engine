// TODO: Define the query and mutation functionality to work with the Mongoose models.
// Use the functionality in the user-controller.ts as a guide.

import { User, Book } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
  }

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({_id: context.user._id })
            }
            // populate user's saved books above?
            throw new AuthenticationError('Could not authenticate user.');
        },
    },

    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
          
            // If no user is found, throw an AuthenticationError
            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
          
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
          
            // Return the token and the user
            return { token, user };
        },

        
    },
};

export default resolvers;