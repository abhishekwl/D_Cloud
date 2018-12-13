import { createStackNavigator } from 'react-navigation';
//LOCAL
import Splash from './app/src/screens/Splash';
import SignIn from './app/src/screens/SignIn';
import SignUp from './app/src/screens/SignUp';
import Home from './app/src/screens/Home';

export default createStackNavigator(
  {
    Splash: { screen: Splash },
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    Home: { screen: Home }
  },
  {
    headerMode: 'none',
    initialRouteKey: Splash
  }
);