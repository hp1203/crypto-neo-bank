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

const Dashboard = () => {
  const { account } = useContext(AuthContext)
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
          <AccountStats />
          {/* <Card className="max-h-40">
          </Card>
          <Card className="max-h-40">Dashboard</Card>
          <Card className="max-h-40">Dashboard</Card>
          <Card className="max-h-40">Dashboard</Card> */}
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

export default Dashboard;
