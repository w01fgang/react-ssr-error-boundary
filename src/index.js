// @flow
import React, { PureComponent } from 'react'

const server = typeof window === 'undefined' && require('./server')

type Props = {|
  +children: React$Node,
    +fallBack: () => React$Node,
|};

type State = {|
  +hasError: boolean,
|};

export function withContext (contextTypes: $FlowFixMe = {}) {
  const ProvideContext = server && server._makeProvider(contextTypes)

  class ServerBoundary extends PureComponent<Props, State> {
    static defaultProps = {
      fallBack: () => null
    }
    static contextTypes = contextTypes
    state = {
      hasError: false
    }

    componentDidCatch () {
      this.setState({
        hasError: true
      })
    }

    render () {
      if (server) return server._render(this, ProvideContext)
      return <div>{this.state.hasError ? this.props.fallBack() : this.props.children}</div>
    }
  }

  return ServerBoundary
}

export default withContext()
