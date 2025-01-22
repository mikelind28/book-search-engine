// TODO: Define the necessary Query and Mutation types:

// Query type:
//  me: Which returns a User type.

// Mutation type:
//  login: Accepts an email and password as parameters; returns an Auth type.
//  addUser: Accepts a username, email, and password as parameters; returns an Auth type.
//  saveBook: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type. (Look into creating what's known as an input type to handle all of these parameters!)
//  removeBook: Accepts a book's bookId as a parameter; returns a User type.

// User type:
//  _id
//  username
//  email
//  bookCount
//  savedBooks (This will be an array of the Book type.)

// Book type:
//  bookId (Not the _id, but the book's id value returned from Google's Book API.)
//  authors (An array of strings, as there may be more than one author.)
//  description
//  title
//  image
//  link

// Auth type:
//  token
//  user (References the User type.)

const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String
        title: String
        authors: [String]
        description: String
        image: String

    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String

    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;