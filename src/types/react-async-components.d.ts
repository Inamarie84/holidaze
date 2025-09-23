import 'react'

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P): React.ReactElement | Promise<React.ReactElement> | null
  }
}
