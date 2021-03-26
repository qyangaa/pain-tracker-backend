const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Category {
    _id: ID!
    type: String!
    screenType: String!
    hasDuration: Boolean!
    title: String!
    backgroundImage: String!
}

type Option {
    _id: ID!
    categoryId: ID!
    src: String
    text: String!
}



type Record {
    _id: ID!
    categoryId: ID!
    duration: Int
    optionId: ID!
    date: String!
    user: ID!
}

input RecordsInput {
    records: [RecordInput!]!
}

input RecordInput {
    categoryId: ID!
    duration: Int
    optionId: ID!
    user: ID!
}

input CategoriesInput {
    categories: [CategoryInput!]!
}

input CategoryInput {
    categoryId: ID!
    options: [ID!]!
}

type LastUsedOutput {
    categories: [Category!]!
    options: [Option!]!
}

type RootQuery {
    option(id: ID!): Option
    lastUsed(uid: ID!): LastUsedOutput!
}

type RootMutation {
    createRecords(records: RecordsInput!): [Record!]!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
