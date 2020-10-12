

module.exports = function (server) {

  server.get('/api/v0/testget', async function (req, res, next) {
    try {
        console.log('hello')
        res.status(200).send();
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
  })

  server.post('/api/v0/testpost', function (req, res) {
    const { info } = req.body;

    try {
        console.log(info)
        res.status(200).send();
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }

});

}