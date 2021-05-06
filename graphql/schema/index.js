const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Category {
    _id: Int
    name: String!
    title: String!
    options: [Option!]!
}

type Option {
    _id: Int
    categoryId: Int
    src: String
    srcActive: String
    title: String!
    selected: Boolean!
    value: Float
    unit: String
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
    optionId: Int!
    categoryId: Int!
    selected: Boolean!
    value: Float
    src: String
    srcActive: String
    title: String
}

input geoCoordinates {
    lon: Float,
    lat: Float
}





type RootQuery {
    lastUsed: [Category!]!
    searchOption(text: String!, categoryId: Int!): [Option!]!
    getLineChart(numMonths: Int!, type: String!, arg: String): LineChart!
    getLineChartSelections: [LineChartOption!]!
    getPieChart(categoryId: Int!, categoryName: String!, optionId: String!, optionName: String!, Int: String!, extension: Int!): LineChart!
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
