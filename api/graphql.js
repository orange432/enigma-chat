import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
    type LoginResponse{
        success: Boolean!
        message: String
        session: String
    }

    type SuccessResponse{
        success: Boolean!
        message: String
        code: String
    }


    input LoginInput{
        username: String!
        password: String!
    }

    type Query{
        AuthorizeSession(session: String!): SuccessResponse!
        Login(input: LoginInput): LoginResponse!
    }

    type Mutation{
        Register(input: LoginInput): SuccessResponse!
    }
`)

const root = {
    Login: ({input}) => {

    },
    Register: ({input}) => {

    }
}

const APIRouter = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
})

export default APIRouter