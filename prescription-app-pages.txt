// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>מערכת מרשמים דיגיטליים</title>
        <meta name="description" content="אפליקציה לניהול מרשמים דיגיטליים" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;

// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-8 py-10">
      <h1 className="text-3xl font-bold text-center">ברוכים הבאים למערכת המרשמים הדיגיטליים</h1>
      
      <div className="w-full max-w-md flex flex-col space-y-4">
        <Link href="/prescriptions/new">
          <a className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-lg text-lg transition shadow">
            יצירת מרשם חדש
          </a>
        </Link>
        
        <Link href="/prescriptions/history">
          <a className="block bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-4 px-6 rounded-lg text-lg transition shadow">
            צפייה בהיסטוריית מרשמים
          </a>
        </Link>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">יתרונות מערכת המרשמים הדיגיטליים</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>יצירת מרשמים דיגיטליים עם חתימה אלקטרונית</li>
          <li>אפשרות להוספת תרופות מותאמות אישית</li>
          <li>ניהול ומעקב אחר היסטוריית מרשמים</li>
          <li>ממשק משתמש נוח וקל לשימוש</li>
          <li>גישה מכל מקום ובכל זמן</li>
        </ul>
      </div>
    </div>
  );
}

// pages/prescriptions/new.js
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// טעינה דינמית של הקומפוננטה כדי למנוע שגיאות SSR עם חתימות קנבס
const PrescriptionFormWithNoSSR = dynamic(
  () => import('../../components/PrescriptionForm'),
  { ssr: false }
);

export default function NewPrescription() {
  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">יצירת מרשם חדש</h1>
      <Suspense fallback={<div>טוען טופס...</div>}>
        <PrescriptionFormWithNoSSR />
      </Suspense>
    </div>
  );
}

// pages/prescriptions/history.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import PrescriptionCard from '../../components/PrescriptionCard';

export default function PrescriptionHistory() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get('/api/prescriptions');
        setPrescriptions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('אירעה שגיאה בטעינת המרשמים');
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">היסטוריית מרשמים</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2">טוען מרשמים...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h3 className="font-medium text-lg mb-2">אין מרשמים בהיסטוריה</h3>
          <p className="text-gray-600">צור מרשם חדש כדי שיופיע כאן</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <PrescriptionCard key={index} prescription={prescription} />
          ))}
        </div>
      )}
    </div>
  );
}
