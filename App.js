import React from "react"
import { StatusBar } from "expo-status-bar"
import * as SplashScreen from "expo-splash-screen"
import { AnimeProvider, useAnime } from "./src/context/AnimeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import AppNavigator from "./src/navigation/AppNavigator"
import AnimatedBootSplash from "./src/components/AnimatedBootSplash"

SplashScreen.preventAutoHideAsync().catch(() => {})

const splashSource = require("./assets/app-icon.png")

function AppShell() {
  const { loading: animeLoading } = useAnime()
  const { loading: authLoading } = useAuth()
  return (
    <AnimatedBootSplash
      dataReady={!animeLoading && !authLoading}
      splashSource={splashSource}
    >
      <AppNavigator />
    </AnimatedBootSplash>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AnimeProvider>
        <StatusBar style="light" />
        <AppShell />
      </AnimeProvider>
    </AuthProvider>
  )
}
