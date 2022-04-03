import React, { useContext, useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import PageHeader from "../../components/dashboard/PageHeader";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Grid from "../../components/UI/Grid";
import HStack from "../../components/UI/HStack";

import { FaArrowDown, FaArrowRight, FaArrowUp } from "react-icons/fa";
import Table from "../../components/UI/Table";
import TableBody from "../../components/UI/TableBody";
import TableRow from "../../components/UI/TableRow";
import TableCol from "../../components/UI/TableCol";
import TableFooter from "../../components/UI/TableFooter";
import TableHead from "../../components/UI/TableHead";

import { AccountBalances } from "../../components/AccountBalances";

import { AuthContext } from "../../context/AuthContext";
import CreatePaymentLink from "../../components/CreatePaymentLink";
import { createClient } from "urql";
import { utils } from "ethers";
import { getEllipsisTxt } from "../../helpers/formatters";
import { cryptos } from "../../constants/cryptos";
import moment from "moment";
import { useMoralis } from "react-moralis";

const Transactions = () => {
  const { account } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const { chainId } = useMoralis()
  const APIURL = "https://api.thegraph.com/subgraphs/name/hp1203/cryptoneo";
  const query = `
    query {
        transactions (
            first: 20
            orderBy: timestamp
            orderDirection: desc
            where: { owner: "${account}" }
        ) {
            id
            currency
            token
            depositor
            owner
            accountNumber
            amount
            timestamp
        }
    }
  `;

  const client = createClient({
    url: APIURL,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await client.query(query).toPromise();
      console.log("Response", response);
      if(response.data){

        setTransactions(response.data.transactions);
      }
    };
    fetchData();
  }, []);
  return (
    <AppLayout>
      <PageHeader title="Transactions">
        {/* <AccountSelection/>
         */}
        {/* <CreatePaymentLink /> */}
      </PageHeader>

      <Card className="">
        <div className="flex mb-4 items-center justify-between">
          <p className="font-semibold text-lg">Latest Transactions</p>
          <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
        </div>
        <Table>
          <TableHead
            tableHeadings={[
              "#",
              "Currency",
              "Token",
              "Depositor/Withdrawer",
              "Owner",
              "Account Number",
              "amount",
              "timestamp",
            ]}
          />
          <TableBody>
            {
              transactions.length > 0 ?
              transactions.map((transaction, index) => (
              <>
                <TableRow>
                  <TableCol>{index+1}</TableCol>
                  <TableCol>{transaction.currency}</TableCol>
                  <TableCol>
                    {
                      cryptos["0x13881"].filter(
                        (crypto) => crypto.address == transaction.token
                      ).name
                    }
                  </TableCol>
                  <TableCol>
                    {getEllipsisTxt(transaction.depositor, 6)}
                  </TableCol>
                  <TableCol>{getEllipsisTxt(transaction.owner, 6)}</TableCol>
                  <TableCol>{transaction.accountNumber}</TableCol>
                  <TableCol>
                    {utils.formatEther(transaction.amount)}{" "}
                    {/* {transaction.currency} */}
                    {cryptos["0x13881"][0].symbol}
                  </TableCol>
                  <TableCol>
                    {moment.unix(transaction.timestamp).toString()}
                  </TableCol>
                </TableRow>
              </>
            ))
            : (
                          <TableRow className="w-full">
                          <TableCol colSpan="8" className="text-center border">
                            <p className="text-base text-gray-500">No Transactions Found</p>
                          </TableCol>
                          </TableRow>
                        )
            }
          </TableBody>
        </Table>
      </Card>
    </AppLayout>
  );
};

export default Transactions;
