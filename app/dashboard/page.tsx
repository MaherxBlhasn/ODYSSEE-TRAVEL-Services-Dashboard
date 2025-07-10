import { redirect } from 'next/navigation';
import DashboardSection from './sections/DashboardSection'

export default function DashboardPage() {
    redirect('/dashboard/home');
}