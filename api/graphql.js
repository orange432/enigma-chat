import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { login, authorizeSession } from './controllers/sessions.js';
import { createUser } from "./controllers/users.js";

const schema = buildSchema(`
    type LoginResponse{
        success: Boolean!
        message: String
        code: String
        session: String
    }

    type SuccessResponse{
        success: Boolean!
        message: String
        code: String
    }

    type AuthResponse{
        success: Boolean!
        message: String
        code: String
        username: String
    }


    input LoginInput{
        username: String!
        password: String!
    }

    type Query{
        AuthorizeSession(session: String!): AuthResponse!
        Login(input: LoginInput): LoginResponse!
    }

    type Mutation{
        Register(input: LoginInput): SuccessResponse!
    }
`)

const root = {
    Login: async ({input}) => {
        let response = await login(input.username,input.password);
       return response;
    },
    Register: async ({input}) => {
       let response = await createUser(input);
       return response;
    },
    AuthorizeSession: async ({session}) => {
        let response = await authorizeSession(session);
        return response;
    }
}

const APIRouter = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
})

export default APIRouter