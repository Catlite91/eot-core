const Container = require('../dist/container').default
const expect = require('chai').expect
require('reflect-metadata')
describe('Container', () => {
  before(() => {

  })

  describe('bind', () => {
    it('should bind class', () => {
      const container = new Container()
      class A { }
      expect(container.bind(A, 'A')).to.be.equal(A)
    })

    it('should bind constant value', () => {
      const container = new Container()
      class A { }
      const a = new A()
      container.bindConstantValue(a, 'A', 'a')
    })
  })

})