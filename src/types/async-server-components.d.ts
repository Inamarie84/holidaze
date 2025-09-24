// Allow async Server Components to be used in JSX without TS errors.
import 'react'

declare module 'react' {
  // Widen the callable signature so FC/ComponentType can return a Promise
  // in the RSC runtime. Using Record<string, never> avoids the "{}" lint.
  // This does not affect runtime behavior; it's only for typing.
  interface FunctionComponent<P = Record<string, never>> {
    (props: P): React.ReactNode | Promise<React.ReactNode>
  }
  interface ComponentType<P = Record<string, never>> {
    (props: P): React.ReactNode | Promise<React.ReactNode>
  }
}
