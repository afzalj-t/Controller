const { expect } = require('chai')
const sinon = require('sinon')

const MicroserviceManager = require('../../../src/data/managers/microservice-manager')
const MicroservicesService = require('../../../src/services/microservices-service')
const AppHelper = require('../../../src/helpers/app-helper')
const Validator = require('../../../src/schemas')
const ChangeTrackingService = require('../../../src/services/change-tracking-service')
const CatalogService = require('../../../src/services/catalog-service')
const FlowService = require('../../../src/services/flow-service')
const FlowManager = require('../../../src/data/managers/flow-manager')
const ioFogService = require('../../../src/services/iofog-service')
const MicroservicePortManager = require('../../../src/data/managers/microservice-port-manager')
const CatalogItemImageManager = require('../../../src/data/managers/catalog-item-image-manager')
const RouterManager = require('../../../src/data/managers/router-manager')
const VolumeMappingManager = require('../../../src/data/managers/volume-mapping-manager')
const MicroserviceStatusManager = require('../../../src/data/managers/microservice-status-manager')
const RoutingManager = require('../../../src/data/managers/routing-manager')
const MicroserviceEnvManager = require('../../../src/data/managers/microservice-env-manager')
const MicroserviceArgManager = require('../../../src/data/managers/microservice-arg-manager')
const RegistryManager = require('../../../src/data/managers/registry-manager')
const Op = require('sequelize').Op
const MicroservicePublicModeManager = require('../../../src/data/managers/microservice-public-mode-manager')
const MicroservicePublicPortManager = require('../../../src/data/managers/microservice-public-port-manager')
const ioFogManager = require('../../../src/data/managers/iofog-manager')
const Errors = require('../../../src/helpers/errors')

