const serializeReason = (reason) => {
  if (reason instanceof Error) {
    return { message: reason.message, stack: reason.stack }
  }
  return { reason }
}

const setupCrashHandlers = () => {
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection', serializeReason(reason))
    process.exit(1)
  })

  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception', serializeReason(err))
    process.exit(1)
  })
}

export default setupCrashHandlers

