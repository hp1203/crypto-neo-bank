import React, { useContext, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./UI/Button";
import Card from "./UI/Card";
import { AccountContext } from "../context/AccountContext";
import ShowMoreText from "react-show-more-text";
import Image from "next/image";
import ListItem from "./UI/ListItem";
import { createClient } from "urql";
import Table from "./UI/Table";
import TableHead from "./UI/TableHead";
import TableBody from "./UI/TableBody";
import TableRow from "./UI/TableRow";
import TableCol from "./UI/TableCol";
import { getEllipsisTxt } from "../helpers/formatters";
import { utils } from "ethers";
import moment from "moment";
import { cryptos } from "../constants/cryptos";

export const AccountTransactions = (props) => {
  const { selectedAccount, Balances, getEthBalance, getERC20Balance } =
    useContext(AccountContext);
  const [transactions, setTransactions] = useState([]);
  const APIURL = "https://api.thegraph.com/subgraphs/name/hp1203/cryptoneo";

  const client = createClient({
    url: APIURL,
  });

  useEffect(() => {
    if (selectedAccount) {
      const fetchData = async () => {
        const query = `
    query {
        transactions (
            first: 20
            orderBy: timestamp
            orderDirection: desc
            where: { accountNumber: ${selectedAccount.accountNumber} }
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
        console.log("query", query);
        const response = await client.query(query).toPromise();
        console.log("Response", response);
        if (response.data) {
          setTransactions(response.data.transactions);
        }
      };
      fetchData();
    }
  }, [selectedAccount]);
  return (
    <Card {...props}>
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
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <>
                <TableRow key={index}>
                  <TableCol>{index + 1}</TableCol>
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
                    {transaction.currency}
                  </TableCol>
                  <TableCol>
                    {moment.unix(transaction.timestamp).toString()}
                  </TableCol>
                </TableRow>
              </>
            ))
          ) : (
            <TableRow className="w-full">
              <TableCol colSpan="8" className="text-center border">
                <p className="text-base text-gray-500">No Transactions Found</p>
              </TableCol>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
