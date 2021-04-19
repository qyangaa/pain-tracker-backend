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
    srcActive: String
    title: String!
    selected: Boolean!
    duration: Int
    amount: Int
}

type LineChart {
    title: String!
    seriesData: [Series]
}

type Series {
    xlabel: String!
    ylabel: String!
    data: [SeriesItem]
}

type SeriesItem {
    x: String
    y: Float
}

input recordInput {
    _id: String!
    categoryId: String!
    selected: Boolean!
    duration: Int
    amount: Int
    src: String
    srcActive: String
    title: String
}

input geoCoordinates {
    lon: Float,
    lat: Float
}



type RootQuery {
    option(id: ID!): Option
    lastUsed: [Category!]!
    searchOption(text: String!, categoryId: String!): [Option!]!
    getRecords(numMonths: String): Boolean
    getPainDayData(numMonths: String): LineChart!
    getDailyTotal(categoryId: String!, categoryName: String!, numMonths: String, type: String!): LineChart!
}

type RootMutation {
    createRecords(records: [recordInput!]!, geoCoordinates: geoCoordinates): Boolean
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
