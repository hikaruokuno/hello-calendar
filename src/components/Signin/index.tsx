// import React, { FC, useContext } from 'react';
// import firebase from 'firebase/app';
// import { FirebaseContext } from 'contexts';
// import { StyledFirebaseAuth } from 'react-firebaseui';
// import { useNavigate } from 'react-router';

// const Signin: FC = () => {
//   const { auth } = useContext(FirebaseContext);
//   const navigate = useNavigate();
//   const uiConfig: firebaseui.auth.Config = {
//     signInFlow: 'redirect',
//     signInOptions: [
//       {
//         provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         scopes: ['https://www.googleapis.com/auth/calendar.events'],
//       },
//     ],
//     callbacks: {
//       signInSuccessWithAuthResult: (authResult, redirectUrl) => {
//         const dest = redirectUrl || '/';
//         navigate(dest, { replace: true });

//         return false;
//       },
//     },
//   };

//   return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
// };

// export default Signin;
