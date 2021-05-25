/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const generateGQLFile = {
  label: 'Sync insomnia file to .graphql',
  icon: 'fa-exchange',
  action: async (
    context: any,
    obj: {
      requestGroup: any
      requests: Array<any>
    },
  ): Promise<void> => {
    const resp = await context.app.showSaveDialog()
    console.log(resp)
    console.log(context)
    console.log(obj.requestGroup)
    console.log(obj.requests[0])
  },
}
