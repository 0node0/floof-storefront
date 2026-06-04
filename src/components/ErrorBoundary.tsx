import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600 font-medium">Something went wrong</p>
          <button onClick={() => this.setState({ error: null })} className="mt-2 text-sm text-red-500 underline hover:no-underline">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}