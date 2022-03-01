const truffleAssert = require('truffle-assertions')
const Mlist = artifacts.require("Mlist")

contract('Mlist', (accounts) => {
    const aString = '0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb' // 'a'
    let mList
    
    before(async () => {
        mList = await Mlist.deployed()
    })
    
    it('It should return 0xc5d...470', async () => {
        const hashInternalAsString = await mList.gethashInternalAsString()

        const emptyStringHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        assert.equal(hashInternalAsString, emptyStringHash)
    })
    
    it('It should set hashInternal to 0xbea...3ae', async() => {
        const combinedString = '0xbea7774072254bb0d224ea4ea5daeabc6b2520620334696fde6408429355e3ae' // void + 'a'

        await mList.sethashInternal(aString, {from: accounts[0]})
        const hashInternalAsString = await mList.gethashInternalAsString()
        assert.equal(hashInternalAsString, combinedString)
    })

    it("It should abort with an error", async () => {
        await truffleAssert.reverts(mList.sethashInternal(aString, {from: accounts[1]}), "Not the owner")
    })
})