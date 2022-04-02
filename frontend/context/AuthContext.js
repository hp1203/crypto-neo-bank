import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";

export const AuthContext = React.createContext();

// const { ethereum } = window;

export const AuthProvider = ({ children }) => {
  // walletConnected keep track of whether the user's wallet is connected or not

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, chainId } = useMoralis();

  const login = async () => {
    if (!isAuthenticated) {

      await authenticate({signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const logOut = async () => {
    await logout();
    console.log("logged out");
  }


  return (
    <AuthContext.Provider
      value={{
        login, user, account, logOut, chainId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

