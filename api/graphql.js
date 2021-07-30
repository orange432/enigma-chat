import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { login, authorizeSession } from './controllers/sessions.js';
import { createUser } from "./controllers/users.js";
import { getMessages, sendMessage,decryptMessage } from "./controllers/messages.js";

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

    type Message{
        id: Int
        from: Int
        to: Int
        content: String
        time: String
        createdAt: String
        updatedAt: String
    }

    type DecryptResponse{
        success: Boolean!
        content: String
        message: String
        code: String
    }

    input LoginInput{
        username: String!
        password: String!
    }

    input MessageInput{
        session: String!
        receiver: String!
        message: String!
    }

    type Query{
        AuthorizeSession(session: String!): AuthResponse!
        Login(input: LoginInput): LoginResponse!
        GetMessages(session: String): [Message]
        DecryptMessage(session: String, id: Int): DecryptResponse!
    }

    type Mutation{
        Register(input: LoginInput): SuccessResponse!
        SendMessage(input: MessageInput): SuccessResponse!
        DeleteMessage(session: String, id: Int): SuccessResponse!
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
    },
    GetMessages: async ({session}) => {
        let auth = await authorizeSession(session);
        if(auth.success){
            let messages = await getMessages(auth.username);
            return messages;
        }else{
            return [];
        }
    },
    SendMessage: async ({input}) => {
        let auth = await authorizeSession(input.session);
        if(auth.success){
            let result = await sendMessage(auth.username,input.receiver,input.message);
            return result;
        }else{
            return auth;
        }
    },
    DecryptMessage: async ({session, id}) => {
        let auth = await authorizeSession(session);
        if(auth.success){
            let result = await decryptMessage(id,auth.user_id);
            return result;
        }else{
            return auth;
        }
    }
}

const APIRouter = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
})

export default APIRouter