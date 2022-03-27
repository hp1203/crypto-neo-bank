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
import CreateFd from "../../components/CreateFd";

const Investments = () => {
  const { account } = useContext(AuthContext)
  return (
    <AppLayout>
      <PageHeader title="Investments">
        {/* <AccountSelection/>
        */}
        {/* <CreatePaymentLink/>  */}
      </PageHeader>

      <HStack space={4}>
      
        <Grid cols={2}>
          <HStack>
          <Card className="mb-3">
                <div id="jh-stats-neutral" className="flex flex-col justify-center">
                <div className="flex justify-between mb-8">
                            <h1 className="text-lg font-semibold">Fixed Deposits</h1>
                            <CreateFd/>
                        </div>
                        <div className="flex justify-between">
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total FDs</p>
                        </div>
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total Investment</p>
                        </div>
                        <div className="flex w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total APY</p>
                        </div>
                        </div>
                    </div>
            </Card>
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
          </HStack>
          <HStack>
          <Card className="mb-3">
                <div id="jh-stats-neutral" className="flex flex-col justify-center">
                        <div className="flex justify-between mb-8">
                            <h1 className="text-lg font-semibold">Recursive Deposits</h1>
                            <Button title="Create RD" primary={true}/>
                        </div>
                        <div className="flex justify-between">
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total RDs</p>
                        </div>
                        <div className="flex border-r border-gray-100 w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total Investment</p>
                        </div>
                        <div className="flex w-full flex-col justify-center items-center">
                          <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                          <p className="text-lg text-center text-gray-500">Total APY</p>
                        </div>
                        </div>
                    </div>
            </Card>
          <AccountBalances/>
          </HStack>
        </Grid>
      </HStack>
    </AppLayout>
  );
};

export default Investments;
