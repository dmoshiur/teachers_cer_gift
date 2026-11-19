import Admin from '@/components/admin';
import {requireSession} from '@/lib/auth';
import {redirect} from 'next/navigation';
export const metadata={title:'Admin | Teacher Tribute Studio',robots:{index:false,follow:false}};
export default async function Page(){if(!await requireSession())redirect('/login');return <Admin/>}
