// TODO: Define the query and mutation functionality to work with the Mongoose models.
// Use the functionality in the user-controller.ts as a guide.

import { User } from '../models/index.js';
import { BookDocument } from '../models/Book.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    bookCount: number;
    savedBooks: BookDocument[];
}

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

interface AddBookArgs {
    userId: string;
    book: string;
}

interface RemoveBookArgs {
    userId: string;
    book: string;
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },

    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent: any, { email, password }: LoginUserArgs): Promise<{ token: string; user: User }> => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
              throw AuthenticationError;
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
              throw AuthenticationError;
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        saveBook: async (_parent: any, { userId, book }: AddBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
              return await User.findOneAndUpdate(
                { _id: userId },
                {
                  $addToSet: { savedBooks: book },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
            throw AuthenticationError;
          },
        removeBook: async (_parent: any, { book }: RemoveBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: book } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

export default resolvers;