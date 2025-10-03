// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import React, { useCallback } from 'react'
// import { signInWithGoogle } from '../services/supabase'
// import Message from './Message'

// type GoogleSignInButtonProps = {
//   text?: 'Sign in with Google' | 'Sign up with Google' // allowed variations
// }

// export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
//   text = 'Sign in with Google',
// }) => {
//   const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

//   const handleSignIn = useCallback(async () => {
//     const result = await signInWithGoogle()
//     if (result.error) {
//       setErrorMessage(result.error)
//     }
//   }, [])

//   return (
//     <Box>
//       {errorMessage && <Message color="error" message={errorMessage} />}
//       <Button
//         fullWidth
//         variant="contained"
//         onClick={handleSignIn}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '12px',
//           fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
//           fontSize: '14px',
//           fontWeight: 500,
//         }}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 48 48"
//         >
//           <path
//             fill="#EA4335"
//             d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C36.46 2.7 30.72 0 24 0 14.7 0 6.6 5.38 2.55 13.22l7.98 6.19C12.43 13.07 17.74 9.5 24 9.5z"
//           />
//           <path
//             fill="#4285F4"
//             d="M46.1 24.5c0-1.57-.14-3.08-.39-4.5H24v9h12.45c-.54 2.77-2.1 5.1-4.45 6.68l7.01 5.44c4.1-3.79 6.49-9.37 6.49-16.62z"
//           />
//           <path
//             fill="#FBBC05"
//             d="M10.53 28.41c-1.24-2.77-1.24-6.05 0-8.82l-7.98-6.19C.92 16.58 0 20.17 0 24s.92 7.42 2.55 10.6l7.98-6.19z"
//           />
//           <path
//             fill="#34A853"
//             d="M24 48c6.48 0 11.91-2.13 15.88-5.79l-7.01-5.44c-2.1 1.41-4.78 2.23-8.87 2.23-6.26 0-11.57-3.57-13.47-8.7l-7.98 6.19C6.6 42.62 14.7 48 24 48z"
//           />
//           <path fill="none" d="M0 0h48v48H0z" />
//         </svg>
//         {text}
//       </Button>
//     </Box>
//   )
// }