describe('Microservices Service', () => {
  def('subject', () => MicroservicesService)
  def('sandbox', () => sinon.createSandbox())

  const isCLI = true

  afterEach(() => $sandbox.restore())

  describe('.listMicroservicesEndPoint()', () => {
    const transaction = {}
    const error = 'Error!'

    const user = {
      id: 15,
    }

    const flowId = 10

    const response = [
      {
        uuid: 'testUuid',
      },
    ]

    def('subject', () => $subject.listMicroservicesEndPoint(flowId, user, isCLI, transaction))
    def('findMicroservicesResponse', () => Promise.resolve(response))
    def('findPortMappingsResponse', () => Promise.resolve([]))
    def('findVolumeMappingsResponse', () => Promise.resolve([]))
    def('findRoutesResponse', () => Promise.resolve([]))
    def('publicModeResponse', () => Promise.resolve([]))
    def('envResponse', () => Promise.resolve([]))
    def('cmdResponse', () => Promise.resolve([]))
    def('imgResponse', () => Promise.resolve([]))
    def('statusResponse', () => Promise.resolve([]))

    beforeEach(() => {
      $sandbox.stub(MicroserviceManager, 'findAllExcludeFields').returns($findMicroservicesResponse)
      $sandbox.stub(MicroservicePortManager, 'findAll').returns($findPortMappingsResponse)
      $sandbox.stub(VolumeMappingManager, 'findAll').returns($findVolumeMappingsResponse)
      $sandbox.stub(RoutingManager, 'findAll').returns($findRoutesResponse)
      $sandbox.stub(MicroserviceEnvManager, 'findAllExcludeFields').returns($envResponse)
      $sandbox.stub(MicroserviceArgManager, 'findAllExcludeFields').returns($cmdResponse)
      $sandbox.stub(MicroservicePublicModeManager, 'findAll').returns($publicModeResponse)
      $sandbox.stub(CatalogItemImageManager, 'findAll').returns($imgResponse)
      $sandbox.stub(MicroserviceStatusManager, 'findAllExcludeFields').returns($statusResponse)
    })
    
    it('calls MicroserviceManager#findAllExcludeFields() with correct args', async () => {
      await $subject
      const where = isCLI ? { delete: false } : { flowId: flowId, delete: false }

      expect(MicroserviceManager.findAllExcludeFields).to.have.been.calledWith(where, transaction)
    })

    context('when MicroserviceManager#findAllExcludeFields() fails', () => {
      def('findMicroservicesResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when MicroserviceManager#findAllExcludeFields() succeeds', () => {
      it('fulfills the promise', () => {
        return expect($subject).to.eventually.have.property('microservices')
      })
    })
  })

  describe('.getMicroserviceEndPoint()', () => {
    const transaction = {}
    const error = 'Error!'

    const user = {
      id: 15,
    }

    const microserviceUuid = 'testMicroserviceUuid'

    const response = {
      dataValues: {
        uuid: 'testUuid',
      },
    }

    def('subject', () => $subject.getMicroserviceEndPoint(microserviceUuid, user, isCLI, transaction))
    def('findMicroserviceResponse', () => Promise.resolve(response))
    def('findPortMappingsResponse', () => Promise.resolve([]))
    def('findVolumeMappingsResponse', () => Promise.resolve([]))
    def('findRoutesResponse', () => Promise.resolve([]))
    def('publicModeResponse', () => Promise.resolve([]))
    def('envResponse', () => Promise.resolve([]))
    def('cmdResponse', () => Promise.resolve([]))
    def('imgResponse', () => Promise.resolve([]))
    def('statusResponse', () => Promise.resolve([]))

    beforeEach(() => {
      $sandbox.stub(MicroserviceManager, 'findOneExcludeFields').returns($findMicroserviceResponse)
      $sandbox.stub(MicroservicePortManager, 'findAll').returns($findPortMappingsResponse)
      $sandbox.stub(VolumeMappingManager, 'findAll').returns($findVolumeMappingsResponse)
      $sandbox.stub(RoutingManager, 'findAll').returns($findRoutesResponse)
      $sandbox.stub(MicroserviceEnvManager, 'findAllExcludeFields').returns($envResponse)
      $sandbox.stub(MicroserviceArgManager, 'findAllExcludeFields').returns($cmdResponse)
      $sandbox.stub(MicroservicePublicModeManager, 'findAll').returns($publicModeResponse)
      $sandbox.stub(CatalogItemImageManager, 'findAll').returns($imgResponse)
      $sandbox.stub(MicroserviceStatusManager, 'findAllExcludeFields').returns($statusResponse)
    })

    it('calls MicroserviceManager#findOneExcludeFields() with correct args', async () => {
      await $subject
      expect(MicroserviceManager.findOneExcludeFields).to.have.been.calledWith({
        uuid: microserviceUuid, delete: false,
      }, transaction)
    })

    context('when MicroserviceManager#findOneExcludeFields() fails', () => {
      def('findMicroserviceResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when MicroserviceManager#findOneExcludeFields() succeeds', () => {
      it('fulfills the promise', () => {
        return expect($subject).to.eventually.have.property('uuid')
      })
    })

    context('when microservice has public ports', () => {
      def('findPortMappingsResponse', () => Promise.resolve([
        {
          id: 1,
          portInternal: 80,
          portInternal: 8080,
          isPublic: true,
          getPublicPort: () => Promise.resolve({
            hostId: 'fakeAgentUuid',
            publicPort: 1234,
            protocol: 'http'
          })
        },
      ]))

      beforeEach(() => {
        $sandbox.stub(RouterManager, 'findOne').returns(Promise.resolve({host: '1.2.3.4'}))
        $sandbox.stub(ioFogManager, 'findOne').returns(Promise.resolve({}))
      })

      it('returns public link', async () => {
        const ms = await $subject
        expect(ms).to.have.property('ports')
        expect(ms.ports).to.have.length(1)
        expect(ms.ports[0]).to.have.property('publicLink')
        expect(ms.ports[0].publicLink).to.equal('http://1.2.3.4:1234')
      })
    })
  })

  describe('.createMicroserviceEndPoint()', () => {
    const transaction = {}
    const error = 'Error!'

    const user = {
      id: 15,
    }

    const microserviceData = {
      'name': 'name2',
      'config': 'string',
      'catalogItemId': 15,
      'flowId': 16,
      'iofogUuid': 'testIofogUuid',
      'rootHostAccess': true,
      'logSize': 0,
      'volumeMappings': [
        {
          'hostDestination': '/var/dest',
          'containerDestination': '/var/dest',
          'accessMode': 'rw',
        },
      ],
      'ports': [
        {
          'internal': 1,
          'external': 1,
        },
      ],
      'routes': [],
      'logLimit': 50
    }

    const newMicroserviceUuid = 'newMicroserviceUuid'
    const newMicroservice = {
      uuid: newMicroserviceUuid,
      name: microserviceData.name,
      config: microserviceData.config,
      catalogItemId: microserviceData.catalogItemId,
      flowId: microserviceData.flowId,
      iofogUuid: microserviceData.iofogUuid,
      rootHostAccess: microserviceData.rootHostAccess,
      logSize: microserviceData.logLimit,
      registryId: 1,
      userId: user.id,
    }

    const fog = {
      uuid: microserviceData.iofogUuid,
      name: 'testfog'
    }

    const item = {}

    const portMappingData =
      {
        'internal': 1,
        'external': 1,
      }

    const mappings = []
    for (const volumeMapping of microserviceData.volumeMappings) {
      const mapping = Object.assign({}, volumeMapping)
      mapping.microserviceUuid = newMicroservice.uuid
      mappings.push(mapping)
    }

    const mappingData = {
      isPublic: false,
      portInternal: portMappingData.internal,
      portExternal: portMappingData.external,
      userId: newMicroservice.userId,
      microserviceUuid: newMicroservice.uuid,
    }

    const images = [
      {fogTypeId: 1, containerImage: 'hello-world'},
      {fogTypeId: 2, containerImage: 'hello-world'},
    ]

    const proxyCatalogItem = {
      id: 42
    }

    const systemFog = {
      isSystem: true,
      uuid: 'systemFogUuid',
      getMicroservice: () => Promise.resolve([])
    }

    const defaultRouter = {
      id: 21
    }

    def('subject', () => $subject.createMicroserviceEndPoint(microserviceData, user, isCLI, transaction))
    def('validatorResponse', () => Promise.resolve(true))
    def('validatorResponse2', () => Promise.resolve(true))
    def('generateRandomStringResponse', () => newMicroserviceUuid)
    def('deleteUndefinedFieldsResponse', () => newMicroservice)
    def('findMicroserviceResponse', () => Promise.resolve())
    def('findMicroserviceResponse2', () => Promise.resolve(microserviceData))
    def('getCatalogItemResponse', () => Promise.resolve({images}))
    def('findFlowResponse', () => Promise.resolve({}))
    def('getIoFogResponse', () => Promise.resolve())
    def('createMicroserviceResponse', () => Promise.resolve(newMicroservice))
    def('findMicroservicePortResponse', () => Promise.resolve())
    def('createMicroservicePortResponse', () => Promise.resolve({id: 15}))
    def('updateMicroserviceResponse', () => Promise.resolve())
    def('updateChangeTrackingResponse', () => Promise.resolve())
    def('createVolumeMappingResponse', () => Promise.resolve())
    def('createMicroserviceStatusResponse', () => Promise.resolve())
    def('findOneRegistryResponse', () => Promise.resolve({}))
    def('findOneFogResponse', () => Promise.resolve({...fog, getMicroservice: () => Promise.resolve([])}))
    def('findPublicPortsResponse', () => Promise.resolve([]))
    def('getProxyCatalogItem', () => Promise.resolve((proxyCatalogItem)))
    def('proxyCatalogItem', () => Promise.resolve(null))
    def('findDefaultFogResponse', () => Promise.resolve(systemFog))
    def('findDefaultRouterResponse', () => Promise.resolve(defaultRouter))
    def('getProxyMsvcResponse', () => Promise.resolve(null))

    beforeEach(() => {
      $sandbox.stub(Validator, 'validate')
          .onFirstCall().returns($validatorResponse)
          .onSecondCall().returns($validatorResponse2)
      $sandbox.stub(AppHelper, 'generateRandomString').returns($generateRandomStringResponse)
      $sandbox.stub(AppHelper, 'deleteUndefinedFields').returns($deleteUndefinedFieldsResponse)
      $sandbox.stub(MicroserviceManager, 'findOne')
          .onFirstCall().returns($findMicroserviceResponse)
          .onSecondCall().returns($findMicroserviceResponse2)
          .withArgs({ catalogItemId: proxyCatalogItem.id, iofogUuid: microserviceData.iofogUuid }).returns($getProxyMsvcResponse) // find proxy microservice in public port
      $sandbox.stub(CatalogService, 'getCatalogItem').returns($getCatalogItemResponse)
      $sandbox.stub(FlowManager, 'findOne').returns($findFlowResponse)
      $sandbox.stub(ioFogService, 'getFog').returns($getIoFogResponse)
      $sandbox.stub(CatalogService, 'getProxyCatalogItem').returns($getProxyCatalogItem)
      $sandbox.stub(MicroserviceManager, 'create').returns($createMicroserviceResponse)
      $sandbox.stub(MicroservicePortManager, 'findOne').returns($findMicroservicePortResponse)
      $sandbox.stub(MicroservicePortManager, 'create').returns($createMicroservicePortResponse)
      $sandbox.stub(MicroserviceManager, 'update').returns($updateMicroserviceResponse)
      $sandbox.stub(ChangeTrackingService, 'update').returns($updateChangeTrackingResponse)
      $sandbox.stub(VolumeMappingManager, 'bulkCreate').returns($createVolumeMappingResponse)
      $sandbox.stub(MicroserviceStatusManager, 'create').returns($createMicroserviceStatusResponse)
      $sandbox.stub(RegistryManager, 'findOne').returns($findOneRegistryResponse)
      const stub = $sandbox.stub(ioFogManager, 'findOne')
      stub.withArgs({isSystem: true}).returns($findDefaultFogResponse)
      stub.returns($findOneFogResponse)
      $sandbox.stub(MicroservicePublicPortManager, 'findAll').returns($findPublicPortsResponse)
    })

    it('calls Validator#validate() with correct args', async () => {
      await $subject
      expect(Validator.validate).to.have.been.calledWith(microserviceData,
          Validator.schemas.microserviceCreate)
    })

    context('when Validator#validate() fails', () => {
      def('validatorResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when Validator#validate() succeeds', () => {
      it('calls AppHelper#generateRandomString() with correct args', async () => {
        await $subject
        expect(AppHelper.generateRandomString).to.have.been.calledWith(32)
      })

      context('when AppHelper#generateRandomString() fails', () => {
        def('generateRandomStringResponse', () => error)

        it(`fails with ${error}`, () => {
          return expect($subject).to.eventually.have.property('uuid')
        })
      })

      context('when AppHelper#generateRandomString() succeeds', () => {
        it('calls AppHelper#deleteUndefinedFields() with correct args', async () => {
          await $subject
          expect(AppHelper.deleteUndefinedFields).to.have.been.calledWith(newMicroservice)
        })

        context('when AppHelper#deleteUndefinedFields() fails', () => {
          const err = 'Invalid microservice UUID \'undefined\''
          def('deleteUndefinedFieldsResponse', () => Promise.reject(err))

          it(`fails with ${error}`, () => {
            return expect($subject).to.eventually.have.property('uuid')
          })
        })

        context('when AppHelper#deleteUndefinedFields() succeeds', () => {
          it('calls MicroserviceManager#findOne() with correct args', async () => {
            await $subject
            const where = item.id
              ?
              {
                name: microserviceData.name,
                uuid: { [Op.ne]: item.id },
                userId: user.id,
                delete: false
              }
              :
              {
                name: microserviceData.name,
                userId: user.id,
                delete: false
              }
            expect(MicroserviceManager.findOne).to.have.been.calledWith(where, transaction)
          })

          context('when MicroserviceManager#findOne() fails', () => {
            def('findMicroserviceResponse', () => Promise.reject(error))

            it(`fails with ${error}`, () => {
              return expect($subject).to.be.rejectedWith(error)
            })
          })

          context('when MicroserviceManager#findOne() succeeds', () => {
            it('calls CatalogService#getCatalogItem() with correct args', async () => {
              await $subject
              expect(CatalogService.getCatalogItem).to.have.been.calledWith(newMicroservice.catalogItemId,
                  user, isCLI, transaction)
            })

            context('when CatalogService#getCatalogItem() fails', () => {
              def('getCatalogItemResponse', () => Promise.reject(error))

              it(`fails with ${error}`, () => {
                return expect($subject).to.be.rejectedWith(error)
              })
            })

            context('when CatalogService#getCatalogItem() succeeds', () => {
              it('calls FlowManager#findOne() with correct args', async () => {
                await $subject
                expect(FlowManager.findOne).to.have.been.calledWith({id: microserviceData.flowId}, transaction)
              })

              context('when FlowManager#findOne() fails', () => {
                def('findFlowResponse', () => Promise.reject(error))

                it(`fails with ${error}`, () => {
                  return expect($subject).to.be.rejectedWith(error)
                })
              })

              context('when FlowManager#findOne() returns null', () => {
                def('findFlowResponse', () => Promise.resolve(null))

                it(`fails with ${error}`, async () => {
                  try {
                    await $subject
                  } catch (e) {
                    return expect(e).to.be.instanceOf(Errors.NotFoundError)
                  }
                  return expect(true).to.eql(false)
                })
              })

              context('when FlowManager#findOne() succeeds', () => {
                it('calls IoFogService#getFog() with correct args', async () => {
                  await $subject
                  expect(ioFogService.getFog).to.have.been.calledWith({
                    uuid: newMicroservice.iofogUuid,
                  }, user, isCLI, transaction)
                })

                context('when IoFogService#getFog() fails', () => {
                  def('getIoFogResponse', () => Promise.reject(error))

                  it(`fails with ${error}`, () => {
                    return expect($subject).to.be.rejectedWith(error)
                  })
                })

                context('when IoFogService#getFog() succeeds', () => {
                  it('calls MicroserviceManager#create() with correct args', async () => {
                    await $subject
                    expect(MicroserviceManager.create).to.have.been.calledWith(newMicroservice,
                        transaction)
                  })

                  context('when MicroserviceManager#create() fails', () => {
                    def('getIoFogResponse', () => Promise.reject(error))

                    it(`fails with ${error}`, () => {
                      return expect($subject).to.be.rejectedWith(error)
                    })
                  })

                  context('when MicroserviceManager#create() succeeds', () => {
                    it('calls MicroservicePortManager#findOne() with correct args', async () => {
                      await $subject
                      expect(MicroservicePortManager.findOne).to.have.been.calledWith({
                        microserviceUuid: newMicroservice.uuid,
                        [Op.or]:
                          [
                            {
                              portInternal: portMappingData.internal,
                            },
                            {
                              portExternal: portMappingData.external,
                            },
                          ],
                      }, transaction)
                    })
                    context('when MicroservicePortManager#findOne() fails', () => {
                      def('findMicroservicePortResponse', () => Promise.reject(error))

                      it(`fails with ${error}`, () => {
                        return expect($subject).to.be.rejectedWith(error)
                      })
                    })

                    context('when MicroservicePortManager#findOne() succeeds', () => {
                      it('calls MicroservicePortManager#create() with correct args', async () => {
                        await $subject
                        expect(MicroservicePortManager.create).to.have.been.calledWith(mappingData, transaction)
                      })

                      context('when portMapping is public', () => {
                        const router = {
                          host: 'routerHost',
                          messagingPort: 5672
                        }
                        const publicPort = 1234
                        let routerStub
                        beforeEach(() => {
                          microserviceData.ports[0].publicPort = publicPort
                          microserviceData.ports[0].host = undefined
                          routerStub = $sandbox.stub(RouterManager, 'findOne').returns(Promise.resolve(router))
                          $sandbox.stub(MicroservicePublicPortManager, 'create')
                        })

                        afterEach(() => {
                          delete microserviceData.ports[0].publicPort
                          delete microserviceData.ports[0].host
                        })
                        
                        it('should create local and remote proxy microservices', async () => {
                          await $subject
                          const networkRouter = {
                            host: router.host,
                            port: router.messagingPort
                          }
                          const localProxy = {
                            uuid: sinon.match.string,
                            name: 'Proxy',
                            config: JSON.stringify({
                              mappings: [`amqp:${newMicroserviceUuid}=>http:${microserviceData.ports[0].external}`],
                              networkRouter: networkRouter
                            }),
                            catalogItemId: proxyCatalogItem.id,
                            iofogUuid: microserviceData.iofogUuid,
                            rootHostAccess: true,
                            registryId: 1,
                            userId: user.id
                          }
                          const remoteProxy = {
                            uuid: sinon.match.string,
                            name: 'Proxy',
                            config: JSON.stringify({
                              mappings: [`http:${publicPort}=>amqp:${newMicroserviceUuid}`],
                              networkRouter: networkRouter
                            }),
                            catalogItemId: proxyCatalogItem.id,
                            iofogUuid: systemFog.uuid,
                            rootHostAccess: true,
                            registryId: 1,
                            userId: user.id
                          }
                          expect(MicroserviceManager.create).to.have.been.calledWith(remoteProxy, transaction)
                          expect(MicroserviceManager.create).to.have.been.calledWith(localProxy, transaction)
                        })

                        it('Should create the public port', async () => {
                          await $subject
                          const publicPortData = {
                            portId: 15,
                            hostId: systemFog.uuid,
                            localProxyId: newMicroservice.uuid,
                            remoteProxyId: newMicroservice.uuid,
                            publicPort: publicPort,
                            queueName: newMicroserviceUuid,
                            isTcp: false
                          }
                          expect(MicroservicePublicPortManager.create).to.have.been.calledWith(publicPortData, transaction)
                        })

                        context('when there is no system fog (K8s)', () => {
                          def('findDefaultFogResponse', () => Promise.resolve(null))

                          beforeEach(() => {
                            routerStub.withArgs({isSystem: true}).returns($findDefaultRouterResponse)
                          })
                          it('should only create local proxy microservices', async () => {
                            await $subject
                            const networkRouter = {
                              host: router.host,
                              port: router.messagingPort
                            }
                            const localProxy = {
                              uuid: sinon.match.string,
                              name: 'Proxy',
                              config: JSON.stringify({
                                mappings: [`amqp:${newMicroserviceUuid}=>http:${microserviceData.ports[0].external}`],
                                networkRouter: networkRouter
                              }),
                              catalogItemId: proxyCatalogItem.id,
                              iofogUuid: microserviceData.iofogUuid,
                              rootHostAccess: true,
                              registryId: 1,
                              userId: user.id
                            }
                            const remoteProxy = {
                              uuid: sinon.match.string,
                              name: 'Proxy',
                              config: JSON.stringify({
                                mappings: [`http:${publicPort}=>amqp:${newMicroserviceUuid}`],
                                networkRouter: networkRouter
                              }),
                              catalogItemId: proxyCatalogItem.id,
                              iofogUuid: systemFog.uuid,
                              rootHostAccess: true,
                              registryId: 1,
                              userId: user.id
                            }
                            expect(MicroserviceManager.create).to.have.been.calledWith(localProxy, transaction)
                            expect(MicroserviceManager.create).not.to.have.been.calledWith(remoteProxy, transaction)
                          })
  
                          it('Should create the public port without remote host/proxy info', async () => {
                            await $subject
                            const publicPortData = {
                              portId: 15,
                              hostId: null,
                              localProxyId: newMicroservice.uuid,
                              remoteProxyId: null,
                              publicPort: publicPort,
                              queueName: newMicroserviceUuid,
                              isTcp: false
                            }
                            expect(MicroservicePublicPortManager.create).to.have.been.calledWith(publicPortData, transaction)
                          })
                        })

                      })

                      context('when MicroservicePortManager#create() fails', () => {
                        def('createMicroservicePortResponse', () => Promise.reject(error))

                        it(`fails with ${error}`, () => {
                          return expect($subject).to.be.rejectedWith(error)
                        })
                      })

                      context('when MicroservicePortManager#create() succeeds', () => {
                        it('calls MicroserviceManager#update() with correct args', async () => {
                          await $subject
                          const updateRebuildMs = {
                            rebuild: true,
                          }
                          expect(MicroserviceManager.update).to.have.been.calledWith({
                            uuid: newMicroservice.uuid,
                          }, updateRebuildMs, transaction)
                        })

                        context('when MicroserviceManager#update() fails', () => {
                          def('updateMicroserviceResponse', () => Promise.reject(error))

                          it(`fails with ${error}`, () => {
                            return expect($subject).to.be.rejectedWith(error)
                          })
                        })

                        context('when MicroserviceManager#update() succeeds', () => {
                          it('calls ChangeTrackingService#update() with correct args', async () => {
                            await $subject
                            expect(ChangeTrackingService.update).to.have.been.calledWith(microserviceData.iofogUuid,
                                ChangeTrackingService.events.microserviceConfig, transaction)
                          })

                          context('when ChangeTrackingService#update() fails', () => {
                            def('updateChangeTrackingResponse', () => Promise.reject(error))

                            it(`fails with ${error}`, () => {
                              return expect($subject).to.be.rejectedWith(error)
                            })
                          })

                          context('when ChangeTrackingService#update() succeeds', () => {
                            it('calls VolumeMappingManager#bulkCreate() with correct args', async () => {
                              await $subject
                              expect(VolumeMappingManager.bulkCreate).to.have.been.calledWith(mappings,
                                  transaction)
                            })

                            context('when VolumeMappingManager#bulkCreate() fails', () => {
                              def('createVolumeMappingResponse', () => Promise.reject(error))

                              it(`fails with ${error}`, () => {
                                return expect($subject).to.be.rejectedWith(error)
                              })
                            })

                            context('when VolumeMappingManager#bulkCreate() succeeds', () => {
                              it('calls ChangeTrackingService#update() with correct args', async () => {
                                await $subject
                                expect(ChangeTrackingService.update).to.have.been.calledWith(microserviceData.iofogUuid,
                                    ChangeTrackingService.events.microserviceList, transaction)
                              })

                              context('when ChangeTrackingService#update() fails', () => {
                                def('updateChangeTrackingResponse', () => Promise.reject(error))

                                it(`fails with ${error}`, () => {
                                  return expect($subject).to.be.rejectedWith(error)
                                })
                              })

                              context('when ChangeTrackingService#update() succeeds', () => {
                                it('calls MicroserviceStatusManager#create() with correct args', async () => {
                                  await $subject
                                  expect(MicroserviceStatusManager.create).to.have.been.calledWith({
                                    microserviceUuid: newMicroservice.uuid,
                                  }, transaction)
                                })

                                context('when MicroserviceStatusManager#create() fails', () => {
                                  def('createMicroserviceStatusResponse', () => Promise.reject(error))

                                  it(`fails with ${error}`, () => {
                                    return expect($subject).to.be.rejectedWith(error)
                                  })
                                })

                                context('when MicroserviceStatusManager#create() succeeds', () => {
                                  it('fulfills the promise', () => {
                                    return expect($subject).to.eventually.have.property('uuid')
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
  // TODO: Rewrite tests once service has been refactored
  // describe('.updateMicroserviceEndPoint()', () => {
  //   const transaction = {};
  //   const error = 'Error!';

  //   const user = {
  //     id: 15
  //   };

  //   const microserviceUuid = 'testMicroserviceUuid';

  //   const query = isCLI
  //     ?
  //     {
  //       uuid: microserviceUuid
  //     }
  //     :
  //     {
  //       uuid: microserviceUuid,
  //       userId: user.id
  //     };

  //   const microserviceData = {
  //     "name": "name2",
  //     "config": "string",
  //     "catalogItemId": 15,
  //     "flowId": 16,
  //     "iofogUuid": 'testIofogUuid',
  //     "rootHostAccess": true,
  //     "logSize": 0,
  //   };

  //   const microserviceToUpdate = {
  //     name: microserviceData.name,
  //     config: microserviceData.config,
  //     rebuild: microserviceData.rebuild,
  //     iofogUuid: microserviceData.iofogUuid,
  //     rootHostAccess: microserviceData.rootHostAccess,
  //     logSize: microserviceData.logLimit,
  //     volumeMappings: microserviceData.volumeMappings
  //   };

  //   const newMicroserviceUuid = microserviceUuid;
  //   const oldMicroservice = {
  //     uuid: newMicroserviceUuid,
  //     name: 'oldName',
  //     config: microserviceData.config,
  //     catalogItemId: microserviceData.catalogItemId,
  //     flowId: microserviceData.flowId,
  //     iofogUuid: microserviceData.iofogUuid,
  //     rootHostAccess: !microserviceData.rootHostAccess,
  //     logSize: microserviceData.logLimit,
  //     userId: user.id
  //   };

  //   const microserviceUpdateData = {
  //     uuid: oldMicroservice.uuid,
  //     rootHostAccess: microserviceData.rootHostAccess,
  //   }

  //   const newMicroservice = {
  //     ...oldMicroservice,
  //     rootHostAccess: microserviceUpdateData.rootHostAccess,
  //   }

  //   const randomString = 'randomString'

  //   def('subject', () => $subject.updateMicroserviceEndPoint(microserviceUuid, microserviceData, user, isCLI, transaction));
  //   def('validatorResponse', () => Promise.resolve(true));
  //   def('deleteUndefinedFieldsResponse', () => microserviceUpdateData);
  //   def('oldMicroserviceResponse', () => Promise.resolve(oldMicroservice))
  //   def('newMicroserviceResponse', () => Promise.resolve(newMicroservice))
  //   def('findRegistryResponse', () => Promise.resolve({}))
  //   def('findCatalogItem', () => Promise.resolve({}))
  //   def('findFogResponse', () => Promise.resolve({}))


  //   beforeEach(() => {
  //     $sandbox.stub(Validator, 'validate').returns($validatorResponse);
  //     $sandbox.stub(AppHelper, 'deleteUndefinedFields').returns($deleteUndefinedFieldsResponse);
  //     $sandbox.stub(AppHelper, 'generateRandomString').returns(randomString);
  //     $sandbox.stub(ChangeTrackingService, 'update')
  //     $sandbox.stub(MicroserviceManager, 'findOneWithCategory').returns($oldMicroserviceResponse)
  //     $sandbox.stub(MicroserviceManager, 'updateAndFind').returns($newMicroserviceResponse)
  //     $sandbox.stub(RegistryManager, 'findOne').returns($findRegistryResponse)
  //     $sandbox.stub(CatalogService, 'getCatalogItem').returns($findCatalogItem)
  //     $sandbox.stub(ioFogService, 'getFog').returns($findFogResponse)
  //   });

  //   it('calls Validator#validate() with correct args', async () => {
  //     await $subject;
  //     expect(Validator.validate).to.have.been.calledWith(microserviceData,
  //       Validator.schemas.microserviceUpdate);
  //   });

  //   context('when Validator#validate() fails', () => {
  //     def('validatorResponse', () => Promise.reject(error));

  //     it(`fails with ${error}`, () => {
  //       return expect($subject).to.be.rejectedWith(error);
  //     })
  //   });

  //   context('when Validator#validate() succeeds', () => {
  //     it('calls AppHelper#deleteUndefinedFields() with correct args', async () => {
  //       await $subject;
  //       const microserviceToUpdate = {
  //         name: microserviceData.name,
  //         config: sinon.match.string,
  //         images: microserviceData.images,
  //         catalogItemId: microserviceData.catalogItemId,
  //         rebuild: microserviceData.rebuild,
  //         iofogUuid: microserviceData.iofogUuid,
  //         rootHostAccess: microserviceData.rootHostAccess,
  //         logSize: (microserviceData.logLimit || 50) * 1,
  //         registryId: microserviceData.registryId,
  //         volumeMappings: microserviceData.volumeMappings,
  //         env: microserviceData.env,
  //         cmd: microserviceData.cmd
  //       }
  //       expect(AppHelper.deleteUndefinedFields).to.have.been.calledWith(microserviceToUpdate);
  //     });

  //     context('when AppHelper#deleteUndefinedFields() succeeds', () => {
  //       it('should update the microservice', async () => {
  //         await $subject
  //         expect(MicroserviceManager.updateAndFind).to.have.been.calledWith(query, microserviceUpdateData, transaction)
  //       })

  //       context('when the microservice could not be found', () => {
  //         def('oldMicroserviceResponse', () => Promise.resolve(null))

  //         it('should error with NotFound', async () => {
  //           try{
  //             await $subject
  //           } catch(e) {
  //             return expect(e).to.be.instanceOf(Errors.NotFoundError)
  //           }
  //           return expect(true).to.eql(false)
  //         })
  //       })

  //       context('when the registry could not be found', () => {
  //         def('deleteUndefinedFieldsResponse', () => ({
  //           uuid: microserviceUuid,
  //           registryId: 5,
  //         }))
  //         def('findRegistryResponse', () => Promise.resolve(null))

  //         it('should error with NotFound', async () => {
  //           try{
  //             await $subject
  //           } catch(e) {
  //             return expect(e).to.be.instanceOf(Errors.NotFoundError)
  //           }
  //           return expect(true).to.eql(false)
  //         })
  //       })

  //       context('when microservice is moved', () => {
  //         const oldFog = {
  //           uuid: 'oldUuid'
  //         }
  //         const newFog = {
  //           uuid: 'newFogUuid'
  //         }
  //         const portMappings = []
  //         def('oldMicroserviceResponse', () => Promise.resolve({
  //           ...oldMicroservice,
  //           iofogUuid: oldFog.uuid,
  //           getPorts: () => Promise.resolve(portMappings)
  //         }))
  //         const newMicroservice = {
  //           ...microserviceUpdateData,
  //           iofogUuid: newFog.uuid,
  //         }
  //         const updatedNewMicroservice = {
  //           ...newMicroservice,
  //           getPorts: () => Promise.resolve(portMappings)
  //         }
  //         def('newMicroserviceResponse', () => Promise.resolve(updatedNewMicroservice))
  //         def('deleteUndefinedFieldsResponse', () => newMicroservice)
  //         def('getNewAgentMicroserviceReponse', () => Promise.resolve([]))
  //         def('newAgentPublicPortsResponse', () => Promise.resolve([]))
  //         def('findRoutesResponse', () => Promise.resolve([]))

  //         beforeEach(() => {
  //           const stub = $sandbox.stub(ioFogManager, 'findOne')
  //           stub.withArgs({isDefault: true}).returns(Promise.resolve({
  //             uuid: 'defaultFogUuid',
  //             isDefault: true,
  //             isSystem: true
  //           }))
  //           stub.returns(Promise.resolve({
  //             ...newFog,
  //             getMicroservice: () => $getNewAgentMicroserviceReponse
  //           }))
  //           $sandbox.stub(MicroservicePublicPortManager, 'findAll').returns($newAgentPublicPortsResponse)
  //           $sandbox.stub(RoutingManager, 'findAll').returns($findRoutesResponse)
  //           $sandbox.stub(updatedNewMicroservice, 'getPorts').returns(Promise.resolve(portMappings))
  //         })

  //         it('should look for ports and routes to move', async () => {
  //           const query = {
  //             [Op.or]:
  //               [
  //                 {
  //                   sourceMicroserviceUuid: microserviceUuid
  //                 },
  //                 {
  //                   destMicroserviceUuid: microserviceUuid
  //                 }
  //               ]
  //           }
  //           await $subject
  //           expect(RoutingManager.findAll).to.have.been.calledWith(query, transaction)
  //           expect(updatedNewMicroservice.getPorts).to.have.been.called
  //         })

  //         context('when there are routes to be moved', () => {
  //           const routes = [{
  //             id: 233,
  //             sourceMicroserviceUuid: microserviceUuid,
  //             destMicroserviceUuid: 'destMsvcUUID1',
  //             sourceIofogUuid: oldMicroservice.iofogUuid,
  //             destIofogUuid: 'destUUID1',
  //             isNetworkConnection: true
  //           }, {
  //             id: 234,
  //             sourceMicroserviceUuid: 'srcMsvcUUID2',
  //             destMicroserviceUuid: microserviceUuid,
  //             sourceIofogUuid: 'srcUUID2',
  //             destIofogUuid: oldMicroservice.iofogUuid
  //           }]
  //           const otherMsvc = {
  //             iofogUuid: 'otherFoguuid',
  //             uuid: 'otherMsvcUuid'
  //           }
  //           def('findRoutesResponse', () => Promise.resolve(routes))
  //           def('findRouteResponse', () => Promise.resolve(null))

  //           beforeEach(() => {
  //             $sandbox.stub(MicroserviceManager, 'findOne').returns(Promise.resolve(otherMsvc))
  //             $sandbox.stub(RoutingManager, 'delete')
  //             $sandbox.stub(RoutingManager, 'create')
  //             $sandbox.stub(RoutingManager, 'findOne').returns($findRouteResponse)
  //           })

  //           it('should delete old routes and create new ones', async () => {
  //             await $subject

  //             expect(RoutingManager.delete).to.have.been.calledWith()
  //             expect(RoutingManager.create).to.have.been.calledWith()
  //           })

  //         })
  //       })
  //     })
  //   })
  // });

  describe('.deleteMicroserviceEndPoint()', () => {
    const transaction = {};

    const microserviceUuid = 'msvcToDeleteUUID'
    const isCLI = false
    const user = {
      id: 15
    }

    const microserviceData = {
      uuid: microserviceUuid,
      iofogUuid: 'msvciofoguuid'
    }

    def('subject', () => $subject.deleteMicroserviceEndPoint(microserviceUuid, microserviceData, user, isCLI, transaction))
    def('findMicroserviceResponse', () => Promise.resolve(microserviceData))
    def('findRoutesResponse', () => Promise.resolve([]))
    def('findPortMappings', () => Promise.resolve([]))
  
    beforeEach(() => {
      $sandbox.stub(MicroserviceManager, 'findOneWithStatusAndCategory').returns($findMicroserviceResponse)
      $sandbox.stub(RoutingManager, 'findAll').returns($findRoutesResponse)
      $sandbox.stub(MicroservicePortManager, 'findAll').returns($findPortMappings)
      $sandbox.stub(MicroserviceManager, 'delete')
      $sandbox.stub(ChangeTrackingService, 'update')
    })

    it('should delete the microservice', async () => {
      await $subject
      expect(MicroserviceManager.delete).to.have.been.calledWith({uuid: microserviceUuid}, transaction)
      return expect(ChangeTrackingService.update).to.have.been.calledWith(microserviceData.iofogUuid, ChangeTrackingService.events.microserviceList, transaction)
    })

    context('when microservice is not found', () => {
      def('findMicroserviceResponse', () => Promise.resolve(null))
      it('should fail with NotFound error', async () => {
        try {
          await $subject
        } catch(e) {
          return expect(e).to.be.instanceOf(Errors.NotFoundError)
        }
        return expect(true).to.eql(false)
      })
    })

    context('when microservice is system', () => {
      def('findMicroserviceResponse', () => Promise.resolve({
        catalogItem: {
          category: 'SYSTEM'
        }
      }))
      it('should fail with NotFound error', async () => {
        try {
          await $subject
        } catch(e) {
          return expect(e).to.be.instanceOf(Errors.NotFoundError)
        }
        return expect(true).to.eql(false)
      })
    })

    context('when there are routes', () => {
      const routes = [{
        id: 233,
        sourceMicroserviceUuid: 'srcMsvcUUID1',
        destMicroserviceUuid: 'destMsvcUUID1',
        sourceIofogUuid: 'srcUUID1',
        destIofogUuid: 'destUUID1'
      }, {
        id: 234,
        sourceMicroserviceUuid: 'srcMsvcUUID2',
        destMicroserviceUuid: 'destMsvcUUID2',
        sourceIofogUuid: 'srcUUID2',
        destIofogUuid: 'destUUID2'
      }]
      def('findRoutesResponse', () => Promise.resolve(routes))

      beforeEach(() => {
        $sandbox.stub(RoutingManager, 'delete')
      })

      it('should delete routes', async () => {
        await $subject

        for(const route of routes) {
          expect(RoutingManager.delete).to.have.been.calledWith({id: route.id}, transaction)
          expect(ChangeTrackingService.update).to.have.been.calledWith(route.sourceIofogUuid, ChangeTrackingService.events.microserviceFull, transaction)
          expect(ChangeTrackingService.update).to.have.been.calledWith(route.destIofogUuid, ChangeTrackingService.events.microserviceFull, transaction)
        }
      })
    })
    
    context('when there are ports', () => {
      const publicPort = {
        id: 1,
        queueName: 'queuename',
        localProxyId: 15,
        remoteProxyId: null,
      }
      const portMappings = [{
        id: 1,
        portExternal: 1,
        portInternal: 1
      }, {
        id: 2,
        portExternal: 2,
        portInternal: 2,
        isPublic: true,
        getPublicPort: () => Promise.resolve(publicPort)
      }]
      const localProxyMsvc = {
        uuid: 'proxyuuid',
        iofogUuid: 'proxyiofoguuid',
        config: `{"mappings": ["amqp:${publicPort.queueName}=>http:${portMappings[1].portExternal}"]}`
      }
      const remoteProxyMsvc = null // Simulates K8s env
      def('findPortMappings', () => Promise.resolve(portMappings))

      beforeEach(() => {
        $sandbox.stub(MicroservicePortManager, 'delete')
        $sandbox.stub(MicroserviceManager, 'update')
        $sandbox.stub(MicroserviceManager, 'findOne')
        .withArgs({uuid: publicPort.localProxyId}, transaction).returns(Promise.resolve(localProxyMsvc))
        .withArgs({uuid: publicPort.remoteProxyId}, transaction).returns(Promise.resolve(remoteProxyMsvc))
      })

      it('should delete ports and proxy msvc', async () => {
        await $subject
        // Private port
        expect(MicroservicePortManager.delete).to.have.been.calledWith({id: portMappings[0].id}, transaction)
        expect(MicroserviceManager.update).to.have.been.calledWith({ uuid: microserviceData.uuid }, {rebuild: true}, transaction)
        expect(ChangeTrackingService.update).to.have.been.calledWith(microserviceData.iofogUuid, ChangeTrackingService.events.microserviceCommon, transaction)
      
        // Public port
        expect(MicroserviceManager.findOne).to.have.been.calledWith({uuid: publicPort.localProxyId}, transaction)
        expect(MicroserviceManager.findOne).to.have.been.calledWith({uuid: publicPort.remoteProxyId}, transaction)
        expect(MicroserviceManager.delete).to.have.been.calledWith({uuid: localProxyMsvc.uuid}, transaction)
        expect(ChangeTrackingService.update).to.have.been.calledWith(localProxyMsvc.iofogUuid, ChangeTrackingService.events.microserviceConfig, transaction)
        expect(MicroservicePortManager.delete).to.have.been.calledWith({id: portMappings[1].id}, transaction)
      })
    })

  });

  describe('.createPortMappingEndPoint()', () => {
    const transaction = {}
    const error = 'Error!'

    const user = {
      id: 15,
    }

    const microserviceUuid = 'testMicroserviceUuid'

    const microserviceData = {
      'uuid': microserviceUuid,
      'name': 'name2',
      'config': 'string',
      'catalogItemId': 15,
      'flowId': 16,
      'iofogUuid': 'testIofogUuid',
      'rootHostAccess': true,
      'logSize': 0,
      'volumeMappings': [
        {
          'hostDestination': '/var/dest',
          'containerDestination': '/var/dest',
          'accessMode': 'rw',
        },
      ],
      'ports': [
        {
          'internal': 1,
          'external': 1,
          'publicMode': false,
        },
      ],
      'routes': [],
    }
    const newMicroservice = {
      uuid: microserviceUuid,
      name: microserviceData.name,
      config: microserviceData.config,
      catalogItemId: microserviceData.catalogItemId,
      flowId: microserviceData.flowId,
      iofogUuid: microserviceData.iofogUuid,
      rootHostAccess: microserviceData.rootHostAccess,
      logSize: microserviceData.logLimit,
      registryId: 1,
      userId: user.id,
    }

    const portMappingData = [
      {
        'internal': 1,
        'external': 1,
        'publicMode': false,
      },
    ]

    const where = isCLI
      ? { uuid: microserviceUuid }
      : { uuid: microserviceUuid, userId: user.id }

    const mappingData = {
      isPublic: false,
      portInternal: portMappingData.internal,
      portExternal: portMappingData.external,
      userId: microserviceData.userId,
      microserviceUuid: microserviceData.uuid,
    }

    const fog = {
      uuid: microserviceData.iofogUuid,
      name: 'testFog'
    }

    def('subject', () => $subject.createPortMappingEndPoint(microserviceUuid, portMappingData, user, isCLI, transaction))
    def('validatorResponse', () => Promise.resolve(true))
    def('findMicroserviceResponse', () => Promise.resolve(microserviceData))
    def('findMicroservicePortResponse', () => Promise.resolve())
    def('createMicroservicePortResponse', () => Promise.resolve())
    def('updateMicroserviceResponse', () => Promise.resolve())
    def('updateChangeTrackingResponse', () => Promise.resolve())
    def('findOneFogResponse', () => Promise.resolve({...fog, getMicroservice: () => Promise.resolve([])}))
    def('findPublicPortsResponse', () => Promise.resolve([]))

    beforeEach(() => {
      $sandbox.stub(Validator, 'validate').returns($validatorResponse)
      $sandbox.stub(MicroserviceManager, 'findOne').returns($findMicroserviceResponse)
      $sandbox.stub(MicroservicePortManager, 'findOne').returns($findMicroservicePortResponse)
      $sandbox.stub(MicroservicePortManager, 'create').returns($createMicroservicePortResponse)
      $sandbox.stub(MicroserviceManager, 'update').returns($updateMicroserviceResponse)
      $sandbox.stub(ChangeTrackingService, 'update').returns($updateChangeTrackingResponse)
      $sandbox.stub(ioFogManager, 'findOne').returns($findOneFogResponse)
      $sandbox.stub(MicroservicePublicPortManager, 'findAll').returns($findPublicPortsResponse)
    })

    it('calls Validator#validate() with correct args', async () => {
      await $subject
      expect(Validator.validate).to.have.been.calledWith(portMappingData, Validator.schemas.portsCreate)
    })

    context('when Validator#validate() fails', () => {
      def('validatorResponse', () => Promise.reject(error))

      it(`fails with ${error}`, () => {
        return expect($subject).to.be.rejectedWith(error)
      })
    })

    context('when Validator#validate() succeeds', () => {
      it('calls MicroserviceManager#findOne() with correct args', async () => {
        await $subject
        expect(MicroserviceManager.findOne).to.have.been.calledWith(where, transaction)
      })

      context('when MicroserviceManager#findOne() fails', () => {
        def('findMicroserviceResponse', () => Promise.reject(error))

        it(`fails with ${error}`, () => {
          return expect($subject).to.be.rejectedWith(error)
        })
      })

      context('when MicroserviceManager#findOne() succeeds', () => {
        it('calls MicroservicePortManager#findOne() with correct args', async () => {
          await $subject
          expect(MicroservicePortManager.findOne).to.have.been.calledWith({
            microserviceUuid: microserviceUuid,
            [Op.or]:
              [
                {
                  portInternal: portMappingData.internal,
                },
                {
                  portExternal: portMappingData.external,
                },
              ],
          }, transaction)
        })

        context('when MicroservicePortManager#findOne() fails', () => {
          def('findMicroservicePortResponse', () => Promise.reject(error))

          it(`fails with ${error}`, () => {
            return expect($subject).to.be.rejectedWith(error)
          })
        })

        context('when MicroservicePortManager#findOne() succeeds', () => {
          it('calls MicroservicePortManager#create() with correct args', async () => {
            await $subject
            expect(MicroservicePortManager.create).to.have.been.calledWith(mappingData, transaction)
          })

          context('when MicroservicePortManager#create() fails', () => {
            def('createMicroservicePortResponse', () => Promise.reject(error))

            it(`fails with ${error}`, () => {
              return expect($subject).to.be.rejectedWith(error)
            })
          })

          context('when MicroservicePortManager#create() succeeds', () => {
            it('calls MicroserviceManager#update() with correct args', async () => {
              await $subject
              const updateRebuildMs = {
                rebuild: true,
              }
              expect(MicroserviceManager.update).to.have.been.calledWith({
                uuid: newMicroservice.uuid,
              }, updateRebuildMs, transaction)
            })

            context('when MicroserviceManager#update() fails', () => {
              def('updateMicroserviceResponse', () => Promise.reject(error))

              it(`fails with ${error}`, () => {
                return expect($subject).to.be.rejectedWith(error)
              })
            })

            context('when MicroserviceManager#update() succeeds', () => {
              it('calls ChangeTrackingService#update() with correct args', async () => {
                await $subject
                expect(ChangeTrackingService.update).to.have.been.calledWith(microserviceData.iofogUuid,
                    ChangeTrackingService.events.microserviceConfig, transaction)
              })

              context('when ChangeTrackingService#update() fails', () => {
                def('updateChangeTrackingResponse', () => Promise.reject(error))

                it(`fails with ${error}`, () => {
                  return expect($subject).to.be.rejectedWith(error)
                })
              })

              context('when ChangeTrackingService#update() succeeds', () => {
                it('fulfills the promise', () => {
                  return expect($subject).eventually.equals(undefined)
                })
              })
            })
          })
        })
      })
    })
  })
})
