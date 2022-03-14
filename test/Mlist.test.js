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
    
    // sethashInternal
    it('It should set hashInternal to 0xbea...3ae', async() => {
        const combinedString = '0xbea7774072254bb0d224ea4ea5daeabc6b2520620334696fde6408429355e3ae' // void + 'a'

        await mList.sethashInternal(aString, {from: accounts[0]})
        const hashInternalAsString = await mList.gethashInternalAsString()
        assert.equal(hashInternalAsString, combinedString)
    })

    // pay
    it('It should pay 1 ETH to contract', async() => {
        const oneEth = web3.utils.toWei('1', "ether")
        const accounts = await web3.eth.getAccounts()
        const contractAddress = await mList.getContractSelfAddress()

        const balanceWeiBefore = await web3.eth.getBalance(contractAddress)
        const balanceEtherBefore = web3.utils.fromWei(balanceWeiBefore, "ether")

        await web3.eth.sendTransaction({from: accounts[1], to: contractAddress, value: oneEth})
        const balanceWeiAfter = await web3.eth.getBalance(contractAddress);
        const balanceEtherAfter = web3.utils.fromWei(balanceWeiAfter, "ether")
        console.log('balanceEtherBefore', balanceEtherBefore)
        console.log('balanceEtherAfter', balanceEtherAfter)
        assert.equal(balanceEtherAfter, Number(balanceEtherBefore) + 1)
    })

    // sendAllToOwner
    it("It should send the whole amount to the owner", async () => {
        const sendResult = await mList.sendAllToOwner({from: accounts[0]})
        console.log('send_result', sendResult)

        // await truffleAssert.reverts(mList.sendAllToOwner({from: accounts[1]}), "Not the owner")
    })

    // sendAllToOwner
    it("It should not send the whole amount to the owner", async () => {
        await truffleAssert.reverts(mList.sendAllToOwner({from: accounts[1]}), "Not the owner")
    })

    // sethashInternal
    it("It should abort with an error", async () => {
        await truffleAssert.reverts(mList.sethashInternal(aString, {from: accounts[1]}), "Not the owner")
    })
})