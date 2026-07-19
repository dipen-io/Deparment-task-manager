import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { SocketProvider } from './context/SocketContext.tsx'
import App from './App.tsx'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const queryClient = new QueryClient({
    //Global event handlers to catch error
    queryCache: new QueryCache({
        onError: (error: any) => {
            toast.error(`Query Error: ${error.message} || "Something went wrong"}`)

        }
    }),
    mutationCache: new MutationCache({
        onError: (error: any) => {
            toast.error(`Action Faield: ${error.message} || "Failed to execute action"`)
        }

    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 3, // 3m : considerd data fresh for 3 minutes
            gcTime: 1000 * 60 * 15, // 15m : keep unused data cached 
            retry: (failureCount, error: any) => {
                // dont retry if its authtetication or authorization
                if (error?.status === 401 || error?.status === 403) return false
                return failureCount < 2; // retry twice before breaking
            },
            refetchOnWindowFocus: false,
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient} >
            <AuthProvider>
                <SocketProvider >
                    <App />
                </SocketProvider>
            </AuthProvider>
        </QueryClientProvider >
    </StrictMode>,
)
