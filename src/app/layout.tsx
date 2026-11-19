import type { Metadata } from 'next';
import '@fontsource/poppins/400.css'; import '@fontsource/poppins/500.css'; import '@fontsource/poppins/600.css'; import '@fontsource/poppins/700.css'; import '@fontsource/lora/400.css'; import '@fontsource/lora/700.css'; import '@fontsource/hind-siliguri/400.css';
import './globals.css';
import { Toaster } from 'sonner';
export const metadata: Metadata={title:'Teacher Tribute Studio',description:'A little tribute for the teachers who made a big difference.'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}<Toaster richColors position="top-right"/></body></html> }
