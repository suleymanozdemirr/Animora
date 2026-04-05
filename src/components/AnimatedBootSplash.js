import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from "react-native"
import * as SplashScreen from "expo-splash-screen"

const BG = "#0c0c10"
const MIN_SPLASH_MS = 2000

export default function AnimatedBootSplash({
  dataReady,
  children,
  splashSource,
}) {
  const [visible, setVisible] = useState(true)
  const opacity = useRef(new Animated.Value(0)).current
  const scaleOuter = useRef(new Animated.Value(0.88)).current
  const pulse = useRef(new Animated.Value(1)).current
  const layerOpacity = useRef(new Animated.Value(1)).current
  const pulseLoopRef = useRef(null)
  const startTime = useRef(null)
  const exitedRef = useRef(false)

  useEffect(() => {
    startTime.current = Date.now()
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {})
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const intro = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleOuter, {
        toValue: 1,
        friction: 7,
        tension: 78,
        useNativeDriver: true,
      }),
    ])

    intro.start(() => {
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.035,
            duration: 780,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 780,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ])
      )
      pulseLoopRef.current.start()
    })

    return () => {
      intro.stop?.()
      pulseLoopRef.current?.stop?.()
    }
  }, [opacity, scaleOuter, pulse])

  useEffect(() => {
    if (!dataReady || exitedRef.current) return

    const elapsed = Date.now() - (startTime.current ?? Date.now())
    const delay = Math.max(0, MIN_SPLASH_MS - elapsed)

    const t = setTimeout(() => {
      if (exitedRef.current) return
      exitedRef.current = true
      pulseLoopRef.current?.stop?.()
      pulse.setValue(1)

      Animated.parallel([
        Animated.timing(layerOpacity, {
          toValue: 0,
          duration: 460,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(scaleOuter, {
          toValue: 1.05,
          duration: 460,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => setVisible(false))
    }, delay)

    return () => clearTimeout(t)
  }, [dataReady, layerOpacity, scaleOuter, pulse])

  return (
    <View style={styles.root}>
      <View style={styles.main}>{children}</View>
      {visible && (
        <Animated.View
          style={[styles.overlay, { opacity: layerOpacity }]}
          pointerEvents="auto"
        >
          <Animated.View
            style={{
              flex: 1,
              opacity,
              transform: [{ scale: scaleOuter }],
            }}
          >
            <Animated.View
              style={{ flex: 1, transform: [{ scale: pulse }] }}
            >
              <Image
                source={splashSource}
                style={styles.image}
                resizeMode="cover"
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  main: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
  },
  image: {
    width: "100%",
    height: "100%",
  },
})
