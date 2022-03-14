const truffleAssert = require('truffle-assertions')
const Mlist = artifacts.require("Mlist")

contract('Mlist', (accounts) => {
    const aString = '0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb' // 'a'
    let mList
    
    before(async () => {
        mList = await Mlist.deployed()
    })

    // getContractSelfAddress
    it('should return the contract address', async () => {
        const address = await mList.getContractSelfAddress()
        console.log(address)
        assert.equal(isNaN(address), false)
    })

    // getBalance
    it('should return the current balance', async () => {
        const balance = await mList.getBalance()
        console.log(balance)
        assert.equal(isNaN(balance.toNumber()), false)
    })
    
    // gethashInternalAsString
    it('It should return 0xc5d...470', async () => {
        const hashInternalAsString = await mList.gethashInternalAsString()

        const emptyStringHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        assert.equal(hashInternalAsString, emptyStringHash)
    })
    
    // gethashInternalAsString
    it('It should set hashInternal to 0xbea...3ae', async() => {
        const combinedString = '0xbea7774072254bb0d224ea4ea5daeabc6b2520620334696fde6408429355e3ae' // void + 'a'

        await mList.sethashInternal(aString, {from: accounts[0]})
        const hashInternalAsString = await mList.gethashInternalAsString()
        assert.equal(hashInternalAsString, combinedString)
    })

    // pay
    it('It should pay 1 ETH to contract', async() => {
        const one_eth = web3.utils.toWei('1', "ether");
        const accounts = await web3.eth.getAccounts()
        const contract_address = await mList.getContractSelfAddress()

        const balance_wei_before = await web3.eth.getBalance(contract_address);
        const balance_ether_before = web3.utils.fromWei(balance_wei_before, "ether");

        await web3.eth.sendTransaction({from: accounts[1], to: contract_address, value: one_eth});
        const balance_wei_after = await web3.eth.getBalance(contract_address);
        const balance_ether_after = web3.utils.fromWei(balance_wei_after, "ether");
        console.log('balance_ether_before', balance_ether_before)
        console.log('balance_ether_after', balance_ether_after)
        assert.equal(balance_ether_after, Number(balance_ether_before) + 1);
    })

    // TODO
    // https://trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#making-a-transaction
    // truffle(develop)> let accounts = await web3.eth.getAccounts()
    // truffle(develop)> instance.sendCoin(accounts[1], 10, {from: accounts[0]})

    /*// send
    it('should send 1 ether to the contract', async () => {
        mList.send(web3.utils.toWei(1, "ether")).then(result => {
            console.log(result)
        })

        // const balanceBefore = await mList.getBalance()
        // console.log('balanceBefore', balanceBefore)
        // const amount = 1
        // const receiver = accounts[1]
        // await mList.send(receiver, amount, {from: accounts[0]})
        // const balanceAfter = await mList.getBalance()
        // const balanceDifference = balanceAfter.toNumber() - balanceBefore.toNumber()
        // assert.equal(balanceDifference, amount)
    })*/

    // sethashInternal
    it("It should abort with an error", async () => {
        await truffleAssert.reverts(mList.sethashInternal(aString, {from: accounts[1]}), "Not the owner")
    })
})