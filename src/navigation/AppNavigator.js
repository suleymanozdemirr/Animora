import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  DashboardScreen,
  AnimeDetailScreen,
  AddAnimeScreen,
  RegisterScreen,
  LoginScreen,
  ForgotPasswordScreen,
  VerificationCodeScreen,
  ResetPasswordScreen,
} from "../screens"
import { useAuth } from "../context/AuthContext"
import { colors } from "../constants/colors"

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  const { isAuthenticated } = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="AnimeDetail"
              component={AnimeDetailScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="AddAnime"
              component={AddAnimeScreen}
              options={{
                animation: "slide_from_bottom",
                presentation: "modal",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="VerificationCode"
              component={VerificationCodeScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
