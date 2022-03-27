import React, { useContext } from "react";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/dashboard/PageHeader";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Grid from "../../components/UI/Grid";
import HStack from "../../components/UI/HStack";
import { AccountStats } from "../../components/AccountStats";
import { FaArrowDown, FaArrowRight, FaArrowUp } from "react-icons/fa";
import Table from "../../components/UI/Table";
import TableBody from "../../components/UI/TableBody";
import TableRow from "../../components/UI/TableRow";
import TableCol from "../../components/UI/TableCol";
import TableFooter from "../../components/UI/TableFooter";
import TableHead from "../../components/UI/TableHead";
import { cryptos } from "../../constants/cryptos";
import ListItem from "../../components/UI/ListItem";
import Account from "../../components/Account";
import CreateAccount from "../../components/CreateAccount";
import AccountSelection from "../../components/AccountSelection";
import { AccountBalances } from "../../components/AccountBalances";
import { WalletContext } from "../../context/WalletContext";
import { AuthContext } from "../../context/AuthContext";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import Image from "next/image";
import { AccountTransactions } from "../../components/AccountTransactions";

const Dashboard = () => {
  const { account } = useContext(AuthContext)
  const showRampModal = () => {
    new RampInstantSDK({
        hostAppName: 'Cryptoneo',
        hostLogoUrl: 'https://orbital.vision/wp-content/uploads/2021/07/orbital-logo-black.svg',
        variant: "auto",
        
      }).show();
  }
  return (
    <AppLayout>
      <PageHeader title="Your Accounts">
        <AccountSelection/>
        <CreateAccount/>
      </PageHeader>

      <HStack space={4}>
        <Grid cols={3} className="grid-cols-1 md:grid-cols-3">
          <AccountStats className="col-span-2" />
          {/* <AccountStats /> */}
          <Card className="flex flex-col justify-center items-center space-y-2">
            <img objectFit="cover" className="w-20 h-20 rounded-full object-cover border-4 border-gray-200" alt="eth" src="https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278328_1280.png" />
            <p className="text-2xl max-w-xs text-center font-light">{"Don't have cryptos in your wallet?"}</p>
            <Button onClick={showRampModal} primary title="Buy some with Card"/>
          </Card>
          {/* <Card className="max-h-40">
          </Card>
          <Card className="max-h-40">Dashboard</Card>
          <Card className="max-h-40">Dashboard</Card>
          <Card className="max-h-40">Dashboard</Card> */}
        </Grid>
        <Grid cols={2}>
          <AccountTransactions/>
          <AccountBalances/>
        </Grid>
      </HStack>
    </AppLayout>
  );
};

export default Dashboard;
