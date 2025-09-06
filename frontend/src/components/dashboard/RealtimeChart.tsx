import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RealtimeData {
  time: string
  visitors: number
  conversions: number
  revenue: number
}

const RealtimeChart: React.FC = () => {
  const [data, setData] = useState<RealtimeData[]>([])

  useEffect(() => {
    // Generate initial data
    const generateInitialData = () => {
      const now = new Date()
      const initialData: RealtimeData[] = []
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000) // 1 minute intervals
        initialData.push({
          time: time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          visitors: Math.floor(Math.random() * 100) + 50,
          conversions: Math.floor(Math.random() * 10) + 5,
          revenue: Math.floor(Math.random() * 1000) + 200,
        })
      }
      
      setData(initialData)
    }

    generateInitialData()

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData]
        newData.shift() // Remove first item
        
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          visitors: Math.floor(Math.random() * 100) + 50,
          conversions: Math.floor(Math.random() * 10) + 5,
          revenue: Math.floor(Math.random() * 1000) + 200,
        })
        
        return newData
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          stroke="#666"
          fontSize={12}
        />
        <YAxis 
          stroke="#666"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#2196f3"
          strokeWidth={2}
          dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="conversions"
          stroke="#4caf50"
          strokeWidth={2}
          dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#ff9800"
          strokeWidth={2}
          dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RealtimeChart
