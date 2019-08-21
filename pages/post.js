import App from '../components/App'
import Header from '../components/Header'
import Create from '../components/Create'
import Post from '../components/Post'

export default () => (
  <App>
    <Header />
    <div>
      <Create />
      <Post />
    </div>
  </App>
)
