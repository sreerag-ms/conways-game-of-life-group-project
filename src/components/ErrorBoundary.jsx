import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="mb-4 -mt-20 text-4xl text-gray-500 animate-spin">⚙️</div>
          <h3 className="mb-3 text-2xl font-semibold">
          Uh oh, Something went wrong!
          </h3>
          <p className='mb-2'>Our WebGL features aren't optimized for <br/> your device yet.</p>
          <p className='text-sm'>
          Please check out our prototype version:{' '}  <br/>
            <a
              href="https://v1.gameoflife.site"
              className="text-blue-500 underline"
            >
            https://v1.gameoflife.site
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
