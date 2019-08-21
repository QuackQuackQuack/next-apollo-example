import Link from 'next/link'
import { withRouter } from 'next/router'
import css from '../css/header.css'

const Header = ({ router: { pathname } }) => (
  <header className={css.header}>
    <Link prefetch href='/'>
      <a className={pathname === '/' ? css.active : ''}>Home</a>
    </Link>
    <Link prefetch href='/post'>
      <a className={pathname === '/post' ? css.active : ''}>subscription list exmaple</a>
    </Link>
    <Link prefetch href='/map'>
      <a className={pathname === '/map' ? css.active : ''}>subscription KaKaoMap example</a>
    </Link>
  </header>
)

export default withRouter(Header)
