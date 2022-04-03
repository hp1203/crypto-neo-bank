import React, { useContext, useState, useEffect } from "react";
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
import { AccountBalances } from "../../components/AccountBalances";
import { WalletContext } from "../../context/WalletContext";
import { AuthContext } from "../../context/AuthContext";
import CreatePaymentLink from "../../components/CreatePaymentLink";
import { createClient } from "urql";
import { getEllipsisTxt } from "../../helpers/formatters";
import { utils } from "ethers";
import moment from "moment";
import ListItem from "../../components/UI/ListItem";
import { FiExternalLink } from "react-icons/fi";
import { useMoralis } from "react-moralis";

const Payments = () => {
  const { account } = useContext(AuthContext);
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [payments, setPayments] = useState([]);
  const { chainId } = useMoralis()
  const APIURL = "https://api.thegraph.com/subgraphs/name/hp1203/cryptoneo";
  console.log("Acc", account);
  const query = `
    query {
        paymentLinks (
            orderBy: timestamp
            orderDirection: desc
            where: { owner: "${account}" }
        ) {
          id
          owner
          paymentLinkId
          url
          type
          receiver
          metadata
          timestamp
        }
        payments (
          first: 20
          orderBy: paymentId
          orderDirection: desc
        ) {
          id
          paymentId
          mode
          sender
          receiver
          account
          fee
          currency
          timestamp
        }
    }
  `;
  console.log("query", query);
  const client = createClient({
    url: APIURL,
  });

  const fetchData = async () => {
    const response = await client.query(query).toPromise();
    console.log("Response", response);
    if (response.data) {
      setPaymentLinks(response.data.paymentLinks);
      setPayments(response.data.payments);
    }
  };
  useEffect(() => {
    fetchData();
  }, [account]);
  return (
    <AppLayout>
      <PageHeader title="Payments">
        {/* <AccountSelection/>
         */}
        <CreatePaymentLink fetchData={fetchData} />
      </PageHeader>

      <HStack space={4}>
        <Grid cols={2}>
          <Card className="">
            <div className="flex mb-4 items-center justify-between">
              <p className="font-semibold text-lg">Latest Payments</p>
              <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
            </div>
            <Table>
              <TableHead
                tableHeadings={[
                  "#",
                  "Payment ID",
                  "Mode",
                  "Sender",
                  "Account Number",
                  "Amount",
                  "Fee",
                  "Date",
                ]}
              />
              <TableBody className="overflow-x-scroll">
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <>
                      <TableRow key={index}>
                        <TableCol>{index + 1}</TableCol>
                        <TableCol>{payment.paymentId}</TableCol>
                        <TableCol>{payment.mode}</TableCol>
                        {/* <TableCol>{
                                cryptos["0x13881"].filter(crypto => crypto.address == payment.token).name
                            }</TableCol> */}
                        <TableCol>{getEllipsisTxt(payment.sender, 6)}</TableCol>
                        <TableCol>{payment.account}</TableCol>
                        <TableCol>
                          {payment.amount
                            ? utils.formatEther(payment.amount.toString())
                            : 0.0}{" "}
                          {
                            cryptos["0x13881"].filter(
                              (crypto) => crypto.address == payment.currency
                            ).symbol
                          }
                        </TableCol>
                        <TableCol>
                          {utils.formatEther(payment.fee.toString())}{" "}
                          {
                            cryptos["0x13881"].filter(
                              (crypto) =>
                                crypto.address == payment.currency.toString()
                            ).symbol
                          }
                        </TableCol>
                        <TableCol>
                          {moment.unix(payment.timestamp).toString()}
                        </TableCol>
                      </TableRow>
                    </>
                  ))
                ) : (
                  <TableRow className="w-full">
                    <TableCol colSpan="8" className="text-center border">
                      <p className="text-base text-gray-500">
                        No Payments Found
                      </p>
                    </TableCol>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          <HStack space={3}>
            <Card className="mb-3">
              <div
                id="jh-stats-positive"
                className="flex flex-col justify-center items-center mb-3"
              >
                {/* <div>
            <p className="flex items-center justify-end text-green-500 text-md">
                <span className="font-bold">6%</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
            </p>
        </div> */}
                <p className="text-3xl font-semibold text-center text-gray-800">
                  {paymentLinks.length}
                </p>
                <p className="text-lg text-center text-gray-500">
                  Payment Links
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex mb-4 items-center justify-between">
                <p className="font-semibold text-lg">Payment Links</p>
                <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
              </div>
              {paymentLinks.map((link, index) => (
                <ListItem
                  title={link.url}
                  subTitle={link.type}
                  key={index}
                  left={
                    <div className="flex flex-col items-end">
                      <a
                        className="text-xs text-green-600"
                        target="_blank"
                        rel="noreferrer"
                        href={`pay/${link.url}`}
                      >
                        <FiExternalLink className="text-base text-violet-500 cursor-pointer" />
                      </a>
                    </div>
                  }
                />
              ))}
            </Card>
          </HStack>
        </Grid>
      </HStack>
    </AppLayout>
  );
};

export default Payments;
