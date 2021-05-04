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

type LineChartOption {
    _id: String, name: String
}

type Series {
    xlabel: String!
    ylabel: String!
    xmin: Float
    xmax: Float
    ymin: Float
    ymax: Float
    xunit: String!
    yunit: String!
    data: [SeriesItem]
}

type PieChartSelections {
    categories: [PieChartCategory]!
    options: [PieChartOption]!
}

type PieChartCategory {_id: Int, name: String}
type PieChartOption {_id: Int, name: String}

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
    getLineChart(numMonths: String!, type: String!, arg: String): LineChart!
    getLineChartSelections: [LineChartOption!]!
    getContribution(categoryId: String!, categoryName: String!, optionId: String!, optionName: String!, numMonths: String!, extension: String!): LineChart!
    getPieChartSelections: PieChartSelections!
}

type RootMutation {
    createRecords(records: [recordInput!]!, geoCoordinates: geoCoordinates): Boolean
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
