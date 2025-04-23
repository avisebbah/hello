// pages/api/drugs.js
export default function handler(req, res) {
  const drugs = [
    { id: 1, name: 'Dysport 500IU' },
    { id: 2, name: 'Botox 100IU' },
    { id: 3, name: 'Hyaluronic Acid' },
    { id: 4, name: 'Tretinoin 0.025%' },
    { id: 5, name: 'Clindamycin 1%' },
    { id: 6, name: 'Hydrocortisone 1%' },
    { id: 7, name: 'Benzoyl Peroxide 2.5%' },
    { id: 8, name: 'Salicylic Acid 2%' },
    { id: 9, name: 'Azelaic Acid 15%' },
    { id: 10, name: 'Vitamin C Serum 20%' }
  ];
  res.status(200).json(drugs);
}

// pages/api/prescriptions.js
import fs from 'fs';
import path from 'path';

// פונקציה לקריאת הנתונים מהקובץ
const readPrescriptionsFile = () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'prescriptions.json');
    
    // אם הקובץ לא קיים, יצור תיקייה וקובץ חדש
    if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
      fs.mkdirSync(path.join(process.cwd(), 'data'));
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
      return [];
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading prescriptions file:', error);
    return [];
  }
};

// פונקציה לכתיבת הנתונים לקובץ
const writePrescriptionsFile = (data) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'prescriptions.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing prescriptions file:', error);
    return false;
  }
};

export default async function handler(req, res) {
  // טיפול בבקשות GET - קבלת כל המרשמים
  if (req.method === 'GET') {
    const prescriptions = readPrescriptionsFile();
    res.status(200).json(prescriptions);
  } 
  // טיפול בבקשות POST - הוספת מרשם חדש
  else if (req.method === 'POST') {
    try {
      const prescriptionData = req.body;
      
      // הוספת מזהה ייחודי למרשם
      prescriptionData.id = Date.now().toString();
      
      // קריאת המרשמים הקיימים
      const prescriptions = readPrescriptionsFile();
      
      // הוספת המרשם החדש
      prescriptions.unshift(prescriptionData); // הוספה בתחילת המערך
      
      // שמירת המרשמים המעודכנים
      const success = writePrescriptionsFile(prescriptions);
      
      if (success) {
        res.status(201).json({ success: true, prescription: prescriptionData });
      } else {
        res.status(500).json({ success: false, message: 'שגיאה בשמירת המרשם' });
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      res.status(500).json({ success: false, message: 'שגיאה בשרת' });
    }
  } 
  // טיפול בשאר סוגי הבקשות
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
