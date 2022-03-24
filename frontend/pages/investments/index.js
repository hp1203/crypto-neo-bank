import React, { useContext } from "react";
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

const Investments = () => {
  const { account } = useContext(AuthContext)
  return (
    <AppLayout>
      <PageHeader title="Investments">
        {/* <AccountSelection/>
        */}
        <CreatePaymentLink/> 
      </PageHeader>

      <HStack space={4}>
      <Grid cols={3}>

            <Card>

                <div id="jh-stats-positive" className="flex flex-col justify-center ">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-green-500 text-md">
                                <span className="font-bold">6%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                        <p className="text-lg text-center text-gray-500">New Tickets</p>
                    </div>
                </div>
            </Card>
            <Card>

                <div id="jh-stats-negative" className="flex flex-col justify-center ">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-red-500 text-md">
                                <span className="font-bold">6%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                        <p className="text-lg text-center text-gray-500">New Tickets</p>
                    </div>
                </div>
            </Card>
            <Card>
                <div id="jh-stats-neutral" className="flex flex-col justify-center">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-gray-500 text-md">
                                <span className="font-bold">0%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                        <p className="text-lg text-center text-gray-500">New Tickets</p>
                    </div>
                </div>
            </Card>


        </Grid>
        <Grid cols={2}>
        
          <Card className="">
            <div className="flex mb-4 items-center justify-between">
              <p className="font-semibold text-lg">Latest Transactions</p>
              <FaArrowRight className="text-sm items-center font-base tracking-widest text-violet-500" />
            </div>
            <Table>
              <TableHead
                tableHeadings={["#", "Category", "Details", "Change"]}
              />
              <TableBody>
                <TableRow>
                  <TableCol>1</TableCol>
                  <TableCol>4,569</TableCol>
                  <TableCol>340</TableCol>
                  <TableCol>
                    <div className="inline-flex items-center">
                      <FaArrowUp className="fas fa-arrow-up text-emerald-500 mr-2"></FaArrowUp>
                      46,53%
                    </div>
                  </TableCol>
                </TableRow>
                <TableRow>
                  <TableCol>2</TableCol>
                  <TableCol>3,985</TableCol>
                  <TableCol>319</TableCol>
                  <TableCol>
                    <div className="inline-flex items-center">
                      <FaArrowDown className="fas fa-arrow-down text-orange-500 mr-2"></FaArrowDown>
                      46,53%
                    </div>
                  </TableCol>
                </TableRow>
                <TableRow>
                  <TableCol>3</TableCol>
                  <TableCol>3,513</TableCol>
                  <TableCol>294</TableCol>
                  <TableCol>
                    <div className="inline-flex items-center">
                      <FaArrowDown className="fas fa-arrow-down text-orange-500 mr-2"></FaArrowDown>
                      36,49%
                    </div>
                  </TableCol>
                </TableRow>
                <TableRow>
                  <TableCol>4</TableCol>
                  <TableCol>2,050</TableCol>
                  <TableCol>147</TableCol>
                  <TableCol>
                    <div className="inline-flex items-center">
                      <FaArrowUp className="fas fa-arrow-up text-emerald-500 mr-2"></FaArrowUp>
                      <span>50.87%</span>
                    </div>
                  </TableCol>
                </TableRow>
                <TableRow>
                  <TableCol>5</TableCol>
                  <TableCol>1,795</TableCol>
                  <TableCol>190</TableCol>
                  <TableCol>
                    <div className="inline-flex items-center">
                      <FaArrowDown className="fas fa-arrow-down text-red-500 mr-2"></FaArrowDown>
                      46,53%
                    </div>
                  </TableCol>
                </TableRow>
              </TableBody>
            </Table>
            <TableFooter>
              <a
                href="#"
                className="flex items-center justify-center space-x-2"
              >
                <span>See More</span>
                <FaArrowRight className="text-gray-600"></FaArrowRight>
              </a>
            </TableFooter>
          </Card>
          <AccountBalances/>
        </Grid>
      </HStack>
    </AppLayout>
  );
};

export default Investments;
