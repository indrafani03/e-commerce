import React from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../stores/useUserStore'
function LoginPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {login, loading} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  }

  return (
    <div className='flex flex-col items-center py-12 sm:px-6 lg:px-8'>
      <motion.div className='sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.8, }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Login your account</h2>
      </motion.div>
      <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.8, delay: 0.2}}
      >
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
             
              <div>
                 <label htmlFor="email" className='block text-sm font-medium  text-gray-300'>
                   Email address
                 </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3  pointer-events-none'>
                      <Mail className='w-5 h-5 text-gray-400' aria-hidden='true'/>
                    </div>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      autoComplete='email'
                      required
                      className='block w-full pl-10 pr-3 py-2 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                      placeholder='you@gmail.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
              </div>
              <div>
                 <label htmlFor="password" className='block text-sm font-medium  text-gray-300'>
                   Password
                 </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3  pointer-events-none'>
                      <Mail className='w-5 h-5 text-gray-400' aria-hidden='true'/>
                    </div>
                    <input
                      type='password'
                      id='password'
                      name='password'
                      autoComplete='password'
                      required
                      className='block w-full pl-10 pr-3 py-2 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                      placeholder='**********'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
              </div>
              

           <button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
                  {loading ? (
                    <>
                      <Loader className='animate-spin mr-2 h-5 w-5' aria-hidden='true' /> Loading...</>
                  ) : (
                    <>
                      <LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
                        Login
                    </>
                  )}
              </button>

          </form>
            <p className='mt-8 text-center text-sm text-gray-400'>
                  Not a member?{' '}
                  <Link to={'/login'} className='font-medium text-emerald-600 hover:text-emerald-300'>
                    Sign Up <ArrowRight className='inline-block h-4 w-4'/>
                  </Link>
            </p>

        </div>
      </motion.div>

    </div>
  )
}

export default LoginPage