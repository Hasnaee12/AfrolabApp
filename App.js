import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import DepartmentScreen from './screens/DepartmentScreen';
import HomeScreen from './screens/HomeScreen';
import TaskScreen from './screens/TaskScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ReportScreen from './screens/ReportScreen';
import HomeScreenAdmin from './screens/HomeScreenAdmin';
import ViewEmployeeScreen from './screens/ViewEmployeeScreen';
import ManageEmployeeScreen from './screens/ManageEmployeeScreen';
import ViewDepartmentResponsiblesScreen from './screens/ViewDepartmentResponsiblesScreen';
import ManageDepartmentResponsiblesScreen from './screens/ManageDepartmentResponsiblesScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import HomeScreenSuperuser from './screens/HomeScreenSuperuser';
import ManageDefinedTaskScreen from './screens/ManageDefinedTaskScreen';
import ManageEquipment from './screens/manageEquipment';
import ViewEmployeeAdmin from './screens/ViewEmployeeAdmin';
import ManageEmployeeAdmin from './screens/ManageEmployeeAdmin';


const Stack = createStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null); // Example: 'admin', 'employee', 'superuser'

  // Define screens based on user role
  const getHomeScreen = () => {
    switch (userRole) {
      case 'admin':
        return HomeScreenAdmin;
      case 'superuser':
        return HomeScreenSuperuser;
      default:
        return HomeScreen;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication and role-based navigation */}
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} setUserRole={setUserRole} />}
        </Stack.Screen>
        <Stack.Screen name="Department" component={DepartmentScreen} />
        <Stack.Screen name="Home" component={getHomeScreen()} />
        <Stack.Screen name="Tasks" component={TaskScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="Reports" component={ReportScreen} />
        {/* Admin Screens */}
        {userRole === 'admin' && (
          <>
            <Stack.Screen name="HomeScreenAdmin" component={HomeScreenAdmin} />
            <Stack.Screen name="ViewDepartmentResponsibles" component={ViewDepartmentResponsiblesScreen} />
            <Stack.Screen name="ManageDepartmentResponsibles" component={ManageDepartmentResponsiblesScreen} />
            <Stack.Screen name="ViewEmployeeAdmin" component={ViewEmployeeAdmin} />
            <Stack.Screen name="ManageEmployeeAdmin" component={ManageEmployeeAdmin} />
            <Stack.Screen name="ManageEquipment" component={ManageEquipment} />
            <Stack.Screen name="ViewReportsAdmin" component={ViewReportsScreen} />
          </>
        )}
        {/* Superuser Screens */}
        {userRole === 'superuser' && (
          <>
            <Stack.Screen name="HomeScreenSuperuser" component={HomeScreenSuperuser} />
            <Stack.Screen name="ViewEmployeeSuperuser" component={ViewEmployeeScreen} />
            <Stack.Screen name="ManageEmployeeSuperuser" component={ManageEmployeeScreen} />
            <Stack.Screen name="ManageDefinedTask" component={ManageDefinedTaskScreen} />
            <Stack.Screen name="ViewReportsSuperuser" component={ViewReportsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


