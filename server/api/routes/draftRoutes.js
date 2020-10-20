
//move out of here long term
// import { GraphQLClient, gql } from 'graphql-request'
const graphqlRequest = require('graphql-request');


//Link to graphQL queries:
// https://docs.aave.com/developers/integrating-aave/using-graphql


module.exports = async function (server) {


    const endpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol'

    const graphQLClient = new graphqlRequest.GraphQLClient(endpoint)

    const allReservesQuery = graphqlRequest.gql`
    {
      reserves (where: {
        usageAsCollateralEnabled: true
      }) {
        id
        name
        price {
          id
        }
        liquidityRate
        variableBorrowRate
        stableBorrowRate
      }
    }
  `


    const data = await graphQLClient.request(allReservesQuery)


    server.post('/api/v0/accountresources', async function (req, res) {
        var { account } = req.query

        account = account.toLowerCase()

        console.log(typeof(account))

        const variables = {
            user: account,
          }
        

        const userAllReserveQuery = graphqlRequest.gql`
        query  getUserReservers($user : String!){
            userReserves(where: { user: $user }) {
            id
            reserve{
                id
                symbol
                stableBorrowRate
                variableBorrowRate
            }
            user {
                id
            }
            }
        }
        `

        try {
            const returnData = await graphQLClient.request(userAllReserveQuery , variables);
            console.log(returnData)
            res.status(200).send(returnData)
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    });



    server.get('/api/v0/testget', async function (req, res, next) {
        try {
            console.log('hello')
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    })



    server.post('/api/v0/testpost', function (req, res) {
        const { info } = req.query

        try {
            console.log(info)
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    });

    const chainlinkReservesQuery = graphqlRequest.gql`
    {
        reserve(id: "0x514910771af9ca656af840dff83e8264ecf986ca0x24a42fd28c976a61df5d00d0599c34c4f90748c8") { // LINK
          symbol
          price
          aToken {
            id
          }
        }
      }
  `

    const userSingleReserveQuery = graphqlRequest.gql`
    {
        userReserve(id: "USER_ADDRESS_AND_RESERVE_ADDRESS") {
        reserve {
            id
            symbol
        }
        user {
            id
        }
        }
    }
    `

    const templateUserAllReserveQuery = graphqlRequest.gql`
    {
        userReserves(where: { user: "USER_ADDRESS"}) {
        id
        reserve{
            id
            symbol
        }
        user {
            id
        }
        }
    }
    `



}