import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import { Store } from '../utils/Store'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from 'next-auth/react'

export default function Layout({ title, children }) {
  const { status, data: session } = useSession()
  const { state } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])
  return (
    <>
      <Head>
        <title>
          {title
            ? title + ' - NextJS Tailwind Ecommerce'
            : 'NextJS Tailwind Ecommerce'}
        </title>
        <meta name='description' content='Ecommerce Website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 justify-between items-center shadow-md px-4'>
            <Link href='/'>
              <a className='text-lg font-bold'>Raffaelli</a>
            </Link>
            <div>
              <Link href='/cart'>
                <a className='p-2'>
                  Cart
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {status === 'loading' ? (
                'Loading...'
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href='/login'>
                  <a className='p-2'>Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex shadow-inner h-10 justify-center items-center'>
          <p>
            {' '}
            Copyright &copy; {new Date().getFullYear()}&nbsp;
            <a href='https://raffaelli.studio' target='_blank' rel='noreferrer'>
              Raffaelli.Studio
            </a>{' '}
          </p>
        </footer>
      </div>
    </>
  )
}
