import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AttendenceTrackerFactory } from '../artifacts/attendence_tracker/AttendenceTrackerClient'

export async function deploy() {
  console.log('=== Deploying AttendenceTracker ===')

  const algorand = AlgorandClient.fromEnvironment()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  const factory = algorand.client.getTypedAppFactory(AttendenceTrackerFactory, {
    defaultSender: deployer.addr,
  })

  const { appClient, result } = await factory.deploy({ onUpdate: 'append', onSchemaBreak: 'append' })

  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    })
  }
}
