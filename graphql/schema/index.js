const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type ScreenType {
    BUTTON,
    ICON
}

type Category {
    _id: ID!
    type: String!
    screenType: ScreenType = ScreenType.ICON
    hasTime: Boolean = false
    title: String!
    backgroundImage: String!
    options: [Option!]!,
}

type Option {
    _id: ID!
    src: String!
    text: String!
}

type RootQuery {
    categories: [Category!]!
}

type Record {
    _id: ID!
    categoryId: ID!
    time: Int
    optionId: ID!
    date: String!

}

type RootMutation {
    
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
