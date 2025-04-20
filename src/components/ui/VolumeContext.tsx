import { createContext, useContext, useState } from "react"

type VolumeContextType = {
  volume: number
  setVolume: (value: number) => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

export const VolumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [volume, setVolume] = useState(1) 
  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  )
}

export const useVolume = () => {
  const context = useContext(VolumeContext)
  if (!context) throw new Error("useVolume must be used within VolumeProvider")
  return context
}
