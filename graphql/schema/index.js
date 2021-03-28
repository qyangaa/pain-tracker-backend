const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Category {
    _id: ID!
    name: String!
    screenType: String!
    hasDuration: Boolean!
    title: String!
    backgroundImage: String!
    options: [Option!]!
}

type Option {
    _id: ID!
    categoryId: ID!
    src: String
    text: String!
    selected: Boolean!
    duration: Int
    amount: Int
}

input recordInput {
    _id: ID!
    categoryId: ID!
    selected: Boolean!
    duration: Int
    amount: Int
}

input geoCoordinates {
    lon: Float,
    lat: Float
}

type RootQuery {
    option(id: ID!): Option
    lastUsed(uid: ID!): [Category!]!
}

type RootMutation {
    createRecords(records: [recordInput!]!, geoCoordinates: geoCoordinates): Boolean
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
