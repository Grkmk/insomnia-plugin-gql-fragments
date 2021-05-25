export type RequestAction = {
  action: (
    context: any,
    obj: {
      requestGroup: any
      request: any
    },
  ) => Promise<void> | void
  label: string
  icon?: string
}
